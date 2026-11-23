import { swalError, swalSuccess } from "../../../helpers/swal";
import * as requestFromServer from "./hrRequest";
import { callTypes, hrSlice } from "./hrSlice";

const { actions } = hrSlice;

// Mneu category API start
export const getMenuCategoryList = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getMenuCategoryList()
    .then((response) => {
      console.log("response", response);
      if (response?.data?.data) {
        dispatch(
          actions.getMenuCategoryList({
            menuCategoryList: response?.data?.data,
          }),
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

export const deleteMenuCategory = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteMenuCategory(id)
    .then((response) => {
      if (response.data.success) {
        swalSuccess("Menu Category Deleted !!!");
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

export const saveMenuCategory = (param) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .saveMenuCategory(param)
    .then((response) => {
      if (response.data.success) {
        swalSuccess("Menu Category Saved!!!");
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

export const updateMenuCategory = (param, id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateMenuCategory(param, id)
    .then((response) => {
      if (response.data.success) {
        swalSuccess("Menu Category Updated!!!");
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

export const getMenuCategoryById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getMenuCategoryById(id)
    .then((response) => {
      if (response?.data?.data) {
        dispatch(
          actions.getMenuCategoryById({
            menuCategoryData: response?.data?.data,
          }),
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

// Inventory Items API Start
export const getInventoryItemList = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getInventoryItemList()
    .then((response) => {
      console.log("response", response?.data?.data);
      if (response?.data) {
        dispatch(
          actions.getInventoryItemList({
            inventoryItemList: response?.data?.data,
          }),
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

export const deleteInventoryItem = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteInventoryItem(id)
    .then((response) => {
      if (response.data.success) {
        swalSuccess("Inventory Item Deleted !!!");
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

export const saveInventoryItem = (param) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .saveInventoryItem(param)
    .then((response) => {
      if (response.data.success) {
        swalSuccess("Inventory Item Saved!!!");
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

export const updateInventoryItem = (param, id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateInventoryItem(param, id)
    .then((response) => {
      if (response.data.success) {
        swalSuccess("Inventory Item Updated!!!");
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

// ------------- F&B Outlets END ----------------//
export const getSettingsData = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getSettingsData()
    .then((response) => {
      if (response?.data?.data) {
        dispatch(
          actions.getSettingsData({
            settingsData: response?.data?.data,
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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

// export const getDashboardApplicantsInfo = () => (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .getDashboardApplicantsInfo()
//     .then((response) => {
//       if (response?.data?.data) {
//         dispatch(
//           actions.dashboardApplicantsinfo({
//             dashboardApplicantsinfo: response?.data?.data,
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

export const getMenuList = (typeId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getMenuList(typeId)
    .then((response) => {
      if (response?.data?.data) {
        dispatch(
          actions.menuList({
            menuList: response?.data?.data,
          }),
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
          }),
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
          }),
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
