import React from "react";
import { useDispatch } from "react-redux";
import { deleteKey } from '_actions/user_action';

    function MyPageButton(key) {
        const dispatch = useDispatch();
        console.log(key);
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
            <li>
                <span>{key.keyName}</span>
                <button onClick={deleteBtn}>삭제</button>
            </li>
        )
    };

export default MyPageButton;
