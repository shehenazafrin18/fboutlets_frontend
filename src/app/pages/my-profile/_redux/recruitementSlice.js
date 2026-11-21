import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  lastError: null,
  requisitonForEdit: undefined,
  error: null,
  educationLavel: null,
  degree: null,
  resultType: null,
  majorSubject: null,
  board: null,
  institute: null,
  data: [],
  educationList: [],
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const recruitementSlice = createSlice({
  name: "recruitement",
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

    // getrequisitonById
    recruitementFetched: (state, action) => {
      state.actionsLoading = false;
      state.requisitonForEdit = action.payload;
      state.error = null;
    },

    educationLavelFetched: (state, action) => {
      state.actionsLoading = false;
      state.educationLavel = action.payload.educationLavel;
      state.error = null;
    },

    degreeFetched: (state, action) => {
      state.actionsLoading = false;
      state.degree = action.payload.degree;
      state.error = null;
    },

    resultTypeFetched: (state, action) => {
      state.actionsLoading = false;
      state.resultType = action.payload.resultType;
      state.error = null;
    },

    boardFetched: (state, action) => {
      state.actionsLoading = false;
      state.board = action.payload.board;
      state.error = null;
    },

    instituteFetched: (state, action) => {
      state.actionsLoading = false;
      state.institute = action.payload.institute;
      state.error = null;
    },

    majorSubjectFetched: (state, action) => {
      state.actionsLoading = false;
      state.majorSubject = action.payload.majorSubject;
      state.error = null;
    },

    // find requisiton
    allRecruitementFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },


    applicantsInfoFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.applicantsInfo = action.payload.applicantsInfo;
    },

    educationListFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.educationList = action.payload.educationList;
    },

    profesionalCertificatesListFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.profesionalCertificatesList = action.payload.profesionalCertificatesList;
    },

    experienceFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.experienceList = action.payload.experienceList;
    },

    trainingFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.trainingList = action.payload.trainingList;
    },

    specialisationFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.specialisationList = action.payload.specialisationList;
    },

    additionalInfoFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.additionalInfo = action.payload.additionalInfo;
    },

    relativesInfoFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.relativesInfo = action.payload.relativesInfo;
    },

    referenceInfoFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.referenceInfo = action.payload.referenceInfo;
    },

    languageInfoFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.languageInfo = action.payload.languageInfo;
    },

    publicationInfoFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.publicationInfo = action.payload.publicationInfo;
    },

    portfolioInfoFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.portfolioInfo = action.payload.portfolioInfo;
    },

    // delete requisiton
    recruitementDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },

    profilePercentageFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.profilePercentage = action.payload.profilePercentage;
    },
    documentsInfoFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.documentsInfo = action.payload.documentsInfo;
    },
    publicationCommonDataFethced: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.publicationCommonData = action.payload.publicationCommonData;
    },
    preDistrictListFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.pre_district = action.payload.pre_district;
    },

    perDistrictListFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.per_district = action.payload.per_district;
    },

    preThanaListFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.pre_thana = action.payload.pre_thana;
    },

    perThanaListFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.per_thana = action.payload.per_thana;
    },
    profileMatchedFetched: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.profileMatched = action.payload.profileMatched;
    },
  },
});
