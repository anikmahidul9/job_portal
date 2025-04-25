import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an Axios instance for API calls
const recruiterApi = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initial state for the job slice
const initialState = {
  jobs: [], // Latest 10 jobs
  allJobs: [], // All jobs
  loading: false,
  error: null,
};

// Async thunk to fetch all jobs
export const fetchAllJobs = createAsyncThunk(
  'jobs/fetchAllJobs',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await recruiterApi.get('job/jobs'); // API call to fetch jobs
      return data.jobs; // Return the jobs array
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch jobs' });
    }
  }
);

// Create the job slice
const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobState: (state) => {
      state.jobs = [];
      state.allJobs = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAllJobs pending state
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fetchAllJobs fulfilled state
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.allJobs = action.payload; // Store all jobs
        state.jobs = action.payload.slice(0, 10); // Store the latest 10 jobs
      })
      // Handle fetchAllJobs rejected state
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      });
  },
});

// Export actions and reducer
export const { clearJobState } = jobSlice.actions;
export default jobSlice.reducer;

// Selectors for accessing state
export const selectJobs = (state) => state.jobs.jobs;
export const selectAllJobs = (state) => state.jobs.allJobs;
export const selectJobLoading = (state) => state.jobs.loading;
export const selectJobError = (state) => state.jobs.error;