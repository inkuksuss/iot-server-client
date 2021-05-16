import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { userDevice } from '_actions/user_action';


function DevicePage() {
    const userId = useSelector(state => state.user.userData.id);
    const dispatch = useDispatch();
    console.log(userId);

    useEffect(() => {
        dispatch(userDevice(userId))
            .then(response => console.log(response));
    }, [])

    return (
        <div>hello</div>
    )
};

export default DevicePage;