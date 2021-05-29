import React, { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { withRouter } from 'react-router-dom'; 
import { logout } from '_actions/user_action';
import styled, { keyframes } from "styled-components";

const Container = styled.div`
    background: linear-gradient(to right, #E2E2E2 0%, #C9D6FF 100% );
    width: 100%;
    height: 100vh;
`;
    

function LandingPage(props) {
    const dispatch = useDispatch();
    const onClickHandler = (event) => {
        event.preventDefault();
        dispatch(logout())
            .then(response => {
                if (response.payload.success) {
                    window.location.replace("/login");
                } else {
                    alert('로그아웃 실패');
                }
            })
        window.localStorage.setItem('persist:root','');
    };

    return (
        <Container>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </Container>
    )
};

export default withRouter(LandingPage);