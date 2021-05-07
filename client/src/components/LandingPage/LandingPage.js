import React, { useEffect } from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom'; 
function LandingPage(props) {

    useEffect(() => {
        axios.get('/')
            .then(response => { console.log(response) })
    }, [])


    const onClickHandler = () => {
        axios.get(`http://localhost:3001/logout`, { withCredentials: true })
            .then(response => {
                if (response.data.success) {
                    props.history.push("/login")
                } else {
                    alert('로그아웃 하는데 실패 했습니다.')
                }
            })
    }

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
}

export default withRouter(LandingPage)