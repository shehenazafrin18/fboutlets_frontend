import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../app/modules/Auth/redux/authReducer";
import { recruitementSlice } from "../app/pages/my-profile/_redux/recruitementSlice";
import availableJobsReducer from '../app/_redux/availableJobSlice'
import jobsDepartmentReducer from '../app/_redux/jobsDepartmentSlice'
import { jobSlice } from "../app/_redux/jobSlice";
import { hrSlice } from "../app/pages/hr-admin/_redux/hrSlice";
import { applicantJobSlice } from "../app/pages/jobs/_redux/applicantJobSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        recruitement: recruitementSlice.reducer,
        availableJobs: availableJobsReducer,
        jobsDepartmentList: jobsDepartmentReducer,
        job: jobSlice.reducer,
        hr: hrSlice.reducer,
        applicantJob: applicantJobSlice.reducer
    },
});
