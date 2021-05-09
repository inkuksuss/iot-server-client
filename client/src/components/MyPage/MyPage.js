import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../_actions/user_action';

function MyPage(props) {
    const user = useSelector(state => state.user.userData);
    const dispatch = useDispatch();
    // console.log("mypage")
    // console.log(user);
    const [oldPassword, setOldPassword] = useState("");
    const [Password, setPassword] = useState("");
    const [Password2, setPassword2] = useState("");
    const [addKey, setAddKey] = useState("");

    const onOldPasswordHandler = (event) => {
        setOldPassword(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onPasswordHandler2 = (event) => {
        setPassword2(event.currentTarget.value);
    }

    const onKeyHandler = (event) => {
        setAddKey(event.currentTarget.value);
    }

    const onPasswordSubmitHandler = (event) => {
        event.preventDefault();
        if (Password !== Password2) {
            return alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        }

        const body = {
            oldPassword,
            Password,
            Password2,
            userId: user.id
        }
        console.log(body);
        console.log(body);
        dispatch(changePassword(body))
            .then(response => {
                if (response.payload.success) {
                    alert(response.payload.message);
                } else {
                    alert(response.payload.message);
                }
            })
    }

    const onAddKeySubmitHandler = (event) => {
        event.preventDefault();
    }


    return (
        <>
            <div style={{marginTop:"50px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-around", height:"150px"}}>
                <span>이름:  {user.name}</span>
                <span>이메일:  {user.email}</span>
                <span>제품번호:  {user.key}</span>
            </div>
            <div style={{marginTop: "150px", display: "flex", justifyContent: "space-around"}}>
                <form onSubmit={onPasswordSubmitHandler} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
                    <label>기존 비밀번호</label>
                    <input type="password" value={oldPassword} onChange={onOldPasswordHandler} />
                    <label>새 비밀번호</label>
                    <input type="password" value={Password} onChange={onPasswordHandler} />
                    <label>비밀번호 확인</label>
                    <input type="password" value={Password2} onChange={onPasswordHandler2} />
                    <button type="submit">
                        비밀번호 변경
                    </button>
                </form>
                <form onSubmit={onAddKeySubmitHandler} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
                    <label>제품 번호</label>
                    <input type="text" value={addKey} onChange={onKeyHandler} />
                    <button type="submit">
                        제품 추가
                    </button>
                </form>
            </div>
        </>
    );
}

export default MyPage;