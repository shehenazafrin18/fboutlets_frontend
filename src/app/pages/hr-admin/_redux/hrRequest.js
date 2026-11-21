import API from "../../../helpers/devApi"

export function saveSlider(param) {
  return API.post(`/hrms_career_portal_slider`, param);
}

export function updateSlider(param, id) {
  return API.patch(`/hrms_career_portal_slider/${id}`, param);
}

export function deleteSlider(id) {
  return API.delete(`/hrms_career_portal_slider/${id}`);
}

export function getSliderList() {
  return API.get(`/hrms_career_portal_slider`);
}

export function getSliderById(id) {
  return API.get(`/hrms_career_portal_slider/${id}`);
}

export function getSettingsData() {
  return API.get(`/hrms_career_portal_settings`);
}

export function insertSettings(param) {
  return API.post(`/hrms_career_portal_settings`, param);
}

export function updateSettings(param, id) {
  return API.patch(`/hrms_career_portal_settings/${id}`, param);
}

export function getApplicantListByJobId(jobId) {
  return API.get(`/hrms_job_application/find-all-by-job-id/${jobId}`);
}
export function getShortlistedApplicantList(params = {}, body) {
  let searchParam = new URLSearchParams();
  for (let key of Object.keys(params)) {
    searchParam.append(key, params[key])
  }
  return API.post(`/hrms_job_application/all-shortlisted?` + searchParam.toString(), body);
}
export function fetchAllJob(params) {
  return API.post(`/hrms_job/all-jobs`, params);
}
export function fetchJobById(id) {
  return API.get(`/hrms_job/${id}`);
}
export function downloadApplicant(body = [], type = 'word') {
  return API.post(`/hrms_job_application/generate-shortlisted-cv-bulk?type=${type}`, body);
}

// export function shortListedApplicant(params) {
//   return API.post(`/hrms_job/list/status_wise`, params);
// }

export function getDashboardJobApplication() {
  return API.get(`/common/get-job-application-info`);
}

export function getDashboardJobInfo() {
  return API.get(`/common/get-available-job-info`);
}

export function getDashboardApplicantsInfo() {
  return API.get(`/common/get-applicants-data`);
}

export function getDashboarCurrentJobInfo() {
  return API.get(`/common/get-live-job-data`);
}
export function getDashboarExpiredJobInfo() {
  return API.get(`/common/get-expired-job-data`);
}
export function getDashboarLatestJobInfo() {
  return API.get(`/common/get-latest-job-data`);
}
export function getDashboarJobViewCount() {
  return API.get(`/hrms_job_view`);
}
export function getJobSummaryReport(filters) {
  return API.get('/hrms_job/reports/job-summary', {
    params: filters
  });
}

export function getMenuList(type_id) {
  return API.get(`/career_portal_menu_priviledge/menus/${type_id}`);
}
export function getApplicantList(params) {
  return API.get(`/hrms_applicant`, {
    params
  });
}

export function getCareerPortalUserList(params) {
  return API.get(`/career_portal_user`, {
    params
  });
}

export function downloadJobSummaryReport(filters) {
  return API.get('/hrms_job/reports/job-summary/download', {
    params: filters,
    responseType:  'blob'
  });
}

export function getApplicantAnalyticsReport(filters) {
  return API.get('/hrms_job_application/reports/analytics-of-the-applicants', {
    params: filters
  });
}

export function downloadApplicantAnalyticsReport(filters) {
  return API.get('/hrms_job_application/reports/analytics-of-the-applicants/download', {
    params: filters,
    responseType: 'blob'
  });
}

export function getJobDropDownOptions() {
  return API.get('/hrms_job/list/dropdown');
}

export function getAllDisticts() {
  return API.get('/sys_geo_districts'); 
}

export function getProfileSummaryReport(filters) {
  return API.get('/hrms_job_application/reports/profile-summary', {
    params: filters
  }); 
}

export function downloadProfileSummaryReport(filters) {
  return API.get('/hrms_job_application/reports/profile-summary/download', {
    params: filters,
    responseType: 'blob'
  }); 
}

export function downloadApplicantSummaryReport(filters) {
  return API.get('/hrms_job_application/reports/applicant-summary/download', {
    params: filters,
    responseType: 'blob'
  }); 
}

export function getBlackListReport() {
  return API.get(`/hrms_applicant/reports/blacklist-applicant`);
}

export function downloadBlackListReport() {
  return API.get(`/hrms_applicant/reports/blacklist-applicant/download`, {
    responseType: 'blob'
  });
}

export function fetchUserTypes (params) {
  return API.get(`/career_portal_user_type`, { params });
}