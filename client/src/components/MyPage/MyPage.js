import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { addKey, changePassword, auth } from '../../_actions/user_action';
import MyPageButton from './MyPageButton';
import Loading from "../Loader";
import styled, { keyframes } from "styled-components";
import Zoom from "react-reveal/Zoom";
import imgA from 'react.png';

const a = keyframes`
    0% { 
        background-position: 0 0, 0 100%, 0 0, 100% 0; 
    }
    100% {
        background-position: 30px 0, -30px 100%, 0 -30px, 100% 30px;
    }
`;

const Container = styled.div`
    /* background: linear-gradient(to right, #ffc3a0 0%, #FFAFBD 100%); */
    background-color: #FFFFFF;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const MyInfo = styled.div`
    margin-top: 50px;
    display: grid;
    font-size: 26px;
    text-align: center;
    grid-template-columns: 300px 300px;
    grid-template-rows: 100px 100px;
    grid-column-gap: 20px;
`;

const Box = styled.div`
    &:first-child {
        grid-row: 1/3;
    }
    &:nth-child(2) {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    &:nth-child(3) {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
`;

const H1 = styled.h1`
    display: flex;
    padding: 5px 0px;
    width: 100%;
    border: 1px solid black;
    justify-content: center;
    align-items: center;
    &:nth-child(odd) {
        background-color: #FFAFBD;
    }
`;

const MyKey = styled.ul`
    display: flex;
    width: 620px;
    flex-direction: column;
    justify-content: center;
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
`;

function MyPage(props) {
    // const user = useSelector(state => state.user.userData); // 스테이트로부터 유저데이터 받아옴
    const dispatch = useDispatch(); // 리덕스 디스패치 
    const [oldPassword, setOldPassword] = useState(""); // 스테이트 관리
    const [Password, setPassword] = useState("");
    const [Password2, setPassword2] = useState("");
    const [newKey, setNewKey] = useState("");
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

    const onOldPasswordHandler = (event) => { // 인풋 이벤트 관리
        setOldPassword(event.currentTarget.value);
    }
    
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    
    const onPasswordHandler2 = (event) => {
        setPassword2(event.currentTarget.value);
    }
    
    const onKeyHandler = (event) => {
        setNewKey(event.currentTarget.value);
    }
    
    const onPasswordSubmitHandler = (event) => { // 폼 이벤트 관리
        event.preventDefault();
        if (!oldPassword || !Password || !Password2) {
            return alert("모든 정보를 입력해주세요.");
        }
        if (Password !== Password2) {
            setOldPassword("");
            setPassword("");
            setPassword2("");
            return alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        }
        
        const body = {
            oldPassword,
            Password,
            Password2,
            userId: user.id
        }
        dispatch(changePassword(body))
        .then(response => {
            if (!response.payload) {
                return alert("서버로부터 데이터를 받지 못했습니다.");
            }
            alert(response.payload.message);
            setOldPassword("");
            setPassword2("");
            setPassword("");
        })
    }
    
    const onNewKeySubmitHandler = (event) => {
        event.preventDefault();
        if(!newKey) {
            return alert("제품번호를 입력해주세요.");
        }
        
        const body = {
            userId: user.id,
            newKey 
        }
        
        dispatch(addKey(body))
        .then(response => {
            if (!response.payload) {
                return alert("서버로부터 데이터를 받지 못했습니다.");
            }
            alert(response.payload.message);
            window.location.replace('/me');
            setNewKey("");
        });
    };
    
    return (
        <>
            {
            loading ? (<Loading />) : (
            <Container>
                <Zoom top delay={1000}>
                <MyInfo>
                    <Box>
                        <img src={imgA} alt={"profile"} width={"300px"} height={"200px"}/>
                    </Box>
                    <Box>
                        <H1>Name</H1>
                        <H1>{user.name}</H1>
                    </Box>
                    <Box>
                        <H1>E-mail</H1>
                        <H1>{user.email}</H1>
                    </Box>
                </MyInfo>
                <MyKey><h1 style={{padding:"10px", display:"flex", justifyContent:"center", fontWeight:"600px", fontSize:"22px"}}>나의 제품</h1>
                    {user.keyList ? (user.keyList.map((key) => ( key ? (
                    <MyPageButton {...key} key={key._id}/>) : (null)
                    ))) : (null)
                }</MyKey>
                
                
                <div style={{marginTop: "150px", display: "flex", justifyContent: "space-around"}}>
                    <form onSubmit={onPasswordSubmitHandler} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
                        <label>기존 비밀번호</label>
                        <input type="password" value={oldPassword} onChange={onOldPasswordHandler} />
                        <label>새 비밀번호</label>
                        <input type="password" value={Password} onChange={onPasswordHandler} />
                        <label>비밀번호 확인</label>
                        <input type="password" value={Password2} onChange={onPasswordHandler2} />
                        <button type="submit">비밀번호 변경</button>
                    </form>
                    <form onSubmit={onNewKeySubmitHandler} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
                        <label>제품 번호</label>
                        <input type="text" value={newKey} onChange={onKeyHandler} />
                        <button type="submit">제품 추가</button>
                    </form>
                </div>
                </Zoom>
            </Container>)
        }    
        </>
    );
}

export default MyPage;
