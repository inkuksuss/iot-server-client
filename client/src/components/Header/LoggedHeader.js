import React from "react";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";

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

export default withRouter(({ location: { pathname } }) => {
    const userId = useSelector(state => state.user.userData.id) // 스테이트로부터 유저 아이디 받아
    const url = window.location.href;
    const path = url.split('/localhost:3000')[1]
    return(
        <NAV>
            {path === '/' ? (
                <ITEMLIST>
                <Item current={pathname==='/'} style={{backgroundColor:"#C9D6FF"}}> 
                    <SLink to="/">Home</SLink>
                </Item>    
                <Item current={pathname==='/me'} style={{backgroundColor:"#FFAFBD"}}> 
                    <SLink to="/me">MyPage</SLink>
                </Item>
                <Item current={pathname===`/data/${userId}`} style={{backgroundColor:"#ffa751"}}> 
                    <SLink to={`/data/${userId}`}>Device</SLink>
                </Item>
                </ITEMLIST>
            ) : (
                path === '/me' ? (
                    <ITEMLIST>
                        <Item current={pathname==='/me'} style={{backgroundColor:"#FFAFBD"}}> 
                            <SLink to="/me">MyPage</SLink>
                        </Item>
                        <Item current={pathname==='/'} style={{backgroundColor:"#C9D6FF"}}> 
                            <SLink to="/">Home</SLink>
                        </Item>    
                        <Item current={pathname===`/data/${userId}`} style={{backgroundColor:"#ffa751"}}> 
                            <SLink to={`/data/${userId}`}>Device</SLink>
                        </Item>
                    </ITEMLIST>
                ) : (
                    <ITEMLIST>
                        <Item current={pathname===`/data/${userId}`} style={{backgroundColor:"#ffa751"}}> 
                            <SLink to={`/data/${userId}`}>Device</SLink>
                        </Item>
                        <Item current={pathname==='/me'} style={{backgroundColor:"#FFAFBD"}}> 
                            <SLink to="/me">MyPage</SLink>
                        </Item>
                        <Item current={pathname==='/'} style={{backgroundColor:"#C9D6FF"}}> 
                            <SLink to="/">Home</SLink>
                        </Item>    
                    </ITEMLIST>
                )
            )}
        </NAV>
    )
});