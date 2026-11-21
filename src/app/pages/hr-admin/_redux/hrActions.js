import { swalError, swalSuccess } from "../../../helpers/swal";
import * as requestFromServer from "./hrRequest";
import { callTypes, hrSlice } from "./hrSlice";

const { actions } = hrSlice;


export const saveSlider = (param) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .saveSlider(param)
        .then((response) => {
            if (response.data.success) {
                swalSuccess("Slider Saved!!!");
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

export const updateSlider = (param, id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .updateSlider(param, id)
        .then((response) => {
            if (response.data.success) {
                swalSuccess("Slider Updated!!!");
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
export const deleteSlider = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .deleteSlider(id)
        .then((response) => {
            if (response.data.success) {
                swalSuccess("Slider Deleted !!!");
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

export const getSliderList = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getSliderList()
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.getSliderList({
                        sliderList: response?.data?.data,
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

export const getSliderById = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getSliderById(id)
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.getSliderById({
                        sliderData: response?.data?.data,
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

export const getSettingsData = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getSettingsData()
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.getSettingsData({
                        settingsData: response?.data?.data,
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

export const insertSettings = (param) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .insertSettings(param)
        .then((response) => {
            if (response.data.success) {
                swalSuccess("Data saved!!!");
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
export const updateSettings = (param, id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .updateSettings(param, id)
        .then((response) => {
            if (response.data.success) {
                swalSuccess("Data Updated!!!");
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


export const getApplicantListByJobId = (jobId) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getApplicantListByJobId(jobId)
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.getApplicantListByJobId({
                        applicantByJobId: response?.data?.data,
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

export const getShortlistedApplicantList = (params, body) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getShortlistedApplicantList(params, body)
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.getShortlistedApplicantList({
                        shortlistedApplicantList: response?.data?.data,
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

export const fetchAllJob = (param) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .fetchAllJob(param)
        .then((response) => {

            if (response?.data?.data) {
                dispatch(
                    actions.fetchAllJob({
                        allJobs: response?.data?.data,
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


// export const shortListedApplicant = (params) => (dispatch) => {
//     dispatch(actions.startCall({ callType: callTypes.action }));
//     return requestFromServer
//         .shortListedApplicant(params)
//         .then((response) => {
//             if (response?.data?.data) {
//                 dispatch(
//                     actions.shortListedApplicant({
//                         shortListedApplicant: response?.data?.data?.hrms_job,
//                     })
//                 );
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

export const getDashboardJobApplication = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getDashboardJobApplication()
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.dashboardJobApplication({
                        dashboardJobApplication: response?.data?.data,
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

export const getDashboardJobInfo = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getDashboardJobInfo()
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.dashboardJobInfo({
                        dashboardJobInfo: response?.data?.data,
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

export const getDashboardApplicantsInfo = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getDashboardApplicantsInfo()
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.dashboardApplicantsinfo({
                        dashboardApplicantsinfo: response?.data?.data,
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

export const getDashboarCurrentJobInfo = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getDashboarCurrentJobInfo()
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.dashboarCurrentJobInfo({
                        dashboarCurrentJobInfo: response?.data?.data,
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
export const getDashboarExpiredJobInfo = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getDashboarExpiredJobInfo()
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.dashboarExpiredJobInfo({
                        dashboarExpiredJobInfo: response?.data?.data,
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

export const getDashboarLatestJobInfo = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getDashboarLatestJobInfo()
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.dashboarlatestJobInfo({
                        dashboarlatestJobInfo: response?.data?.data,
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

export const getDashboarJobViewCount = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getDashboarJobViewCount()
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.dashboarJobViewCount({
                        dashboarJobViewCount: response?.data?.data,
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
export const getMenuList = (typeId) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getMenuList(typeId)
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.menuList({
                        menuList: response?.data?.data,
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

export const getApplicantList = (params) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getApplicantList(params)
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.applicantList({
                        applicantList: response?.data?.data,
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

export const getCareerPortalUserList = (params) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getCareerPortalUserList(params)
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.careerPortalUserList({
                        userList: response?.data?.data,
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
