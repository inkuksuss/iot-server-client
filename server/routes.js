// Global
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const AUTH = "/auth";
const LOGOUT = "/logout";
const SEARCH = "/search";

// Users
const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";
const ME = "/me";
const ADD_KEY = "/addKey";

// data
const DATAS = "/data";
const DATA_DETAIL = "/:id/detail";

// API
const API = "/api";
const WEATHER = "/weather";

const routes = {
    //Global
    home: HOME,
    join: JOIN,
    login: LOGIN,
    auth: AUTH,
    logout: LOGOUT,
    search: SEARCH,

    //Users
    users: USERS,
    userDetail: id => {
        if (id) {
          return `/users/${id}`;
        } else {
          return USER_DETAIL;
        }
    },
    editProfile: EDIT_PROFILE,
    changePassword: CHANGE_PASSWORD,
    me: ME,
    addKey: ADD_KEY,
    
    //Datas
    data: DATAS,
    dataDetail: id => {
        if (id) {
          return `/data/${id}/detail`;
        } else {
          return DATA_DETAIL;
        }
    },
    // API
    api: API,
    weather: WEATHER
};

export default routes;

