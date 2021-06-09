import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import socektIO from "socket.io-client";
import styled, { keyframes, css } from "styled-components";
import { dataDate, deviceDetail, auth, get_weather } from '_actions/user_action';
import Loader from "../Loader";
import DatePick from "./DatePicker";
import ProductDetail from './ProductDetail';
import Fade from "react-reveal/Fade";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from "./IOSSwitch";
import { Bar } from "react-chartjs-2";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";


const socket = socektIO('http://localhost:3001');
//const socket = socektIO('http://114.71.241.151:3001');

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
    /* background: linear-gradient(to right, #ffe259 0%, #ffa751 100%); */
    background-color: #FFFFFF;
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
    width: 100%;
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
    grid-template-columns: 40% 60%;
    grid-template-rows: 40px 40px 30px;
`;

const ProductName = styled.span`
    height: 100%;
    font-size: 18px;
    grid-row: 1 / 4;
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
    ${props => 
        props.status && 
        css`
            background-color: black;
            color: #FFFFFF;
            transition: background-color 0.5s ease-in-out;
        `} 
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
    margin-left: 10px;
    transition: background-color 0.2s linear;
    &:hover {
        color: white;
        background-color: black;
    }
`;


const DataBox = styled.table`
    width: 100%;
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

const OptionContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const Label = styled.label`
    margin-left: 10px;
`;

const OptionInput = styled.input`
    padding: 5px 10px;
`;

const SortButton = styled.button`
    background-color: #FFFFFF;
    border: none;
`;

const PublishBox = styled.div`
    display: flex; 
    justify-content: center;
`;


