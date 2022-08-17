import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";
import convertArrayBufferToBase64String from "../../utils/displayImage";

export type AdminState = {
    me: { admin_id?: number, username?: string, name?: string, position?: string, profile_pic_type?: string, profile_pic_data?: string, last_login?: Date, status?: string },
    otherAdminsList: { admin_id: number, username: string, name: string, position: string, profile_pic_type?: string, profile_pic_data?: string, last_login: Date, status: string }[] | [],
    isAuthorized: boolean,
    isLoading: boolean,
    isUpdating: boolean
};

export type AdminType = { admin_id: number, username: string, name: string, position: string, profile_pic_type?: string, profile_pic_data?: string, last_login: Date, status: string };

const initialState: AdminState = {
    me: { admin_id: undefined, username: undefined, name: undefined, position: undefined, profile_pic_type: undefined, profile_pic_data: undefined, last_login: undefined, status: undefined },
    otherAdminsList: [],
    isAuthorized: false,
    isLoading: false,
    isUpdating: false
};

export const loginAdmin = createAsyncThunk('admin/loginAdmin', async({ username, password }: { username: string, password: string }, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, { username, password }, { withCredentials: true });
        return response.data.message;
    } catch (error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

export const logoutAdmin = createAsyncThunk('admin/logoutAdmin', async(admin_id: number | undefined, thunkAPI) => {
    try {
        await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/admins/${admin_id}`, { last_login: new Date(), status: 'offline' }, { withCredentials: true });
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/logout`, { withCredentials: true });
        return response.data.message;
    } catch (error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

export const getMe = createAsyncThunk('admin/getMe', async(_, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/admins/me`, { withCredentials: true });
        await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/admins/${response.data.admin.admin_id}`, { last_login: new Date(), status: 'online' }, { withCredentials: true });
        return { ...response.data.admin, profile_pic_data: response.data.admin.profile_pic_data ? response.data.admin.profile_pic_data.data : undefined };
    } catch (error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
})

export const getOtherAdmins = createAsyncThunk('admin/getOtherAdmins', async (_, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/admins`, { withCredentials: true });
        return response.data.admins.map((admin: any) => ({ ...admin, profile_pic_data: admin.profile_pic_data ? admin.profile_pic_data.data : undefined }));
    } catch (error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

export const updateMe = createAsyncThunk('admin/updateMe', async ({ admin_id, updatedInfo }: { admin_id: number | undefined, updatedInfo: FormData }, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/admins/${admin_id}`, updatedInfo, { withCredentials: true });
        return { message: response.data.message, admin: { ...response.data.admin, profile_pic_data: response.data.admin.profile_pic_data ? response.data.admin.profile_pic_data.data : undefined }};
    } catch (error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: {
        [loginAdmin.pending.toString()]: (state: AdminState) => {
            state.isLoading = true;
        },
        [loginAdmin.fulfilled.toString()]: (state: AdminState, action: PayloadAction<string>) => {
            toast.success(action.payload, { autoClose: 3000 });
            window.location.href = `${process.env.REACT_APP_CLIENT_URL}/#/dashboard/home`;
            state.isLoading = false;
        },
        [loginAdmin.rejected.toString()]: (state: AdminState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
            state.isLoading = false;
        },
        [logoutAdmin.pending.toString()]: (state: AdminState) => {
            state.isLoading = true;
        },
        [logoutAdmin.fulfilled.toString()]: (state: AdminState, action: PayloadAction<string>) => {
            toast.success(action.payload, { autoClose: 3000 });
            state.me = {admin_id: undefined, username: undefined, name: undefined, position: undefined, profile_pic_type: undefined, profile_pic_data: undefined, last_login: undefined, status: undefined};
            state.otherAdminsList = [];
            state.isAuthorized = false;
            state.isLoading = false;
            window.location.href = `${process.env.REACT_APP_CLIENT_URL}/#/`;
        },
        [logoutAdmin.rejected.toString()]: (state: AdminState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
            state.isLoading = false;
        },
        [getMe.pending.toString()]: (state: AdminState) => {
            state.isLoading = true;
        },
        [getMe.fulfilled.toString()]: (state: AdminState, action: PayloadAction<{ admin_id: number, username: string, name: string, position: string, profile_pic_type?: string, profile_pic_data?: ArrayBuffer, last_login: Date, status: string }>) => {
            state.me = { ...action.payload, profile_pic_data: action.payload.profile_pic_data ? convertArrayBufferToBase64String(action.payload.profile_pic_data) : undefined };
            state.isAuthorized = true;
            state.isLoading = false;
        },
        [getMe.rejected.toString()]: (state: AdminState, action: PayloadAction<string>) => {
            state.isAuthorized = false;
            toast.error(action.payload, { autoClose: 3000 });
            window.location.href = `${process.env.REACT_APP_CLIENT_URL}/#/`;
            state.isLoading = false;
        },
        [getOtherAdmins.pending.toString()]: (state: AdminState) => {
            state.isLoading = true;
        },
        [getOtherAdmins.fulfilled.toString()]: (state: AdminState, action: PayloadAction<{ admin_id: number, username: string, name: string, position: string, profile_pic_type?: string, profile_pic_data?: ArrayBuffer, last_login: Date, status: string }[]>) => {
            state.otherAdminsList = action.payload.map(admin => ({ ...admin, profile_pic_data: convertArrayBufferToBase64String(admin.profile_pic_data) })).filter(admin => admin.admin_id !== state.me.admin_id).sort((a, b) => {
                if (a.status === 'online' && b.status === 'offline') return -1;
                if (a.status === 'offline' && b.status === 'online') return 1;
                if (a.status === 'online' && b.status === 'online') return 0;
                if (a.status === 'offline' && b.status === 'offline') {
                    if (a.last_login && b.last_login) {
                        if (a.last_login > b.last_login) {
                            return -1;
                        } else if (a.last_login <= b.last_login) {
                            return 1;
                        }
                    } else if (!a.last_login && b.last_login) {
                        return 1;
                    } else if (a.last_login && !b.last_login) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
                return 0;
            });
            state.isLoading = false;
        },
        [getOtherAdmins.rejected.toString()]: (state: AdminState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
            state.isLoading = false;
        },
        [updateMe.pending.toString()]: (state: AdminState) => {
            state.isUpdating = true;
        },
        [updateMe.fulfilled.toString()]: (state: AdminState, action: PayloadAction<{ message: string, admin: { admin_id: number, username: string, name: string, position: string, profile_pic_type?: string, profile_pic_data?: ArrayBuffer, last_login: Date, status: string } }>) => {
            toast.success(action.payload.message, { autoClose: 3000 });
            state.me = { ...action.payload.admin, profile_pic_data: action.payload.admin.profile_pic_data ? convertArrayBufferToBase64String(action.payload.admin.profile_pic_data) : undefined };
            state.isUpdating = false;
        },
        [updateMe.rejected.toString()]: (state: AdminState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
            state.isUpdating = false;
        },
    }
});

export default adminSlice.reducer;