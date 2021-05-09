import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { joinUser } from '../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function JoinPage(props) {
    const dispatch = useDispatch();
    
    const [Email, setEmail] = useState("");
    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [Key, setKey] = useState("");


    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };

    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    };

    const onKeyHandler = (event) => {
        setKey(event.currentTarget.value);
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        }

        const body = {
            email: Email,
            password: Password,
            confirmPassword: ConfirmPassword,
            name: Name,
            key: Key
        } ;

        dispatch(joinUser(body))
            .then(response => {
                if (response.payload.success) {
                    props.history.push("/login");
                } else {
                    alert(response.payload.message);
                }
            })
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>이메일</label>
                <input type="email" value={Email} onChange={onEmailHandler} />

                <label>이름</label>
                <input type="text" value={Name} onChange={onNameHandler} />

                <label>비밀번호</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <label>비밀번호 확인</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

                <label>제품 번호</label>
                <input type="text" value={Key} onChange={onKeyHandler} />

                <br />
                <button type="submit">
                    회원 가입
                </button>
            </form>
        </div>
    )
};

export default withRouter(JoinPage);

