import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from './types';

const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true
});

export function loginUser(dataToSubmit) {

    const request = api.post('/login', dataToSubmit)
        .then(response => response.data)
    console.log(request);
    return {
        type: LOGIN_USER,
        payload: request
    }
};

export function registerUser(dataToSubmit) {

    const request = api.post('/join', dataToSubmit)
        .then(response => response.data)
    console.log(request);
    return {
        type: REGISTER_USER,
        payload: request
    }
};

export function auth() {

    const request = api.get('/auth')
        .then(response => response.data)
    console.log(request);
    return {
        type: AUTH_USER,
        payload: request
    }
};
