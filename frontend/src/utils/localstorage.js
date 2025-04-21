// src/utils/localStorage.js

export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('reduxState');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      console.warn('Failed to load state from localStorage:', err);
      return undefined;
    }
  };
  
  export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('reduxState', serializedState);
    } catch (err) {
      console.warn('Failed to save state to localStorage:', err);
    }
  };
  
  export const clearState = () => {
    try {
      localStorage.removeItem('reduxState');
    } catch (err) {
      console.warn('Failed to clear state from localStorage:', err);
    }
  };