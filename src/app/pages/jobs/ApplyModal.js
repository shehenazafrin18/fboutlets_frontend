import React from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, Formik, } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from "react-redux";
import * as jobAction from "../../_redux/jobActions"
import { useHistory } from 'react-router-dom';
import { swalError, swalWarning } from "../../helpers/swal";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Progress } from "antd";
import { formatCurrency } from "../../helpers/common";
const ApplyModal = ({
    show,
    setShow,
    selectedData, selectedJobId, totalMarks, profileMatched, additionalInfo
}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { user } = useSelector((state) => state.auth);

    const initialValues = {
        "expected_salary": additionalInfo && additionalInfo[0] ? additionalInfo[0].expected_salary : null,
        "cover_letter": '',
        "statement_flag": 0,
    }

    const FormSchema = Yup.object().shape({
        expected_salary: Yup.number().required('Required'),
    });


    const handleSubmit = async (values) => {
        // let flag = 0;
        // if (selectedData?.salary == "salary_range") {
        //     if (parseInt(values?.expected_salary) >= selectedData.min_salary && parseInt(values?.expected_salary) <= selectedData?.max_salary) {
        //         flag = 1;
        //     }
        // } else if (selectedData?.salary == "fixed") {
        //     if (parseInt(values?.expected_salary) === parseInt(selectedData.fixed_salary)) {
        //         flag = 1;
        //     }
        // } else {
        //     flag = 1;
        // }

        // if (flag === 1) {
        const param = {
            "job_id": parseInt(selectedJobId),
            "applicant_id": user?.data?.applicant_id,
            "expected_salary": parseInt(values?.expected_salary),
            "assessments_marks": totalMarks,
            "cover_letter": values.cover_letter,
            "statement_flag": values.statement_flag,
        }
        await dispatch(jobAction.applyToJob(param));
        await dispatch(jobAction.fetchJobDetailsById(user?.length != 0 ? true : false, selectedJobId));
        history.push(`/jobs-details/${selectedJobId}`);
        setShow(false);
        // } else {
        //     swalWarning("Expected salary must be in the recommended range!!!");
        // }
    }

    return (
        <>
            <Modal
                show={show}
                onHide={() => { setShow(false) }}
                size="lg"
                aria-labelledby="example-modal-sizes-title-lg"
                centered
                backdrop="static"
                className="modal_for_apply_jobs"
            >
                <Formik
                    initialValues={initialValues}
                    validationSchema={FormSchema}
                    onSubmit={values => handleSubmit(values)}
                    enableReinitialize
                >
                    {({ handleSubmit, errors, values, setFieldValue, touched }) => (
                        <>
                            <Form>
                                <Modal.Header>
                                    <Modal.Title>Please enter expected salary to apply AS {selectedData?.job_title}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body >
                                    <div className='row mb-5 mt-4'>

                                        <div className='col-8'>
                                            <div className='modal_d_flex'>
                                                <div className='label_div'>Job Code</div>
                                                <div className='item_div'>:&nbsp;{selectedData?.job_code}</div>
                                            </div>
                                            <div className='modal_d_flex'>
                                                <div className='label_div'>Job Type</div>
                                                <div className='item_div'>:&nbsp;{selectedData?.position_status}</div>
                                            </div>
                                            <div className='modal_d_flex'>
                                                <div className='label_div'>Salary Type </div>
                                                <div className='item_div'>:&nbsp; {selectedData?.salary == "salary_range" ? "Salary Range" : selectedData?.salary == "fixed" ? "Fixed" : selectedData?.salary}</div>
                                            </div>
                                            <div className='modal_d_flex'>
                                                <div className='label_div'>Salary </div>
                                                <div className='item_div text-primary'> : &nbsp;
                                                    {
                                                        selectedData?.salary == "salary_range" ?
                                                            `: ${formatCurrency(selectedData.min_salary)} - ${formatCurrency(selectedData.max_salary)}`
                                                            : selectedData?.salary == "fixed" ? formatCurrency(selectedData?.fixed_salary)
                                                                : selectedData?.salary}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className='progress_box'>
                                                <Progress
                                                    type="circle"
                                                    percent={parseInt(profileMatched)}
                                                    format={(percent) => (
                                                        <>
                                                            <span className='d-block' style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                                <p className="text-dark">Matched</p>
                                                                {`${percent}%`}
                                                            </span>
                                                        </>
                                                    )}
                                                />


                                            </div>
                                        </div>
                                        {/* <div className='col-6'>
                                            <div className='modal_d_flex'>
                                                <div className='label_div'>Salary Type </div>
                                                <div className='item_div'>:&nbsp; {selectedData?.salary == "salary_range" ? "Salary Range" : selectedData?.salary == "fixed" ? "Fixed" : selectedData?.salary}</div>
                                            </div>
                                            <div className='modal_d_flex'>
                                                <div className='label_div'>Salary </div>
                                                <div className='item_div text-primary'> : &nbsp;
                                                    {
                                                        selectedData?.salary == "salary_range" ?
                                                            `: ${selectedData.min_salary} - ${selectedData.max_salary} BDT`
                                                            : selectedData?.salary == "fixed" ? selectedData?.fixed_salary
                                                                : selectedData?.salary}
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                    {/* <div className='form_card'>
                                        <div className="mb-4">
                                            <label htmlFor="one" className="form-label">How many years have you taught?</label>
                                            <select className="form-select form-control" aria-label="one">
                                                <option selected
                                                // onChange={(e) => {
                                                // setFieldValue(`${k}.input_answer_id`, e.target.value);
                                                // setFieldValue(`${k}.is_correct`, col?.is_correct)
                                                // }}
                                                >Choose a number</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="two" className="form-label">What's the extent of your research?</label>
                                            <select className="form-select form-control" aria-label="two">
                                                <option selected>Select an extent from list</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="two" className="form-label">How long have you been in software development?</label>
                                            <select className="form-select form-control" aria-label="two">
                                                <option selected>Choose a number</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </div>

                                    </div> */}
                                    <div className='row mb-5 mt-4'>

                                        <div className="col-md-6 mb-4">
                                            <label htmlFor="Salary" className="form-label text-primary">Expected Salary (in BDT)</label>
                                            <input type="number"
                                                className="form-control"
                                                name="expected_salary"
                                                placeholder="Enter your expected salary"
                                                value={values.expected_salary}
                                                onChange={(e) => {
                                                    setFieldValue(`expected_salary`, e.target.value);
                                                }}
                                            />
                                            {errors.expected_salary && touched.expected_salary ? (
                                                <div className="text-danger">
                                                    Expected salary is required
                                                </div>
                                            ) : null}
                                        </div>


                                        <div className="col-md-12 mb-4 cover_letter_editor">
                                            <label htmlFor="cover_letter" className="form-label text-primary">Cover Letter</label>

                                            <ReactQuill
                                                theme="snow"
                                                value={values.cover_letter}
                                                onChange={(val) => {
                                                    setFieldValue(`cover_letter`, val);
                                                }} />
                                        </div>

                                        <div className="col-md-12 mb-4">
                                            <label htmlFor="declaration" className="form-label text-primary">
                                                <Field
                                                    type="checkbox"
                                                    id="declaration"
                                                    checked={values.statement_flag ? true : false}
                                                    name="statement_flag"
                                                    onChange={(e) => {
                                                        setFieldValue(`statement_flag`, values.statement_flag ? 0 : 1);
                                                    }} />
                                                <span className="ml-2"> Declaration Statement</span>
                                            </label>

                                            {/* {errors.statement_flag && touched.statement_flag ? (
                                                <div className="text-danger">
                                                    Declaration Statement is required
                                                </div>
                                            ) : null} */}

                                        </div>
                                    </div>

                                    <div className='modal_footer_apply_jobs'>
                                        <button className="btn close_btn" type="button"
                                            onClick={() => { setShow(false) }}>
                                            Close
                                        </button>
                                        <button type="submit" disabled={values.statement_flag == 0} className="btn btn-primary"> Confirm Application</button>
                                    </div>
                                </Modal.Body>
                                {/* <Modal.Footer>
                                    <button
                                        type="button"
                                        onClick={() => { setShow(false) }}
                                        className="btn btn-light btn-elevate"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Submit
                                    </button>
                                </Modal.Footer> */}
                            </Form>
                        </>
                    )}
                </Formik>
            </Modal>
        </>
    );
}
export default ApplyModal;