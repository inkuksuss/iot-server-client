import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { joinUser } from '../../_actions/user_action';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import Swing from "react-reveal/Swing";

const Container = styled.div`
    background: linear-gradient(to right, #ffe259 0%, #ffa751 100%);
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
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
                <label>이메일</label>
                <input type="email" value={Email} onChange={onEmailHandler} />

                <label>이름</label>
                <input type="text" value={Name} onChange={onNameHandler} />

                <label>비밀번호</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <label>비밀번호 확인</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

                <label>제품 번호</label>
                <input type="text" value={Key} onChange={onKeyHandler} />

                <br />
                <button type="submit">
                    회원 가입
                </button>
            </form>
            </Swing>
        </Container>
    )
};

export default withRouter(JoinPage);

