// Global
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const AUTH = "/authuser";
const LOGOUT = "/logout";
const SEARCH = "/search";
const PYTHON = "/python";

// Users
const USERS = "/users";
const CHANGE_PASSWORD = "/change-password/:id";
const ME = "/me";
const ADD_KEY = "/addKey";
const DELETE_KEY = "/deleteKey";

// data
const DATAS = "/data";
const DATA_USER = "/:id";
const DETAIL_DATA = "/product/:id"

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
    python: PYTHON,

    //Users
    users: USERS,
    changePassword: id => {
      if(id) {
        return `/users/change-password/${id}`;
      } else {
        return CHANGE_PASSWORD;
      }
    },
    me: ME,
    addKey: ADD_KEY,
    deleteKey: DELETE_KEY,
    
    //Datas
    data: DATAS,
    dataUser: id => {
        if (id) {
          return `/data/${id}`;
        } else {
          return DATA_USER;
        }
    },
    detailData: id => {
      if (id) {
        return `/data/product/${id}`;
      } else {
        return DETAIL_DATA;
      }
    },
    // API
    api: API,
    weather: WEATHER
};

export default routes;

