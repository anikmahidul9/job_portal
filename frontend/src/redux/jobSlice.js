import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an Axios instance for API calls
const recruiterApi = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
    //  baseURL: 'https://job-portal-kc3x.onrender.com/api/v1/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

recruiterApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
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
  async (searchParams = {}, { rejectWithValue }) => {
    try {
      const { search, location, jobType } = searchParams;
      const params = {};
      
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      
      const { data } = await recruiterApi.get('job/jobs', { params });
      return data.jobs || data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchJobs = createAsyncThunk(
  'jobs/searchJobs',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const { data } = await recruiterApi.get(`job/jobs?title=${encodeURIComponent(searchTerm)}`);
      return data.jobs; // Assuming the API returns { jobs: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to search jobs' });
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
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.allJobs = Array.isArray(action.payload) ? action.payload : [];
        state.jobs = state.allJobs.slice(0, 10); // First 10 results
        state.searchResults = state.allJobs; // Store all search results
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      .addCase(searchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle searchJobs fulfilled state
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false;
       const jobsArray = Array.isArray(action.payload) ? action.payload : [];
        state.allJobs = jobsArray;
        state.jobs = jobsArray.slice(0, 10);
      })
      // Handle searchJobs rejected state
      .addCase(searchJobs.rejected, (state, action) => {
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