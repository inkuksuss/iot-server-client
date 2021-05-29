import React from "react";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";

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
    const url = window.location.href;
    const path = url.split('/localhost:3000')[1]
    return(
        <NAV>
            {path === '/' ? (
                <ITEMLIST>
                <Item current={pathname==='/'} style={{backgroundColor:"#C9D6FF"}}> 
                    <SLink to="/">Home</SLink>
                </Item>    
                <Item current={pathname==='/login'} style={{backgroundColor:"#FFAFBD"}}> 
                    <SLink to="/login">Login</SLink>
                </Item>
                <Item current={pathname==="/join"} style={{backgroundColor:"#ffa751"}}> 
                    <SLink to={"/join"}>Join</SLink>
                </Item>
                </ITEMLIST>
            ) : (
                path === '/login' ? (
                    <ITEMLIST>
                        <Item current={pathname==='/login'} style={{backgroundColor:"#FFAFBD"}}> 
                            <SLink to="/login">Login</SLink>
                        </Item>
                        <Item current={pathname==='/'} style={{backgroundColor:"#C9D6FF"}}> 
                            <SLink to="/">Home</SLink>
                        </Item>    
                        <Item current={pathname==="/join"} style={{backgroundColor:"#ffa751"}}> 
                            <SLink to={"/join"}>Join</SLink>
                        </Item>
                    </ITEMLIST>
                ) : (
                    <ITEMLIST>
                        <Item current={pathname==="/join"} style={{backgroundColor:"#ffa751"}}> 
                            <SLink to={"/join"}>Join</SLink>
                        </Item>
                        <Item current={pathname==='/login'} style={{backgroundColor:"#FFAFBD"}}> 
                            <SLink to="/login">Login</SLink>
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