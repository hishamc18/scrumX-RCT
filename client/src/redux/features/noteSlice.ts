import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../../api/axiosInstance'

interface Note {
    id: string;
    title: string;
    content: string;
    backgroundColor: string;
}

interface NotesState {
    notes: Note[];
    loading: boolean;
    error: string | null;
}

// Initial State
const initialState: NotesState = {
    notes: [],
    loading: false,
    error: null,
};

// Fetch Notes
export const fetchNotes = createAsyncThunk("/userNotes", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/userNotes");
        return response.data.notes;
    } catch (error: any) {
        return rejectWithValue(error.response.data.message);
    }
});

// Create Note
export const createNote = createAsyncThunk("/createNote", async (newNote: Omit<Note, "id">, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/createNote", newNote);
        console.log(response);
        
        return response.data.note;
    } catch (error: any) {
        console.log(error);
        
        return rejectWithValue(error.response.data.message);
    }
});

// Update Note
export const updateNote = createAsyncThunk(
    "notes/updateNote",
    async ({ id, title, content, backgroundColor }: Note, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/updateNote/${id}`, { title, content, backgroundColor });
            return response.data.note;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Delete Note
export const deleteNote = createAsyncThunk("/deleteNote", async (id: string, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/deleteNote/${id}`);
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response.data.message);
    }
});

// Notes Slice
const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = action.payload;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.notes.push(action.payload);
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                state.notes = state.notes.map((note) => (note.id === action.payload.id ? action.payload : note));
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.notes = state.notes.filter((note) => note.id !== action.payload);
            });
    },
});

export default notesSlice.reducer;
