import API from "../helpers/devApi"

export function fetchALLDepartmentList() {
  return API.get(`/sys_departments/landing-page/get-all-departments`);
}

export function fetchALLSystemInfo() {
  return API.get(`/hrms_career_portal_settings/get-company-info/data`);
}

export function fetchALLAvailableJob(param, page, size, isAuthenticated) {
  if(isAuthenticated) {
    return API.post(`hrms_job/list/available/applicant_wise?page=${page}&size=${size}`, param)
  } else {
    return API.post(`/hrms_job/list/available?page=${page}&size=${size}`, param);
  }
}

export function fetchAllRecommendedJob(param, page, size, isAuthenticated) {
  if(isAuthenticated) {
    return API.post(`/hrms_job/list/recommended/applicant_wise?page=${page}&size=${size}`, param);
  } else {
    return API.post(`/hrms_job/list/recommended?page=${page}&size=${size}`, param);
  }
}

export function fetchAllRelevantJob(auth, jobId) {
  if (auth) {
    return API.post(`hrms_job/list/relevant/${jobId}`);
  } else {
    return API.post(`hrms_job/list/allRelevant/${jobId}`);
  }
}

export function fetchJobDetailsById(auth, jobId) {
  if (auth) {
    return API.get(`/hrms_job/view/details/${jobId}`);
  } else {
    return API.get(`/hrms_job/${jobId}`);
  }
}

export function saveJob(param) {
  return API.post(`/hrms_job_save`, param);
}

export function sliderInfo() {
  return API.get(`/hrms_career_portal_slider/landing-page/get-all-slider`);
}


export function getApplicantAssessmentQstnAns(params) {
  return API.post(`/hrms_applicant_jd_assesment_answer/byApplicantJob/`, params);
}

export function getApplicantAssessmentQstn(jobId) {
  return API.get(`/hrms_jd_assesment_question/byJobDescId/${jobId}`);
}

export function applyToJob(params) {
  return API.post(`/hrms_job_application`, params);
}

export function unsaveJob(jobId) {
  return API.delete(`/hrms_job_save/${jobId}`);
}
export function withdrawJobApplication(jobId) {
  return API.delete(`/hrms_job_application/${jobId}`);
}

export function fetchALLCategory() {
  return API.get(`/hrms_applicant_category`);
}

export function jobDetailsViewCountSave(id) {
  return API.post(`/hrms_job_view/insert-job-detail-count/${id}`);
}

export function jobSearchViewCountSave(idArr) {
  return API.post(`/hrms_job_view`, { jobidArr: idArr });
}
