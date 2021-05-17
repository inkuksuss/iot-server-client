import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { userDevice } from '_actions/user_action';
import socektIO from "socket.io-client";
import DeviceDetail from "./DeviceDetail";


const socket = socektIO('http://localhost:3001');

function DevicePage() {
    const userId = useSelector(state => state.user.userData.id);
    const dispatch = useDispatch();

    const [response, setResponse] = useState([]);

    const jsonHandler = async (res) => {
        const parser = await JSON.parse(res);
        if(response.length > 2) {
            setResponse(
                response.concat(parser).filter((data, index) => index > 2)
                )
        } else {
                setResponse(
                    response.concat(parser)
                    )
        }  
    };
    
    const timer = window.setInterval(() => {
        socket.emit("sendId", { userId });
    }, 2000);

    setTimeout(() => {
        clearTimeout(timer);
    }, 2001);
    
    useEffect(() => {
        socket.on("mqttSubmit", jsonHandler);
        return () => {
            socket.off("mqttSubmit", jsonHandler);
        }
    }, [])
    
    useEffect(() => {
        dispatch(userDevice(userId))
            .then(response => console.log(response));
    }, [{ userId }])
        
    return (
        <>
            <div>
                <div style={{marginTop:"50px"}}>{response !== [] ? response.map((res) => (
                    (<DeviceDetail {...res} key={res.product} />)))
                : null}
                </div>
            </div>
        </>
    )
};

export default DevicePage;