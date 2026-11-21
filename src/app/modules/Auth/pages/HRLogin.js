import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../redux/authReducer";


const initialValues = {
    email: "",
    password: "",
};

function HRLogin(props) {
    const { intl } = props;
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);


    useEffect(() => {
        if (user?.length != 0 && user?.access_token) {
            props.history.push("/hr-admin");
        }
    }, [user, props.history]);

    // console.log(user)
    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email("Wrong email format")
            .min(3, "Minimum 3 symbols")
            .max(50, "Maximum 50 symbols")
            .required(),
        password: Yup.string()
            .min(3, "Minimum 3 symbols")
            .max(50, "Maximum 50 symbols")
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
            dispatch(loginAdmin(values));
            resetForm();
        },
    });


    const [passwordType, setPasswordType] = useState("password");
    const [passwordInput, setPasswordInput] = useState("");
    const handlePasswordChange = (evnt) => {
        setPasswordInput(evnt.target.value);
    }
    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text");
            return;
        }
        setPasswordType("password")
    }


    return (

        <>
            <div className="login_page_wrapper" >
                <div >
                    <div className="login_container">
                        <div className="logo_box">
                            <img className="img-fluid" src="images/login_logo.png" alt="logo" />
                        </div>

                        <div className="login_form_div">
                            <div className="top-header">
                                <h3>Enter HR Login Credentials  </h3>
                            </div>
                            <form
                                onSubmit={formik.handleSubmit}
                            >
                                <div className="input_group">
                                    <label htmlFor="email" className="form-label">
                                        <span className="me-1">*</span>
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter email or phone"
                                        name="email"
                                        {...formik.getFieldProps("email")}
                                    />
                                    <i className="fas fa-envelope"></i>
                                </div>
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block text-danger">{formik.errors.email}</div>
                                    </div>
                                ) : null}


                                {/* <div className="input_group">
                                    <label htmlFor="password" className="form-label">
                                        <span className="me-1">*</span>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        name="password"
                                        {...formik.getFieldProps("password")}
                                    />
                                    <i className="fas fa-lock"></i>
                                </div> */}

                                <div className="input_group">
                                    <label htmlFor="password" className="form-label">
                                        <span className="me-1">*</span>
                                        Password
                                    </label>

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
                                        {passwordType === "password" ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                                    </span>

                                </div>


                                {formik.touched.password && formik.errors.password ? (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block text-danger">{formik.errors.password}</div>
                                    </div>
                                ) : null}

                                <div className="submit_btn">
                                    <button
                                        type="submit"
                                    >
                                        LOGIN
                                    </button>
                                </div>

                            </form>

                        </div>

                    </div>
                </div>
            </div>




            <div className="d-none login-form login-signin" id="kt_login_signin_form">
                {/* begin::Head */}
                <div className="text-center mb-10 mb-lg-20">
                    <h3 className="font-size-h1">Sign In</h3>
                </div>
                {/* end::Head */}

                {/*begin::Form*/}
                <form
                    onSubmit={formik.handleSubmit}
                    className="form fv-plugins-bootstrap fv-plugins-framework"
                >
                    {error && (
                        <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                            <div className="alert-text font-weight-bold">{error}</div>
                        </div>
                    )}

                    <div className="form-group fv-plugins-icon-container">
                        <input
                            placeholder="Email"
                            type="email"
                            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                                "email"
                            )}`}
                            name="email"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="fv-plugins-message-container">
                                <div className="fv-help-block">{formik.errors.email}</div>
                            </div>
                        ) : null}
                    </div>
                    <div className="form-group fv-plugins-icon-container">
                        <input
                            placeholder="Password"
                            type="password"
                            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                                "password"
                            )}`}
                            name="password"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="fv-plugins-message-container">
                                <div className="fv-help-block">{formik.errors.password}</div>
                            </div>
                        ) : null}
                    </div>
                    <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
                        {/* <Link
                to="/auth/forgot-password"
                className="text-dark-50 text-hover-primary my-3 mr-2"
                id="kt_login_forgot"
            >
                Forgot Password
            </Link> */}
                        <button
                            id="kt_login_signin_submit"
                            type="submit"
                            disabled={loading}
                            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
                        >
                            <span>Sign In</span>
                            {loading && <span className="ml-3 spinner spinner-white"></span>}
                        </button>
                    </div>
                </form>
                {/*end::Form*/}
                {/* <div className="text-center mb-5">
                    <Link className="font-weight-bold" to="/auth/forgot-password">
                        Forgot Password
                    </Link>
                    &nbsp;
                    /
                    &nbsp;
                    <Link className="font-weight-bold" to="/auth/signup">
                        Sign Up
                    </Link>
                </div> */}
                <div className="text-center mb-5">
                    {/* <h4 className="text-muted font-weight-bold">or</h4> */}
                </div>
                {/* <GoogleLogin
            clientId="29603225172-pfhm883kfm8crm526lgpbpa0e92ljnul.apps.googleusercontent.com"
            buttonText="Sign In with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            className="w-100 justify-content-center"
        /> */}
            </div>

        </>
    );
}

export default HRLogin;
