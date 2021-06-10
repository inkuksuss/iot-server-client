import axios from 'axios';
import {
    LOGIN_USER,
    JOIN_USER,
    AUTH_USER,
    CHANGE_PASSWORD,
    ADD_KEY,
    LOGOUT,
    DELETE_KEY,
    USER_DEVICE,
    DEVICE_DETAIL,
    DATA_DATE,
    GET_WEATHER
} from './types';

const apiKey = '5c604b15cb7bd1204b67f00b4932e3bc';

const api = axios.create({ // axios 설정
    baseURL: 'http://localhost:3001',
    withCredentials: true
});
// baseURL: 'http://114.71.241.151:3001',

export function loginUser(dataToSubmit) { // 로그인 페이지 패치

    const request = api.post('/login', dataToSubmit)
        .then(response => response.data)

    return {
        type: LOGIN_USER,
        payload: request
    }
};

export function joinUser(dataToSubmit) { // 회원가입 페이지 패치

    const request = api.post('/join', dataToSubmit)
        .then(response => response.data)

    return {
        type: JOIN_USER,
        payload: request
    }
};

export function auth() {

    const request = api.get('/authuser')
        .then(response => response.data)
        .catch(error => console.log(error.response))

    return {
        type: AUTH_USER,
        payload: request
    }
};

export function changePassword(dataToSubmit, id) {
    const request = api.post(`/users/change-password/${id}`,dataToSubmit)
        .then(response => response.data)
    return {
        type: CHANGE_PASSWORD,
        payload: request
    }
};

export function addKey(dataToSubmit) {
    const request = api.post('/users/addKey', dataToSubmit)
        .then(response => response.data)
    return {
        type: ADD_KEY,
        payload: request
    }
};

export function logout() {
    const request = api.get('/logout')
        .then(response => {
            return response.data
        })
    return {
        type: LOGOUT,
        payload: request
    }
};

export function deleteKey(id) {
    const request = api.post('/users/deleteKey', id)
        .then(response => response.data)
    return {
        type: DELETE_KEY,
        payload: request
    }
};

export function userDevice(id) {
    const request = api.get(`/data/${id}`)
        .then(response => response.data)
    return {
        type: USER_DEVICE,
        payload: request
    }
};

export function deviceDetail(id) {
    const request = api.get(`/data/product/${id}`)
        .then(response => response.data)
    return {
        type: DEVICE_DETAIL,
        payload: request
    }
};

export function dataDate(id, body) {
    const request = api.post(`data/product/${id}`, body)
        .then(response => response.data)
    return {
        type: DATA_DATE,
        payload: request
    }
};

export function get_weather(lat, lon) {
    const request = axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.data)
    return {
        type: GET_WEATHER,
        payload: request
    }
}