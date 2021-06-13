import React from 'react'
import { withRouter } from 'react-router-dom'; 
import styled from "styled-components";

const Container = styled.div`
    /* background: linear-gradient(to right, #E2E2E2 0%, #C9D6FF 100% ); */
    background-color: #FFFFFF;
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