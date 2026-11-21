
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from "../helpers/devApi";


export const fetchAvailableJobsData = createAsyncThunk('deptList/fetchData', async (department_id) => {
    try {
        const data = {
            "status": "Published",
            "department_id": department_id ? department_id : ''
        }
        const response = await API.post('/hrms_job/available', data);
        return response.data.data.hrms_job;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
});



const availableJobstSlice = createSlice({
    name: 'deptList',
    initialState: {
        isLoding: false,
        data: [],
        error: null,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAvailableJobsData.pending, (state) => {
            state.isLoding = true;
        });
        builder.addCase(fetchAvailableJobsData.fulfilled, (state, action) => {
            state.isLoding = false;
            state.data = action.payload;
            state.error = null;
        });
        builder.addCase(fetchAvailableJobsData.rejected, (state, action) => {
            state.isLoding = false;
            state.data = [];
            state.error = action.error.message;
        });
    },
});



export default availableJobstSlice.reducer;