import React from "react";
import { Link } from "react-router-dom";

function DeviceDetail({ tmp, hum, dust, measuredAt, product}) {
    return (
        <div style={{display:"flex", justifyContent: "space-between"}}>
            <Link to={`/${product}`}>
                <span>{tmp}</span>
                <span>{hum}</span>
                <span>{dust}</span>
                <span>{measuredAt}</span>
            </Link>
        </div>
    )
}

export default DeviceDetail;