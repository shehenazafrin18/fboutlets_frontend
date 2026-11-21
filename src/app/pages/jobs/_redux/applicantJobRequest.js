import API from "../../../helpers/devApi"

// export function saveSlider(param) {
//   return API.post(`/hrms_career_portal_slider`, param);
// }


export function getAppliedJobList(applicantId, page, size, params) {
  return API.post(`/hrms_job_application/getAppliedJob/${applicantId}?page=${page}&size=${size}`, params);
}

export function getShortlistedJobList(params, page, size, searchText) {
  if (searchText) {
    return API.post(`/hrms_job/list/status_wise?page=${page}&size=${size}&search=${searchText}`, params);
  } else {
    return API.post(`/hrms_job/list/status_wise?page=${page}&size=${size}`, params);
  }
}

export function getSavedJobList(applicantId, page, size, params) {
  return API.post(`/hrms_job_save/list/saved/${applicantId}?page=${page}&size=${size}`, params);
}

export function getMyJobList(params, page, size) {
  return API.post(`/hrms_job_application/applicant-all-types-jobs?page=${page}&size=${size}`, params);
}

