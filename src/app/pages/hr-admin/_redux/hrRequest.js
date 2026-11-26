import API from "../../../helpers/devApi";

export function getMenuCategoryList() {
  return API.get(`/menu-categories`);
}

export function saveMenuCategory(param) {
  return API.post(`/menu-categories`, param);
}

export function updateMenuCategory(param, id) {
  return API.patch(`/menu-categories/${id}`, param);
}

export function deleteMenuCategory(id) {
  return API.delete(`/menu-categories/${id}`);
}

export function getMenuCategoryById(id) {
  return API.get(`/menu-categories/${id}`);
}

export function getMenuItemList() {
  return API.get(`/menu-items`);
}
export function getInventoryItemList() {
  return API.get(`/inventory-item`);
}

export function saveInventoryItem(param) {
  return API.post(`/inventory-item`, param);
}

export function updateInventoryItem(param, id) {
  return API.patch(`/inventory-item/${id}`, param);
}

export function deleteInventoryItem(id) {
  return API.delete(`/inventory-item/${id}`);
}

export function getOutletMenuList(outletId) {
  return API.get(`/outlet-menu/outlets/menu/${outletId}`);
}

export function saveOutletMenu(outletId, itemId, param) {
  return API.post(
    `/outlet-menu/outlets/${outletId}/menu-items/${itemId}/assign`,
    param,
  );
}

export function updateOutletMenu(outletId, itemId, param) {
  return API.patch(
    `/outlet-menu/outlets/${outletId}/menu-items/price/${itemId}`,
    param,
  );
}

export function deleteOutletMenu(id) {
  return API.delete(`/outlet-menu/${id}`);
}

export function getInventories() {
  return API.get(`/inventories`);
}
export function deleteInventories(id) {
  return API.delete(`/inventories/${id}`);
}
export function saveInventories(param) {
  return API.post(`/inventories`, param);
}
export function updateInventories(param, id) {
  return API.patch(`/inventories/${id}`, param);
}
export function getOutletList() {
  return API.get(`/outlet`);
}
export function getSupplierList() {
  return API.get(`/suppliers`);
}

export function getPurchaseList() {
  return API.get(`/purchases`);
}
export function deletePurchase(id) {
  return API.delete(`/purchases/${id}`);
}
export function savePurchase(param) {
  return API.post(`/purchases`, param);
}
export function updatePurchase(param, id) {
  return API.patch(`/purchases/${id}`, param);
}

export function createSales(param) {
  return API.post(`/sales`, param);
}

export function getSalesByOutlet(outletId) {
  return API.get(`/sales/outlet/${outletId}`);
}
export function getRevenueByOutlet(startDate, endDate, outletId) {
  return API.get(`/sales/revenue/outlets/${startDate}/${endDate}/${outletId}`);
}
export function getTopSellingItems(startDate, endDate, outletId) {
  return API.get(
    `/sales/top-selling-items/${startDate}/${endDate}/${outletId}`,
  );
}
// ------------- F&B Outlets END ----------------//

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
    searchParam.append(key, params[key]);
  }
  return API.post(
    `/hrms_job_application/all-shortlisted?` + searchParam.toString(),
    body,
  );
}
export function fetchAllJob(params) {
  return API.post(`/hrms_job/all-jobs`, params);
}
export function fetchJobById(id) {
  return API.get(`/hrms_job/${id}`);
}
export function downloadApplicant(body = [], type = "word") {
  return API.post(
    `/hrms_job_application/generate-shortlisted-cv-bulk?type=${type}`,
    body,
  );
}

// export function shortListedApplicant(params) {
//   return API.post(`/hrms_job/list/status_wise`, params);
// }

// export function getDashboardJobApplication() {
//   return API.get(`/common/get-job-application-info`);
// }

export function getMenuList(type_id) {
  return API.get(`/career_portal_menu_priviledge/menus/${type_id}`);
}
export function getApplicantList(params) {
  return API.get(`/hrms_applicant`, {
    params,
  });
}

export function getCareerPortalUserList(params) {
  return API.get(`/career_portal_user`, {
    params,
  });
}

export function downloadJobSummaryReport(filters) {
  return API.get("/hrms_job/reports/job-summary/download", {
    params: filters,
    responseType: "blob",
  });
}

export function getApplicantAnalyticsReport(filters) {
  return API.get("/hrms_job_application/reports/analytics-of-the-applicants", {
    params: filters,
  });
}

export function downloadApplicantAnalyticsReport(filters) {
  return API.get(
    "/hrms_job_application/reports/analytics-of-the-applicants/download",
    {
      params: filters,
      responseType: "blob",
    },
  );
}

export function getJobDropDownOptions() {
  return API.get("/hrms_job/list/dropdown");
}

export function getAllDisticts() {
  return API.get("/sys_geo_districts");
}

export function getProfileSummaryReport(filters) {
  return API.get("/hrms_job_application/reports/profile-summary", {
    params: filters,
  });
}

export function downloadProfileSummaryReport(filters) {
  return API.get("/hrms_job_application/reports/profile-summary/download", {
    params: filters,
    responseType: "blob",
  });
}

export function downloadApplicantSummaryReport(filters) {
  return API.get("/hrms_job_application/reports/applicant-summary/download", {
    params: filters,
    responseType: "blob",
  });
}

export function getBlackListReport() {
  return API.get(`/hrms_applicant/reports/blacklist-applicant`);
}

export function downloadBlackListReport() {
  return API.get(`/hrms_applicant/reports/blacklist-applicant/download`, {
    responseType: "blob",
  });
}

export function fetchUserTypes(params) {
  return API.get(`/career_portal_user_type`, { params });
}
