import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../types';
import axiosInstance from '@/api/axiosInstance';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  otpLoading: boolean;
  otpError: string | null;
  otpSuccess: boolean;
  emailExists: boolean | null;
  emailCheckLoading: boolean;
  emailCheckError: string | null;
  passwordResetSuccess: boolean;
  passwordResetError: string | null;
}

interface UserData {
  firstName: string | null;
  lastName: string | null;
  userProfession: string | null;
  password: string | null;
  email: string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  otpLoading: false,
  otpError: null,
  otpSuccess: false,
  emailExists: null,
  emailCheckLoading: false,
  emailCheckError: null,
  passwordResetSuccess: false,
  passwordResetError: null,
};

// Google OAuth
export const googleOAuth = createAsyncThunk('auth/google', async () => {
  try {
    window.location.href = 'http://localhost:3300/auth/google';
  } catch (err) {
    console.error(err);
  }
});

// Fetch New User Data
export const getNewUserData = createAsyncThunk('auth/getNewUserData', async () => {
  try {
    const response = await axios.get("http://localhost:3300/auth/user", { withCredentials: true })
    return response.data
  } catch (err) {
    console.error(err);
    throw err;
  }
});

export const updateUserData = createAsyncThunk('auth/updateUserData', async (userData: any) => {
  try {
    const response = await axios.post
      ("http://localhost:3300/auth/updateProfileAndLogin", userData, { withCredentials: true })

    if (response.data.profileCompleted) {
      window.location.href = "/home";
    } else {
      window.location.href = "/register/userCredentials";
    }

  } catch (err) {
    console.log(err, "error");
  }
});


export const updateUserProfile = createAsyncThunk<User, FormData>(
  "auth/myAccountUpdate",
  async (formData, { rejectWithValue }) => {

    try {
      const response = await axios.put(
        "http://localhost:3300/auth/editUser",
        formData,
        { withCredentials: true, }
      );

      return response.data.user;
    } catch (error: any) {


      return rejectWithValue(error.response?.data?.error);
    }
  }
);


export const compareUserPassword = createAsyncThunk(
  "auth/compareUserPassword",
  async (currentPassword: { currentPassword: string }, { rejectWithValue }) => {
   
    try {
      console.log(currentPassword, 'try')
      const response = await axios.post(
        "http://localhost:3300/auth/comparePassword",
        currentPassword,
        { withCredentials: true }
      );

      return response.data;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message);
    }
  }
);



export const updateUserPassword = createAsyncThunk<
  User,
  { currentPassword: string; newPassword: string }
>("auth/updateUserPassword", async ({ currentPassword, newPassword }, { rejectWithValue }) => {
  try {
    const response = await axios.put("http://localhost:3300/auth/editPassword", {
      currentPassword,
      newPassword,
    }, { withCredentials: true, });
    return response.data.user;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Password update failed");
  }
});



// Check if Email Exists
export const checkEmailExists = createAsyncThunk(
  'auth/checkEmailExists',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3300/auth/check-email", { email });
      return response.data.exists; // true or false
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to check email");
    }
  }
);

// Send OTP
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3300/auth/send-otp", { email });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {    
    try {
      const response = await axios.post("http://localhost:3300/auth/verify-otp", { email, otp }, { withCredentials: true });
      console.log(response);
      
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "OTP verification failed");
    }
  }
);

// Login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3300/auth/login", { email, password }, { withCredentials: true });
      console.log(response.data);
      
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3300/auth/forgot-password', { email }, {withCredentials: true});
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send reset email');
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
    console.log(token, password, "slice");
    
    try {
      const response = await axios.post(`http://localhost:3300/auth/reset-password/${token}`, { password }, {withCredentials: true});      
      return response.data;
    } catch (err: any) {
      console.log(err);
      
      return rejectWithValue(err.response?.data?.message || 'Password reset failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
    },

  },
  extraReducers: builder => {
    builder
    .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      //compareUserPassword
      .addCase(compareUserPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(compareUserPassword.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(compareUserPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      //updateUserPassword
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      //  Get New User Data
      .addCase(getNewUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNewUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getNewUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user data";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      //compareUserPassword
      .addCase(compareUserPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(compareUserPassword.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(compareUserPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      //updateUserPassword
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update User Data
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user data";
      })
      // Check Email Exists
      .addCase(checkEmailExists.pending, (state) => {
        state.emailCheckLoading = true;
        state.emailCheckError = null;
        state.emailExists = null;
      })
      .addCase(checkEmailExists.fulfilled, (state, action) => {
        state.emailCheckLoading = false;
        state.emailExists = action.payload;
      })
      .addCase(checkEmailExists.rejected, (state, action) => {
        state.emailCheckLoading = false;
        state.emailCheckError = action.payload as string;
      })
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
        state.otpSuccess = false;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.otpLoading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpSuccess = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload as string;
      })
       // Forgot Password
       .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.passwordResetError = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.passwordResetError = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
