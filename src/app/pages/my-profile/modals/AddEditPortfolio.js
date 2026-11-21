import React from "react";
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
        // .min(2, 'Too Short!')
        .max(255, 'Too Long!')
        .required('Required'),
    year: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .nullable()
        .required('Required'),
    place: Yup.string()
        // .min(2, 'Too Short!')
        .max(255, 'Too Long!')
        .required('Required'),
    author: Yup.string()
        // .min(2, 'Too Short!')
        .max(255, 'Too Long!')
        .required('Required'),
    url: Yup.string()
        .max(255, 'Too Long!')
        .required('Required'),
});


const AddEditPortfolio = ({ show, setShow, selectedData, setSelectedData, editId, portInit }) => {
    const dispatch = useDispatch();

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
        const data = { "title": "Web Development", "year": "2011", "place": "Rajshahi, Bangladesh", "author": "Nazmul Shakib", "url": "www.innovatpark.com", "applicant_id": 4 }

        if (editId == 0) {
            await API.post(`/hrms_portfolio`, formdata)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data saved successfully');
                        dispatch(Action.insertProfileScore(["Portfolio"]));
                        //dispatch(Action.getProfilePercentage());
                        dispatch(Action.getPortfolioInfoByApplicants(portInit?.applicant_id));
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(portInit?.applicant_id));
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
            await API.patch(`/hrms_portfolio/${editId}`, formdata)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data updated successfully');
                        dispatch(Action.insertProfileScore(["Portfolio"]));
                        //dispatch(Action.getProfilePercentage());
                        dispatch(Action.getPortfolioInfoByApplicants(portInit?.applicant_id));
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(portInit?.applicant_id));
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

    const yearListOption = year?.map(function (item) {
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
                setSelectedData(portInit)
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
                                    <h2>{editId > 0 ? "Edit" : "Add"} Portfolio</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShow(false);
                                            setSelectedData(portInit)
                                        }}
                                    >
                                        <i className="fas fa-times text-danger" style={{ fontSize: '26px' }}></i>
                                    </button>
                                </Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label className="required"><b>Portfolio title</b></label>
                                        <Field
                                            name="title"
                                            placeholder="Portfolio title"
                                            className="form-control"
                                            maxLength="255"
                                        />
                                        {errors.title && touched.title ? (
                                            <div className="text-danger">{errors.title}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b> Year</b></label>
                                        <Select
                                            options={yearListOption}
                                            placeholder="Select Year"
                                            value={yearListOption.find(option => option.value == values?.year)}
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
                                        <label className="required"><b>Institute/place</b></label>
                                        <Field
                                            name="place"
                                            placeholder="Institute/place"
                                            className="form-control"
                                            maxLength="255"
                                        />
                                        {errors.place && touched.place ? (
                                            <div className="text-danger">{errors.place}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Author</b></label>
                                        <Field
                                            name="author"
                                            placeholder="Author"
                                            className="form-control"
                                            maxLength="255"
                                        />
                                        {errors.author && touched.author ? (
                                            <div className="text-danger">{errors.author}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>URL</b></label>
                                        <Field
                                            name="url"
                                            placeholder="URL"
                                            className="form-control"
                                            maxLength="255"
                                        />
                                        {errors.url && touched.url ? (
                                            <div className="text-danger">{errors.url}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Document Upload:</b></label>
                                        <input
                                            name="document"
                                            type="file"
                                            className="form-control"
                                            onChange={(event) => {
                                                setFieldValue("document", event.target.files[0]);
                                            }}
                                        />
                                        {
                                            selectedData.document && values.document === selectedData.document && (
                                                <a href={DOC_CONTAINER + selectedData?.document + DOC_TOKEN} target="_blank" rel="noopener noreferrer">
                                                    {selectedData?.document}
                                                </a>
                                            )
                                        }
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={() => {
                                        setShow(false);
                                        setSelectedData(portInit)
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

export default AddEditPortfolio;
