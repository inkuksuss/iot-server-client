import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { addKey, changePassword, auth } from '../../_actions/user_action';
import MyPageButton from './MyPageButton';
import Loading from "../Loader";
import styled from "styled-components";
import Jump from "react-reveal/Jump";
import Rotate from "react-reveal/Rotate";

const Container = styled.div`
    background: linear-gradient(to right, #ffc3a0 0%, #FFAFBD 100%);
    width: 100%;
    height: 100vh;
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
                <Rotate up right>
                <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-around", height:"150px"}}>
                    <span>이름:  {user.name}</span>
                    <span>이메일:  {user.email}</span>
                    <ul>{user.keyList ? (user.keyList.map((key) => ( key ? (
                        <MyPageButton {...key} key={key._id}/>) : (null)
                        ))) : (null)
                    }</ul>
                </div>
                
                
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
                </Rotate>
            </Container>)
        }    
        </>
    );
}

export default MyPage;
