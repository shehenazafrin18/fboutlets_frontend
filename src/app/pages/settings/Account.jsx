import React, { useEffect, useState } from 'react'
// import { Link } from "react-router-dom";
// import * as Action from "../my-profile/_redux/recruitementActions";
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import API from "../../helpers/devApi"
import { useDispatch, useSelector } from 'react-redux';
import { swalError, swalSuccess } from '../../helpers/swal';
import { toAbsoluteUrl } from '../../../_metronic/_helpers';
import { changePhoto } from "../../modules/Auth/redux/authReducer";
import { values } from 'lodash';

export default function Account() {
    const dispatch = useDispatch();
    const { user: { data } } = useSelector((state) => state.auth);
    const [applicantsInfo, setApplicantsInfo] = useState();
    const [password, setPassword] = useState('');
    const [passwordType, setPasswordType] = useState("password");
    const [confirmPasswordType, setConfirmPasswordType] = useState("password");
    const [images, setImages] = useState(null);
    const [preview, setPreview] = useState(false);
    const [picture, setPicture] = useState(null);
    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

    const getApplicantProfileInfo = async (id) => {
        // let  URL = `/career_portal_user/profile/${id}`;
        // if (data?.user_type == 2) {
        //     URL = `/hrms_applicant/profile/${id}`;
        // } else {
        //     URL = `/sys_users/profile/${id}`;
        // }
        try {
            const response = await API.get(`/career_portal_user/${id}`);

            if (response?.data?.success) {
                const responseData = response?.data?.data;

                setApplicantsInfo({
                    first_name: responseData?.first_name,
                    middle_name: responseData?.middle_name,
                    last_name: responseData?.last_name,
                    full_name: responseData?.full_name,
                    contact_number: responseData?.contact_number,
                    email: responseData?.email,
                });
            } else {
                swalError(response?.data?.message, " ");
            }
        } catch (error) {
            swalError("Something went wrong");
        }
    }

    useEffect(() => {
        if (data) {
            // if (data?.user_type == 2) {
            getApplicantProfileInfo(data?.id);
            // }
        }
    }, [data]);

    const SignupSchema = Yup.object().shape({
        first_name: Yup.string()
            .min(2, 'Too Short!')
            .max(30, 'Too Long!')
            .required('Required'),
        last_name: Yup.string()
            .min(2, 'Too Short!')
            .max(30, 'Too Long!'),
        // full_name: data?.user_type === 1 && Yup.string()
        //     .min(2, 'Too Short!')
        //     .max(30, 'Too Long!')
        //     .required('Required'),
        contact_number: Yup.string().typeError('Required').max(11, 'Too Long!'),
        // mobile: Yup.string().max(11, 'Too Long!'),
        email: Yup.string().email('Invalid email').required('Required'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match")
    });

    
    const handleImage = (e) => {
        const files = e.target.files[0];
        setImages(files);
        setPicture(URL.createObjectURL(files));
        setPreview(true);
    };

    const handleSubmit = async (values) => {
        // console.log({ values });
        // return false;
        var formdata = new FormData();
        // let URL = '';

        // if (data?.user_type == 2) {
        // formdata.append('first_name', values?.first_name);
        // formdata.append('middle_name', values?.middle_name);
        // formdata.append('last_name', values?.last_name);
        if(values?.contact_number) {
            formdata.append('contact_number', values?.contact_number);
        }
        // } else {
        //     formdata.append('full_name', values?.full_name);
        // }

        formdata.append('email', values?.email);
        if (data?.user_type !== 3 && images) {
            formdata.append('profile_image', images);

        }

        if (password) {
            formdata.append('password', password);
        }


        // if (data?.user_type == 2) {


        //     URL = `/hrms_applicant/update-profile/${data?.id}`;
        // } else {
        //     formdata.append('mobile', values?.mobile);
        //     URL = `/sys_users/update-profile/${data?.id}`;
        // }



        await API.patch(`/career_portal_user/${data?.id}`, formdata)
            .then((res) => {
                if (res?.data?.success) {
                    swalSuccess('Profile Info Updated Successfully!!!');
                    getApplicantProfileInfo(data?.id);
                    dispatch(changePhoto({
                        profile_image: res?.data?.data?.profile_image,
                        first_name: res?.data?.data?.first_name,
                        middle_name: res?.data?.data?.middle_name,
                        last_name: res?.data?.data?.last_name,
                        email: res?.data?.data?.email,
                        contact_number: res?.data?.data?.mobile,
                    }));
                } else {
                    swalError(res?.data?.message, " ");
                }
            })
            .catch((error) => {
                console.log({ error })
                swalError("someting went wrong");
            });
    }

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text");
            return;
        }
        setPasswordType("password")
    }

    const toggleConfirmPassword = () => {
        if (confirmPasswordType === "password") {
            setConfirmPasswordType("text");
            return;
        }
        setConfirmPasswordType("password")
    }
    return (
        <>

            <div className='breadcrum_div2'>
                {/* <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"> <Link to="/" className="text-dark">Home</Link></li>
                        <li className="breadcrumb-item"> <Link to="/settings/account-settings">Basic Settings</Link></li>
                    </ol>
                </nav> */}
                <h2 className='mb-4'>Basic Settings</h2>
            </div>
            {applicantsInfo && (
                <>
                    <Formik
                        initialValues={applicantsInfo}
                        validationSchema={SignupSchema}
                        onSubmit={values => {
                            // console.log('Form submitted with values:', values);
                            handleSubmit(values);
                        }}
                        enableReinitialize
                    >
                        {({ errors, touched, setFieldValue }) => (
                            <Form>

                                <div className='row'>
                                    <div className='col-md-12'>
                                        <div className='card card_border_div'>
                                            {/* {data?.user_type == 2 ?
                                                <> */}

                                            {/* </> :
                                                <>
                                                    <div className='col_row_div3'>
                                                        <div className='user_name_div'>Full Name</div>
                                                        <div className='input_box_div'>
                                                            <Field name="full_name" type="text" className="form-control" />
                                                            {errors.full_name ? (
                                                                <div className="text-danger">{errors.full_name}</div>
                                                            ) : null}
                                                        </div>
                                                        <div className='edit_btn_div'></div>
                                                    </div>
                                                </>} */}
                                            <div className='col_row_div3'>
                                                <div className='user_name_div'>Email</div>
                                                <div className='input_box_div'>
                                                    <Field name="email" type="text" className="form-control" disabled={true} />
                                                    {
                                                        errors.email ? (
                                                            <div className="text-danger">{errors.email}</div>
                                                        ) : null
                                                    }
                                                </div>
                                                <div className='edit_btn_div'> </div>
                                            </div>
                                            <div className='col_row_div3'>
                                                <div className='user_name_div'>Password</div>
                                                <div className='input_box_div'>
                                                    <div className="password-input-container">
                                                        <input type={passwordType} name="password" className="form-control" autoComplete="off"
                                                            onChange={(e) => {
                                                                setFieldValue("password", e.target.value);
                                                                setPassword(e.target.value);
                                                            }} />
                                                        <span className="password_view_btn" onClick={togglePassword}>
                                                            {passwordType === "password" ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                                                        </span>
                                                    </ div>
                                                    {errors.password ? (
                                                        <div className="text-danger">{errors.password}</div>
                                                    ) : null}
                                                </div>
                                                <div className='edit_btn_div'> </div>
                                            </div>
                                            <div className='col_row_div3'>
                                                <div className='user_name_div'>Confirm Password</div>
                                                <div className='input_box_div'>
                                                    <div className="password-input-container">
                                                        <input type={confirmPasswordType} name="confirm_password" className="form-control" autoComplete="off"
                                                            onChange={(e) => {
                                                                setFieldValue("confirm_password", e.target.value);
                                                            }} />
                                                        <span className="password_view_btn" onClick={toggleConfirmPassword}>
                                                            {confirmPasswordType === "password" ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                                                        </span>
                                                    </ div>
                                                    {errors.confirm_password ? (
                                                        <div className="text-danger">{errors.confirm_password}</div>
                                                    ) : null}
                                                </div>
                                                <div className='edit_btn_div'> </div>
                                            </div>
                                            <div className='col_row_div3'>
                                                <div className='user_name_div'>First Name</div>
                                                <div className='input_box_div'>
                                                    <Field name="first_name" type="text" className="form-control" disabled={true} />
                                                    {errors.first_name ? (
                                                        <div className="text-danger">{errors.first_name}</div>
                                                    ) : null}
                                                </div>
                                                <div className='edit_btn_div'></div>
                                            </div>
                                            <div className='col_row_div3'>
                                                <div className='user_name_div'>Middle Name</div>
                                                <div className='input_box_div'>
                                                    <Field name="middle_name" type="text" className="form-control" disabled={true} />
                                                    {errors.middle_name ? (
                                                        <div className="text-danger">{errors.middle_name}</div>
                                                    ) : null}
                                                </div>
                                                <div className='edit_btn_div'></div>
                                            </div>
                                            <div className='col_row_div3'>
                                                <div className='user_name_div'>Last Name</div>
                                                <div className='input_box_div'>
                                                    <Field name="last_name" type="text" className="form-control" disabled={true} />
                                                    {errors.last_name ? (
                                                        <div className="text-danger">{errors.last_name}</div>
                                                    ) : null}
                                                </div>
                                                <div className='edit_btn_div'></div>
                                            </div>
                                            <div className='col_row_div3'>
                                                <div className='user_name_div'>Phone</div>
                                                <div className='input_box_div'>
                                                    {/* {data?.user_type == 2 ?
                                                        <> */}
                                                    <Field name="contact_number" type="text" className="form-control" />
                                                    {errors.contact_number ? (
                                                        <div className="text-danger">{errors.contact_number}</div>
                                                    ) : null}
                                                    {/* </>
                                                        : <>
                                                            <Field name="mobile" type="text" className="form-control" />
                                                            {errors.mobile ? (
                                                                <div className="text-danger">{errors.mobile}</div>
                                                            ) : null}
                                                        </>
                                                    } */}

                                                </div>
                                                <div className='edit_btn_div'> </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-5 mx-auto'>
                                                    {data?.user_type !== 3 && (
                                                        <>
                                                            <div className="account-seetings-image_box pl-5">
                                                                <div className='profile_image_boxs mb-5'>
                                                                    {preview ? (
                                                                        <>
                                                                            <img src={picture} alt="upload images" />
                                                                        </>

                                                                    ) : (
                                                                        <>
                                                                            {data?.profile_image ? (
                                                                                <img src={DOC_CONTAINER + data?.profile_image + DOC_TOKEN } alt="Profile images" />
                                                                            ) : (
                                                                                <img src={toAbsoluteUrl("/media/users/default.jpg")} alt="" />
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>

                                                                <div className="hr-profile-edit">
                                                                    <input
                                                                        type="file"
                                                                        id="imageUpload"
                                                                        accept=".png, .jpg, .jpeg"
                                                                        onChange={(e) => {
                                                                            handleImage(e)
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>


                                            <div className='edit_account_btn'>
                                                <button className="btn btn-primary" type="submit">Update</button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            )}
            {/* <a href="!#">
                                                <svg className='mr-3' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M11.8922 4.50469L10.7469 3.35938L5.07969 9.025L4.83594 10.4156L6.225 10.1703L11.8922 4.50469Z" fill="#E6F7FF" />
                                        <path d="M13.75 13.0625H2.25C1.97344 13.0625 1.75 13.2859 1.75 13.5625V14.125C1.75 14.1938 1.80625 14.25 1.875 14.25H14.125C14.1938 14.25 14.25 14.1938 14.25 14.125V13.5625C14.25 13.2859 14.0266 13.0625 13.75 13.0625ZM4.02656 11.75C4.05781 11.75 4.08906 11.7469 4.12031 11.7422L6.74844 11.2812C6.77969 11.275 6.80938 11.2609 6.83125 11.2375L13.4547 4.61406C13.4692 4.59961 13.4807 4.58244 13.4885 4.56354C13.4963 4.54463 13.5004 4.52437 13.5004 4.50391C13.5004 4.48344 13.4963 4.46318 13.4885 4.44428C13.4807 4.42538 13.4692 4.40821 13.4547 4.39375L10.8578 1.79531C10.8281 1.76563 10.7891 1.75 10.7469 1.75C10.7047 1.75 10.6656 1.76563 10.6359 1.79531L4.0125 8.41875C3.98906 8.44219 3.975 8.47031 3.96875 8.50156L3.50781 11.1297C3.49261 11.2134 3.49804 11.2995 3.52364 11.3807C3.54923 11.4618 3.59421 11.5355 3.65469 11.5953C3.75781 11.6953 3.8875 11.75 4.02656 11.75ZM5.07969 9.025L10.7469 3.35938L11.8922 4.50469L6.225 10.1703L4.83594 10.4156L5.07969 9.025Z" fill="#FFF" />
                                    </svg>
                                                Update
                                            </a> */}
            {/* <div className='col_row_div3'>
                                <div className='user_name_div'></div>
                                <div className='input_box_div togle_btn_div'>
                                    Email Notification
                                    <div className="switch-field">
                                        <input type="radio" id="radio-one" name="switch-one" value="yes" checked />
                                        <label for="radio-one">Yes</label>
                                        <input type="radio" id="radio-two" name="switch-one" value="no" />
                                        <label for="radio-two">No</label>
                                    </div>
                                </div>
                                <div className='edit_btn_div'></div>
                            </div>
                            <div className='col_row_div3'>
                                <div className='user_name_div'></div>
                                <div className='input_box_div togle_btn_div'>
                                    SMS Notification
                                    <div className="switch-field">
                                        <input type="radio" id="radio-one1" name="switch-two" value="yes" checked />
                                        <label for="radio-one1">Yes</label>
                                        <input type="radio" id="radio-two2" name="switch-two" value="no" />
                                        <label for="radio-two2">No</label>
                                    </div>
                                </div>
                                <div className='edit_btn_div'></div>
                            </div>
                            <div className='col_row_div3'>
                                <div className='user_name_div'></div>
                                <div className='input_box_div togle_btn_div'>
                                    My Resume
                                    <div className="switch-field">
                                        <input type="radio" id="radio-one4" name="switch-three" value="yes" />
                                        <label for="radio-one4">Yes</label>
                                        <input type="radio" id="radio-two3" name="switch-three" value="no" checked />
                                        <label for="radio-two3">No</label>
                                    </div>
                                </div>
                                <div className='edit_btn_div'></div>
                            </div> */}
        </>
    )
}

