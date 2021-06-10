import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { addKey, changePassword, auth } from '../../_actions/user_action';
import MyPageButton from './MyPageButton';
import Loading from "../Loader";
import styled, { keyframes, css } from "styled-components";
import Zoom from "react-reveal/Zoom";
import Slide from "react-reveal/Slide";
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
    margin-bottom: 30px;
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
    align-items: center;
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

const KeyContainer = styled.div`
    width: 100%;
    margin-top: 15px;
`;

const KeyForm = styled.form`
    width: 100%;
`;

const KeyAddInput = styled.input`
    width: 620px;
    border: none;
    border-bottom: 1px solid black;
    height: 30px;
    margin-bottom: 10px;
`;

const KeyAddBtn = styled.button`
    width: 620px;
    text-decoration: none;
    color: black;
    border: 1px solid black;
    background-color: #FFFFFF;
    padding: 5px 0px;
    transition: background-color 0.2s linear;
    &:hover {
        color: white;
        background-color: black;
        opacity: 0.3;
    }
    border-radius: 30px;
`;

const PasswordBox = styled.div`
    width: 620px;
    margin-top: 30px;
`;

const PasswordForm = styled.form`
    width: 620px;
`;

const PasswordInput = styled.input`
    width: 100%;
`;

const PasswordLabel = styled.label`
    width: 100%;
`;

const PasswordBtn = styled.button`
    width: 100%;
    text-decoration: none;
    color: black;
    border: 1px solid black;
    background-color: #FFFFFF;
    padding: 5px 0px;
    transition: background-color 0.2s linear;
    &:hover {
        color: white;
        background-color: black;
        opacity: 0.3;
    }
    border-radius: 30px;
`;

const PwVisualBtn = styled.button`
    width: 620px;
    text-decoration: none;
    color: black;
    border: 1px solid black;
    background-color: #FFFFFF;
    padding: 5px 0px;
    transition: background-color 0.2s linear;
    &:hover {
        color: white;
        background-color: black;
        opacity: 0.3;
    }
    border-radius: 30px;
`;


function MyPage(props) {
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
    const [visual, setVisual] = useState(false);
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
        dispatch(changePassword(body, user.id))
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
                <MyKey>
                    <h1 style={{padding: "6px"}}>나의 제품</h1>
                    {user.keyList ? (user.keyList.map((key) => ( key ? (
                    <MyPageButton {...key} key={key._id}/>) : (null)
                    ))) : (null)
                }</MyKey>
                <KeyContainer>
                    <KeyForm onSubmit={onNewKeySubmitHandler} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
                        <KeyAddInput type="text" value={newKey} onChange={onKeyHandler} placeholder="제품번호를 입력해주세요..."/>
                        <KeyAddBtn type="submit" >+</KeyAddBtn>
                    </KeyForm>
                </KeyContainer>
                <PasswordBox>
                    {visual ? (
                    <Slide right>
                    <PasswordForm onSubmit={onPasswordSubmitHandler} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
                        <PasswordLabel>기존 비밀번호</PasswordLabel>
                        <PasswordInput type="password" value={oldPassword} onChange={onOldPasswordHandler} />
                        <PasswordLabel>새 비밀번호</PasswordLabel>
                        <PasswordInput type="password" value={Password} onChange={onPasswordHandler} />
                        <PasswordLabel>비밀번호 확인</PasswordLabel>
                        <PasswordInput type="password" value={Password2} onChange={onPasswordHandler2} />
                        <PasswordBtn type="submit">비밀번호 변경</PasswordBtn>
                    </PasswordForm>
                    </Slide>
                    ) : <PwVisualBtn type="button" onClick={()=>setVisual(!visual)}>비밀번호 변경</PwVisualBtn>}
                </PasswordBox>
                </Zoom>
            </Container>)
        }    
        </>
    );
}

export default MyPage;
