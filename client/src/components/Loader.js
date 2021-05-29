import React from "react";
import styled from "styled-components";

const Container = styled.div`
    margin-right: 180px;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    background: linear-gradient(to right, #ffe259 0%, #ffa751 100%);;
`;

const Loader = () => (
    <Container>
        <span role="img" aria-label="Loading">
            ⏰
        </span>
    </Container>
);

export default Loader;