function ProductPage(props) {
    
    const [time, setTime] = useState(false);
    const [socketLoading, setSocektLoading] = useState(true);
    const [jsLoading, setJsLoading] = useState(true);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherData, setWeatherData] = useState({});
    const [socketData, setSocketData] = useState(initialValue);
    const [jsData, setJsData] = useState(initialJsValue);
    const [tmpSort, setTmpSort] = useState(false);
    const [humSort, setHumSort] = useState(false);
    const [dustSort, setDustSort] = useState(false);
    const [jsAvg, setJsAvg] = useState({
        tmpAvg: [],
        humAvg: [],
        dustAvg: []
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
    const [threeBox, setThreeBox] = useState(false);
    const [sevenBox, setSevenBox] = useState(false);
    const [monthBox, setMonthBox] = useState(false);

    const [avgCheck, setAvgCheck] = useState(false);
    const [minCheck, setMinCheck] = useState(false);
    const [maxCheck, setMaxCheck] = useState(false);
    const [date, setDate] = useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
        )
    );
    const [nodata, setNodata] = useState(false);
    const [endDate, setEndDate] = useState(new Date());
    const [btnResult, setBtnResult] = useState(0);
    const [LedChecked, setLedChecked] = useState(false);
    const [FanChecked, setFanChecked] = useState(false);
    const [BuzChecked, setBuzChecked] = useState(false);
    const [ledStatus, setLedStatus] = useState({
        auto: false,
        Red: false,
        Yellow: false,
        Green: false
    });
    const [fanStatus, setFanStatus] = useState({
        auto: false,
        on: false
    });
    const [buzStatus, setBuzStatus] = useState({
        auto: false,
        on: false
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
            }
        ]
    }

    const meanChart = {
        labels: dateBox,
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
        labels: dateBox,
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
        labels: dateBox,
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
        labels: dateBox,
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
    const [fanCheckedBox, setFanCheckedBox] = useState(false);
    const [buzCheckedBox, setBuzCheckedBox] = useState(false);

    const handleLedChange = (event) => {
        setCheckedBox({...checkedBox, [event.target.name]: event.target.checked})
    }

    const handleFanChange = () => {
        setFanCheckedBox(!fanCheckedBox);
    }

    const handleBuzChange = () => {
        setBuzCheckedBox(!buzCheckedBox);
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
            setThreeBox(false);
            setSevenBox(!sevenBox);
            setMonthBox(false);
        } else if(value === '3') {
            setAllBox(false);
            setThreeBox(!threeBox);
            setSevenBox(false);
            setMonthBox(false);
        } else if(value === '1') {
            setAllBox(false);
            setThreeBox(false);
            setSevenBox(false);
            setMonthBox(false);
        } else if(value === '30') {
            setAllBox(false);
            setThreeBox(false);
            setSevenBox(false);
            setMonthBox(!monthBox);
        } else{
            setAllBox(!allBox);
            setThreeBox(false);
            setSevenBox(false);
            setMonthBox(false);
        }
        setJsLoading(true);
        setBtnResult(value);
        setDateBox(dateBox.filter((_, idx) => idx < 0));
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
            // setDateBox(dateBox.filter((_, idx) => idx < 0));
            setAvgCheck(false);
            setMinCheck(false);
            setMaxCheck(false);
            setTmpSort(false);
            setHumSort(false);
            setDustSort(false);
            dispatch(dataDate(id, body))
                .then(response => {
                    if(response.payload.success) {
                        const res = response.payload.dataList;
                        const meanArray = response.payload.dataDate.mean;
                        const minArray = response.payload.dataDate.min;
                        const maxArray = response.payload.dataDate.max;
                        const dateArray = response.payload.dateBox;
                            if(jsData.length !== 0) {
                                setJsData(jsData.filter((_, idx) => idx < 0))
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
                    } else {
                        setNodata(true);
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
        }
    }, [btnResult])

    const handleSubmitClicked = (event) => {
        setJsLoading(true);
        setAvgCheck(false);
        setMinCheck(false);
        setMaxCheck(false);
        setTmpSort(false);
        setHumSort(false);
        setDustSort(false);
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
            if(response.payload.success) {
                const res = response.payload.dataList;
                const meanArray = response.payload.dataDate.mean;
                const minArray = response.payload.dataDate.min;
                const maxArray = response.payload.dataDate.max;
                const dateArray = response.payload.dateBox;
                    if(jsData.length !== 0) {
                        setJsData(jsData.filter((_, idx) => idx < 0))
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
            } else {
                setNodata(true);
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
        dispatch(get_weather(35, 135))
            .then(response => {
                const data = response.payload
                console.log(data)
                setWeatherData({...weatherData, ...data})
                setWeatherLoading(false);
            });
    }, [])    

    useEffect(() => {
        dispatch(deviceDetail(id))
            .then(response => {
                const success = response.payload.success;
                if(success) {
                    const data = response.payload.todayContainer;
                    const avgTmpForm = response.payload.avgTmpForm;
                    const avgHumForm = response.payload.avgHumForm;
                    const avgDustForm = response.payload.avgDustForm;
                    const calculated = response.payload.dhtHourCalculator;
                    if(calculated.length !== 0){
                        let meanObject = {tmp:[], hum: [], dust: []};
                        let minObject = {tmp:[], hum: [], dust: []};
                        let maxObject = {tmp:[], hum: [], dust: []};
                        let timeArray = [];
                        for(const cal of calculated) {
                            meanObject.tmp.push(cal.AverageTmpValue);
                            meanObject.hum.push(cal.AverageHumValue);
                            meanObject.dust.push(cal.AverageDustValue);
                            minObject.tmp.push(cal.MinTmpValue);
                            minObject.hum.push(cal.MinHumValue);
                            minObject.dust.push(cal.MinDustValue);
                            maxObject.tmp.push(cal.MaxTmpValue);
                            maxObject.hum.push(cal.MaxHumValue);
                            maxObject.dust.push(cal.MaxDustValue);
                            timeArray.push(cal._id);
                        };
                        setMean({...mean, ...meanObject});
                        setMin({...min, ...minObject});
                        setMax({...max, ...maxObject});
                        setDateBox([...dateBox, ...timeArray]);
                    }
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

    const publishLed = (event) => {
        const {
             target: { value, name }
        } = event;
        const data = checkedBox;
        const userId = window.localStorage.getItem('id');
        data['auto'] = LedChecked;
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

    const publishFan = (event) => {
        const {
             target: { value, name }
        } = event;
        const data = { 'on': fanCheckedBox };
        const userId = window.localStorage.getItem('id');
        data['auto'] = FanChecked;
        data['key'] = value;
        data['product'] = name;
        data['controller'] = userId
        if(data['auto'] === true) {
            data['on'] = false;
        }
        socket.emit("publishFan", data)
        socket.on('FanResult', result => {
            if(result.success) {
                setFanStatus({
                    ...fanStatus, 
                    ...result
                })
            }
        });
    };

    const publishBuz = (event) => {
        const {
             target: { value, name }
        } = event;
        const data = { 'on': fanCheckedBox };
        const userId = window.localStorage.getItem('id');
        data['auto'] = FanChecked;
        data['key'] = value;
        data['product'] = name;
        data['controller'] = userId
        if(data['auto'] === true) {
            data['on'] = false;
        }
        socket.emit("publishFan", data)
        socket.on('BuzResult', result => {
            if(result.success) {
                setBuzStatus({
                    ...buzStatus, 
                    ...result
                })
            }
        });
    };

    const handleCheck = () => {
        setLedChecked(!LedChecked);
    };

    const handleFanCheck = () => {
        setFanChecked(!FanChecked);
    }

    const handleBuzCheck = () => {
        setBuzChecked(!BuzChecked);
    }

    useEffect(() => {
        if(tmpSort) {
            setJsData(jsData.sort((start, end) => {
                if(start.tmp > end.tmp) {
                    return 1;
                }
                else if(start.tmp < end.tmp) {
                    return -1;
                } else {
                    return 0;
                }
            }))
        } else {
            setJsData(jsData.sort((start, end) => {
                if(start.tmp < end.tmp) {
                    return 1;
                }
                else if(start.tmp > end.tmp) {
                    return -1;
                } else {
                    return 0;
                }
            }))
        }
    }, [tmpSort])

    useEffect(() => {
        if(humSort) {
            setJsData(jsData.sort((start, end) => {
                if(start.hum > end.hum) {
                    return 1;
                }
                else if(start.hum < end.hum) {
                    return -1;
                } else {
                    return 0;
                }
            }))
        } else {
            setJsData(jsData.sort((start, end) => {
                if(start.hum < end.hum) {
                    return 1;
                }
                else if(start.hum > end.hum) {
                    return -1;
                } else {
                    return 0;
                }
            }))
        }
    }, [humSort])

    useEffect(() => {
        if(dustSort) {
            setJsData(jsData.sort((start, end) => {
                if(start.dust > end.dust) {
                    return 1;
                }
                else if(start.dust < end.dust) {
                    return -1;
                } else {
                    return 0;
                }
            }))
        } else {
            setJsData(jsData.sort((start, end) => {
                if(start.dust < end.dust) {
                    return 1;
                }
                else if(start.dust > end.dust) {
                    return -1;
                } else {
                    return 0;
                }
            }))
        }
    }, [dustSort])


    return (
        loading || socketLoading || jsLoading || weatherLoading ? (
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
                        <PublishBox>      
                        <div>                 
                            <FormGroup>
                                <FormControlLabel
                                control={<IOSSwitch checked={LedChecked} onChange={handleCheck} name="LedChecked" />}
                                label="AUTO"
                                />
                            <div>{LedChecked ? null : (
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
                            <button type="submit" name={socketData.product} value={socketData.keyName} onClick={publishLed}>제어</button>
                            </FormGroup>
                        </div>
                        <div>                 
                            <FormGroup>
                                <FormControlLabel
                                control={<IOSSwitch checked={FanChecked} onChange={handleFanCheck} name="FanChecked" />}
                                label="AUTO"
                                />
                            <div>{FanChecked ? null : (
                                <FormGroup>
                                    <FormControlLabel
                                    control={<IOSSwitch checked={fanCheckedBox} onChange={handleFanChange} name="on" />}
                                    label="Fan"
                                    />
                                </FormGroup>
                            )}</div>
                            <button type="submit" name={socketData.product} value={socketData.keyName} onClick={publishFan}>제어</button>
                            </FormGroup>
                        </div>
                        <div>                 
                            <FormGroup>
                                <FormControlLabel
                                control={<IOSSwitch checked={BuzChecked} onChange={handleBuzCheck} name="BuzChecked" />}
                                label="AUTO"
                                />
                            <div>{BuzChecked ? null : (
                                <FormGroup>
                                    <FormControlLabel
                                    control={<IOSSwitch checked={buzCheckedBox} onChange={handleBuzChange} name="on" />}
                                    label="Buz"
                                    />
                                </FormGroup>
                            )}</div>
                            <button type="submit" name={socketData.product} value={socketData.keyName} onClick={publishBuz}>제어</button>
                            </FormGroup>
                        </div>
                    </PublishBox>
                        </Fade>
                    </RealTimeContainer>
                    <WHITEBACK>
                    <Box>
                        <DateHandler>
                            <ProductName>
                                <h1 style={{fontSize: "28px"}}>Device: {socketData.keyName}</h1>
                            </ProductName>
                            <Form onSubmit={handleSubmitClicked}>
                                <DatePick
                                date={date}
                                setDate={setDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                />
                                <FormBtn value="조회" type="submit" onClick={() => setDateBox(dateBox.filter((_,idx) => idx < 0))}>조회</FormBtn>
                            </Form>
                            <BtnContainer>
                                <DayBtn value={100} type="submit" onClick={allBox ? null : handleBtnClicked} status={allBox}>일년</DayBtn>
                                <DayBtn value={3} type="submit" onClick={threeBox ? null : handleBtnClicked} status={threeBox}>3일</DayBtn>
                                <DayBtn value={7} type="submit" onClick={sevenBox ? null : handleBtnClicked} status={sevenBox}>7일</DayBtn>
                                <DayBtn value={30} type="submit" onClick={monthBox ? null : handleBtnClicked} status={monthBox}>한달</DayBtn>
                            </BtnContainer>
                            <OptionContainer>
                                <Label>
                                    평균
                                    <OptionInput type="checkbox" defaultChecked={avgCheck} onChange={
                                        jsData ? () => setAvgCheck(!avgCheck) : null
                                    } />
                                </Label>
                                <Label>
                                    최대
                                    <OptionInput type="checkbox" defaultChecked={maxCheck} onChange={
                                        jsData ? () => setMaxCheck(!maxCheck) : null
                                    } />
                                </Label>
                                <Label>
                                    최소
                                    <OptionInput type="checkbox" defaultChecked={minCheck} onChange={
                                        jsData ? () => setMinCheck(!minCheck) : null
                                    } />
                                </Label>
                            </OptionContainer>
                        </DateHandler>
                    </Box>
                    <Fade left>
                    <DataBox>
                        <DataHeader>
                            <Tr>
                                <Th>측정시간</Th>
                                <Th>
                                    <span>온도</span>
                                    <SortButton value="tmp" onClick={() => setTmpSort(!tmpSort)}>{!tmpSort ? <BsFillCaretDownFill/> : <BsFillCaretUpFill/>}</SortButton>
                                </Th>
                                <Th>
                                    <span>습도</span>
                                    <SortButton value="hum" onClick={() => setHumSort(!humSort)}>{!humSort ? <BsFillCaretDownFill/> : <BsFillCaretUpFill/>}</SortButton>
                                </Th>
                                <Th>
                                    <span>미세먼지</span>
                                    <SortButton value="dust" onClick={() => setDustSort(!dustSort)}>{!dustSort ? <BsFillCaretDownFill/> : <BsFillCaretUpFill/>}</SortButton>
                                </Th>
                            </Tr>
                        </DataHeader>
                        <DataBody style={{marginTop: "45px"}}>{jsData.length > 0 ? jsData.map(res => (
                            <ProductDetail {...res} key={res._id} />)) : (<tr><td colSpan="5"><h1 style={{display:"flex",  justifyContent:"center"}}>데이터 없음</h1></td></tr>) }
                        </DataBody>
                        <DataBody style={{marginTop: "45px"}}>{nodata ? <h1>데이터가 없습니다</h1> : null}</DataBody>
                    </DataBox>
                    <div>{minCheck && maxCheck && min && max && jsData ? (<Bar data={minMaxChart} options={options} style={{height:"500px", width:"80vw"}} />) : null}</div>
                    <div>{minCheck && !maxCheck && min && jsData ? (<Bar data={minChart} options={options} style={{height:"500px", width:"80vw"}} />) : null}</div>
                    <div>{!minCheck && maxCheck && max && jsData ? (<Bar data={maxChart} options={options} style={{height:"500px", width:"80vw"}} />) : null}</div>
                    <div>{avgCheck && mean && jsData ? (<Bar data={meanChart} options={options} style={{height:"500px", width:"80vw"}} />) : null}</div>
                    <Bar data={avgChart} options={options} style={{height:"500px", width:"80vw"}} />
                    </Fade>
                    </WHITEBACK>
        </Container>
        )
    )  
};

export default ProductPage;