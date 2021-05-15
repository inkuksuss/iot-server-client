import React from 'react'
import { useDispatch } from "react-redux";
import { withRouter } from 'react-router-dom'; 
import { logout } from '_actions/user_action';

function LandingPage(props) {
    const dispatch = useDispatch();
    const onClickHandler = (event) => {
        event.preventDefault();
        dispatch(logout())
            .then(response => {
                if (response.payload.success) {
                    props.history.push("/login");
                } else {
                    alert('로그아웃 실패');
                }
            })
        window.localStorage.setItem('persist:root','');
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>

            <button onClick={onClickHandler}>
                로그아웃
            </button>

        </div>
    )
};

export default withRouter(LandingPage);