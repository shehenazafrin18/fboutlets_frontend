import { swalError, swalSuccess } from "../../../helpers/swal";
import * as requestFromServer from "./recruitementRequest";
import { callTypes, recruitementSlice } from "./recruitementSlice";
import { objectKeyReplace } from '../../../helpers/objectKeyReplace'
import { logout } from "../../../modules/Auth/redux/authReducer";
const { actions } = recruitementSlice;

export const createEducation = (payload) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .createEducation(payload)
        .then((response) => {
            if (response.data.success) {
                swalSuccess("Education Added");
            } else {
                if (response.data.message) {
                    swalError(response.data.message);
                } else {
                    swalError("someting went wrong");
                }
            }
        })
        .catch((error) => {
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const updateEducation = (payload, applicantId, id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .updateEducation(payload, applicantId, id)
        .then((response) => {
            if (response.data.success) {
                swalSuccess("Education Updated");
            } else {
                if (response.data.message) {
                    swalError(response.data.message);
                } else {
                    swalError("someting went wrong");
                }
            }
        })
        .catch((error) => {
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const deleteEducation = (itemId, id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .deleteEducation(itemId, id)
        .then((response) => {
            if (response.data.success) {
                swalSuccess("Education Deleted");
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

export const getAllEducationLavel = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getAllEducationLavel()
        .then((response) => {
            if (response.data.success) {
                const educationLavel = response.data?.data?.hrms_education_level?.map(
                    (item) => {
                        return {
                            value: item?.hrms_education_level__id,
                            label: item?.hrms_education_level__name,
                        };
                    }
                );
                dispatch(
                    actions.educationLavelFetched({
                        educationLavel,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getApplicantsInfoById = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getApplicantsInfoById(id)
        .then((res) => {
            if (res?.data?.success) {
                if (res?.data?.data) {
                    dispatch(
                        actions.applicantsInfoFetched({
                            applicantsInfo: res?.data?.data,
                        })
                    );
                } else {
                    if (res.data.message) {
                        swalError(res.data.message);
                    }
                }
            } else {
                dispatch(logout({}));
            }
        })
        .catch((error) => {
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getAllEducationByApplicants = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getEducationByApplicantId(id)
        .then((response) => {
            if (response?.data?.data?.hrms_education) {
                const resData = response?.data?.data?.hrms_education
                var result = resData?.map(function (o) {
                    return objectKeyReplace(o, 'hrms_education__');
                });
                dispatch(
                    actions.educationListFetched({
                        educationList: result,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getProfessionalCertificatesByApplicants = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getprofesionalCertificatesByApplicantId(id)
        .then((response) => {
            if (response?.data?.data?.hrms_professional_certification) {
                const resData = response?.data?.data?.hrms_professional_certification
                var result = resData?.map(function (o) {
                    return objectKeyReplace(o, 'hrms_professional_certification__');
                });
                dispatch(
                    actions.profesionalCertificatesListFetched({
                        profesionalCertificatesList: result,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getExperienceByApplicants = (id, query) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getExperienceByApplicantId(id, query)
        .then((response) => {
            if (response?.data?.data?.hrms_experience) {
                const resData = response?.data?.data?.hrms_experience;

                var result = resData?.map(function (o) {
                    return objectKeyReplace(o, 'hrms_experience__');
                });
                dispatch(
                    actions.experienceFetched({
                        experienceList: result,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getTrainingByApplicants = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getTrainingByApplicantId(id)
        .then((response) => {
            if (response?.data?.data?.hrms_training) {
                const resData = response?.data?.data?.hrms_training;
                var result = resData?.map(function (o) {
                    return objectKeyReplace(o, 'hrms_training__');
                });
                dispatch(
                    actions.trainingFetched({
                        trainingList: result,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getSpecialisationByApplicants = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getSpecialisationByApplicantId(id)
        .then((response) => {
            if (response?.data?.data?.hrms_specialisation) {
                const resData = response?.data?.data?.hrms_specialisation;
                var result = resData?.map(function (o) {
                    return objectKeyReplace(o, 'hrms_specialisation__');
                });
                dispatch(
                    actions.specialisationFetched({
                        specialisationList: result,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getAdditionalInfoByApplicants = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getAdditionalInfoByApplicantId(id)
        .then((response) => {
            if (response?.data?.data?.hrms_additional_information) {
                var resData = response?.data?.data?.hrms_additional_information;
                var result = resData?.map(function (o) {
                    return objectKeyReplace(o, 'hrms_additional_information__');
                });
                dispatch(
                    actions.additionalInfoFetched({
                        additionalInfo: result,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getRelativesInfoByApplicants = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getRelativesInfoByApplicantId(id)
        .then((response) => {
            if (response?.data?.data?.hrms_applicant_relative_information) {
                var resData = response?.data?.data?.hrms_applicant_relative_information;
                var result = resData?.map(function (o) {
                    return objectKeyReplace(o, 'hrms_applicant_relative_information__');
                });
                dispatch(
                    actions.relativesInfoFetched({
                        relativesInfo: result,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const updateRelativesInfo = (param) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .updateRelativesInfo(param)
        .then((response) => {
            console.log(response)
            // if (response.data.success) {
            //     swalSuccess("Data Updated!!!");
            // } else {
            //     if (response.data.message) {
            //         swalError(response.data.message);
            //     } else {
            //         swalError("someting went wrong");
            //     }
            // }
        })
        .catch((error) => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const deleteRelativesInfo = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .deleteRelativesInfo()
        .then((response) => {
            console.log(response)
            // if (response.data.success) {
            //     swalSuccess("Data Updated!!!");
            // } else {
            //     if (response.data.message) {
            //         swalError(response.data.message);
            //     } else {
            //         swalError("someting went wrong");
            //     }
            // }
        })
        .catch((error) => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getReferenceInfoByApplicants = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getReferenceInfoByApplicantId(id)
        .then((response) => {
            if (response?.data?.data?.hrms_references) {
                const resData = response?.data?.data?.hrms_references
                var result = resData?.map(function (o) {
                    return objectKeyReplace(o, 'hrms_references__');
                });
                dispatch(
                    actions.referenceInfoFetched({
                        referenceInfo: result,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getLanguageInfoByApplicants = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getLanguageInfoByApplicantId(id)
        .then((response) => {
            if (response?.data?.data?.hrms_language_proficiency) {
                const resData = response?.data?.data?.hrms_language_proficiency
                var result = resData?.map(function (o) {
                    return objectKeyReplace(o, 'hrms_language_proficiency__');
                });
                dispatch(
                    actions.languageInfoFetched({
                        languageInfo: result,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getPublicationInfoByApplicants = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getPublicationInfoByApplicantId(id)
        .then((response) => {
            if (response?.data?.data?.hrms_publication) {
                const resData = response?.data?.data?.hrms_publication
                var result = resData?.map(function (o) {
                    return objectKeyReplace(o, 'hrms_publication__');
                });
                dispatch(
                    actions.publicationInfoFetched({
                        publicationInfo: result,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getPortfolioInfoByApplicants = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getPortfolioInfoByApplicantId(id)
        .then((response) => {
            if (response?.data?.data?.hrms_portfolio) {
                const resData = response?.data?.data?.hrms_portfolio
                var result = resData?.map(function (o) {
                    return objectKeyReplace(o, 'hrms_portfolio__');
                });
                dispatch(
                    actions.portfolioInfoFetched({
                        portfolioInfo: result,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getAllDegree = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getAllDegree()
        .then((response) => {
            if (response.data.success) {
                const degree = response.data?.data?.hrms_degree?.map((item) => {
                    return {
                        value: item?.hrms_degree__id,
                        label: item?.hrms_degree__name,
                    };
                });
                dispatch(
                    actions.degreeFetched({
                        degree,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getAllResultType = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getAllResultType()
        .then((response) => {
            if (response.data.success) {
                const resultType = response.data?.data?.hrms_result_type?.map(
                    (item) => {
                        return {
                            value: item?.hrms_result_type__id,
                            label: item?.hrms_result_type__name,
                        };
                    }
                );
                dispatch(
                    actions.resultTypeFetched({
                        resultType,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getAllBoard = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getAllBoard()
        .then((response) => {
            if (response.data.success) {
                const board = response.data?.data?.hrms_board?.map((item) => {
                    return {
                        value: item?.hrms_board__id,
                        label: item?.hrms_board__name,
                    };
                });
                dispatch(
                    actions.boardFetched({
                        board,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getAllInstitute = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getAllInstitute()
        .then((response) => {
            if (response.data.success) {
                const institute = response.data?.data?.hrms_institute?.map((item) => {
                    return {
                        value: item?.hrms_institute__id,
                        label: item?.hrms_institute__name,
                    };
                });
                dispatch(
                    actions.instituteFetched({
                        institute,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getAllMajorSubject = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getAllMajorSubject()
        .then((response) => {
            if (response.data.success) {
                const majorSubject = response.data?.data?.hrms_major_subject?.map(
                    (item) => {
                        return {
                            value: item?.hrms_major_subject__id,
                            label: item?.hrms_major_subject__name,
                        };
                    }
                );
                dispatch(
                    actions.majorSubjectFetched({
                        majorSubject,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};


export const getProfilePercentage = () => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getProfilePercentage()
        .then((response) => {
            if (response.data.success) {
                const profilePercentage = response?.data?.data?.percentage;
                dispatch(
                    actions.profilePercentageFetched({
                        profilePercentage,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const insertProfileScore = (params) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .insertProfileScore(params)
        .then((response) => {
            if (response.data.success) {
                console.log("Score saved");
            } else {
                if (response.data.message) {
                    console.log(response.data.message);
                } else {
                    console.log("someting went wrong");
                }
            }
        })
        .catch((error) => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const updateProfileScore = (params) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .updateProfileScore(params)
        .then((response) => {
            if (response.data.success) {
                console.log("Score saved");
            } else {
                if (response.data.message) {
                    console.log(response.data.message);
                } else {
                    console.log("someting went wrong");
                }
            }
        })
        .catch((error) => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};
export const getDocumentsInfoByApplicants = (id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getDocumentsInfoByApplicantId(id)
        .then((response) => {
            if (response?.data?.data?.hrms_applicant_documents) {
                var resData = response?.data?.data?.hrms_applicant_documents;
                var result = resData?.map(function (o) {
                    return objectKeyReplace(o, 'hrms_applicant_documents__');
                });
                dispatch(
                    actions.documentsInfoFetched({
                        documentsInfo: result,
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
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const updateUserData = (params, id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .updateUserData(params, id)
        .then((response) => {
            if (response.data.success) {
                console.log("User data saved");
            } else {
                if (response.data.message) {
                    console.log(response.data.message);
                } else {
                    console.log("someting went wrong");
                }
            }
        })
        .catch((error) => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const insertPublicationCommonData = (params) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .insertPublicationCommonData(params)
        .then((response) => {
            if (response.data.success) {
                console.log("Data saved successfully!!!");
            } else {
                if (response.data.message) {
                    console.log(response.data.message);
                } else {
                    console.log("someting went wrong");
                }
            }
        })
        .catch((error) => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const updatePublicationCommonData = (params, id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .updatePublicationCommonData(params, id)
        .then((response) => {
            if (response.data.success) {
                console.log("Data updated successfully!!!");
            } else {
                if (response.data.message) {
                    console.log(response.data.message);
                } else {
                    console.log("someting went wrong");
                }
            }
        })
        .catch((error) => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getPublicationCommonData = (applicantId) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getPublicationCommonData(applicantId)
        .then((response) => {
            if (response?.data?.data) {
                dispatch(
                    actions.publicationCommonDataFethced({
                        publicationCommonData: response?.data?.data,
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

export const getAllPerDistrictByDivision = (division) => (dispatch) => {
    if (!division) {
        return dispatch(
            actions.perDistrictListFetched({
                per_district: null,
            })
        );
    }
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getAllDistrict(division)
        .then((response) => {
            if (response.data.success) {
                const per_district = response.data?.data?.rows?.map((item) => {
                    return {
                        value: item?.geo_district_id,
                        label: item?.geo_district_name,
                    };
                });
                dispatch(
                    actions.perDistrictListFetched({
                        per_district,
                    })
                );
            } else {
                if (response.data.message) {
                    swalError(response.data.message);
                } else {
                    swalError("something went wrong");
                }
            }
        })
        .catch((error) => {
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getAllPerThanaDistrictByDivision = (division, district) => (
    dispatch
) => {
    if (!division || !district) {
        return dispatch(
            actions.perThanaListFetched({
                per_thana: null,
            })
        );
    }

    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getAllThana(division, district)
        .then((response) => {
            if (response.data.success) {
                const per_thana = response.data?.data?.rows?.map((item) => {
                    return {
                        value: item?.id,
                        label: item?.name,
                    };
                });
                dispatch(
                    actions.perThanaListFetched({
                        per_thana,
                    })
                );
            } else {
                if (response.data.message) {
                    swalError(response.data.message);
                } else {
                    swalError("something went wrong");
                }
            }
        })
        .catch((error) => {
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const getAllPreThanaDistrictByDivision = (division, district) => (
    dispatch
) => {
    if (!division && !district) {
        return dispatch(
            actions.preThanaListFetched({
                pre_thana: null,
            })
        );
    }

    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getAllThana(division, district)
        .then((response) => {
            if (response.data.success) {
                const pre_thana = response.data?.data?.rows?.map((item) => {
                    return {
                        value: item?.id,
                        label: item?.name,
                    };
                });
                dispatch(
                    actions.preThanaListFetched({
                        pre_thana,
                    })
                );
            } else {
                if (response.data.message) {
                    swalError(response.data.message);
                } else {
                    swalError("something went wrong");
                }
            }
        })
        .catch((error) => {
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};
export const getAllPreDistrictByDivision = (division) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getAllDistrict(division)
        .then((response) => {
            if (response.data.success) {
                const pre_district = response.data?.data?.rows?.map((item) => {
                    return {
                        value: item?.geo_district_id,
                        label: item?.geo_district_name,
                    };
                });
                dispatch(
                    actions.preDistrictListFetched({
                        pre_district,
                    })
                );
            } else {
                if (response.data.message) {
                    swalError(response.data.message);
                } else {
                    swalError("something went wrong");
                }
            }
        })
        .catch((error) => {
            // error.clientMessage = "Can't create buy";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const applicantJobProfilePercentage = (param) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .applicantJobProfilePercentage(param)
        .then((response) => {
           
            if (response.data.success) {
                const profile_matching=response?.data?.data?.profile_matching;
                dispatch(
                    actions.profileMatchedFetched({
                        profileMatched: profile_matching,
                    })
                );
            } else {
                if (response.data.message) {
                    console.log(response.data.message);
                } else {
                    console.log("someting went wrong");
                }
            }
        })
        .catch((error) => {
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};