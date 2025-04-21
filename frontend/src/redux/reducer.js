import { combineReducers } from 'redux';

import authReducer from './authSlice';
import adminReducer from './adminSlice';

export default combineReducers({
    auth: authReducer,
    admin: adminReducer
});
