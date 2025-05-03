// recruiterSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const recruiterApi = axios.create({
  // baseURL: 'http://localhost:8000/api/v1/',
  baseURL:"https://job-portal-kc3x.onrender.com/api/v1/",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const initialState = {
    jobs: [],
    currentCompany: null,
    loading: false,
    error: null
  };
// Add request interceptor to inject token
recruiterApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const postJob = createAsyncThunk(
    'recruiter/postJob',
    async (jobData, { rejectWithValue }) => {
      try {
        console.log('Sending job data:', jobData); // Debug log
        const { data } = await recruiterApi.post('job/jobAdd', jobData);
        return data.jobPost;
      } catch (error) {
        console.error('Job post error:', error.response?.data); // Detailed error log
        return rejectWithValue(error.response?.data || { 
          error: error.message || 'Failed to post job' 
        });
      }
    }
  );
export const getMyJobs = createAsyncThunk(
  'recruiter/getMyJobs',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await recruiterApi.get('job/adminJobs'); // Changed from 'job/jobs' to 'job/adminJobs'
      return data.jobs;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch jobs' });
    }
  }
);
export const registerCompany = createAsyncThunk(
    'recruiter/registerCompany',
    async (companyData, { rejectWithValue }) => {
      try {
        console.log('Sending company data:', companyData); // Debug log
        const { data } = await recruiterApi.post('company/register', companyData);
        return data.company;
      } catch (error) {
        console.error('Registration error:', error.response?.data); // Detailed error log
        return rejectWithValue(error.response?.data || { 
          error: error.message || 'Failed to register company' 
        });
      }
    }
  );
  export const getCompanyProfile = createAsyncThunk(
    'recruiter/getCompany',
    async (_, { rejectWithValue }) => {
      try {
        const { data } = await recruiterApi.get('company/recruiter'); // Ensure this matches your backend route
        console.log('API Response:', data); // Debug log
        return data.company;
      } catch (error) {
        console.error('API Error:', error.response?.data || error.message); // Debug log
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  
export const updateCompanyProfile = createAsyncThunk(
  'recruiter/updateCompany',
  async ({ companyId, updateData }, { rejectWithValue }) => {
    try {
      const { data } = await recruiterApi.put(`company/update/${companyId}`, updateData); // Changed from POST to PUT and fixed endpoint
      return data.company;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to update company' });
    }
  }
);

const recruiterSlice = createSlice({
  name: 'recruiter',
  initialState,
  reducers: {
    clearRecruiterState: (state) => {
      state.jobs = [];
      state.company = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Post Job
      .addCase(postJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
      })
      .addCase(postJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      
      // Get My Jobs
      .addCase(getMyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(getMyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      
  // Get Company Profile
  .addCase(getCompanyProfile.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getCompanyProfile.fulfilled, (state, action) => {
    state.loading = false;
    state.currentCompany = action.payload;
  })
  .addCase(getCompanyProfile.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.error || action.error.message;
  })
  
  // Update Company Profile
  .addCase(updateCompanyProfile.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(updateCompanyProfile.fulfilled, (state, action) => {
    state.loading = false;
    state.currentCompany = action.payload;
  })
  .addCase(updateCompanyProfile.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.error || action.error.message;
  })
  // Register Company
  .addCase(registerCompany.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(registerCompany.fulfilled, (state, action) => {
    state.loading = false;
    state.currentCompany = action.payload;
  })
  .addCase(registerCompany.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.error || action.error.message;
  });
  }
});

export const { clearRecruiterState } = recruiterSlice.actions;
export default recruiterSlice.reducer;
export const selectCompanyStatus = (state) => state.recruiter.loading;
export const selectCompanyError = (state) => state.recruiter.error;
export const selectCompany = (state) => state.recruiter.currentCompany;