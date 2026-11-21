import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { SelectInput } from "../../../../_metronic/_partials/controls";
import { Field, Form, Formik } from 'formik';
import API from "../../../helpers/devApi"
import { swalError, swalSuccess } from "../../../helpers/swal";
import * as Yup from 'yup';
import * as Action from "../_redux/recruitementActions";
import { useDispatch } from "react-redux";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  phone: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  relation: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});
const AddEditRelatives = ({ show, setShow, selectedData, setSelectedData, editId, rltvInit }) => {

  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    // return false;
    if (editId == 0) {
      await API.post(`/hrms_applicant_relative_information`, values)
        .then((res) => {
          if (res?.data?.success) {
            swalSuccess('Data saved successfully');
            dispatch(Action.insertProfileScore(["Relatives"]));
            //dispatch(Action.getProfilePercentage());
            dispatch(Action.getRelativesInfoByApplicants(rltvInit?.hrms_applicant_id))
            setShow(false);
          } else {
            swalError(res?.data?.message, " ");
          }
        })
        .catch((error) => {
          swalError("someting went wrong");
        });
    } else {
      await API.patch(`/hrms_applicant_relative_information/${editId}`, values)
        .then((res) => {
          if (res?.data?.success) {
            swalSuccess('Data updated successfully');
            dispatch(Action.insertProfileScore(["Relatives"]));
            //dispatch(Action.getProfilePercentage());
            dispatch(Action.getRelativesInfoByApplicants(rltvInit?.hrms_applicant_id))
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
        setSelectedData(rltvInit)
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
              <Modal.Header closeButton>
                <Modal.Title> {editId > 0 ? "Edit" : "Add"} Relatives</Modal.Title>
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
                    <label className="required"><b>Phone Number</b></label>
                    <Field
                      // type="number"
                      name="phone"
                      placeholder="Phone Number"
                      className="form-control"
                    />
                    {errors.phone && touched.phone ? (
                      <div className="text-danger">{errors.phone}</div>
                    ) : null}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="required"><b>Relation</b></label>
                    <Field
                      name="relation"
                      placeholder="Relation"
                      className="form-control"
                    />
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
                    setSelectedData(rltvInit)
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

export default AddEditRelatives;
