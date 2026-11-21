import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { register } from "../redux/authCrud";
import * as jobAction from "../../../_redux/jobActions"
import { useDispatch, useSelector } from "react-redux";
import { swalError, swalSuccess, swalWarning } from "../../../helpers/swal";
import swal from "sweetalert2";
import { Modal } from 'react-bootstrap'
import AutoDismissAlert from "../../../components/toolkit/AutoDismissAlert";

const initialValues = {
    category_id: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    password: "",
    confirm_password: "",
    contact_number: "",
    gender: "",
    // user_type_id: 3,
    sign_up_statement: 0,
};

const COMPANY_ID = process.env.REACT_APP_COMPANY_ID;

function Registration(props) {
    const dispatch = useDispatch();
    const {
        // departmentList,
        categoryList
    } = useSelector((state) => state.job);


    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [showTAC, setShowTAC] = useState(false);
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const { systemInfo } = useSelector((state) => state.job);

    useEffect(() => {
        dispatch(jobAction.fetchALLSystemInfo());
    }, [dispatch]);

    const RegistrationSchema = Yup.object().shape({
        category_id: Yup.number().typeError("Category is required")
            .required("Category is required"),
        first_name: Yup.string()
            .min(2, "Minimum 2 value")
            .max(50, "Maximum 50 value")
            .required("First name is required"),
        last_name: Yup.string()
            .min(3, "Minimum 3 value")
            .max(50, "Maximum 50 value")
            .required("Last name is required"),
        gender: Yup.string()
            .required("Gender is required"),
        contact_number: Yup.string()
            // .min(9, "Minimum 11 digits input")
            .max(10, "Maximum 11 digits input")
            .required("Phone is required"),
        email: Yup.string()
            .email("Wrong email format")
            .min(3, "Minimum 3 value")
            .max(50, "Maximum 50 value")
            .required("Email is required"),
        password: Yup.string()
            .min(3, "Minimum 3 value")
            .max(50, "Maximum 50 value")
            .required("Password is required"),
        confirm_password: Yup.string()
            .required()
            .when("password", {
                is: (val) => (val && val.length > 0 ? true : false),
                then: Yup.string().oneOf(
                    [Yup.ref("password")],
                    "Password and Confirm Password didn't match"
                ),
            }),

        sign_up_statement: Yup.boolean()
            .required('Please check declaration of statement')
            .oneOf([true], 'Please check declaration of statement')
    });

    const enableLoading = () => {
        setLoading(true);
    };

    const disableLoading = () => {
        setLoading(false);
    };

    // const getInputClasses = (fieldname) => {
    //     if (formik.touched[fieldname] && formik.errors[fieldname]) {
    //         return "is-invalid";
    //     }

    //     if (formik.touched[fieldname] && !formik.errors[fieldname]) {
    //         return "is-valid";
    //     }

    //     return "";
    // };
    const showConfirmedSignupMessage = async () => {
        const result = await swal.fire({
            text: 'Data saved successfully!!! Confirm sign up by submitting confirm button from your provided email',
            icon: "success",
            showCancelButton: false,
            confirmButtonText: 'Okay',
            confirmButtonColor: "#3699FF",
            heightAuto: false, // Disable auto height to allow custom height
        });
        if (result.isConfirmed) {
            history.push('/auth/login');
        }
    }

    const formik = useFormik({
        initialValues,
        validationSchema: RegistrationSchema,
        onSubmit: (values, { resetForm, setStatus, setSubmitting }) => {
            // console.log({values});return;
            setShow(false);
            setSubmitting(true);
            enableLoading();
            resetForm();
            // register(parseInt(values.category_id), values.email, values.first_name, values.middle_name, values.last_name, '0' + values.contact_number, values.password, values.gender, values?.user_type_id, values?.sign_up_statement)
            register(parseInt(values.category_id), values.email, values.first_name, values.middle_name, values.last_name, '0' + values.contact_number, values.password, values.gender, values?.sign_up_statement, COMPANY_ID)
                .then(({ data: { data } }) => {
                    disableLoading();
                    setSubmitting(false);
                    //  if (data?.error == true || !data?.success) {
                    if (data?.error == true) {
                        setTimeout(() => {
                            setStatus(data?.Msg ? data?.Msg : "Sign up failed!!", "");
                            setShow(true)
                            // swalWarning(data?.Msg ? data?.Msg : "Sign up failed!!", "");
                        }, 3000);
                    } else {
                        // setStatus(data?.Msg, "");
                        setTimeout(() => {
                            showConfirmedSignupMessage();
                        }, 5000);
                        // swalSuccess(data?.Msg);
                        // setTimeout(() => {
                        //     history.push(`/auth/login`);
                        // }, 3000);
                    }
                })
                .catch(() => {
                    setSubmitting(false);
                    // swalError("Invalid Sign Up ", "");
                    setError("Invalid Sign Up ");
                    setShow(true);
                    setStatus(
                        "Invalid Sign Up"
                    );
                    disableLoading();
                });
        },
    });

    useEffect(() => {
        dispatch(jobAction.fetchALLDepartmentList());
        dispatch(jobAction.fetchALLCategory());
    }, [dispatch]);

    const [passwordType, setPasswordType] = useState("password");
    const [passwordConfirmType, setPasswordConfirmType] = useState("password");
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordConfirmInput, setPasswordConfirmInput] = useState("");
    const handlePasswordChange = (evnt) => {
        setPasswordInput(evnt.target.value);
    }
    const handlePasswordConfirmChange = (evnt) => {
        setPasswordConfirmInput(evnt.target.value);
    }

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text");
            return;
        }
        setPasswordType("password")
    }

    const toggleConfirmPassword = () => {
        if (passwordConfirmType === "password") {
            setPasswordConfirmType("text");
            return;
        }
        setPasswordConfirmType("password")
    }

    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;
    return (
        <>

            <div className="login_page_wrapper registration_page_wrapper" >
                <div >
                    <div className="login_container">
                        <div className="logo_box">
                            <Link to="/">
                                <img className="img-fluid" src={systemInfo ? (DOC_CONTAINER + systemInfo?.logo + DOC_TOKEN) : COMPANY_ID == 1 ? "images/login_logo.png" : COMPANY_ID == 3 ? "images/bied.png" : COMPANY_ID == 2 ? "images/bigd.png" : "images/jpgsph.png"} alt="logo" />
                            </Link>
                        </div>

                        <div className="login_form_div">
                            <div className="top-header">
                                <h3>Complete the form to Create Account</h3>
                            </div>

                            <form
                                onSubmit={formik.handleSubmit}
                            >

                                {
                                    formik.status && show && (
                                        <AutoDismissAlert message={formik.status} variant="success" />

                                        // <div className="mb-10 alert alert-custom alert-dismissible alert-light-warning  p-3" >
                                        //     <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setShow(false)}>
                                        //         <span aria-hidden="true" >&times;</span>
                                        //     </button>
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



                                {/* <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="input_group">
                                            <label htmlFor="Category" className="form-label">
                                                <span className="me-1">*</span>
                                                Department
                                            </label>
                                            <select className="form-control"
                                                aria-label="Category"
                                                name="department_id"
                                                {...formik.getFieldProps("department_id")}
                                            >
                                                <option selected  >Select Department</option>
                                                {
                                                    departmentList && departmentList.map((val, key) => {
                                                        return (
                                                            <>
                                                                <option value={val?.department_id} key={key}>{val?.department_name}</option>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="input_group">
                                            <label htmlFor="Category" className="form-label">
                                                <span className="me-1">*</span>
                                                Job Category
                                            </label>
                                            <select className="form-control"
                                                aria-label="Category"
                                                name="category_id"
                                                {...formik.getFieldProps("category_id")}
                                            >
                                                <option selected  >Select Category</option>
                                                {
                                                    categoryList
                                                    && categoryList?.hrms_applicant_category
                                                    && categoryList?.hrms_applicant_category.map((val, key) => {
                                                        return (
                                                            <>
                                                                <option value={val?.hrms_applicant_category__id} key={key}>{val?.hrms_applicant_category__name}</option>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        {formik.touched.category_id && formik.errors.category_id ? (
                                            <div className="fv-plugins-message-container mb-3">
                                                <div className="fv-help-block">{formik.errors.category_id}</div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="input_group">
                                            <label htmlFor="first_name" className="form-label">
                                                <span className="me-1">*</span>
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter first name"
                                                name="first_name"
                                                className="form-control"
                                                {...formik.getFieldProps("first_name")}
                                            />
                                            <i className="fas fa-user"></i>
                                        </div>
                                        {formik.touched.first_name && formik.errors.first_name ? (
                                            <div className="fv-plugins-message-container mb-3">
                                                <div className="fv-help-block">{formik.errors.first_name}</div>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="input_group">
                                            <label htmlFor="middle_name" className="form-label">
                                                <span className="me-1"></span>
                                                Middle Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter middle name"
                                                name="middle_name"
                                                className="form-control"
                                                {...formik.getFieldProps("middle_name")}
                                            />
                                            <i className="fas fa-user"></i>
                                        </div>
                                        {formik.touched.middle_name && formik.errors.middle_name ? (
                                            <div className="fv-plugins-message-container mb-3">
                                                <div className="fv-help-block">{formik.errors.middle_name}</div>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="input_group">
                                            <label htmlFor="last_name" className="form-label">
                                                <span className="me-1">*</span>
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter last name"
                                                name="last_name"
                                                className="form-control"
                                                {...formik.getFieldProps("last_name")}
                                            />
                                            <i className="fas fa-user"></i>
                                        </div>
                                        {formik.touched.last_name && formik.errors.last_name ? (
                                            <div className="fv-plugins-message-container mb-3">
                                                <div className="fv-help-block">{formik.errors.last_name}</div>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="input_group">
                                            <label htmlFor="gender" className="form-label">
                                                <span className="me-1">*</span>
                                                Gender
                                            </label>
                                            <select className="form-control"
                                                aria-label="gender"
                                                name="gender"
                                                {...formik.getFieldProps("gender")}
                                            >
                                                <option selected>Select a gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Others">Others</option>
                                            </select>

                                            {
                                                formik.touched.gender &&
                                                    formik.errors.gender ? (
                                                    <div className="fv-plugins-message-container mb-3">
                                                        <div className="fv-help-block">{formik.errors.gender}</div>
                                                    </div>
                                                ) : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="input_group">
                                            <label htmlFor="email" className="form-label">
                                                <span className="me-1">*</span>
                                                Email
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter email"
                                                name="email"
                                                className="form-control"
                                                {...formik.getFieldProps("email")}
                                            />
                                            <i className="fas fa-envelope"></i>
                                        </div>
                                        {formik.touched.email && formik.errors.email ? (
                                            <div className="fv-plugins-message-container mb-3">
                                                <div className="fv-help-block text-danger">{formik.errors.email}</div>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="input_group">
                                            <label htmlFor="phone" className="form-label">
                                                <span className="me-1">*</span>
                                                Phone
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Enter phone number"
                                                name="contact_number"
                                                className="form-control"
                                                {...formik.getFieldProps("contact_number")}
                                            />
                                            <i className="fas fa-phone"></i>
                                        </div>
                                        {formik.touched.contact_number && formik.errors.contact_number ? (
                                            <div className="fv-plugins-message-container mb-3">
                                                <div className="fv-help-block text-danger">{formik.errors.contact_number}</div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-md-6">
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
                                            <div className="fv-plugins-message-container mb-3">
                                                <div className="fv-help-block">{formik.errors.password}</div>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="input_group">
                                            <label htmlFor="phone" className="form-label">
                                                <span className="me-1">*</span>
                                                Confirm Password
                                            </label>

                                            <input
                                                type={passwordConfirmType}
                                                placeholder="Enter Confirm Password"
                                                name="confirm_password"
                                                className="form-control"
                                                onChange={handlePasswordConfirmChange}
                                                value={passwordConfirmInput}
                                                {...formik.getFieldProps("confirm_password")}
                                            />
                                            <span className="password_view_btn" onClick={toggleConfirmPassword}>
                                                {passwordConfirmType === "password" ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                                            </span>

                                        </div>
                                        {formik.touched.confirm_password && formik.errors.confirm_password ? (
                                            <div className="fv-plugins-message-container mb-3">
                                                <div className="fv-help-block">
                                                    {formik.errors.confirm_password}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="row pt-5">
                                    <div className="col-12 col-md-12 align-middle font-size-lg">
                                        <label>
                                            <input
                                                value={1}
                                                checked={formik.values.sign_up_statement == 1}
                                                type="checkbox"
                                                name="sign_up_statement"
                                            // onChange={(e) => {
                                            //     formik.setFieldValue("sign_up_statement", e.target.checked ? 1 : 0);
                                            // }}
                                            />
                                            {/* <span className="ms-3 text-white">
                                                I declare that all the information provided during the sign-up process is accurate and up-to-date to the best of my knowledge
                                            </span> */}
                                        </label>
                                        <span className="ms-3 text-white cursor-pointer" onClick={(e) => { e.preventDefault(); setShowTAC(true) }}>
                                            <a href="#" className="text-decoration-underline">Terms and Condition</a>
                                        </span>
                                        {formik.touched.sign_up_statement && formik.errors.sign_up_statement ? (
                                            <div className="fv-plugins-message-container mb-3">
                                                <div className="fv-help-block">
                                                    {formik.errors.sign_up_statement}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                {/* <p className="text-white"> {JSON.stringify(loading)}</p> */}
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="submit_btn">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                            >
                                                Sign Up
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="link_btn_footer">
                                            <span>Already have account?  <Link to="/auth/login">  Login Now</Link> </span>
                                        </div>
                                    </div>
                                </div>

                            </form>

                        </div>

                    </div>
                </div>
            </div>
            <TermsAndConditionModal
                show={showTAC}
                setShow={setShowTAC}
                setFieldValue={formik.setFieldValue}
                html={systemInfo?.terms_and_condition}
            />
        </>
    );
}

const TermsAndConditionModal = ({ show, setShow, html, setFieldValue }) => {
    const [canAccept, setCanAccept] = useState(false);

    const handleClose = () => {
        setShow(false);
        setCanAccept(false);
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
        >
            <>
                <Modal.Header>
                    <Modal.Title className='cover_letter_modal_view'>
                        <h2 className='mb-0'>Terms and Condition</h2>
                        <button
                            type="button"
                            onClick={handleClose}
                        >
                            <i className="fas fa-times text-danger" style={{ fontSize: '26px' }}></i>
                        </button>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body onScroll={(e) => {
                    if (!canAccept) {
                        let targetModelBody = e.target;
                        const scrollTopTotalHegight = (targetModelBody.scrollHeight - targetModelBody.offsetHeight) - 100;
                        if (targetModelBody.scrollTop >= scrollTopTotalHegight) {
                            setCanAccept(true);
                        }
                    }
                }}>
                    <div className="row">
                        <div className='col-md-12'>
                            <div className="col-md-12 mb-3" dangerouslySetInnerHTML={{ __html: html }}>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <div className="row col-md-12" style={{ justifyContent: 'space-between' }}>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                handleClose();
                                setFieldValue('sign_up_statement', 0);
                            }}
                        >
                            Decline
                        </button>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                handleClose();
                                setFieldValue('sign_up_statement', 1);
                            }}
                            disabled={!canAccept}
                        >
                            Accept
                        </button>
                    </div>
                </Modal.Footer>

            </>
        </Modal>
    )
}

export default Registration;

