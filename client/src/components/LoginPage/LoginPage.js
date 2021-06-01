import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { auth, loginUser } from '../../_actions/user_action';
import { withRouter } from 'react-router-dom';
import Bounce from "react-reveal/Bounce";
import styled from "styled-components";

const Container = styled.div`
    background: linear-gradient(to right, #ffc3a0 0%, #FFAFBD 100%);
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
`;

function LoginPage(props) {
    const dispatch = useDispatch(); // 리덕스 dispatch 
    const [Email, setEmail] = useState("") // 이메일과 패스워드를 스테이트로 관리
    const [Password, setPassword] = useState("")
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
            if(userData){
                if (userData.isAuth) {
                        props.history.push('/') // 로그인한 유저 차단
                } else {
                    setUser({...user, ...userData})
                }
            }
        })
    }, [])

    useEffect(() => {
        setLoading(false);
    }, [user])

    const onEmailHandler = (event) => { // 이벤트 관리
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => { // 폼을 사용하여 서버로 데이터 전송
        event.preventDefault();

        const body = {
            email: Email,
            password: Password
        }
        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.success) {
                    window.localStorage.setItem('id', response.payload.userId);
                    props.history.push('/');
                    setTimeout(() => {
                        window.location.replace('/')
                    }, 1000);
            } else {
                alert(response.payload.message)
            }
        })

    }

    return (
        
        <Container>
            <Bounce top delay={1000}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">
                    Login
                </button>
            </form>
            </Bounce>
        </Container>
    )
}

export default withRouter(LoginPage);

