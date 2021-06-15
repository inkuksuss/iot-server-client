import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { joinUser } from '../../_actions/user_action';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import Swing from "react-reveal/Swing";

const Container = styled.div`
    /* background: linear-gradient(to right, #ffe259 0%, #ffa751 100%);*/
    background-color: #FFFFFF;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Input = styled.input`
    font-weight: 300;
    border: 0;
    border-bottom: 1px solid #ffa751;
    width: 100%;
    height: 36px;
    font-size: 26px;
    margin-bottom: 6px;
    &:focus {
        outline: none;
        box-shadow:none;
        background:#ffa751;
    }
`;

const Button = styled.button`
    width: 100%;
    text-decoration: none;
    color: black;
    border: 1px solid black;
    background-color: #FFFFFF;
    padding: 10px 0px;
    transition: background-color 0.2s linear;
    &:hover {
        color: white;
        background-color: #ffa751;
        opacity: 0.3;
    }
    border-radius: 30px;
`;

const Label = styled.label`
    color:#888;
    font-size: 24px;
`;


function JoinPage(props) {
    const dispatch = useDispatch();
    
    const [Email, setEmail] = useState("");
    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [Key, setKey] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };

    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    };

    const onKeyHandler = (event) => {
        setKey(event.currentTarget.value);
    };

    const onSubmitHandler = (event) => { // 회원가입 페이지 폼 관리
        event.preventDefault(); // 이벤트 발생 막음 => 페이지 리로딩 x
        if (Password !== ConfirmPassword) { // 오류 발생시 1차적으로 클라이언트에서 막음
            return alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        }

        const body = { // 데이터 객체화
            email: Email,
            password: Password,
            confirmPassword: ConfirmPassword,
            name: Name,
            key: Key
        } ;

        dispatch(joinUser(body)) // 서버로 전송
            .then(response => {
                if (response.payload.success) { // 결과에 따라 페이지 이동
                    alert(response.payload.message);
                    props.history.push("/login");
                } else {
                    alert(response.payload.message);
                }
            })
    };

    return (
        <Container>
            <Swing delay={1000}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <Label>이메일</Label>
                <Input type="email" value={Email} onChange={onEmailHandler} />

                <Label>이름</Label>
                <Input type="text" value={Name} onChange={onNameHandler} />

                <Label>비밀번호</Label>
                <Input type="password" value={Password} onChange={onPasswordHandler} />

                <Label>비밀번호 확인</Label>
                <Input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

                <Label>제품 번호</Label>
                <Input type="text" value={Key} onChange={onKeyHandler} />

                <br />
                <Button type="submit">
                    회원 가입
                </Button>
            </form>
            </Swing>
        </Container>
    )
};

export default withRouter(JoinPage);

