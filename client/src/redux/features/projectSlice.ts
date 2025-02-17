/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/api/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";



interface JoinedMembers {
  userId: string; 
  role: string;
  _id: string;
}
// Define the structure of a project
interface Project {
  name: string;
  description: string;
  image: string;
  isGroup: boolean;
  joinedMembers:JoinedMembers[]
  invitedMembers: string[];
}

interface InvitedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}
// Define the initial state
interface ProjectState {
  projects: Project[];
  groupProjects:Project[]
  checkInvitedUser: InvitedUser | null;
  invitedUser:InvitedUser[]
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  groupProjects:[],
  checkInvitedUser: null,
  invitedUser:[],
  status: "idle",
  error: null,
};

// Async thunk for creating a project
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData: Project, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/projects/create",projectData)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
export const createIndividualProject = createAsyncThunk(
  "projects/createIndividualProject",
  async (projectData: Project, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("projects/individual-create",projectData)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk for Check Invite User
export const checkInviteUser = createAsyncThunk(
  "projects/checkInviteUser",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/projects/check-invite-user",{email})
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getGroupProjects=createAsyncThunk("projects/getGroupProjects",async()=>{
  const response=await axiosInstance.get("/projects/all")
  return response.data
})


export const joinGroupProjects = createAsyncThunk(
  "projects/joinGroupProjects",
  async (inviteToken: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/projects/join/${inviteToken}`);
      if (response.data.message === "User Not Found") {
        return rejectWithValue("User Not Found"); // Handle in component
      }
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addInvitedUser: (state, action: PayloadAction<string>) => {
      const latestProject = state.projects[state.projects.length - 1];
      if (latestProject) {
        latestProject.invitedMembers.push(action.payload);
      }
    },
    clearInvitedUser:(state,action)=>{
      state.invitedUser=action.payload
    },
    removeInvitedUser: (state, action: PayloadAction<string>) => {
      const latestProject = state.projects[state.projects.length - 1];
      if (latestProject) {
        latestProject.invitedMembers = latestProject.invitedMembers.filter(
          (email) => email !== action.payload
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log( state.status)
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Check Invite User
      .addCase(checkInviteUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(checkInviteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.invitedUser.push(action.payload);
      })
      .addCase(checkInviteUser.rejected, (state, action) => {
        console.error(action.payload, "API call failed"); // Log error
        state.status = "failed";
        state.error = action.payload as string; // Store the error message
      })
      .addCase(getGroupProjects.fulfilled,(state,action)=>{
        console.log(action.payload,"payload")
        state.groupProjects=action.payload.projects 
      })
  },
});

export const { addInvitedUser, removeInvitedUser,clearInvitedUser } = projectSlice.actions;
export default projectSlice.reducer;
