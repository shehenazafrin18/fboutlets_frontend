
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from "../helpers/devApi";


export const fetchjobsDepartmentData = createAsyncThunk('jobDeptList/fetchData', async () => {
    try {
        let path = "";
        path = '/hrms_job/list/department_wise_jobs_count';
        const response = await API.post(path);
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
});



const jobsDepartmentSlice = createSlice({
    name: 'jobDeptList',
    initialState: {
        isLoding: false,
        data: [],
        error: null,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchjobsDepartmentData.pending, (state) => {
            state.isLoding = true;
        });
        builder.addCase(fetchjobsDepartmentData.fulfilled, (state, action) => {
            state.isLoding = false;
            state.data = action.payload;
            state.error = null;
        });
        builder.addCase(fetchjobsDepartmentData.rejected, (state, action) => {
            state.isLoding = false;
            state.data = [];
            state.error = action.error.message;
        });
    },
});



export default jobsDepartmentSlice.reducer;