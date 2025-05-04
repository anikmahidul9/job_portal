import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  applications: [], // Added missing applications array
  applicationsByJob: {}, // Store applications by job ID
  currentJobId: null,
  loading: false,
  error: null,
  statusFilter: 'all' // Added missing statusFilter
};

const applicationApi = axios.create({
  // baseURL: 'http://localhost:8000/api/v1/',
  baseURL: 'https://job-portal-kc3x.onrender.com/api/v1/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Async Thunks
applicationApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const applyForJob = createAsyncThunk(
  'application/apply',
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await applicationApi.get(`application/apply/${jobId}`);
      console.log(data);
      return data.application;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Application failed' });
    }
  }
);

export const getApplicationsByUser = createAsyncThunk(
  'application/getByUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await applicationApi.get('/application/job');
      return data.applications;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch applications' });
    }
  }
);

export const getApplicationsByJob = createAsyncThunk(
  'application/getByJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await applicationApi.get(`/application/${jobId}/applicants`);
      return { jobId, applications: data.applications };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch applicants' });
    }
  }
);
export const updateApplicationStatus = createAsyncThunk(
  'application/updateStatus',
  async ({ applicationId, status, interviewDetails = null }, { rejectWithValue }) => {
      try {
          const payload = { status };
          if (interviewDetails) payload.interviewDetails = interviewDetails;
          
          const { data } = await applicationApi.put(
              `/application/status/${applicationId}/update`,
              payload
          );
          return data.application;
      } catch (error) {
          return rejectWithValue(error.response?.data || { error: 'Status update failed' });
      }
  }
);

export const inviteForInterview = createAsyncThunk(
  'application/inviteForInterview',
  async ({ applicationId, interviewDetails }, { rejectWithValue }) => {
      try {
          const { data } = await applicationApi.put(
              `/application/status/${applicationId}/update`,
              { 
                  status: 'interview_invited',
                  interviewDetails 
              }
          );
          return data.application;
      } catch (error) {
          return rejectWithValue(error.response?.data || { error: 'Failed to send invitation' });
      }
  }
);
const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    clearApplicationState: (state) => {
      state.applications = [];
      state.currentApplication = null;
      state.error = null;
    },
    clearApplications: (state) => {
      state.applications = [];
    },
    setCurrentJobId: (state, action) => { // Added new reducer
      state.currentJobId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Apply for Job
      .addCase(applyForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload);
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      
      // Get User Applications
      .addCase(getApplicationsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicationsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(getApplicationsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      
      // Get Job Applications
      .addCase(getApplicationsByJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicationsByJob.fulfilled, (state, action) => {
        const { jobId, applications } = action.payload;
        state.applicationsByJob = {
          ...state.applicationsByJob,
          [jobId]: applications
        };
        state.loading = false;
      })
      .addCase(getApplicationsByJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      
      // Update Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update in applications array
        state.applications = state.applications.map(app => 
          app._id === action.payload._id ? action.payload : app
        );
        // Update in applicationsByJob
        for (const jobId in state.applicationsByJob) {
          state.applicationsByJob[jobId] = state.applicationsByJob[jobId].map(app =>
            app._id === action.payload._id ? action.payload : app
          );
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })
      
      // Invite for Interview
      .addCase(inviteForInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteForInterview.fulfilled, (state, action) => {
        state.loading = false;
        // Update in applications array
        state.applications = state.applications.map(app => 
          app._id === action.payload._id ? action.payload : app
        );
        // Update in applicationsByJob
        for (const jobId in state.applicationsByJob) {
          state.applicationsByJob[jobId] = state.applicationsByJob[jobId].map(app =>
            app._id === action.payload._id ? action.payload : app
          );
        }
      })
      .addCase(inviteForInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      });
  }
});

export const { 
  setStatusFilter, 
  clearApplicationState, 
  clearApplications,
  setCurrentJobId // Added new action
} = applicationSlice.actions;

// Selectors
export const selectApplications = (state) => state.application.applications;
export const selectFilteredApplications = (state) => {
  const { applications, statusFilter } = state.application;
  if (!statusFilter || statusFilter === 'all') return applications;
  return applications.filter(app => app.status === statusFilter);
};
export const selectApplicationLoading = (state) => state.application.loading;
export const selectApplicationError = (state) => state.application.error;
export const selectCurrentApplication = (state) => state.application.currentApplication;
export const selectApplicationsByJobId = (state, jobId) => {
  return state?.application?.applicationsByJob?.[jobId] || [];
};
export const selectCurrentApplications = (state) => {
  const jobId = state?.application?.currentJobId;
  return jobId ? selectApplicationsByJobId(state, jobId) : [];
};
export const selectStatusFilter = (state) => state.application.statusFilter; // Added new selector

export default applicationSlice.reducer;