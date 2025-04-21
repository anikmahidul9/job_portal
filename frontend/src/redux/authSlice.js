import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthUser: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;  // Store token
        state.isAuthenticated = true;
      },
    loginFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: () => {
      return initialState;
    }
  }
});

export const { setLoading, setAuthUser, loginFailed, logout } = authSlice.actions;
export default authSlice.reducer;