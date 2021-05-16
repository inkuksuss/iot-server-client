import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { userDevice } from '_actions/user_action';
import socektIO from "socket.io-client";


function DevicePage() {
    const userId = useSelector(state => state.user.userData.id);
    const dispatch = useDispatch();

    const [response, setResponse] = useState("");
    
    useEffect(() => {
        dispatch(userDevice(userId))
            .then(response => console.log(response));
        const socket = socektIO('http://localhost:3001');
        socket.on("mqttSubmit", (data) => {
            setResponse(data);
        })
    }, [])

    return (
        <div>{response}</div>
    )
};

export default DevicePage;