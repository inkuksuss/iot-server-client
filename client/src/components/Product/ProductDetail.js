import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegSmileBeam } from 'react-icons/fa';
import { CgSmileSad, CgSmileNeutral } from 'react-icons/cg';
import styled from "styled-components";


const Tr = styled.tr`
`;

const Td = styled.td`
    width: 20%;
    text-align: center;
`;

function ProductDetail(props) {
    return (
        <>
        <Tr>
            <Td>{props.measuredAt ? props.measuredAt.split('T')[0] + " | " + props.measuredAt.split('T')[1].split('.000Z')[0] : null}</Td>
            <Td>{props.tmp}</Td>
            <Td>{props.hum}</Td>
            <Td>{props.dust}</Td>
        </Tr>
        </>
    )
    
};

export default ProductDetail;


