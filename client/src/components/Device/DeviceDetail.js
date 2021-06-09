import React from "react";
import { Link } from "react-router-dom";
import { FaRegSmileBeam } from 'react-icons/fa';
import { CgSmileSad, CgSmileNeutral } from 'react-icons/cg';
import styled from "styled-components";

const Container = styled.div`
    flex-basis: 100%;
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
`;

const H2 = styled.h2`
    display: inline;
`;



function DeviceDetail({ tmp, hum, dust, measuredAt, product, keyName }) {
    const time = measuredAt.split('T')[1]
    const realTime = time.split('.000Z')[0]    
    return (
        <Container>
            <Link to={`/data/product/${product}`}>
                <h1 style={{fontSize:"32px", marginBottom: "10px"}}>제품번호: {keyName}</h1>
                <div style={{display:"flex", marginBottom:"10px"}}>
                <div style={{marginRight:"20px"}}>
                <H2>온도: </H2>
                <H2 style={{color:"red"}}>{tmp >= 50 ? tmp : null}</H2>
                <H2 style={{color:"red"}}>{tmp >= 50 ? <CgSmileSad className="icon" size="16" /> : null}</H2>
                <H2 style={{color:"orange"}}>{50 > tmp > 40 ? tmp : null}</H2>
                <H2 style={{color:"orange"}}>{50 > tmp > 40 ? <CgSmileNeutral className="icon" size="16" /> : null}</H2>
                <H2 style={{color:"green"}}>{40 >= tmp ? tmp : null}</H2>
                <H2 style={{color:"green"}}>{40 >= tmp ? <FaRegSmileBeam className="icon" size="16" /> : null}</H2>
                </div>
                <div style={{marginRight:"20px"}}>
                <H2>습도: </H2>
                <H2 style={{color:"red"}}>{hum >= 80 ? hum : null}</H2>
                <H2 style={{color:"red"}}>{hum >= 80 ? <CgSmileSad className="icon" size="16" /> : null}</H2>
                <H2 style={{color:"orange"}}>{80 > hum > 70 ? hum : null}</H2>
                <H2 style={{color:"orange"}}>{80 > hum > 70 ? <CgSmileNeutral className="icon" size="16" /> : null}</H2>
                <H2 style={{color:"green"}}>{70 >= hum ? hum : null}</H2>
                <H2 style={{color:"green"}}>{70 >= hum ? <FaRegSmileBeam className="icon" size="16" /> : null}</H2>
                </div>
                <div>
                <H2>미세먼지: </H2>
                <H2 style={{color:"red"}}>{dust >= 120 ? dust : null}</H2>
                <H2 style={{color:"red"}}>{dust >= 120 ? <CgSmileSad className="icon" size="16" /> : null}</H2>
                <H2 style={{color:"orange"}}>{120 > dust > 80 ? dust : null}</H2>
                <H2 style={{color:"orange"}}>{120 > dust > 80 ? <CgSmileNeutral className="icon" size="16" /> : null}</H2>
                <H2 style={{color:"green"}}>{80 >= dust ? dust : null}</H2>
                <H2 style={{color:"green"}}>{80 >= dust ? <FaRegSmileBeam className="icon" size="16" /> : null}</H2>
                </div>
                </div>
                <div>
                <H2 style={{opacity: "0.5"}}>측정시간: {realTime}</H2>
                </div>
            </Link>
        </Container>
    )
}

export default DeviceDetail;