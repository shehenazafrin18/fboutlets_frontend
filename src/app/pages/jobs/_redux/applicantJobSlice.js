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

export const applicantJobSlice = createSlice({
  name: "applicantJob",
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


    getAppliedJobList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.appliedJobList = action.payload.appliedJobList;
    },

    getShortlistedJobList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.shortlistedJobList = action.payload.shortlistedJobList;
    },

    getSavedJobList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.savedJobList = action.payload.savedJobList;
    },

    getMyJobList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.myJobList = action.payload.myJobList;
    },




  },
});
