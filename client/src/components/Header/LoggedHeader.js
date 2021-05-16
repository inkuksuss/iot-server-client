import React from "react";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Header = styled.header`
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    background-color: rgba(20, 20, 20, 0.8);
    z-index: 10;
    box-shadow: 0px 1px 5px 2px rgba(0, 0, 0, 0.8);
`;

const List = styled.ul`
    display:flex;
`;

const Item = styled.li`
    width: 80px;
    height: 50px;
    text-align: center;
    border-bottom: 5px solid 
        ${props => (props.current ? "#3498db" : "transparent")};
        transition: border-bottom 0.5s ease-in-out;
`;

const SLink = styled(Link)`
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default withRouter(({ location: { pathname }}) => {
    const userId = useSelector(state => state.user.userData.id)
    return (
        <Header>
            <List>
                <Item current={pathname === "/"}>
                    <SLink to="/">홈</SLink>
                </Item>    
                <Item current={pathname === "/me"}>
                    <SLink to="/me">내정보</SLink>
                </Item>
                <Item current={pathname === `/data/${userId}`}>
                    <SLink to= {`/data/${userId}`}>기기정보</SLink>
                </Item>
            </List>
        </Header>
    )
});