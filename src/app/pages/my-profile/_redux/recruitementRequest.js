import API from "../../../helpers/devApi";

const API_ENDPOINTS = "/hrms_education";

// Create  new Requisiton
export function createEducation(data) {
  return API.post(API_ENDPOINTS, data);
}

export function getEducationById(id) {
  return API.get(`${API_ENDPOINTS}/hrms_education/${id}`);
}

export function getApplicantsInfoById(id) {
  return API.get(`/hrms_applicant/${id}`);
}

export function getEducationByApplicantId(id) {
  return API.get(`${API_ENDPOINTS}/applicant_education/${id}`);
}

export function getprofesionalCertificatesByApplicantId(id) {
  return API.get(`/hrms_professional_certification/byApplicantId/${id}`);
}

export function getExperienceByApplicantId(id, query) {
  return API.get(`/hrms_experience/byApplicantId/${id}`, {
    params: query
  });
}

export function getTrainingByApplicantId(id) {
  return API.get(`/hrms_training/applicantId/${id}`);
}

export function getSpecialisationByApplicantId(id) {
  return API.get(`/hrms_specialisation/byApplicant/${id}`);
}

export function getAdditionalInfoByApplicantId(id) {
  return API.get(`/hrms_additional_information/byApplicant/${id}`);
}

export function getRelativesInfoByApplicantId(id) {
  return API.get(`/hrms_applicant_relative_information/byApplicantId/${id}`);
}

export function updateRelativesInfo(params) {
  return API.post(`/hrms_applicant_relative_information`, params);
}

export function deleteRelativesInfo() {
  return API.delete(`/hrms_applicant_relative_information/remove-relatives/by-applicant`);
}

export function getReferenceInfoByApplicantId(id) {
  return API.get(`/hrms_references/byApplicant/${id}`);
}

export function getLanguageInfoByApplicantId(id) {
  return API.get(`/hrms_language_proficiency/byApplicant/${id}`);
}

export function getPublicationInfoByApplicantId(id) {
  return API.get(`/hrms_publication/byApplicant/${id}`);
}

export function getPortfolioInfoByApplicantId(id) {
  return API.get(`/hrms_portfolio/byApplicant/${id}`);
}

// UPDATE Requisiton by ID
export function updateEducation(data, applicantId, id) {
  return API.patch(`${API_ENDPOINTS}/${applicantId}/${id}`, data);
}

// DELETE  Requisiton information from server
export function deleteEducation(itemId, id) {
  return API.delete(`${API_ENDPOINTS}/${itemId}/${id}`);
}

export function getAllEducationLavel() {
  return API.get(`/hrms_education_level`);
}

export function getAllDegree() {
  return API.get(`/hrms_degree`);
}

export function getAllResultType() {
  return API.get(`/hrms_result_type`);
}

export function getAllBoard() {
  return API.get(`/hrms_board`);
}

export function getAllInstitute() {
  return API.get(`/hrms_institute`);
}

export function getAllMajorSubject() {
  return API.get(`/hrms_major_subject`);
}

export function getProfilePercentage() {
  //   // return API.get(`/hrms_applicant/profile/percentage/by-applicant`);
}

export function insertProfileScore(params) {
  return API.post(`/hrms_applicant_profile_percentage`, { name: params });
}

export function updateProfileScore(params) {
  return API.patch(`/hrms_applicant_profile_percentage`, { name: params });
}

export function getDocumentsInfoByApplicantId(id) {
  return API.get(`/hrms_applicant_documents/applicantId/${id}`);
}

export function updateUserData(params, id) {
  return API.patch(`/career_portal_user/${id}`, params);
}

export function insertPublicationCommonData(params) {
  return API.post(`/hrms_publication_common`, params);
}

export function updatePublicationCommonData(params, id) {
  return API.patch(`/hrms_publication_common/${id}`, params);
}
export function getPublicationCommonData(applicantId) {
  return API.get(`/hrms_publication_common/byApplicant/${applicantId}`);
}
export function getAllDistrict(division) {
  return API.get(`/sys_geo_districts/district_by_division/${division}`);
}
export function getAllThana(division, district) {
  return API.get(`/hrms_thana/get_thana_by_div_dist/${division}/${district}`);
}
export function applicantJobProfilePercentage(params) {
  return API.post(`/hrms_job_application/profile-matching`, params);
}