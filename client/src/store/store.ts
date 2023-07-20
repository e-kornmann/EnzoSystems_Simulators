import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/auth.slice';
import settingsReducer from './reducers/settings.slice';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';


const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({user: userReducer, settings: settingsReducer})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
    },
);


export const persistor = persistStore(store)