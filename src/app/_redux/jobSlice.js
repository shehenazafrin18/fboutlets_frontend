import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  error: null,
  educationLavel: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const jobSlice = createSlice({
  name: "job",
  initialState: initialState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },

    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },

    allDepartmentList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.departmentList = action.payload.departmentList;
    },

    allALLSystemInfo: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.systemInfo = action.payload.systemInfo;
    },

    allAvailableJob: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.availableJobList = action.payload.availableJobList;
    },

    allRecommendedJob: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.recommendedJobList = action.payload.recommendedJobList;
    },

    allRelevantJob: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.relevantJobList = action.payload.relevantJobList;
    },

    getJobDetails: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.jobDetails = action.payload.jobDetails;
    },

    getSliderInfo: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.sliderInfo = action.payload.sliderInfo;
    },

    getApplicantAssessmentQstnAns: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.assessmentQstnAns = action.payload.assessmentQstnAns;
    },

    getApplicantAssessmentQstn: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.assessmentQstn = action.payload.assessmentQstn;
    },
    fetchALLCategory: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.categoryList = action.payload.categoryList;
    },

  },
});
