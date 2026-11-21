import { swalError, swalSuccess } from "../../../helpers/swal";
import * as requestFromServer from "./applicantJobRequest";
import { callTypes, applicantJobSlice } from "./applicantJobSlice";

const { actions } = applicantJobSlice;


// export const saveSlider = (param) => (dispatch) => {
//     dispatch(actions.startCall({ callType: callTypes.action }));
//     return requestFromServer
//         .saveSlider(param)
//         .then((response) => {
//             if (response.data.success) {
//                 swalSuccess("Slider Saved!!!");
//             } else {
//                 if (response.data.message) {
//                     swalError(response.data.message);
//                 } else {
//                     swalError("someting went wrong");
//                 }
//             }
//         })
//         .catch((error) => {
//             dispatch(actions.catchError({ error, callType: callTypes.action }));
//         });
// };



export const getAppliedJobList = (applicantId, page, size, params) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getAppliedJobList(applicantId, page, size, params)
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.getAppliedJobList({
                        appliedJobList: response?.data?.data,
                    })
                );
            } else {
                if (response.data.message) {
                    swalError(response.data.message);
                } else {
                    swalError("someting went wrong");
                }
            }
        })
        .catch((error) => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};


export const getShortlistedJobList = (params, page, size, searchText) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getShortlistedJobList(params, page, size, searchText)
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.getShortlistedJobList({
                        shortlistedJobList: response?.data?.data,
                    })
                );
            } else {
                if (response.data.message) {
                    swalError(response.data.message);
                } else {
                    swalError("someting went wrong");
                }
            }
        })
        .catch((error) => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getSavedJobList = (applicantId, page, size, params) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getSavedJobList(applicantId, page, size, params)
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.getSavedJobList({
                        savedJobList: response?.data?.data,
                    })
                );
            } else {
                if (response.data.message) {
                    swalError(response.data.message);
                } else {
                    swalError("someting went wrong");
                }
            }
        })
        .catch((error) => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getMyJobList = (params, page, size) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getMyJobList(params, page, size)
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.getMyJobList({
                        myJobList: response?.data?.data,
                    })
                );
            } else {
                if (response.data.message) {
                    swalError(response.data.message);
                } else {
                    swalError("someting went wrong");
                }
            }
        })
        .catch((error) => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};






