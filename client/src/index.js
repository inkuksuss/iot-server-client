import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { CookiesProvider } from 'react-cookie';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';
import logger from 'redux-logger';

const middlewares = [logger, ReduxThunk, promiseMiddleware]
const store = createStore(Reducer, applyMiddleware(...middlewares));
const persistor = persistStore(store);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <CookiesProvider>
                <App />  
            </CookiesProvider>
        </PersistGate>
    </Provider>, document.getElementById('root'));
