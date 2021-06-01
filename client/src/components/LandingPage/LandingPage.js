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
    

    return (
        <Container>
            <h2>시작 페이지</h2>
        </Container>
    )
};

export default withRouter(LandingPage);