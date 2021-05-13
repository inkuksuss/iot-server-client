import React from "react";
import { useDispatch } from "react-redux";
import { deleteKey } from '_actions/user_action';

function MyPageButton(props) {
    const dispatch = useDispatch();
    const id = props._id;
    const deleteBtn = () => {
        dispatch(deleteKey(id))
            .then(response => {
                if (!response.payload) {
                    return alert("서버로부터 데이터를 받지 못했습니다.");
                }
                alert(response.payload.message);
            })
    };
    
    return (
        <li>
            <span>{props.keyName}</span>
            <button onClick={deleteBtn}>삭제</button>
        </li>
    )
};

export default MyPageButton;
