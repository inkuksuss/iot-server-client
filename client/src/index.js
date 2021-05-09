import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';
import logger from 'redux-logger';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk, logger)(createStore)

ReactDOM.render(
    <Provider
    store={createStoreWithMiddleware(Reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__())}
    >
        <App />  
    </Provider>, document.getElementById('root'));
