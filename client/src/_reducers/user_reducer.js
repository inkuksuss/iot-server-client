/* eslint-disable no-unreachable */
/* eslint-disable import/no-anonymous-default-export */
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
} from '../_actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, success: action.payload };
        case JOIN_USER:
            return { ...state, success: action.payload };
        case AUTH_USER:
            return { ...state, userData: action.payload };
        case LOGOUT:
            return {...state, userData: {}};
        case CHANGE_PASSWORD:
            return {...state, success: action.payload};
        case ADD_KEY:
            return {...state, success: action.payload};
        case DELETE_KEY:
            return {...state, success: action.payload};
        case USER_DEVICE:
            return {...state, data: action.payload};
        case DEVICE_DETAIL:
            return {...state, data: action.payload};
        case DATA_DATE:
            return {...state, data: action.payload};
        case GET_WEATHER:
            return {...state, data: action.payload};
        default:
            return state;
    }
}