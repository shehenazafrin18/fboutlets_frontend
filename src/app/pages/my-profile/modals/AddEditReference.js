import React from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, Formik } from 'formik';
import API from "../../../helpers/devApi"
import { swalError, swalSuccess } from "../../../helpers/swal";
import * as Yup from 'yup';
import * as Action from "../_redux/recruitementActions"
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const AddEditReference = ({ show, setShow, selectedData, setSelectedData, editId, refInit, referenceInfo }) => {
    const dispatch = useDispatch();
    const ReferenceSchema = Yup.object().shape({
        name: Yup.string()
            .required('Required'),
        designation: Yup.string()
            .required('Required'),
        organisation: Yup.string()
            .required('Required'),
        address: Yup.string()
            .required('Required'),
        phone: Yup.string().max(11, 'Too Long!').nullable()
            .matches(/^[0-9]+$/, "Must be only digits")
            .required('Phone number is Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        relation: Yup.string()
            .min(5, 'Too Short!')
            .max(80, 'Too Long!')
            .required('Required'),
    });

    const relation_type = [
        {
            value: "Professional",
            label: "Professional",
        },
        {
            value: "Personal",
            label: "Personal", 
        },
        {
            value: "Academic",
            label: "Academic", 
        } 
    ];

    const handleSubmit = async (values) => {
        let refCount = referenceInfo?.length + 1;
        if (editId == 0) {
            await API.post(`/hrms_references`, values)
                .then((res) => {
                    if (res?.data?.success) {
                        dispatch(Action.getReferenceInfoByApplicants(refInit?.applicant_id));
                        if (refCount > 1) {
                            swalSuccess('Data updated successfully!!');
                            dispatch(Action.insertProfileScore(["References"]));
                        } else {
                            Swal.fire({
                                icon: "success",
                                title: 'Data saved successfully!!',
                                html: '<span class="text-danger font-weight-bolder">Please add one more references  to complete your profile!!!</span>',
                                showConfirmButton: false,
                                allowOutsideClick: false,
                                timer: 2500,
                            });
                        }
                        //dispatch(Action.getProfilePercentage());
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(refInit?.applicant_id));
                        }, "300");
                        setShow(false);
                        setSelectedData(refInit);
                    } else {
                        swalError(res?.data?.message, " ");
                    }
                })
                .catch((error) => {
                    swalError("someting went wrong");
                });
        } else {
            let refCount = referenceInfo?.length;
            await API.patch(`/hrms_references/${editId}`, values)
                .then((res) => {
                    if (res?.data?.success) {
                        dispatch(Action.getReferenceInfoByApplicants(refInit?.applicant_id));


                        if (refCount > 1) {
                            swalSuccess('Data updated successfully!!');
                            dispatch(Action.insertProfileScore(["References"]));
                        } else {
                            Swal.fire({
                                icon: "success",
                                title: 'Data saved successfully!!',
                                html: '<span class="text-danger font-weight-bolder">Please add one more references  to complete your profile!!!</span>',
                                showConfirmButton: false,
                                allowOutsideClick: false,
                                timer: 2500,
                            });
                        }
                        //dispatch(Action.getProfilePercentage());
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(refInit?.applicant_id));
                        }, "300");
                        setShow(false);
                        setSelectedData(refInit);
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
                setSelectedData(refInit)
            }}
        ><Formik
            initialValues={selectedData}
            validationSchema={ReferenceSchema}
            enableReinitialize={true}
            onSubmit={values => handleSubmit(values)}
        >
                {({ errors, touched }) => (
                    <>
                        <Form>
                            <Modal.Header>
                                <Modal.Title className='cover_letter_modal_view'>
                                    <h2>{editId > 0 ? "Edit" : "Add"} Reference</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShow(false);
                                            setSelectedData(refInit)
                                        }}
                                    >
                                        <i className="fas fa-times text-danger" style={{ fontSize: '26px' }}></i>
                                    </button>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Name</b></label>
                                        <Field
                                            name="name"
                                            placeholder="Name"
                                            className="form-control"
                                        />
                                        {errors.name && touched.name ? (
                                            <div className="text-danger">{errors.name}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Designation</b></label>
                                        <Field
                                            name="designation"
                                            placeholder="Designation"
                                            className="form-control"
                                        />
                                        {errors.designation && touched.designation ? (
                                            <div className="text-danger">{errors.designation}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Organisation</b></label>
                                        <Field
                                            name="organisation"
                                            placeholder="Organisation"
                                            className="form-control"
                                        />
                                        {errors.organisation && touched.organisation ? (
                                            <div className="text-danger">{errors.organisation}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Address</b></label>
                                        <Field
                                            name="address"
                                            placeholder="address"
                                            className="form-control"
                                        />
                                        {errors.address && touched.address ? (
                                            <div className="text-danger">{errors.address}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Phone</b></label>
                                        <Field
                                            name="phone"
                                            placeholder="Phone"
                                            className="form-control"
                                        />
                                        {errors.phone && touched.phone ? (
                                            <div className="text-danger">{errors.phone}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Email</b></label>
                                        <Field
                                            name="email"
                                            placeholder="Email"
                                            className="form-control"
                                        />
                                        {errors.email && touched.email ? (
                                            <div className="text-danger">{errors.email}</div>
                                        ) : null}

                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Relation</b></label>
                                        
                                        <Field as="select" name="relation" className="form-control">
                                            <option value='' disabled selected>Select</option>
                                            {relation_type?.map((col) => {
                                                return (
                                                    <>
                                                        <option value={col?.value}>{col?.label}</option>
                                                    </>
                                                )
                                            })}
                                        </Field> 
                                        {errors.relation && touched.relation ? (
                                            <div className="text-danger">{errors.relation}</div>
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
                                        setSelectedData(refInit)
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    className="btn btn-primary"
                                    type="submit"
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

export default AddEditReference;
