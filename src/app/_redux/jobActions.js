// import { swalError, swalSuccess } from "../helpers/swal";
// import * as requestFromServer from "./jobRequest";
// import { callTypes, jobSlice } from "./jobSlice";

// const { actions } = jobSlice;

// export const fetchALLDepartmentList = () => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .fetchALLDepartmentList()
//     .then((response) => {
//       if (response?.data?.data) {
//         dispatch(
//           actions.allDepartmentList({
//             departmentList: response?.data?.data,
//           }),
//         );
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError("someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const fetchALLSystemInfo = () => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .fetchALLSystemInfo()
//     .then((response) => {
//       if (response?.data?.data) {
//         dispatch(
//           actions.allALLSystemInfo({
//             systemInfo: response?.data?.data,
//           }),
//         );
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError("someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const fetchAllAvailableJob =
//   (param, page, size, isAuthenticated) => (dispatch) => {
//     dispatch(actions.startCall({ callType: callTypes.action }));
//     return requestFromServer
//       .fetchALLAvailableJob(param, page, size, isAuthenticated)
//       .then((response) => {
//         if (response?.data?.data) {
//           dispatch(
//             actions.allAvailableJob({
//               availableJobList: response?.data?.data,
//             }),
//           );
//         } else {
//           if (response.data.message) {
//             swalError(response.data.message);
//           } else {
//             swalError("someting went wrong");
//           }
//         }
//       })
//       .catch((error) => {
//         dispatch(actions.catchError({ error, callType: callTypes.action }));
//       });
//   };

// export const fetchAllRecommendedJob =
//   (param, page, size, isAuthenticated) => (dispatch) => {
//     dispatch(actions.startCall({ callType: callTypes.action }));
//     return requestFromServer
//       .fetchAllRecommendedJob(param, page, size, isAuthenticated)
//       .then((response) => {
//         if (response?.data?.data) {
//           dispatch(
//             actions.allRecommendedJob({
//               recommendedJobList: response?.data?.data,
//             }),
//           );
//         } else {
//           if (response.data.message) {
//             swalError(response.data.message);
//           } else {
//             swalError("someting went wrong");
//           }
//         }
//       })
//       .catch((error) => {
//         dispatch(actions.catchError({ error, callType: callTypes.action }));
//       });
//   };

// export const fetchAllRelevantJob = (auth, jobId) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .fetchAllRelevantJob(auth, jobId)
//     .then((response) => {
//       if (response?.data?.data) {
//         dispatch(
//           actions.allRelevantJob({
//             relevantJobList: response?.data?.data,
//           }),
//         );
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError("someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const fetchJobDetailsById = (auth, jobId) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .fetchJobDetailsById(auth, jobId)
//     .then((response) => {
//       if (response?.data?.data) {
//         dispatch(
//           actions.getJobDetails({
//             jobDetails: response?.data?.data,
//           }),
//         );
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError("someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const saveJob = (param) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .saveJob(param)
//     .then((response) => {
//       if (response.data.success) {
//         swalSuccess("Job Saved");
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError("someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const sliderInfo = () => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .sliderInfo()
//     .then((response) => {
//       if (response?.data?.data) {
//         dispatch(
//           actions.getSliderInfo({
//             sliderInfo: response?.data?.data,
//           }),
//         );
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError("someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const getApplicantAssessmentQstnAns = (params) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .getApplicantAssessmentQstnAns(params)
//     .then((response) => {
//       if (response?.data?.data) {
//         dispatch(
//           actions.getApplicantAssessmentQstnAns({
//             assessmentQstnAns: response?.data?.data,
//           }),
//         );
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError("someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const getApplicantAssessmentQstn = (jobId) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .getApplicantAssessmentQstn(jobId)
//     .then((response) => {
//       if (response?.data?.data) {
//         dispatch(
//           actions.getApplicantAssessmentQstn({
//             assessmentQstn: response?.data?.data,
//           }),
//         );
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError("someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const applyToJob = (params) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .applyToJob(params)
//     .then((response) => {
//       if (response.data.success) {
//         swalSuccess("Job Application Completed");
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError("someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const unsaveJob = (id) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .unsaveJob(id)
//     .then((response) => {
//       if (response.data.success) {
//         swalSuccess("Job Unsaved");
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError("someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };
// export const withdrawJobApplication = (id) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .withdrawJobApplication(id)
//     .then((response) => {
//       if (response.data.success) {
//         swalSuccess("Job Application Withdrawal Successfully");
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError(response.message || "someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const fetchALLCategory = () => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .fetchALLCategory()
//     .then((response) => {
//       if (response?.data?.data) {
//         dispatch(
//           actions.fetchALLCategory({
//             categoryList: response?.data?.data,
//           }),
//         );
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError("someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// export const jobDetailsViewCountSave = (id) => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .jobDetailsViewCountSave(id)
//     .then((response) => {
//       if (response.data.success) {
//         console.log("Job view count saved Successfully");
//       } else {
//         if (response.data.message) {
//           swalError(response.data.message);
//         } else {
//           swalError("someting went wrong");
//         }
//       }
//     })
//     .catch((error) => {
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };
