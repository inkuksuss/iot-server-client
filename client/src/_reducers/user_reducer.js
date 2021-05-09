/* eslint-disable no-unreachable */
/* eslint-disable import/no-anonymous-default-export */
import {
    LOGIN_USER,
    JOIN_USER,
    AUTH_USER,
    CHANGE_PASSWORD,
    ADD_KEY
} from '../_actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, success: action.payload };
        case JOIN_USER:
            return { ...state, success: action.payload };
        case AUTH_USER:
            return { ...state, userData: action.payload };
        case CHANGE_PASSWORD:
            return {...state, success: action.payload};
        case ADD_KEY:
            return {...state, success: action.payload};
        default:
            return state;
    }
}