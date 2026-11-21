import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, Formik } from 'formik';
import API from "../../../helpers/devApi"
import { swalError, swalSuccess } from "../../../helpers/swal";
import * as Yup from 'yup';
import * as Action from "../_redux/recruitementActions";
import { useDispatch } from "react-redux";


const SignupSchema = Yup.object().shape({
    language: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    speaking: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    writing: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    reading: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
});

const levels = [
    {
        value: "Beginner",
        label: "Beginner ",
    },
    {
        value: "Intermediate",
        label: "Intermediate", 
    },
    {
        value: "Advanced",
        label: "Advanced", 
    },
    {
        value: "Native",
        label: "Native",
    }
];

const AddEditLanguage = ({ show, setShow, selectedData, setSelectedData, editId, langInit }) => {
    const dispatch = useDispatch();

    const handleSubmit = async (values) => {
        // alert(JSON.stringify(values, null, 2))
        // return false;
        if (editId == 0) {
            await API.post(`/hrms_language_proficiency`, values)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data saved successfully');
                        dispatch(Action.insertProfileScore(["Language"]));
                        //dispatch(Action.getProfilePercentage());
                        dispatch(Action.getLanguageInfoByApplicants(langInit?.applicant_id));
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(langInit?.applicant_id));
                        }, "300");
                        setShow(false);
                    } else {
                        swalError(res?.data?.message, " ");
                    }
                })
                .catch((error) => {
                    swalError("someting went wrong");
                });
        } else {
            await API.patch(`/hrms_language_proficiency/${editId}`, values)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data updated successfully');
                        dispatch(Action.insertProfileScore(["Language"]));
                        //dispatch(Action.getProfilePercentage());
                        dispatch(Action.getLanguageInfoByApplicants(langInit?.applicant_id));
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(langInit?.applicant_id));
                        }, "300");
                        setShow(false);
                    } else {
                        swalError(res?.data?.message, " ");
                    }
                })
                .catch((error) => {
                    swalError("someting went wrong");
                });
        }



    }

    return (
        <Modal
            show={show}
            size="lg"
            centered
            onHide={() => {
                setShow(false);
                setSelectedData(langInit)
            }}
        >
            <Formik
                initialValues={selectedData}
                validationSchema={SignupSchema}
                onSubmit={values => handleSubmit(values)}
            >
                {({ errors, touched }) => (
                    <>

                        <Form>
                            <Modal.Header>
                                <Modal.Title className='cover_letter_modal_view'>
                                    <h2>{editId > 0 ? "Edit" : "Add"} Language</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShow(false);
                                            setSelectedData(langInit)
                                        }}
                                    >
                                        <i className="fas fa-times text-danger" style={{ fontSize: '26px' }}></i>
                                    </button>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Language</b></label>
                                        <Field
                                            name="language"
                                            placeholder="Language"
                                            className="form-control"
                                        />
                                        {errors.language && touched.language ? (
                                            <div className="text-danger">{errors.language}</div>
                                        ) : null}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Writing</b></label>
                                        <Field as="select" name="writing" className="form-control">
                                            <option value='' disabled>Select</option>
                                            {levels?.map((col) => {
                                                return (
                                                    <>
                                                        <option value={col?.value}>{col?.label}</option>
                                                    </>
                                                )
                                            })}
                                        </Field> 
                                        {errors.writing && touched.writing ? (
                                            <div className="text-danger">{errors.writing}</div>
                                        ) : null}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Speaking</b></label>
                                        <Field as="select" name="speaking" className="form-control">
                                            <option value='' disabled>Select</option>
                                            {levels?.map((col) => {
                                                return (
                                                    <>
                                                        <option value={col?.value}>{col?.label}</option>
                                                    </>
                                                )
                                            })}
                                        </Field> 
                                        {errors.speaking && touched.speaking ? (
                                            <div className="text-danger">{errors.speaking}</div>
                                        ) : null}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Reading</b></label>
                                        <Field as="select" name="reading" className="form-control">
                                            <option value='' disabled>Select</option>
                                            {levels?.map((col) => {
                                                return (
                                                    <>
                                                        <option value={col?.value}>{col?.label}</option>
                                                    </>
                                                )
                                            })}
                                        </Field> 
                                        {errors.reading && touched.reading ? (
                                            <div className="text-danger">{errors.reading}</div>
                                        ) : null}
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={() => {
                                        setShow(false);
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Submit
                                </button>
                            </Modal.Footer>
                        </Form>
                    </>
                )}
            </Formik>
        </Modal>
    );
};

export default AddEditLanguage;
