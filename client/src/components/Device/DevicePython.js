import React from "react";
import styled from "styled-components";

const Container = styled.div`
  flex-basis: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  height: 10vh;
  color: black;
`;

function DevicePython(props) {
    return (
        <Container>
                <div>주간 평균 온도: {props['0']}</div>
                <div>주간 평균 습도: {props['1']}</div>
                <div>주간 평균 미세먼지: {props['2']}</div>
        </Container>
    )
}

export default DevicePython;