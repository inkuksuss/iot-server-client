import { combineReducers } from 'redux';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import user from './user_reducer';
// import createEncryptor from 'redux-persist-transform-encrypt';

// const encryptor = createEncryptor({
//     secretKey: 'omg-this-is-some-secret-stuff'
// });

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"],
}

const rootReducer = combineReducers({
    user
})

export default persistReducer(persistConfig, rootReducer);
