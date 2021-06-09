import React from "react";
import { useDispatch } from "react-redux";
import { deleteKey } from '_actions/user_action';
import styled from "styled-components";

const Li = styled.li`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const DeleteBtn = styled.button`
    const
`;

function MyPageButton(key) {
    const dispatch = useDispatch();
    const id = key._id;
    const deleteBtn = () => {
        dispatch(deleteKey(id))
            .then(response => {
                if (!response.payload) {
                    return alert("서버로부터 데이터를 받지 못했습니다.");
                }
                alert(response.payload.message);
                window.location.replace('/me');
            })
    };
    
    return (
        <Li>
            
            <h1>{key.keyName}</h1>
            <DeleteBtn onClick={deleteBtn}>삭제</DeleteBtn>
        </Li>
    )
};

export default MyPageButton;
