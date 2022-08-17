import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";
import convertArrayBufferToBase64String from "../../utils/displayImage";

export type EventsState = {
    eventsList: { event_id: number, name: string, description: string, register_deadline: Date, start_datetime: Date, end_datetime: Date, entry_fee?: number, location: string, poster_type: string, poster_data: string, signup_link?: string, created_at: Date } [] | [],
    isLoading: boolean
};

export type EventType = { event_id: number, name: string, description: string, register_deadline: Date, start_datetime: Date, end_datetime: Date, entry_fee?: number, location: string, poster_type: string, poster_data: string, signup_link?: string, created_at: Date };

const initialState = {
    eventsList: [],
    isLoading: false
};

export const getAllEvents = createAsyncThunk('events/getAllEvents', async(_, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/events`, { withCredentials: true });
        return response.data.events.map((event: any) => ({ ...event, poster_data: event.poster_data.data }));
    } catch(error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

export const createEvent = createAsyncThunk('events/createEvent', async(createdInfo: FormData, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/events`, createdInfo, { withCredentials: true });
        return { message: response.data.message, event: { ...response.data.event, poster_data: response.data.event.poster_data.data }  };
    } catch(error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

export const updateEvent = createAsyncThunk('events/updateEvent', async({ eventId, updatedInfo }: { eventId: number | undefined, updatedInfo: FormData }, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/events/${eventId}`, updatedInfo, { withCredentials: true });
        return { message: response.data.message, event: { ...response.data.event, poster_data: response.data.event.poster_data.data } };
    } catch(error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

export const deleteEvent = createAsyncThunk('events/deleteEvent', async(eventId: number | undefined, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/events/${eventId}`, { withCredentials: true });
        return { message: response.data.message, event_id: eventId };
    } catch(error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: {
        [getAllEvents.pending.toString()]: (state: EventsState) => {
            state.isLoading = true;
        },
        [getAllEvents.fulfilled.toString()]: (state: EventsState, action: PayloadAction<{ event_id: number, name: string, description: string, register_deadline: Date, start_datetime: Date, end_datetime: Date, entry_fee?: number, location: string, poster_type: string, poster_data: ArrayBuffer, signup_link?: string, created_at: Date }[]>) => {
            state.eventsList = action.payload.map(event => ({ ...event, poster_data: convertArrayBufferToBase64String(event.poster_data)! })).sort((a, b) => {
                if (a.created_at > b.created_at) return -1;
                if (a.created_at < b.created_at) return 1;
                return 0;
            });
            state.isLoading = false;
        },
        [getAllEvents.rejected.toString()]: (state: EventsState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
            state.isLoading = false;
        },
        [createEvent.pending.toString()]: (state: EventsState) => {
            state.isLoading = true;
        },
        [createEvent.fulfilled.toString()]: (state: EventsState, action: PayloadAction<{ message: string, event: { event_id: number, name: string, description: string, register_deadline: Date, start_datetime: Date, end_datetime: Date, entry_fee?: number, location: string, poster_type: string, poster_data: ArrayBuffer, signup_link?: string, created_at: Date } }>) => {
            toast.success(action.payload.message, { autoClose: 3000 });
            state.eventsList = [...state.eventsList, { ...action.payload.event, poster_data: convertArrayBufferToBase64String(action.payload.event.poster_data)! }].sort((a, b) => {
                if (a.created_at > b.created_at) return -1;
                if (a.created_at < b.created_at) return 1;
                return 0;
            });;
            state.isLoading = false;
        },
        [createEvent.rejected.toString()]: (state: EventsState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
            state.isLoading = false;
        },
        [updateEvent.fulfilled.toString()]: (state: EventsState, action: PayloadAction<{ message: string, event: { event_id: number, name: string, description: string, register_deadline: Date, start_datetime: Date, end_datetime: Date, entry_fee?: number, location: string, poster_type: string, poster_data: ArrayBuffer, signup_link?: string, created_at: Date } }>) => {
            toast.success(action.payload.message, { autoClose: 3000 });
            state.eventsList = state.eventsList.map(event => event.event_id === action.payload.event.event_id ? { ...action.payload.event, poster_data: convertArrayBufferToBase64String(action.payload.event.poster_data)! } : event);
        },
        [updateEvent.rejected.toString()]: (state: EventsState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
        },
        [deleteEvent.fulfilled.toString()]: (state: EventsState, action: PayloadAction<{ message: string, event_id: number }>) => {
            toast.success(action.payload.message, { autoClose: 3000 });
            state.eventsList = state.eventsList.filter(event => event.event_id !== action.payload.event_id);
        },
        [deleteEvent.rejected.toString()]: (state: EventsState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
        }
    }
});

export default eventsSlice.reducer;
