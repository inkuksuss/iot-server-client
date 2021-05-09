import axios from 'axios';
import {
    LOGIN_USER,
    JOIN_USER,
    AUTH_USER,
    CHANGE_PASSWORD,
    ADD_KEY,
    LOGOUT
} from './types';

const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true
});

export function loginUser(dataToSubmit) {

    const request = api.post('/login', dataToSubmit)
        .then(response => response.data)

    return {
        type: LOGIN_USER,
        payload: request
    }
};

export function joinUser(dataToSubmit) {

    const request = api.post('/join', dataToSubmit)
        .then(response => response.data)

    return {
        type: JOIN_USER,
        payload: request
    }
};

export function auth() {

    const request = api.get('/auth')
        .then(response => response.data)
    return {
        type: AUTH_USER,
        payload: request
    }
};

export function changePassword(dataToSubmit) {
    const request = api.post('/users/change-password',dataToSubmit)
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
            console.log(response);
            return response.data
        })
    return {
        type: LOGOUT,
        payload: request
    }
};