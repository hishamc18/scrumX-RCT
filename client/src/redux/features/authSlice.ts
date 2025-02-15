import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../types';


interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
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
};

export const googleOAuth = createAsyncThunk('auth/google', async () => {
  try {
    // Redirect the user to the backend route that handles OAuth
    window.location.href = 'http://localhost:3300/auth/google';
  } catch (err) {
    console.log(err, "error");
  }
});

export const getNewUserData = createAsyncThunk('auth/newUserData', async () => {
  try {
    const response = await axios.get("http://localhost:3300/auth/user", { withCredentials: true, })
    return response.data

  } catch (err) {
    console.log(err, "error");
  }
});

export const updateUserData = createAsyncThunk('auth/updateUserData', async (userData: any) => {
  try {
    const response = await axios.post
      ("http://localhost:3300/auth/updateProfileAndLogin", userData, { withCredentials: true, })

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
    builder.addCase(getNewUserData.fulfilled, (state, action) => {
      state.user = action.payload
    })
      //updateUserData
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


  }
})

export const { } = authSlice.actions;
export default authSlice.reducer;