import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";

export type MembersState = {
    membersList: { member_id: number, first_name: string, last_name: string, student_number: number, email_address: string, year_of_study: string, program: string, campus: string, timestamp: Date, editMode: boolean, submitUpdatedInfoMode: boolean } [] | [],
    isLoading: boolean
};

export type MemberType = { member_id: number, first_name: string, last_name: string, student_number: number, email_address: string, year_of_study: string, program: string, campus: string, timestamp: Date };

const initialState: MembersState = {
    membersList: [],
    isLoading: false
};

export const getMembers = createAsyncThunk('members/getMembers', async(_, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/members`, { withCredentials: true });
        return response.data.members;
    } catch(error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

export const addNewMember = createAsyncThunk('members/addNewMember', async({ first_name, last_name, student_number, email_address, year_of_study, program, campus }: { first_name?: string, last_name?: string, student_number?: number, email_address?: string, year_of_study?: string, program?: string, campus?: string }, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/members`, { first_name, last_name, student_number, email_address, year_of_study, program, campus }, { withCredentials: true });
        return { message: response.data.message, member: response.data.member };
    } catch(error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

export const updateMember = createAsyncThunk('members/updateMember', async({ memberId, updatedInfo }: { memberId: number | undefined, updatedInfo: { first_name?: string, last_name?: string, student_number?: number, email_address?: string, year_of_study?: string, program?: string, campus?: string } }, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/members/${memberId}`, updatedInfo, { withCredentials: true });
        return { message: response.data.message, member: response.data.member };
    } catch(error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
})

export const deleteMember = createAsyncThunk('members/deleteMember', async(memberId: number | undefined, thunkAPI) => {
    try {
        const response: AxiosResponse = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/members/${memberId}`, { withCredentials: true });
        return { message: response.data.message, member_id: memberId };
    } catch(error: AxiosError | any) {
        return thunkAPI.rejectWithValue(error.response.data.error);
    }
});

const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {
        updateEditMode: (state: MembersState, action) => {
            state.membersList = state.membersList.map(member => member.member_id === action.payload.member_id ? { ...member, editMode: action.payload.status } : member);
        },
        updateSubmitUpdatedInfoMode: (state: MembersState, action) => {
            state.membersList = state.membersList.map(member => member.member_id === action.payload.member_id ? { ...member, submitUpdatedInfoMode: action.payload.status } : member);
        }
    },
    extraReducers: {
        [getMembers.pending.toString()]: (state: MembersState) => {
            state.isLoading = true;
        },
        [getMembers.fulfilled.toString()]: (state: MembersState, action: PayloadAction<MemberType[]>) => {
            state.membersList = action.payload.map(member => ({ ...member, editMode: false, submitUpdatedInfoMode: false })).sort((a, b) => {
                if (a.timestamp > b.timestamp) return -1;
                if (a.timestamp < b.timestamp) return 1;
                return 0;
            });;
            state.isLoading = false;
        },
        [getMembers.rejected.toString()]: (state: MembersState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
            state.isLoading = false;
        },
        [addNewMember.fulfilled.toString()]: (state: MembersState, action: PayloadAction<{message: string, member: MemberType}>) => {
            toast.success(action.payload.message, { autoClose: 3000 });
            state.membersList = [...state.membersList, { ...action.payload.member, editMode: false, submitUpdatedInfoMode: false } ];
        },
        [addNewMember.rejected.toString()]: (state: MembersState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
        },
        [updateMember.fulfilled.toString()]: (state: MembersState, action: PayloadAction<{ message: string, member: MemberType}>) => {
            toast.success(action.payload.message, { autoClose: 3000 });
            state.membersList = state.membersList.map(member => member.member_id === action.payload.member.member_id ? { ...action.payload.member, editMode: false, submitUpdatedInfoMode: false } : member);
        },
        [updateMember.rejected.toString()]: (state: MembersState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
        },
        [deleteMember.fulfilled.toString()]: (state: MembersState, action: PayloadAction<{ message: string, member_id: number }>) => {
            toast.success(action.payload.message, { autoClose: 3000 });
            state.membersList = state.membersList.filter(member => member.member_id !== action.payload.member_id);
        },
        [deleteMember.rejected.toString()]: (state: MembersState, action: PayloadAction<string>) => {
            toast.error(action.payload, { autoClose: 3000 });
        },
    }
})

export const { updateEditMode, updateSubmitUpdatedInfoMode } = membersSlice.actions;

export default membersSlice.reducer;