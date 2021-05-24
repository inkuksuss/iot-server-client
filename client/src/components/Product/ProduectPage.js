import React, { useState, useEffect } from "react";
import socektIO from "socket.io-client";
import styled from "styled-components";
import Loader from "../Loader";

const socket = socektIO('http://localhost:3001');

function ProductPage() {
    const [time, setTime] = useState(false);
    const [socketLoading, setSocektLoading] = useState(true);
    const [pythonLoading, setPythonLoading] = useState(false)
    const [socketData, setSocketData] = useState([]);
    

    const url = window.location.href
    const id = url.split('/product/')[1]

    async function jsonHandler (res) {
        try {
            const resData = await JSON.parse(res);
            console.log(resData);
            console.log(socketData.length)
            if(socketData.length === 0) {
                setSocketData(prev => prev.concat(resData))
            } else {
                setSocketData(prev => prev.filter((_, index) => index >= 0).concat(resData))
            }
            console.log(socketData);
        } catch(err) {
            console.log(err);
        } finally {
            setSocektLoading(false);
        }
    }

    
    useEffect(() => {
        const timer = setTimeout(() => {
            socket.emit("productId", { id });
            setTime(true);
            setTimeout(() => {
                setTime(false);
            }, 2000)
        }, 3000)
        return () => {
            clearTimeout(timer);
            setTime(false);
        }
    }, [time])
    
    useEffect(() => {
        socket.on("mqttData", jsonHandler);
        return () => {
            socket.off("mqttData", jsonHandler);
        }
    }, [])

    return (
        socketLoading || pythonLoading ? (
            <Loader />
        )
        : (<div>hello</div>)
    )
};

export default ProductPage;