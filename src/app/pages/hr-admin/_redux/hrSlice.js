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

    getMenuCategoryList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.menuCategoryList = action.payload.menuCategoryList;
    },
    getInventoryItemList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.inventoryItemList = action.payload.inventoryItemList;
    },
    getOutletMenuList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.outletMenuList = action.payload.outletMenuList;
    },
    getInventories: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.inventories = action.payload.inventories;
    },
    getOutletList: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.outletList = action.payload.outletList;
    },

    getMenuCategoryById: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.menuCategoryData = action.payload.menuCategoryData;
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

    // dashboardJobApplication: (state, action) => {
    //   state.error = null;
    //   state.actionsLoading = false;
    //   state.dashboardJobApplication = action.payload.dashboardJobApplication;
    // },

    // dashboardJobInfo: (state, action) => {
    //   state.error = null;
    //   state.actionsLoading = false;
    //   state.dashboardJobInfo = action.payload.dashboardJobInfo;
    // },

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
