import React from "react";
import { Link, withRouter } from "react-router-dom";
import { logout } from "../../_actions/user_action";
import styled from "styled-components";
import { useDispatch } from "react-redux";

const Button = styled.button`
    position: fixed;
    bottom: 20px;
    right: 200px;
    text-decoration: none;
    color: #FFFFFF;
    border: 1px solid black;
    background-color: black;
    padding: 10px 10px;
    border-radius: 20px;
    transition: background-color 0.2s linear;
    &:hover {
        color: black;
        background-color: #FFFFFF;
    }
`;

const NAV = styled.nav`
    position: fixed;
    right: 0;
    top: 0;
    width: 180px;
    z-index: 10;
`;

const ITEMLIST = styled.ul`
    display: grid;
    grid-template-columns: repeat(3, 60px);
    grid-template-rows: 100vh;
`;

const SLink = styled(Link)`
    transform: rotateZ(90deg);
`;

const Item = styled.li`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
`;

export default withRouter((props) => {
    // const 1 = useSelector(state => state.user.userData.id) // 스테이트로부터 유저 아이디 받아
    const url = window.location.href;
    const path = url.split('/localhost:3000')[1]
    const id = window.localStorage.getItem('id');

    const dispatch = useDispatch();
    const onClickHandler = (event) => {
        event.preventDefault();
        dispatch(logout())
            .then(response => {
                if (response.payload.success) {
                    props.history.push('/login');
                    setTimeout(() => {
                        window.location.replace('/login')
                    }, 1000);
                } else {
                    alert('로그아웃 실패');
                }
            })
        window.localStorage.setItem('persist:root','');
        window.localStorage.setItem('id','');
    };

    return(
        <>
        <Button onClick={onClickHandler}>Logout</Button>
        <NAV>
            {path === '/' ? (
                <ITEMLIST>
                <Item current={props.location.pathname==='/'} style={{backgroundColor:"#C9D6FF"}}> 
                    <SLink to="/">Home</SLink>
                </Item>    
                <Item current={props.location.pathname==='/me'} style={{backgroundColor:"#FFAFBD"}}> 
                    <SLink to="/me">MyPage</SLink>
                </Item>
                <Item current={props.location.pathname===`/data/${id}`} style={{backgroundColor:"#ffa751"}}> 
                    <SLink to={`/data/${id}`}>Device</SLink>
                </Item>
                </ITEMLIST>
            ) : (
                path === '/me' ? (
                    <ITEMLIST>
                        <Item current={props.location.pathname==='/me'} style={{backgroundColor:"#FFAFBD"}}> 
                            <SLink to="/me">MyPage</SLink>
                        </Item>
                        <Item current={props.location.pathname==='/'} style={{backgroundColor:"#C9D6FF"}}> 
                            <SLink to="/">Home</SLink>
                        </Item>    
                        <Item current={props.location.pathname===`/data/${id}`} style={{backgroundColor:"#ffa751"}}> 
                            <SLink to={`/data/${id}`}>Device</SLink>
                        </Item>
                    </ITEMLIST>
                ) : (
                    <ITEMLIST>
                        <Item current={props.location.pathname===`/data/${id}`} style={{backgroundColor:"#ffa751"}}> 
                            <SLink to={`/data/${id}`}>Device</SLink>
                        </Item>
                        <Item current={props.location.pathname==='/me'} style={{backgroundColor:"#FFAFBD"}}> 
                            <SLink to="/me">MyPage</SLink>
                        </Item>
                        <Item current={props.location.pathname==='/'} style={{backgroundColor:"#C9D6FF"}}> 
                            <SLink to="/">Home</SLink>
                        </Item>    
                    </ITEMLIST>
                )
            )}
                </NAV>
        </>
    )
});