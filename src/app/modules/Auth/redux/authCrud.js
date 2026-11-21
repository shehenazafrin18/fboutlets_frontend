import API from "../../../helpers/devApi";
export const REGISTER_URL = `/hrms_applicant/registration`;
export const RESET_PASSWORD_URL = `/hrms_applicant/resetPassword`;
export const RESET_PASSWORD_Otp_URL = `/hrms_applicant/varifyOtpAndChangePassword`;


export function register(category_id, email, first_name, middle_name, last_name, contact_number, password, gender,sign_up_statement, company_id) {
  return API.post(REGISTER_URL, { category_id, email, first_name, middle_name, last_name, contact_number, password, gender, sign_up_statement, company_id });
}
export function resetPassword(email) {
  return API.post(RESET_PASSWORD_URL, { email });
}
export function resetPasswordOtp(email, otp, new_password) {
  return API.post(RESET_PASSWORD_Otp_URL, { email, otp, new_password });
}
