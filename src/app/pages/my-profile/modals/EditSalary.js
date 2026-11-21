import React from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, Formik } from 'formik';
import API from "../../../helpers/devApi"
import { swalError, swalSuccess } from "../../../helpers/swal";
import * as Yup from 'yup';
import * as Action from "../_redux/recruitementActions"
import { useDispatch } from "react-redux";

const SignupSchema = Yup.object().shape({
  current_salary: Yup.number()
    .required('Required'),
  current_salary_currency: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  expected_salary: Yup.number()
    .required('Required'),
  expected_salary_currency: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  notice_period: Yup.number().required('Required'),
});


const EditSalary = ({
  show,
  setShow,
  selectedData,
  setSelectedData,
  editId,
  salInit
}) => {
  const dispatch = useDispatch();
  const handleSubmit = async (values) => {
    for (var key in values) {
      if (key == 'expected_salary' || key == 'current_salary' || key == 'notice_period') {
        values[key] = values[key] ? parseInt(values[key]) : 0;
      }
    }
    if (editId == 0) {
      await API.post(`/hrms_additional_information`, values)
        .then((res) => {
          if (res?.data?.success) {
            swalSuccess(res?.data[0]);
            dispatch(Action.getAdditionalInfoByApplicants(salInit?.applicant_id));
            setShow(false);
          } else {
            swalError(res?.data?.message, " ");
          }
        })
        .catch((error) => {
          swalError("someting went wrong");
        });
    } else {
      await API.patch(`/hrms_additional_information/${editId}`, values)
        .then((res) => {
          if (res?.data?.success) {
            swalSuccess(res?.data[0]);
            dispatch(Action.getAdditionalInfoByApplicants(salInit?.applicant_id));
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
        setSelectedData(salInit)
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
                <Modal.Title>{editId > 0 ? "Edit" : "Add"} Additional information</Modal.Title>
              </Modal.Header>
              {/* {
                JSON.stringify(selectedData, null, 2)
              } */}
              <Modal.Body>
                <div className="row pt-5">
                  <div className="col-md-6 mb-3">
                    <label className="required"><b>Current monthly salary</b></label>
                    <Field name="current_salary" type="text" className="form-control" />
                    {errors.current_salary && touched.current_salary ? (
                      <div className="text-danger">{errors.current_salary}</div>
                    ) : null}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="required"><b>Current salary currency</b></label>
                    <Field name="current_salary_currency" type="text" className="form-control" />
                    {errors.current_salary_currency && touched.current_salary_currency ? (
                      <div className="text-danger">{errors.current_salary_currency}</div>
                    ) : null}
                  </div>
                </div>
                <div className="row pt-5">
                  <div className="col-md-6 mb-3">
                    <label className="required"><b>Expected monthly salary</b></label>
                    <Field name="expected_salary" type="text" className="form-control" />
                    {errors.expected_salary && touched.expected_salary ? (
                      <div className="text-danger">{errors.expected_salary}</div>
                    ) : null}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="required"><b>Expected salary currency</b></label>
                    <Field name="expected_salary_currency" type="text" className="form-control" />
                    {errors.expected_salary_currency && touched.expected_salary_currency ? (
                      <div className="text-danger">{errors.expected_salary_currency}</div>
                    ) : null}
                  </div>
                </div>
                <div className="row pt-5">
                  <div className="col-md-6 mb-3">
                    <label className="required"><b>Notice period</b></label>
                    <Field name="notice_period" type="text" className="form-control" />
                    {errors.notice_period && touched.notice_period ? (
                      <div className="text-danger">{errors.notice_period}</div>
                    ) : null}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><b>Extracurricular activities</b></label>
                    <Field name="extracurricular_activities" type="text" className="form-control" />
                    {errors.extracurricular_activities && touched.extracurricular_activities ? (
                      <div className="text-danger">{errors.extracurricular_activities}</div>
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
                    setSelectedData(salInit);
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

export default EditSalary;
