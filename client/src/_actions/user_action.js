import axios from 'axios';
import {
    LOGIN_USER,
    JOIN_USER,
    AUTH_USER,
    CHANGE_PASSWORD,
    ADD_KEY,
    LOGOUT,
    ADD_KEY_ARRAY,
    DELETE_KEY
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
        .then(response => {
            return response.data
        })
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
            return response.data
        })
    return {
        type: LOGOUT,
        payload: request
    }
};

export function addKeyArray(keyName) {
    return {
        type: ADD_KEY_ARRAY,
        payload: keyName
    }
}

export function deleteKey(id) {
    const request = api.post('/users/deleteKey', id)
        .then(response => response.data)
    return {
        type: DELETE_KEY,
        payload: request
    }
}