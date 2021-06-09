import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { auth, userDevice } from '_actions/user_action';
import socektIO from "socket.io-client";
import DeviceDetail from "./DeviceDetail";
import DevicePython from "./DevicePython";
import { BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs"
import Loader from '../Loader';
import styled, { keyframes } from "styled-components";

const initialValue = []
let dataContainer = [];

const a = keyframes`
    0% { 
        background-position: 0 0, 0 100%, 0 0, 100% 0; 
    }
    100% {
        background-position: 30px 0, -30px 100%, 0 -30px, 100% 30px;
    }
`;

const Container = styled.div`
    /* background: linear-gradient(to right, #ffe259 0%, #ffa751 100%); */
    background-color: #FFFFFF;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Box = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

const Slider = styled.div`
    width: 60%;
    overflow: hidden; // 선을 넘어간 이미지들은 보이지 않도록 처리합니다.
    background-image: linear-gradient(
        90deg, #000 50%, transparent 0),linear-gradient(
        90deg, #000 50%, transparent 0),linear-gradient(
        180deg, #000 50%, transparent 0),linear-gradient(
        180deg, #000 50%, transparent 0);
    background-position: 0 0, 0 100%, 0 0, 100% 0;
    background-repeat: repeat-x,repeat-x,repeat-y,repeat-y;
    background-size: 30px 1px, 30px 1px, 1px 30px, 1px 30px;
    &:hover {
        animation: ${a} .4s infinite normal;
        animation-timing-function: linear;
    }
    animation-play-state: paused;
    height: 50vh;
`;

const Button = styled.button`
  all: unset;
  border: 1px solid black;
  padding: 0.5em 2em;
  color: black;
  border-radius: 10px;
  &:hover {
    transition: all 0.3s ease-in-out;
    background-color: black;
    color: #fff;
  }
  height: 50vh;
  opacity: 0.4;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 50%;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  flex: auto;
`;

let total_slides = 0;

const socket = socektIO('http://localhost:3001'); // 소켓 연결
//const socket = socektIO('http://114.71.241.151:3001'); // 소켓 연결

function DevicePage(props) {
    const userId = useSelector(state => state.user.userData.id); 
    const dispatch = useDispatch();

    const [response, setResponse] = useState([]);
    const [ week, setWeek ] = useState(initialValue);
    const [ time, setTime ] = useState(false);
    const [ socketLoading, setSocektLoading ] = useState(true);
    const [ pythonLoading, setPythonLoading ] = useState(true);
    const [ currentSlide, setCurrentSlide ] = useState(0);
    const slideRef = useRef(null); // 가상Dom이 아닌 실제 Dom에 접근
    const slideRefPy = useRef(null);
    const [user, setUser] = useState({
        name: null,
        email: null,
        keyList: [],
        isAuth: false,
        id: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(auth()).then(response => {
            const userData = response.payload
            console.log(response.payload)
            if(response.payload){
                if (!response.payload.isAuth) {
                        props.history.push('/login') // 로그인 안한 유저 차단
                } else {
                    setUser({...user, ...userData})
                }
            }
        })
    }, [])

    useEffect(() => {
        setLoading(false);
    }, [user])


    const nextSlide = () => { // 슬라이드  다음 버튼 이벤트 관리
        if(currentSlide >= total_slides - 1) {
            setCurrentSlide(0);
        } else {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => { // 슬라이드 이전 버튼 이벤트 관리
        if(currentSlide === 0) {
            setCurrentSlide(total_slides - 1);
        } else {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const jsonHandler = async (res) => {
        try {
            const parser = await JSON.parse(res);
            total_slides = parser.length
            if(response.length === 0) {
                setResponse(
                    response.concat(parser)
                    )
                } else {
                    setResponse(
                        response.filter((_, index) => index >= 0).concat(parser)
                    )
            }  
        } catch (err) {
            props.history.push('/')
        } finally {
            setSocektLoading(false);
        }
    };
    
    useEffect(() => {
        dispatch(userDevice(userId))
            .then(response => {
                console.log(response)
                for(const data of response.payload.data){
                    if(dataContainer.length === 0){
                        dataContainer.push(data);
                    } else {
                        dataContainer = [];
                        dataContainer.push(data);
                    }
                }
                setWeek(prev => prev.filter((_, index) => index > 0).concat(dataContainer));
                setPythonLoading(false)
            })
        return () => {
            setWeek([])
        }           
    }, [pythonLoading])

    useEffect(() => { // 서버와 5초 간격으로 소켓 통신
        const timer = setTimeout(() => {
            socket.emit("sendId", { userId });
            setTime(true);
            setTimeout(() => {
                setTime(false);
            }, 2000)
        }, 3000)
        return () => {
            clearTimeout(timer);
            setTime(false);
        }
    }, [time])
    
    useEffect(() => {
        socket.on("mqttSubmit", jsonHandler);
        return () => {
            socket.off("mqttSubmit", jsonHandler);
        }
    }, [])
    
    useEffect(() => {
        if(slideRef.current !== null && slideRefPy.current !== null) {
            slideRef.current.style.transition = "all 0.5s ease-in-out"
            slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
            slideRefPy.current.style.transition = "all 0.5s ease-in-out"
            slideRefPy.current.style.transform = `translateX(-${currentSlide}00%)`;
        }
    }, [currentSlide])

    return (
        loading || socketLoading || pythonLoading ? (
            <Loader />
        )
        : (
        <Container>
            <Box>
                <Button type="button" onClick={prevSlide}><BsChevronDoubleLeft/></Button>
                <Slider>
                    <SliderContainer ref={slideRef}>{response.length && response.map((res) => (
                        (<DeviceDetail {...res} key={res.product} />)))
                    }
                    </SliderContainer>
                    <SliderContainer style={{opacity:"0.7"}} ref={slideRefPy}>
                        {week[0].length && week[0].map((data,index) => (
                            <DevicePython {...data} key={index} />
                        ))}
                    </SliderContainer>    
                </Slider>
                <Button type="button" onClick={nextSlide}><BsChevronDoubleRight/></Button>
            </Box>
        </Container>
        ) 
    )
};

export default DevicePage;