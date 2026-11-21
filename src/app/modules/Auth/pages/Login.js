import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
// import { FormattedMessage, injectIntl } from "react-intl";
import { loginUser } from "../redux/authReducer";
import { swalSuccess } from "../../../helpers/swal";
import * as jobAction from "../../../_redux/jobActions";
import AutoDismissAlert from "../../../components/toolkit/AutoDismissAlert";
// import Axios from "axios";
// import { GoogleLogin } from "react-google-login";

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
  email: "",
  password: "",
};

const COMPANY_ID = process.env.REACT_APP_COMPANY_ID;
// const COMPANY_ID = 1;

function Login(props) {
  const { intl } = props;
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const { user } = useSelector((state) => state.auth);
  const previousState = props?.location?.state?.from;

  const { search } = useLocation();
  const history = useHistory();

  const { systemInfo } = useSelector((state) => state.job);

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const signupConfirmed = searchParams.get("signupConfirmed");
    if (signupConfirmed === "true") {
      setTimeout(async () => {
        // await swalSuccess('Sign up confirmed successfully');
        setStatus("Sign up confirmed successfully");
        history.push("/auth/login");
      }, 5000);
    }
  }, []);

  useEffect(() => {
    console.log({ user });
    if (user?.length != 0 && user?.access_token) {
      const usert_type = user?.data?.user_type;

      if (previousState) {
        props.history.push(previousState);
      } else {
        // if (usert_type == 3) {
        //   props.history.push("/");
        // } else {
        props.history.push("/hr-admin");
        // }
      }
    }
  }, [user, props.history, props.location]);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 value")
      .max(50, "Maximum 50 value")
      .required(),
    // username: Yup.string()
    //   .min(3, "Minimum 3 symbols")
    //   .max(50, "Maximum 50 symbols")
    //   .required(),
    password: Yup.string()
      .min(3, "Minimum 3 value")
      .max(50, "Maximum 50 value")
      .required(),
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(loginUser(values));
      resetForm();
    },
  });

  // const responseGoogle = (response) => {
  //   if (response) {
  //     const userInfo = {
  //       name: response.profileObj.name,
  //       firstName: response.profileObj.givenName,
  //       lastName: response.profileObj.familyName,
  //       email: response.profileObj.email,
  //       picture: response.profileObj.imageUrl,
  //       googleId: response.profileObj.googleId,
  //       accessToken: response.accessToken,
  //     };
  //     dispatch(googleLoginUser(userInfo));
  //   }
  // };

  const [passwordType, setPasswordType] = useState("password");
  const [passwordInput, setPasswordInput] = useState("");
  const handlePasswordChange = (evnt) => {
    setPasswordInput(evnt.target.value);
  };
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
  const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

  return (
    <div className="login_page_wrapper">
      <div className="login_container">
        <div className="logo_box">
          <Link to="/">
            <img
              className="img-fluid"
              src={
                systemInfo
                  ? DOC_CONTAINER + systemInfo?.logo + DOC_TOKEN
                  : COMPANY_ID == 1
                    ? "images/login_logo.png"
                    : COMPANY_ID == 3
                      ? "images/bied.png"
                      : COMPANY_ID == 2
                        ? "images/bigd.png"
                        : "images/jpgsph.png"
              }
              alt="logo"
            />
          </Link>
        </div>
        <div className="login_form_div">
          <div className="top-header">
            <h3>Enter Credentials to login </h3>
          </div>
          <form onSubmit={formik.handleSubmit}>
            {status && (
              <AutoDismissAlert message={status} variant="success" />

              // <div className="mb-10 alert alert-custom alert-dismissible alert-msg-bg p-3">
              //     <div className="alert-text font-weight-bold alert-msg-title">{status}</div>
              // </div>
            )}

            <div className="input_group">
              <label htmlFor="email" className="form-label">
                <span className="me-1">*</span>
                Email
              </label>
              <input
                type="text"
                placeholder="Enter email address"
                name="email"
                {...formik.getFieldProps("email")}
              />
              <i className="fas fa-envelope"></i>
            </div>

            {formik.touched.email && formik.errors.email ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block text-danger">
                  {formik.errors.email}
                </div>
              </div>
            ) : null}

            <div className="input_group">
              <label htmlFor="password" className="form-label">
                <span className="me-1">*</span>
                Password
              </label>
              {/* <input
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                                {...formik.getFieldProps("password")}
                            />
                            <i className="fas fa-lock"></i> */}

              <input
                type={passwordType}
                placeholder="Enter Password"
                name="password"
                className="form-control"
                onChange={handlePasswordChange}
                value={passwordInput}
                {...formik.getFieldProps("password")}
              />
              <span className="password_view_btn" onClick={togglePassword}>
                {passwordType === "password" ? (
                  <i className="fas fa-eye"></i>
                ) : (
                  <i className="fas fa-eye-slash"></i>
                )}
              </span>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block text-danger">
                  {formik.errors.password}
                </div>
              </div>
            ) : null}

            <div className="link_btn_footer">
              <Link to="/auth/forgot-password" className="text-light">
                {" "}
                Forgot Password
              </Link>
              <Link to="/auth/signup">Create Account</Link>
            </div>

            <div className="submit_btn">
              <button type="submit">LOGIN</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
