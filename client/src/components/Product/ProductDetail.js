import React from "react";
import styled from "styled-components";


const Tr = styled.div`
    height: 30px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
`;

const Td = styled.div`
    text-align: center;
`;

function ProductDetail(props) {
    return (
        <Tr>
            <Td>{props.measuredAt ? props.measuredAt.split('T')[0] + " | " + props.measuredAt.split('T')[1].split('.000Z')[0] : null}</Td>
            <Td>{props.tmp}°C</Td>
            <Td>{props.hum}%</Td>
            <Td>{props.dust}㎛</Td>
        </Tr>
    )
    
};

export default ProductDetail;


