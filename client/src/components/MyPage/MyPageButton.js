import React from "react";
import { useDispatch } from "react-redux";
import { deleteKey } from '_actions/user_action';
import styled from "styled-components";

const Li = styled.li`
    width: 100%;
    display: grid;
    grid-template-columns: 80% 20%;
`;

const Text = styled.div`
    display: flex;
    justify-content: center;
`;

const DeleteBtn = styled.button`
    text-decoration: none;
    color: black;
    border: 1px solid black;
    background-color: #FFFFFF;
    transition: background-color 0.2s linear;
    &:hover {
        color: white;
        background-color: black;
    }
`;

function MyPageButton(key) {
    const dispatch = useDispatch();
    const id = key._id;
    const deleteBtn = () => {
        const ok = window.confirm('정말 삭제하시겠습니까?');
        if(ok){
            dispatch(deleteKey(id))
                .then(response => {
                    if (!response.payload) {
                        return alert("서버로부터 데이터를 받지 못했습니다.");
                    }
                    alert(response.payload.message);
                    window.location.replace('/me');
                })
        }
    };
    
    return (
        <Li>
            <Text>
                <h1>제품 번호:</h1>
                <h1>{key.keyName}</h1>
            </Text>
            <DeleteBtn onClick={deleteBtn}>x</DeleteBtn>
        </Li>
    )
};

export default MyPageButton;
