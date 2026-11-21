import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, Formik } from 'formik';
import API from "../../../helpers/devApi"
import { swalError, swalSuccess } from "../../../helpers/swal";
import * as Yup from 'yup';
import moment from "moment";
import * as Action from "../_redux/recruitementActions"
import { useDispatch } from "react-redux";
import Select from "react-select";

const SignupSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, 'Too Short!')
        .required('Required'),
    year: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    organisations: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    authors: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    url: Yup.string()
        .required('Required'),
});


const AddEditPublication = ({ show, setShow, selectedData, setSelectedData, editId, pubInit }) => {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentYear = moment().format("YYYY");
    const year = [];
    for (let i = currentYear; i >= 1800; i--) {
        let obj = {
            value: i,
            label: i,
        };
        year.push(obj);
    }
    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        var formdata = new FormData();
        for (let k in values) {
            if (values[k]) {
                if (k == 'applicant_id') {
                    formdata.append(k, parseInt(values[k]))
                } else {
                    formdata.append(k, values[k])
                }

            }
        }
        if (editId == 0) {
            await API.post(`/hrms_publication`, formdata)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data saved successfully!!');
                        dispatch(Action.insertProfileScore(["Publication"]));
                        //dispatch(Action.getProfilePercentage());
                        dispatch(Action.getPublicationInfoByApplicants(pubInit?.applicant_id));
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(pubInit?.applicant_id));
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
            await API.patch(`/hrms_publication/${editId}`, formdata)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data updated successfully!!');
                        dispatch(Action.insertProfileScore(["Publication"]));
                        //dispatch(Action.getProfilePercentage());
                        dispatch(Action.getPublicationInfoByApplicants(pubInit?.applicant_id));
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(pubInit?.applicant_id));
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

        setIsSubmitting(false);
    }

    const yearOption = year?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });

    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

    return (
        <Modal
            show={show}
            size="lg"
            centered
            onHide={() => {
                setShow(false);
                setSelectedData(pubInit)
            }}
        >
            <Formik
                initialValues={selectedData}
                validationSchema={SignupSchema}
                onSubmit={values => handleSubmit(values)}
            >
                {({ errors, touched, setFieldValue, values }) => (
                    <>

                        <Form>
                            <Modal.Header>
                                <Modal.Title className='cover_letter_modal_view'>
                                    <h2>{editId > 0 ? "Edit" : "Add"} Publication</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShow(false);
                                            setSelectedData(pubInit)
                                        }}
                                    >
                                        <i className="fas fa-times text-danger" style={{ fontSize: '26px' }}></i>
                                    </button>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label className="required"><b>Publication title</b></label>
                                        <Field
                                            name="title"
                                            placeholder="Publication title"
                                            className="form-control"
                                        />
                                        {errors.title && touched.title ? (
                                            <div className="text-danger">{errors.title}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b> Year</b></label>
                                        <Select
                                            options={yearOption}
                                            placeholder="Select Year"
                                            defaultValue={yearOption.find(option => option.value == values?.year)}
                                            onChange={(option) => {
                                                setFieldValue("year", option ? option.value.toString() : null);
                                            }}
                                            isClearable={true}
                                        />
                                        {errors.year && touched.year ? (
                                            <div className="text-danger">{errors.year}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Institute/Organisations</b></label>
                                        <Field
                                            name="organisations"
                                            placeholder="Institute/Organisations"
                                            className="form-control"
                                        />
                                        {errors.organisations && touched.organisations ? (
                                            <div className="text-danger">{errors.organisations}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Authors</b></label>
                                        <Field
                                            name="authors"
                                            placeholder="Authors"
                                            className="form-control"
                                        />
                                        {errors.authors && touched.authors ? (
                                            <div className="text-danger">{errors.authors}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Journal Link</b></label>
                                        <Field
                                            name="url"
                                            placeholder="URL"
                                            className="form-control"
                                        />
                                        {errors.url && touched.url ? (
                                            <div className="text-danger">{errors.url}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className=""><b>Document:</b></label>
                                        <input
                                            name="document"
                                            type="file"
                                            className="form-control"
                                            onChange={(event) => {
                                                setFieldValue("document", event.target.files[0]);
                                            }}
                                        />
                                        {
                                            !values.document && selectedData?.documents && (
                                                <a href={DOC_CONTAINER + selectedData?.documents + DOC_TOKEN} target="_blank" rel="noopener noreferrer">{selectedData?.documents}</a>
                                            )
                                        }
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className=""><b>Citation</b></label>
                                        <textarea
                                            value={values.citation}
                                            className='textarea-form-control'
                                            rows={2}
                                            placeholder={""}
                                            onChange={(e) => {
                                                setFieldValue('citation', e.target.value);
                                            }}
                                        />
                                    </div>

                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={() => {
                                        setShow(false);
                                        setSelectedData(pubInit)
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
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

export default AddEditPublication;
