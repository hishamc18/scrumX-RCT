import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch AI chat history (no userId required)
export const fetchAiHistory = createAsyncThunk(
  "aiChat/fetchAiHistory",
  
  async (_, { rejectWithValue }) => { 
    console.log("hgvgfsggsgs")
    try {
      const response = await axios.get("http://localhost:3300/api/aiHistory", {
        withCredentials: true, 
      });
      console.log(response.data)
      return response.data;
    } catch (error: any) {
      console.error("Fetch AI History Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to fetch AI history");
    }
  }
);

// Send message and get AI response (no userId required)
export const chatAi = createAsyncThunk(
  "aiChat/sendMessage",
  async (message: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3300/api/aiChat",
        { message }, 
        { withCredentials: true } 
      );
      console.log(response.data)
      return { question: message, answer: response.data.response };
    } catch (error: any) {
      console.error("AI Chat Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to get AI response");
    }
  }
);

interface aiState {
  aiHistory: { question: string; answer: string }[];
  loading: boolean;
}

const initialState: aiState = {
  aiHistory: [],
  loading: false,
};

const aiSlice = createSlice({
  name: "aiChat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAiHistory.fulfilled, (state, action: PayloadAction<{ question: string; answer: string }[]>) => {
        state.aiHistory = action.payload;
        state.loading = false;
      })
      .addCase(fetchAiHistory.rejected, (state) => {
        state.loading = false;
      })
      .addCase(chatAi.pending, (state) => {
        state.loading = true;
      })
      .addCase(chatAi.fulfilled, (state, action: PayloadAction<{ question: string; answer: string }>) => {
        state.aiHistory.push(action.payload);
        state.loading = false;
      })
      .addCase(chatAi.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default aiSlice.reducer;
