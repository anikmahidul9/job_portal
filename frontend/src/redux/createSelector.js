import { createSelector } from 'reselect';

export const selectAuthState = (state) => state.auth;

export const selectAuthData = createSelector(
  [selectAuthState],
  (auth) => ({
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
  })
);