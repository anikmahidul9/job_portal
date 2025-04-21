import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import adminReducer from './adminSlice';
import { loadState, saveState } from '@/utils/localstorage';

const persistedState = loadState(); // Implement this to load from localStorage

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin:adminReducer
  },
  preloadedState: persistedState
});

store.subscribe(() => {
  saveState(store.getState()); // Implement this to save to localStorage
});

export default store;