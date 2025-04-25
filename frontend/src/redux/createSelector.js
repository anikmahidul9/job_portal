import { createSelector } from 'reselect';
import { selectAllJobs } from './jobSlice';

export const selectAuthState = (state) => state.auth;

export const selectAuthData = createSelector(
  [selectAuthState],
  (auth) => ({
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
  })
);

export const selectLatestJobs = createSelector(
  [selectAllJobs],
  (allJobs) => [...allJobs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)
);