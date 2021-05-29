import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import socektIO from "socket.io-client";
import styled, { keyframes } from "styled-components";
import { dataDate, deviceDetail, auth } from '_actions/user_action';
import Loader from "../Loader";
import DatePick from "./DatePicker";
import ProductDetail from './ProductDetail';
import Fade from "react-reveal/Fade";


const socket = socektIO('http://localhost:3001');

const initialValue = {
    product: null,
    tmp: 0,
    hum: 0,
    dust: 0,
    measuredAt: Date.now(),
    keyName: null
}

const initialJsValue = [];

const a = keyframes`
    0% { 
        background-position: 0 0, 0 100%, 0 0, 100% 0; 
    }
    100% {
        background-position: 30px 0, -30px 100%, 0 -30px, 100% 30px;
    }
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const RealTimeBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const RealText = styled.span`
    font-size: 32px;
    color: black;
    &:not(:last-child) {
        margin-right: 10px;
    }
`;

const RealTime = styled.div`
    font-size: 24px;
    opacity: 0.3;
    margin-bottom: 20px;
`;

const RealTimeContainer = styled.div`
    background: linear-gradient(to right, #ffe259 0%, #ffa751 100%);
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const WHITEBACK = styled.div`

`;

const Box = styled.div`
    width: 80%;
    display: grid;
    grid-template-columns: 1fr;
    background-image: linear-gradient(90deg,#000 50%,transparent 0),
        linear-gradient(90deg,#000 50%,transparent 0);
    background-position: 0 100%,0 calc(100% - 14px);
    background-repeat: repeat-x,repeat-x;
    background-size: 24px 1px,24px 1px;
    margin-bottom: 30px;
`;

const DateHandler = styled.div`
    padding: 30px 0px;
    display: grid;
    grid-template-columns: 30% 70%;
    grid-template-rows: 40px 40px;
`;

const ProductName = styled.span`
    height: 100%;
    font-size: 18px;
    grid-row: 1 / 3;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const BtnContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const DayBtn = styled.button`
    text-decoration: none;
    color: black;
    border: 1px solid black;
    background-color: #FFFFFF;
    padding: 10px 10px;
    transition: background-color 0.2s linear;
    &:hover {
        color: white;
        background-color: black;
    }
    :not(:last-child) {
        margin-right: 10px;
    }
`;

const Form = styled.form`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const FormBtn = styled.button`
    text-decoration: none;
    color: black;
    border: 1px solid black;
    background-color: #FFFFFF;
    padding: 10px 10px;
    transition: background-color 0.2s linear;
    &:hover {
        color: white;
        background-color: black;
    }
`;


const DataBox = styled.table`
    width: 80%;
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
    margin-bottom: 100px;
`;

const DataHeader = styled.thead`
    width: 100%;
    font-size: 18px;
`;

const DataBody = styled.tbody`
    width: 100%;
`;

const Tr = styled.tr`
    height: 30px;
    line-height: 30px;
`;

const Th = styled.th`
    width: 20%;
`;

function ProductPage(props) {
    
    const [time, setTime] = useState(false);
    const [socketLoading, setSocektLoading] = useState(true);
    const [jsLoading, setJsLoading] = useState(true);
    const [socketData, setSocketData] = useState(initialValue);
    const [jsData, setJsData] = useState(initialJsValue);
    const [date, setDate] = useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
        )
    );
    const [endDate, setEndDate] = useState(new Date());
    // const [dateClick, setDateClick] = useState(false);
    // const [dataLoad, setDataLoad] = useState(false);
    const [btnResult, setBtnResult] = useState(0);


    const dispatch = useDispatch();
    const url = window.location.href
    const id = url.split('/product/')[1]
    
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

    const handleBtnClicked = (event) => {
        const { 
            currentTarget: { value }
        } = event
        setJsLoading(true);
        setBtnResult(value);
    };

    useEffect(() => {
        if(btnResult !== 0) {
            const body = {
                btnResult,
                date: null,
                endDate: null
            }   
            dispatch(dataDate(id, body))
                .then(response => {
                    if(response.payload.success) {
                        const res = response.payload.dataList;
                            if(jsData.length !== 0) {
                                setJsData(jsData.filter((_, idx) => idx >= 0))
                            }
                        setJsData([...initialJsValue, ...res])
                    }
                }) 
        }
    }, [btnResult])

    const handleSubmitClicked = (event) => {
        setJsLoading(true);
        event.preventDefault();
        const body = {
            btnResult: 0,
            date,
            endDate
        }
        dispatch(dataDate(id, body))
        .then(response => {
            if(response.payload.success){
                const res = response.payload.dataList;
                // setDateClick(true);
                if(jsData.length !== 0) {
                    setJsData(jsData.filter((_, idx) => idx >= 0))
                }
                setJsData([...initialJsValue, ...res])
            }
        })
    };

    useEffect(() => {
        setJsLoading(false);
        // setDateClick(false);
    }, [jsData])

    async function jsonHandler (res) {
        try {
            const resData = await JSON.parse(res);
            setSocketData({
                ...socketData,
                ...resData
            })
        } catch(err) {
            props.history.push('/');
        } finally {
            setSocektLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            socket.emit("productId", { id });
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
        socket.on("mqttData", jsonHandler);
        return () => {
        socket.off("mqttData", jsonHandler);
        setSocektLoading(true);
        }
    }, [])
    

    useEffect(() => {
        dispatch(deviceDetail(id))
            .then(response => {
                const success = response.payload.success;
                if(success) {
                    const res = response.payload.data;
                    // setDataLoad(true)
                    if(res.length !== 0) {
                            setJsData(
                                jsData.filter((_, index) => index < 0)
                            );
                    }
                    setJsData(jsData.concat(res));
                    if(jsLoading === true) {
                        setJsLoading(false);
                    }       
                } else {
                    window.location.replace('/me');
                }
            })
        return () => {
            setJsData(jsData.filter((_, idx) => idx >= 0))
        }
    }, [])   

    return (
        loading || socketLoading || jsLoading ? (
            <Loader />
            )
            : (
                <Container>
                    <RealTimeContainer>
                        <Fade up>
                        <RealTimeBox>
                            <RealText>온도: {socketData.tmp}</RealText>
                            <RealText>습도: {socketData.hum}</RealText>
                            <RealText>미세먼지: {socketData.dust}</RealText>
                        </RealTimeBox>
                        <RealTime>{socketData.measuredAt ? (
                        socketData.measuredAt.split('T')[1].split('.000Z')[0]    
                        ) : null}
                        </RealTime>
                        </Fade>
                    </RealTimeContainer>
                    <WHITEBACK>
                    <Box>
                        <DateHandler>
                            <ProductName>
                                <span>제품번호: {socketData.keyName}</span>
                            </ProductName>
                            <Form onSubmit={handleSubmitClicked}>
                                <DatePick
                                date={date}
                                setDate={setDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                />
                                <FormBtn value="조회" type="submit">조회</FormBtn>
                            </Form>
                            <BtnContainer>
                                <DayBtn value={100} type="submit" onClick={handleBtnClicked}>전체</DayBtn>
                                <DayBtn value={1} type="submit" onClick={handleBtnClicked}>오늘</DayBtn>
                                <DayBtn value={3} type="submit" onClick={handleBtnClicked}>3일</DayBtn>
                                <DayBtn value={7} type="submit" onClick={handleBtnClicked}>7일</DayBtn>
                                <DayBtn value={30} type="submit" onClick={handleBtnClicked}>한달</DayBtn>
                            </BtnContainer>
                        </DateHandler>
                    </Box>
                    <Fade left>
                    <DataBox>
                        <DataHeader>
                            <Tr>
                                <Th>측정시간</Th>
                                <Th>상태</Th>
                                <Th>온도</Th>
                                <Th>습도</Th>
                                <Th>미세먼지</Th>
                            </Tr>
                        </DataHeader>
                        <DataBody style={{marginTop: "45px"}}>{jsData.length && jsData.map(res => (
                            <ProductDetail {...res} key={res._id} />))}
                        </DataBody>
                    </DataBox>
                    </Fade>
                    </WHITEBACK>
        </Container>
        )
    )  
};

export default ProductPage;