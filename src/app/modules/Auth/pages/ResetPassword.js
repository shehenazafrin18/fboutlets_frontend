import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { resetPassword } from "../redux/authCrud";
import { swalError, swalSuccess } from "../../../helpers/swal";
import * as jobAction from "../../../_redux/jobActions"
import { useDispatch, useSelector } from "react-redux";
import AutoDismissAlert from "../../../components/toolkit/AutoDismissAlert";
const COMPANY_ID = process.env.REACT_APP_COMPANY_ID;

const initialValues = {
    email: "",
};

 
function ResetPassword(props) {
    const { intl } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [show, setShow] = useState(false);
    const { systemInfo } = useSelector((state) => state.job);

    useEffect(() => {
        dispatch(jobAction.fetchALLSystemInfo());
    }, [dispatch]);

    const ResetPasswordSchema = Yup.object().shape({
        email: Yup.string()
            .email("Wrong email format")
            .min(3, "Minimum 3 value")
            .max(50, "Maximum 50 value")
            .required(),

    });

    const enableLoading = () => {
        setLoading(true);
    };

    const disableLoading = () => {
        setLoading(false);
    };

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
        validationSchema: ResetPasswordSchema,
        onSubmit: (values, { setStatus, setSubmitting }) => {
            setShow(false);
            setSubmitting(true);
            enableLoading();
            resetPassword(values.email)
                .then(({ data: { data } }) => {
                    if (!data?.error || data?.success) {
                        //setTimeout(() => {
                        disableLoading();
                        setSubmitting(false);
                        // swalSuccess(data?.Msg);
                        setStatus(data?.Msg);
                        // }, 2000);
                        setTimeout(() => {
                            history.push('/auth/reset-password-otp')
                        }, 2000);
                    } else {
                        // swalError('Invalid Email', '');
                        setError('Invalid Email');
                        setShow(true);
                    }
                })
                .catch((error) => {
                    console.log({ error })
                    setSubmitting(false);
                    // setStatus(error?.message);
                    // swalError(error?.message);
                    setError(error?.message);
                    setShow(true);
                    disableLoading();
                });
        },
    });

    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

 
    return (

        <>
            <div className="login_page_wrapper" >
                <div >
                    <div className="login_container">
                        <div className="logo_box">
                            <Link to="/">
                                <img className="img-fluid" src={systemInfo ? (DOC_CONTAINER + systemInfo?.logo + DOC_TOKEN) : COMPANY_ID == 1 ? "images/login_logo.png" : COMPANY_ID == 3 ? "images/bied.png" : COMPANY_ID == 2 ? "images/bigd.png" : "images/jpgsph.png"} alt="logo" />
                            </Link>
                        </div>

                        <div className="login_form_div">
                            <div className="top-header">
                                <h3>Recover your Account</h3>
                            </div>

                            <form
                                onSubmit={formik.handleSubmit}
                            >
 
                                {formik.status && (
                                    <AutoDismissAlert message={formik.status} variant="success" />

                                    // <div className="mb-10 alert alert-custom alert-dismissible alert-msg-bg p-3">
                                    //     <div className="alert-text font-weight-bold alert-msg-title">{formik.status}</div>
                                    // </div>
                                )}
                                {
                                    error && show && (
                                        <AutoDismissAlert message={error} variant="danger" />

                                        // <div className="mb-10 alert alert-custom alert-dismissible alert-light-danger  p-3" >
                                        //     <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setShow(false)}>
                                        //         <span aria-hidden="true" >&times;</span>
                                        //     </button>
                                        //     <div className="alert-text font-weight-bold alert-msg-title">{error}</div>
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
                                        <div className="fv-help-block text-danger">{formik.errors.email}</div>
                                    </div>
                                ) : null}


                                <div className="submit_btn">
                                    <button
                                        type="submit"
                                    >
                                        Request for OTP
                                    </button>
                                </div>

                                <div className="link_btn_footer">
                                    <Link to="/auth/login" className="text-light"> Back to Login</Link>
                                    <Link to="/auth/signup">Create Account</Link>
                                </div>
                            </form>

                        </div>

                    </div>
                </div>
            </div>


            <div className="login-form login-signin" style={{ display: "none" }}>
                <div className="text-center mb-10 mb-lg-20">
                    <h3 className="font-size-h1">
                        <FormattedMessage id="AUTH.FORGOT.TITLE" />
                    </h3>
                    <p className="text-muted font-weight-bold">
                        <FormattedMessage id="AUTH.FORGOT.DESC" />
                    </p>
                </div>

                <form
                    id="kt_login_signin_form"
                    className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
                    onSubmit={formik.handleSubmit}
                >
                    {/* begin: Alert */}
                    {formik.status && (
                        <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                            <div className="alert-text font-weight-bold">{formik.status}</div>
                        </div>
                    )}
                    {/* end: Alert */}



                    {/* begin: Email */}
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
                    {/* end: Email */}
                    <div className="form-group d-flex flex-wrap flex-center">
                        <button
                            type="submit"
                            className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                        >
                            <span>Submit</span>
                            {loading && <span className="ml-3 spinner spinner-white"></span>}
                        </button>

                        <Link to="/auth/login">
                            <button
                                type="button"
                                className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                            >
                                Cancel
                            </button>
                        </Link>
                    </div>
                </form>

            </div>

        </>
    );
}
export default ResetPassword;

