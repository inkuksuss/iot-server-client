import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegSmileBeam } from 'react-icons/fa';
import { CgSmileSad, CgSmileNeutral } from 'react-icons/cg';
import styled from "styled-components";

const Container = styled.div`
  flex-basis: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  height: 10vh;
`;



function DeviceDetail({ tmp, hum, dust, measuredAt, product, keyName}) {
    const time = measuredAt.split('T')[1]
    const realTime = time.split('.000Z')[0]    
    return (
        <Container>
            <Link to={`/data/product/${product}`}>
                <div>제품번호: {keyName}</div>
                <span>온도: </span>
                <span style={{color:"red"}}>{tmp >= 50 ? tmp : null}</span>
                <span style={{color:"red"}}>{tmp >= 50 ? <CgSmileSad className="icon" size="16" /> : null}</span>
                <span style={{color:"orange"}}>{50 > tmp >= 40 ? tmp : null}</span>
                <span style={{color:"orange"}}>{50 > tmp >= 40 ? <CgSmileNeutral className="icon" size="16" /> : null}</span>
                <span style={{color:"green"}}>{40 > tmp ? tmp : null}</span>
                <span style={{color:"green"}}>{40 > tmp ? <FaRegSmileBeam className="icon" size="16" /> : null}</span>

                <span>습도: </span>
                <span style={{color:"red"}}>{hum >= 80 ? hum : null}</span>
                <span style={{color:"red"}}>{hum >= 80 ? <CgSmileSad className="icon" size="16" /> : null}</span>
                <span style={{color:"orange"}}>{80 > hum >= 70 ? hum : null}</span>
                <span style={{color:"orange"}}>{80 > hum >= 70 ? <CgSmileNeutral className="icon" size="16" /> : null}</span>
                <span style={{color:"green"}}>{70 > hum ? hum : null}</span>
                <span style={{color:"green"}}>{70 > hum ? <FaRegSmileBeam className="icon" size="16" /> : null}</span>

                <span>미세먼지: </span>
                <span style={{color:"red"}}>{dust >= 120 ? dust : null}</span>
                <span style={{color:"red"}}>{dust >= 120 ? <CgSmileSad className="icon" size="16" /> : null}</span>
                <span style={{color:"orange"}}>{120 > dust >= 80 ? dust : null}</span>
                <span style={{color:"orange"}}>{120 > dust >= 80 ? <CgSmileNeutral className="icon" size="16" /> : null}</span>
                <span style={{color:"green"}}>{80 > dust ? dust : null}</span>
                <span style={{color:"green"}}>{80 > dust ? <FaRegSmileBeam className="icon" size="16" /> : null}</span>
                <span>측정시간: {realTime}</span>
            </Link>
        </Container>
    )
}

export default DeviceDetail;