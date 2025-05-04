import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const adminApi = axios.create({
  // baseURL: 'http://localhost:8000/api/v1/admin',
  baseURL: 'https://job-portal-kc3x.onrender.com/api/v1/admin',
  withCredentials: true,
});

// Add request interceptor to inject token
adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Use only localStorage here
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchPendingRecruiters = createAsyncThunk(
  'admin/fetchPendingRecruiters',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Dynamically access the token from the store
      const token = getState().auth.token;
      if (token) {
        adminApi.defaults.headers.Authorization = `Bearer ${token}`;
      }
      const { data } = await adminApi.get('/recruiters/pending');
      return data.recruiters;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Network Error' });
    }
  }
);

export const approveRecruiter = createAsyncThunk(
  '/approveRecruiter',
  async (recruiterId, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.put(`/recruiters/approve/${recruiterId}`);
      return data.recruiter;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Network Error' });
    }
  }
);

export const rejectRecruiter = createAsyncThunk(
  '/rejectRecruiter',
  async (recruiterId, { rejectWithValue }) => {
    try {
      await adminApi.delete(`/recruiters/reject/${recruiterId}`);
      return recruiterId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Network Error' });
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.get('/users');
      console.log('API Response Data:', data); // Debug log
      
      // Return the actual users array from the response
      return data.users || data.data; // Handle both response formats
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Network Error' });
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    pendingRecruiters: [],
    users: [],
    loading: false,
    error: null,
    initialized: false
  },
  reducers: {
    clearAdminState: (state) => {
      state.pendingRecruiters = [];
      state.users = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingRecruiters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingRecruiters.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRecruiters = action.payload;
      })
      .addCase(fetchPendingRecruiters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch pending recruiters';
      })
      .addCase(approveRecruiter.fulfilled, (state, action) => {
        state.pendingRecruiters = state.pendingRecruiters.filter(
          recruiter => recruiter._id !== action.payload._id
        );
      })
      .addCase(rejectRecruiter.fulfilled, (state, action) => {
        state.pendingRecruiters = state.pendingRecruiters.filter(
          recruiter => recruiter._id !== action.payload
        );
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        if (action.payload?.error?.includes('Unauthorized')) {
          state.error = 'Session expired. Please login again.';
        } else {
          state.error = action.payload?.error || 'Failed to fetch users';
        }
        state.loading = false;
      });
  }
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;