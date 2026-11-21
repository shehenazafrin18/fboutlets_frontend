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

export const hrSlice = createSlice({
  name: "hr",
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


    getSliderList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.sliderList = action.payload.sliderList;
    },

    getSliderById: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.sliderData = action.payload.sliderData;
    },

    getSettingsData: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.settingsData = action.payload.settingsData;
    },

    getApplicantListByJobId: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.applicantByJobId = action.payload.applicantByJobId;
    },

    getShortlistedApplicantList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.shortlistedApplicantList = action.payload.shortlistedApplicantList;
    },

    fetchAllJob: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.allJobs = action.payload.allJobs;
    },

    // shortListedApplicant: (state, action) => {
    //   state.error = null;
    //   state.actionsLoading = false;
    //   state.shortListedApplicant = action.payload.shortListedApplicant;
    // },

    dashboardJobApplication: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.dashboardJobApplication = action.payload.dashboardJobApplication;
    },

    dashboardJobInfo: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.dashboardJobInfo = action.payload.dashboardJobInfo;
    },

    dashboardApplicantsinfo: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.dashboardApplicantsinfo = action.payload.dashboardApplicantsinfo;
    },

    dashboarCurrentJobInfo: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.dashboarCurrentJobInfo = action.payload.dashboarCurrentJobInfo;
    },

    dashboarExpiredJobInfo: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.dashboarExpiredJobInfo = action.payload.dashboarExpiredJobInfo;
    },

    dashboarlatestJobInfo: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.dashboarlatestJobInfo = action.payload.dashboarlatestJobInfo;
    },

    dashboarJobViewCount: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.dashboarJobViewCount = action.payload.dashboarJobViewCount;
    },
    menuList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.menuList = action.payload.menuList;
    },
    applicantList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.applicantList = action.payload.applicantList;
    },

    careerPortalUserList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.careerPortalUserList = action.payload.userList;
    },

  },
});
