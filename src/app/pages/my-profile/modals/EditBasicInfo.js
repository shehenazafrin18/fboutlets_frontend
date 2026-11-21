import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, Formik } from 'formik';
import API from "../../../helpers/devApi"
import { swalError, swalSuccess } from "../../../helpers/swal";
import * as Yup from 'yup';


const SignupSchema = Yup.object().shape({
  institute: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  certification_id: Yup.number().required('Required'),
  status: Yup.string().required('Required'),
  from_date: Yup.date().required('Required'),
  to_date: Yup.date().required('Required'),
  valid_till: Yup.date().required('Required'),
});


const EditBasicInfo = ({ show, setShow, selectedData, setSelectedData, getBasicInfo, profId }) => {


  const handleSubmit = async (values) => {

    for (var key in values) {
      if (key == 'certification_id') {
        values[key] = values[key] ? parseInt(values[key]) : 0;
      }
    }
    await API.patch(`/hrms_applicant/${profId}`, values)
      .then((res) => {
        if (res?.data?.success) {
          swalSuccess(res?.data[0]);
          getBasicInfo();

          setShow(false);
        } else {
          swalError(res?.data?.message, " ");
        }
      })
      .catch((error) => {
        swalError("someting went wrong");
      });
  }


  return (
    <Modal
      show={show}
      size="lg"
      centered
      onHide={() => {
        setShow(false);
      }}
    > <Formik
      initialValues={selectedData}
      validationSchema={SignupSchema}
      onSubmit={values => handleSubmit(values)}
    >
        {({ errors, touched }) => (
          <>

            <Form>
              <Modal.Header closeButton>
                <Modal.Title>Edit Basic Information</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <div className="row pt-5">
                  <div className="col-md-6 mb-3">
                    <label className="required"><b>Certification</b></label>
                    <Field as="select" name="certification_id" className="form-control" >
                      <option value="">Select Certification</option>

                    </Field>
                    {errors.certification_id && touched.certification_id ? (
                      <div className="text-danger">{errors.certification_id}</div>
                    ) : null}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="required"><b>Institution Name</b></label>
                    <Field name="institute" type="text" className="form-control" />
                    {errors.institute && touched.institute ? (
                      <div className="text-danger">{errors.institute}</div>
                    ) : null}
                  </div>
                </div>
                <div className="row  pt-5">
                  <div className="col-md-6 mb-3">
                    <label className="required"><b>From date</b></label>
                    <Field name="from_date" type="date" className="form-control" />
                    {errors.from_date && touched.from_date ? (
                      <div className="text-danger">{errors.from_date}</div>
                    ) : null}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="required"><b>To date</b></label>
                    <Field name="to_date" type="date" className="form-control" />
                    {errors.to_date && touched.to_date ? (
                      <div className="text-danger">{errors.to_date}</div>
                    ) : null}
                  </div>
                </div>
                <div className="row  pt-5">

                  <div className="col-md-6 mb-3">
                    <label className="required"><b>Status</b></label>
                    <Field as="select" name="status" type="date" className="form-control" >
                      <option value={'Enrolled'}>Enrolled</option>
                      <option value={'Awarded'}>Awarded</option>
                      <option value={'In Progress'}>In Progress</option>
                    </Field>
                    {errors.valid_tstatusill && touched.status ? (
                      <div className="text-danger">{errors.status}</div>
                    ) : null}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="required"><b>Valid date</b></label>
                    <Field name="valid_till" type="date" className="form-control" />
                    {errors.valid_till && touched.valid_till ? (
                      <div className="text-danger">{errors.valid_till}</div>
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

    </Modal >
  );
};

export default EditBasicInfo;
