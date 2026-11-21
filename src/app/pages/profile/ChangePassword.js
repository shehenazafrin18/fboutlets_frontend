import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { GridInput } from "../../../_metronic/_partials/controls/forms/GridInput";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../modules/Auth/redux/authReducer";
import API from "../../helpers/devApi";
import { swalError, swalSuccess } from "../../helpers/swal"

// Validation schema
const ChangePasswordSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
  newPassword: Yup.string().required("New Password is required"),
  confirmNewPassword: Yup.string()
    .required("Confirm new passowrd is required")
    .oneOf(
      [Yup.ref("newPassword"), null],
      "New Password and Confirm New Password must match"
    ),
});

export default function ChangePassword() {
  const [loading, setLoading] = useState("");

  const {
    user: {
      data: { email, phone },
      accessToken,
      refreshToken,
    },
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmitPassword = async (values, { resetForm }) => {
    const { password, newPassword } = values;
    // console.log(values);
    // console.log(resetForm);
    setLoading(true);


    await API.post(`/hrms_applicant/changePassword/`, { current_password: password, new_password: newPassword })
      .then((res) => {
        setLoading(false);
        if (res.data?.success) {
          setLoading(false);
          resetForm();
          // dispatch(logout({}));
          swalSuccess("Password changed successfully")
        } else {
          swalError(res?.data?.message);
        }
      })
      .catch((error) => {
        swalError("someting went wrong");
      });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          password: "",
          newPassword: "",
          confirmNewPassword: "",
        }}
        validationSchema={ChangePasswordSchema}
        onSubmit={handleSubmitPassword}
      >
        {({ handleSubmit }) => (
          <Form className="flex-row-fluid ml-lg-8">
            <div className="card card-custom card-stretch">
              <div className="card-header py-3">
                <div className="card-title align-items-start flex-column">
                  <h3 className="card-label font-weight-bolder text-dark">
                    Change Password
                  </h3>
                  <span className="text-muted font-weight-bold font-size-sm mt-1">
                    Change your current password
                  </span>
                </div>
                <div className="card-toolbar">
                  <button
                    type="submit"
                    className="btn btn-success mr-2"
                    disabled={loading}
                    onSubmit={() => handleSubmit()}
                  >
                    Change Password
                    {loading && (
                      <span className="mx-3 spinner spinner-white"></span>
                    )}
                  </button>
                </div>
              </div>
              <div className="form">
                <div className="card-body">
                  <div className="form-group row">
                    <label
                      htmlFor=""
                      className="col-xl-3 col-lg-3 col-form-label"
                    >
                      Password
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <Field
                        name="password"
                        placeholder="Your Current Password"
                        type="password"
                        component={GridInput}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor=""
                      className="col-xl-3 col-lg-3 col-form-label"
                    >
                      New Password
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <Field
                        name="newPassword"
                        placeholder="Enter Your New Password"
                        type="password"
                        component={GridInput}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor=""
                      className="col-xl-3 col-lg-3 col-form-label"
                    >
                      Confirm Password
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <Field
                        name="confirmNewPassword"
                        placeholder="Confirm Your New Password"
                        type="password"
                        component={GridInput}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
