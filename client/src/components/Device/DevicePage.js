import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { userDevice } from '_actions/user_action';
import socektIO from "socket.io-client";
import DeviceDetail from "./DeviceDetail";
import DevicePython from "./DevicePython";
import Loader from '../Loader';
import styled from "styled-components";

//[전체{ 1번 {온도 습도 미세먼지}2번 3번}, 일주일, 한달]

const initialValue = []
let dataContainer = [];

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Container = styled.div`
  width: 60%;
  overflow: hidden; // 선을 넘어간 이미지들은 보이지 않도록 처리합니다.
`;

const Button = styled.button`
  all: unset;
  border: 1px solid coral;
  padding: 0.5em 2em;
  color: coral;
  border-radius: 10px;
  &:hover {
    transition: all 0.3s ease-in-out;
    background-color: coral;
    color: #fff;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  flex: auto;
`;

let total_slides = 0;

const socket = socektIO('http://localhost:3001');

function DevicePage(props) {
    const userId = useSelector(state => state.user.userData.id);
    const dispatch = useDispatch();

    const [response, setResponse] = useState([]);
    const [ week, setWeek ] = useState(initialValue);
    const [ time, setTime ] = useState(false);
    const [ socketLoading, setSocektLoading ] = useState(true);
    const [ pythonLoading, setPythonLoading ] = useState(true);
    const [ currentSlide, setCurrentSlide ] = useState(0);
    const slideRef = useRef(null);
    const slideRefPy = useRef(null);

    const nextSlide = () => {
        if(currentSlide >= total_slides - 1) {
            setCurrentSlide(0);
        } else {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if(currentSlide === 0) {
            setCurrentSlide(total_slides - 1);
        } else {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const jsonHandler = async (res) => {
        try{
            const parser = await JSON.parse(res);
            total_slides = parser.length
            if(response.length === 0) {
                setResponse(
                    response.concat(parser).filter((_, index) => index >= 0)
                    )
            } else {
                    setResponse(
                        response.concat(parser)
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
                for(const data of response.payload.data){
                    if(dataContainer.length === 0){
                        dataContainer.push(data);
                    } else {
                        dataContainer = [];
                        dataContainer.push(data);
                    }
                }
                setWeek(prev => prev.filter((_, index) => index > 0).concat(dataContainer));
                // for(const i of week) {
                //     console.log(i)
                // }
                // console.log(week[0])
                setPythonLoading(false)
            })
        return () => {
            setWeek([])
        }           
    }, [pythonLoading])

    useEffect(() => {
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
        socketLoading || pythonLoading ? (
            <Loader />
        )
        : (
        <>
            <Box>
                <Container>
                    <SliderContainer ref={slideRef}>{response !== [] ? response.map((res) => (
                        (<DeviceDetail {...res} key={res.product} />)))
                    : null}
                    </SliderContainer>
                    <SliderContainer ref={slideRefPy}>
                        {week[0].map((data,index) => (
                            <DevicePython {...data} key={index} />
                        ))}
                    </SliderContainer>
                    <div>
                        <Button type="button" onClick={prevSlide}>Prev</Button>
                        <Button type="button" onClick={nextSlide}>Next</Button>
                    </div>
                </Container>
            </Box>
        </>
        ) 
    )
};

export default DevicePage;