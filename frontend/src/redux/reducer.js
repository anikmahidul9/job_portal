import { combineReducers } from 'redux';

import authReducer from './authSlice';
import adminReducer from './adminSlice';
import recruiterReducer from './recruiterSlice';
import jobReducer from './jobSlice';

export default combineReducers({
    auth: authReducer,
    admin: adminReducer,
    recruiter: recruiterReducer,
    jobs: jobReducer, 
    
});
