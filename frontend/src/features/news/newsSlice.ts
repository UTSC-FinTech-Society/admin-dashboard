import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";
import convertArrayBufferToBase64String from "../../utils/displayImage";

export type NewsState = {
    newsList: { news_id: number, title: string, content: string, picture_type: string, picture_data: string, author: string, created_at: Date } [] | [],
    isLoading: boolean
};

export type NewsType = { news_id: number, title: string, content: string, picture_type: string, picture_data: string, author: string, created_at: Date };

const initialState = {
    newsList: [],
    isLoading: false
};

export const getAllNews = createAsyncThunk('news/getAllNews', async(_, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/news`, { withCredentials: true });
        return response.data.allNews.map((news: any) => ({ ...news, picture_data: news.picture_data.data }));
    } catch(error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

export const createNews = createAsyncThunk('news/createNews', async(createdInfo: FormData, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/news`, createdInfo, { withCredentials: true });
        return { message: response.data.message, news: { ...response.data.news, picture_data: response.data.news.picture_data.data }  };
    } catch(error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

export const updateNews = createAsyncThunk('news/updateNews', async({ newsId, updatedInfo }: { newsId: number | undefined, updatedInfo: FormData }, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/news/${newsId}`, updatedInfo, { withCredentials: true });
        return { message: response.data.message, news: { ...response.data.news, picture_data: response.data.news.picture_data.data } };
    } catch(error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

export const deleteNews = createAsyncThunk('news/deleteNews', async(newsId: number | undefined, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/news/${newsId}`, { withCredentials: true });
        return { message: response.data.message, news_id: newsId };
    } catch(error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
    },
    extraReducers: {
        [getAllNews.pending.toString()]: (state: NewsState) => {
            state.isLoading = true;
        },
        [getAllNews.fulfilled.toString()]: (state: NewsState, action: PayloadAction<{ news_id: number, title: string, content: string, picture_type: string, picture_data: ArrayBuffer, author: string, created_at: Date }[]>) => {
            state.newsList = action.payload.map(news => ({ ...news, picture_data: convertArrayBufferToBase64String(news.picture_data)! }) ).sort((a, b) => {
                if (a.created_at > b.created_at) return -1;
                if (a.created_at < b.created_at) return 1;
                return 0;
            });
            state.isLoading = false;
        },
        [getAllNews.rejected.toString()]: (state: NewsState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
            state.isLoading = false;
        },
        [createNews.pending.toString()]: (state: NewsState) => {
            state.isLoading = true;
        },
        [createNews.fulfilled.toString()]: (state: NewsState, action: PayloadAction<{ message: string, news: { news_id: number, title: string, content: string, picture_type: string, picture_data: ArrayBuffer, author: string, created_at: Date } }>) => {
            toast.success(action.payload.message, { autoClose: 3000 });
            state.newsList = [...state.newsList, { ...action.payload.news, picture_data: convertArrayBufferToBase64String(action.payload.news.picture_data)! }].sort((a, b) => {
                if (a.created_at > b.created_at) return -1;
                if (a.created_at < b.created_at) return 1;
                return 0;
            });;
            state.isLoading = false;
        },
        [createNews.rejected.toString()]: (state: NewsState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
            state.isLoading = false;
        },
        [updateNews.fulfilled.toString()]: (state: NewsState, action: PayloadAction<{ message: string, news: { news_id: number, title: string, content: string, picture_type: string, picture_data: ArrayBuffer, author: string, created_at: Date } }>) => {
            toast.success(action.payload.message, { autoClose: 3000 });
            state.newsList = state.newsList.map(news => news.news_id === action.payload.news.news_id ? { ...action.payload.news, picture_data: convertArrayBufferToBase64String(action.payload.news.picture_data)! } : news);
        },
        [updateNews.rejected.toString()]: (state: NewsState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
        },
        [deleteNews.fulfilled.toString()]: (state: NewsState, action: PayloadAction<{ message: string, news_id: number }>) => {
            toast.success(action.payload.message, { autoClose: 3000 });
            state.newsList = state.newsList.filter(news => news.news_id !== action.payload.news_id);
        },
        [deleteNews.rejected.toString()]: (state: NewsState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
        }
    }
});

export default newsSlice.reducer;