import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import socektIO from "socket.io-client";
import styled, { keyframes } from "styled-components";
import { dataDate, deviceDetail, auth } from '_actions/user_action';
import Loader from "../Loader";
import DatePick from "./DatePicker";
import ProductDetail from './ProductDetail';
import Fade from "react-reveal/Fade";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from "./IOSSwitch";
import { Bar } from "react-chartjs-2";


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
    const [jsAvg, setJsAvg] = useState({
        tmpAvg: [],
        humAvg: [],
        dustAvg: []
    });
    const [jsMin, setJsMin] = useState({
        tmpMin: [],
        humMin: [],
        dustMin: []
    });
    const [jsMax, setJsMax] = useState({
        tmpMax: [],
        humMax: [],
        dustMax: []
    });

    const [mean, setMean] = useState({
        tmp: [],
        hum: [],
        dust: []
    })
    const [max, setMax] = useState({
        tmp: [],
        hum: [],
        dust: []
    })
    const [min, setMin] = useState({
        tmp: [],
        hum: [],
        dust: []
    })
    const [dateBox, setDateBox] = useState([]);
    const [allBox, setAllBox] = useState(false);
    const [oneBox, setOneBox] = useState(false);
    const [threeBox, setThreeBox] = useState(false);
    const [sevenBox, setSevenBox] = useState(false);
    const [monthBox, setMonthBox] = useState(false);

    const [avgCheck, setAvgCheck] = useState(false);
    const [minCheck, setMinCheck] = useState(false);
    const [maxCheck, setMaxCheck] = useState(false);
    const [chartLoading, setChartLoading] = useState(false);
    const [date, setDate] = useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
        )
    );
    const [endDate, setEndDate] = useState(new Date());
    const [btnResult, setBtnResult] = useState(0);
    const [checked, setChecked] = useState(false);
    const [ledStatus, setLedStatus] = useState({
        auto: false,
        Red: false,
        Yellow: false,
        Green: false
    });

    const avgChart = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sem', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                type: 'bar',
                label: '전체 평균 온도',
                data: [...jsAvg.tmpAvg],
                backgroundColor: 'rgb(255, 99, 132)'
            },
            {
                type: 'bar',
                label: '전체 평균 습도',
                data: [...jsAvg.humAvg],
                backgroundColor: 'rgb(54, 162, 235)'
            },
            {
                type: 'bar',
                label: '전체 평균 먼지',
                data: [...jsAvg.dustAvg],
                backgroundColor: 'rgb(75, 192, 192)'
            },
            // {
            //     type: 'line',
            //     label: '전체 최대 온도',
            //     data: [...jsMax.tmpMax],
            //     backgroundColor: 'red'
            // },
            // {
            //     type: 'line',
            //     label: '전체 최대 습도',
            //     data: [...jsMax.humMax],
            //     backgroundColor: 'black'
            // },
            // {
            //     type: 'line',
            //     label: '전체 최대 먼지',
            //     data: [...jsMax.dustMax],
            //     backgroundColor: 'purple'
            // },
            // {
            //     type: 'line',
            //     label: '전체 최소 온도',
            //     data: [...jsMin.tmpMin],
            //     backgroundColor: 'orange'
            // },
            // {
            //     type: 'line',
            //     label: '전체 최소 습도',
            //     data: [...jsMin.humMin],
            //     backgroundColor: 'yellow'
            // },
            // {
            //     type: 'line',
            //     label: '전체 최소 먼지',
            //     data: [...jsMin.dustMin],
            //     backgroundColor: 'green',
            // },
        ]
    }

    const meanChart = {
        labels: [...dateBox],
        datasets: [
            {
                type: 'bar',
                label: '온도',
                data: [...mean.tmp],
                backgroundColor: 'rgb(255, 99, 132)'
            },
            {
                type: 'bar',
                label: '습도',
                data: [...mean.hum],
                backgroundColor: 'rgb(54, 162, 235)'
            },
            {
                type: 'bar',
                label: '먼지',
                data: [...mean.dust],
                backgroundColor: 'rgb(75, 192, 192)'
            }
        ]
    };

    const minMaxChart = {
        labels: [...dateBox],
        datasets: [
            {
                type: 'line',
                label: '온도',
                data: [...min.tmp],
                backgroundColor: 'rgb(255, 99, 132)'
            },
            {
                type: 'line',
                label: '습도',
                data: [...min.hum],
                backgroundColor: 'rgb(54, 162, 235)'
            },
            {
                type: 'line',
                label: '먼지',
                data: [...min.dust],
                backgroundColor: 'rgb(75, 192, 192)'
            },
            {
                type: 'line',
                label: '온도',
                data: [...max.tmp],
                backgroundColor: 'rgb(255, 99, 132)'
            },
            {
                type: 'line',
                label: '습도',
                data: [...max.hum],
                backgroundColor: 'rgb(54, 162, 235)'
            },
            {
                type: 'line',
                label: '먼지',
                data: [...max.dust],
                backgroundColor: 'rgb(75, 192, 192)'
            }
        ]
    };

    const minChart = {
        labels: [...dateBox],
        datasets: [
            {
                type: 'line',
                label: '온도',
                data: [...min.tmp],
                backgroundColor: 'rgb(255, 99, 132)'
            },
            {
                type: 'line',
                label: '습도',
                data: [...min.hum],
                backgroundColor: 'rgb(54, 162, 235)'
            },
            {
                type: 'line',
                label: '먼지',
                data: [...min.dust],
                backgroundColor: 'rgb(75, 192, 192)'
            }
        ]
    };

    const maxChart = {
        labels: [...dateBox],
        datasets: [
            {
                type: 'line',
                label: '온도',
                data: [...max.tmp],
                backgroundColor: 'rgb(255, 99, 132)'
            },
            {
                type: 'line',
                label: '습도',
                data: [...max.hum],
                backgroundColor: 'rgb(54, 162, 235)'
            },
            {
                type: 'line',
                label: '먼지',
                data: [...max.dust],
                backgroundColor: 'rgb(75, 192, 192)'
            }
        ]
    };

    const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };

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
    const [checkedBox, setCheckedBox] = useState({
        Red: false,
        Yellow: false,
        Green: false
    });

    const handleLedChange = (event) => {
        setCheckedBox({...checkedBox, [event.target.name]: event.target.checked})
    }

    useEffect(() => {
        dispatch(auth()).then(response => {
            const userData = response.payload
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
        } = event;
        if(value === '7') {
            setAllBox(false);
            setOneBox(false);
            setThreeBox(false);
            setSevenBox(!sevenBox);
            setMonthBox(false);
        } else if(value === '3') {
            setAllBox(false);
            setOneBox(false);
            setThreeBox(!threeBox);
            setSevenBox(false);
            setMonthBox(false);
        } else if(value === '1') {
            setAllBox(false);
            setOneBox(!oneBox);
            setThreeBox(false);
            setSevenBox(false);
            setMonthBox(false);
        } else if(value === '30') {
            setAllBox(false);
            setOneBox(false);
            setThreeBox(false);
            setSevenBox(false);
            setMonthBox(!monthBox);
        } else{
            setAllBox(!allBox);
            setOneBox(false);
            setThreeBox(false);
            setSevenBox(false);
            setMonthBox(false);
        }
        setJsLoading(true);
        setBtnResult(value);
    };

    useEffect(() => {
        if(btnResult !== 0) {
            const body = {
                btnResult,
                date: null,
                endDate: null,
                avgCheck,
                minCheck,
                maxCheck
            }   
            dispatch(dataDate(id, body))
                .then(response => {
                    if(response.payload.success) {
                        const res = response.payload.dataList;
                        const meanArray = response.payload.dataDate.mean;
                        const minArray = response.payload.dataDate.min;
                        const maxArray = response.payload.dataDate.max;
                        const dateArray = response.payload.dateBox;
                            if(jsData.length !== 0) {
                                setJsData(jsData.filter((_, idx) => idx >= 0))
                            }
                        setJsData([...initialJsValue, ...res])
                        setMean({
                            ...mean, ...meanArray
                        });
                        setMin({
                            ...min, ...minArray
                        });
                        setMax({
                            ...max, ...maxArray
                        });
                        setDateBox([...dateBox, ...dateArray]);
                    }
                }) 
        }
        return () => {
            setMean({
                ...mean,
                tmp: [],
                hum: [],
                dust: []
            });
            setMin({
                ...min,
                tmp: [],
                hum: [],
                dust: []
            });
            setMax({
                ...max,
                tmp: [],
                hum: [],
                dust: []
            });
            setDateBox(prev => prev.filter((_, index) => index <= 0));
        }
    }, [btnResult])

    const handleSubmitClicked = (event) => {
        setJsLoading(true);
        event.preventDefault();
        const body = {
            btnResult: 0,
            date,
            endDate,
            avgCheck,
            minCheck,
            maxCheck
        }
        dispatch(dataDate(id, body))
        .then(response => {
            if(response.payload.success){
                const res = response.payload.dataList;
                if(jsData.length !== 0) {
                    setJsData(jsData.filter((_, idx) => idx >= 0))
                }
                setJsData([...initialJsValue, ...res])
            }
        })
    };

    useEffect(() => {
        setJsLoading(false);
    }, [jsData] )

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
        socket.on("publishData", )
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
                    const data = response.payload.data;
                    const avgTmpForm = response.payload.avgTmpForm
                    const avgHumForm = response.payload.avgHumForm
                    const avgDustForm = response.payload.avgDustForm
                    const minTmpForm = response.payload.minTmpForm
                    const minHumForm = response.payload.minHumForm
                    const minDustForm = response.payload.minDustForm
                    const maxTmpForm = response.payload.maxTmpForm
                    const maxHumForm = response.payload.maxHumForm
                    const maxDustForm = response.payload.maxDustForm
                    if(data.length !== 0) {
                            setJsData(
                                jsData.filter((_, index) => index < 0)
                            );
                    }
                    setJsData(jsData.concat(data));
                    setJsAvg({
                        tmpAvg: [...avgTmpForm],
                        humAvg: [...avgHumForm],
                        dustAvg: [...avgDustForm]
                    });
                    setJsMax({
                        tmpMax: [...maxTmpForm],
                        humMax: [...maxHumForm],
                        dustMax: [...maxDustForm]
                    })
                    setJsMin({
                        tmpMin: [...minTmpForm],
                        humMin: [...minHumForm],
                        dustMin: [...minDustForm]
                    })
                    if(jsLoading === true) {
                        setJsLoading(false);
                    }       
                } else {
                    window.location.replace('/me');
                }
            })
        return () => {
            setJsData(jsData.filter((_, idx) => idx < 0))
        }
    }, [])   

    const publish = (event) => {
        const {
             target: { value, name }
        } = event;
        const data = checkedBox;
        const userId = window.localStorage.getItem('id');
        data['auto'] = checked;
        data['key'] = value;
        data['product'] = name;
        data['controller'] = userId
        if(data['auto'] === true) {
            checkedBox['Green'] = false;
            checkedBox['Red'] = false;
            checkedBox['Yellow'] = false;
        }
        socket.emit("publishLED", data)
        socket.on('LEDResult', result => {
            if(result.success) {
                setLedStatus({
                    ...ledStatus, 
                    ...result
                })
            }
        });
    };


    const handleCheck = () => {
        setChecked(!checked);
    };


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
                        <div>                 
                            <FormGroup>
                                <FormControlLabel
                                control={<IOSSwitch checked={checked} onChange={handleCheck} name="checked" />}
                                label="AUTO"
                                />
                            <div>{checked ? null : (
                                <FormGroup>
                                    <FormControlLabel
                                    control={<IOSSwitch checked={checkedBox.Red} onChange={handleLedChange} name="Red" />}
                                    label="Red"
                                    />
                                    <FormControlLabel
                                    control={<IOSSwitch checked={checkedBox.Yellow} onChange={handleLedChange} name="Yellow" />}
                                    label="Yellow"
                                    />
                                    <FormControlLabel
                                    control={<IOSSwitch checked={checkedBox.Green} onChange={handleLedChange} name="Green" />}
                                    label="Green"
                                    />
                                </FormGroup>
                            )}</div>
                            <button type="submit" name={socketData.product} value={socketData.keyName} onClick={publish}>제어</button>
                            </FormGroup>
                            </div>
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
                                <DayBtn value={100} type="submit" onClick={allBox ? null : handleBtnClicked}>전체</DayBtn>
                                <DayBtn value={1} type="submit" onClick={oneBox ? null : handleBtnClicked}>오늘</DayBtn>
                                <DayBtn value={3} type="submit" onClick={threeBox ? null : handleBtnClicked}>3일</DayBtn>
                                <DayBtn value={7} type="submit" onClick={sevenBox ? null : handleBtnClicked}>7일</DayBtn>
                                <DayBtn value={30} type="submit" onClick={monthBox ? null : handleBtnClicked}>한달</DayBtn>
                            </BtnContainer>
                                <label>
                                    평균
                                    <input type="checkbox" defaultChecked={avgCheck} onChange={
                                        btnResult ? () => setAvgCheck(!avgCheck) : null
                                    } />
                                </label>
                                <label>
                                    최대
                                    <input type="checkbox" defaultChecked={maxCheck} onChange={
                                        btnResult ? () => setMaxCheck(!maxCheck) : null
                                    } />
                                </label>
                                <label>
                                    최소
                                    <input type="checkbox" defaultChecked={minCheck} onChange={
                                        btnResult ? () => setMinCheck(!minCheck) : null
                                    } />
                                </label>
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
                    <div>{minCheck && maxCheck && min && max && jsData ? (<Bar data={minMaxChart} options={options} />) : null}</div>
                    <div>{minCheck && !maxCheck && min && jsData ? (<Bar data={minChart} options={options} />) : null}</div>
                    <div>{!minCheck && maxCheck && max && jsData ? (<Bar data={maxChart} options={options} />) : null}</div>
                    <div>{avgCheck && mean && jsData ? (<Bar data={meanChart} options={options} />) : null}</div>
                    <Bar data={avgChart} options={options} />
                    </Fade>
                    </WHITEBACK>
        </Container>
        )
    )  
};

export default ProductPage;