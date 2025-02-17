import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

interface Task {
  _id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  dueDate?: string;
  attachment?: string[];
}

interface TrelloState {
  tasks: Task[];
  statuses: string[];
  loading: boolean;
  error: string | null;
}

// Fetch Tasks from API
export const fetchTasks = createAsyncThunk(
  "trello/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetchTasks");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

// Fetch Statuses from API
export const fetchStatuses = createAsyncThunk(
  "trello/fetchStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetchStatuses");
      return response.data.statuses;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch statuses"
      );
    }
  }
);

// Add New Task
export const addTaskToTrello = createAsyncThunk(
  "trello/addTask",
  async (task: Task, { rejectWithValue }) => {
    console.log(task);
    try {
      const response = await axiosInstance.post("/createTrello", task);
      return response.data.trello;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add task"
      );
    }
  }
);

//add column
export const addColumn = createAsyncThunk(
  "trello/addColumn",
  async (trimmedColumn: string, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/addColumn`, { newStatus: trimmedColumn });
      return trimmedColumn;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task status"
      );
    }
  }
);

//rename the column
export const renameStatus = createAsyncThunk(
  "status/renameStatus",
  async (
    { oldStatus, newStatus }: { oldStatus: string; newStatus: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch("/changeStatus", {
        oldStatus,
        newStatus,
      });
      return {
        updatedStatuses: response.data.updatedStatuses,
        oldStatus,
        newStatus,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to rename status"
      );
    }
  }
);

//delete status
export const deleteStatus = createAsyncThunk(
  "status/deleteStatus",
  async ({ status }: { status: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/deleteStatus", {
        data: { status },
      });
      return {
        deletedStatus: status,
        updatedStatuses: response.data.updatedStatuses,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete status"
      );
    }
  }
);

//delete task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/deleteTrello/${taskId}`);
      return {
        deletedTaskId: taskId,
        updatedTasks: response.data.updatedTasks,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

//drag and drop
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async (
    { taskId, newStatus }: { taskId: string; newStatus: string },
    { rejectWithValue }
  ) => {
    console.log(taskId);
    console.log(newStatus);
    try {
      const response = await axiosInstance.patch(`/dragAndDrop/${taskId}`, {
        status: newStatus,
      });
      return {
        updatedTask: response.data.updatedTask,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task status"
      );
    }
  }
);

// Trello Slice   updatedStatuses
const trelloSlice = createSlice({
  name: "trello",
  initialState: {
    tasks: [],
    statuses: [],
    loading: false,
    error: null,
  } as TrelloState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStatuses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses = action.payload;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addColumn.fulfilled, (state, action) => {
        state.statuses.push(action.payload);
      })
      .addCase(addTaskToTrello.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(renameStatus.fulfilled, (state, action) => {
        state.statuses = action.payload.updatedStatuses;
        state.tasks = state.tasks.map((task) =>
          task.status === action.payload.oldStatus
            ? { ...task, status: action.payload.newStatus }
            : task
        );
      })
      .addCase(deleteStatus.fulfilled, (state, action) => {
        state.statuses = action.payload.updatedStatuses;
        state.tasks = state.tasks.filter(
          (task) => task.status !== action.payload.deletedStatus
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload.deletedTaskId
        );
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const updatedTask = action.payload.updatedTask;
        const index = state.tasks.findIndex(
          (task) => task._id === updatedTask._id
        );
        state.tasks[index] = updatedTask;
      });
  },
});

export default trelloSlice.reducer;
