import React, { useState, useEffect } from 'react'
import { Footer, Header } from '../../../layout'
import { HeaderMobile } from '../../../_metronic/layout/components/header-mobile/HeaderMobile'
import { ErrorMessage, Form, Formik } from 'formik';
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import * as jobAction from "../../_redux/jobActions";
import * as Action from "../../../app/pages/my-profile/_redux/recruitementActions";
import * as Yup from 'yup';
import API from "../../helpers/devApi";
import { swalError, swalSuccess } from "../../helpers/swal";
import ApplyModal from './ApplyModal';
import { Radio } from "antd";

export default function AssessmentPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const intData = {
        list: [
            {
                question_id: null,
                jd_id: null,
                question: "",
                answer: ""
            }
        ]
    }
    const [qstnList, setQstnList] = useState(intData);
    const [show, setShow] = useState(false);
    const [totalMarks, setTotalMarks] = useState(0);

    const { user, assessmentQstn, jobDetails, profileMatched,additionalInfo } = useSelector((state) => ({
        user: state.auth.user,
        assessmentQstn: state.job.assessmentQstn,
        jobDetails: state.job.jobDetails,
        profileMatched: state.recruitement.profileMatched,
        additionalInfo: state.recruitement.additionalInfo,
    }));
    useEffect(() => {
        dispatch(jobAction.fetchJobDetailsById(user?.length !== 0 ? true : false, id));
        if (user?.data?.applicant_id) {
            dispatch(Action.getAdditionalInfoByApplicants(user?.data?.applicant_id));
            dispatch(Action.applicantJobProfilePercentage({
                job_id: parseInt(id),
                applicant_id: parseInt(user?.data?.applicant_id),
            }));
        }
    }, [dispatch, user, id]);

    useEffect(() => {
        if (jobDetails && jobDetails?.requisition_id) {
            dispatch(jobAction.getApplicantAssessmentQstn(jobDetails?.requisition_id));
        }
    }, [dispatch, jobDetails]);



    useEffect(() => {
        let qstnArr = [];

        if (assessmentQstn) {

            qstnArr = assessmentQstn && assessmentQstn.hrms_jd_assesment_question && assessmentQstn.hrms_jd_assesment_question.rows?.map((val, key) => {
                return (
                    {
                        id: val?.id,
                        jd_id: jobDetails?.jd_id,
                        question: val?.question,
                        marks: val?.marks,
                        image: val?.image,
                        input_answer_id: val?.input_answer_id,
                        list: val?.hrms_jd_assesment_question_answer,
                        is_correct: val.is_correct ? val.is_correct : 0
                    }
                )
            });
        }
        setQstnList(qstnArr);
    }, [assessmentQstn]);



    const FormSchema = Yup.array().of(
        Yup.object().shape({
            input_answer_id: Yup.string().nullable().required('Please select answer'),
        })
    );


    const handleSubmit = async (values) => {
        let formData = [];
        for (let k in values) {
            formData[k] = {
                hrms_jd_assesment_question_id: values[k].id,
                hrms_job_description_id: values[k].jd_id,
                hrms_applicant_id: user?.data?.applicant_id,
                hrms_jd_assesment_question_answer_id: values[k].input_answer_id,
                // is_correct: values[k].is_correct,
            }
        }

        const sumOfMarks = values.filter((item => item.is_correct === 1)).reduce((total, current) => total + current.marks, 0);
        setTotalMarks(sumOfMarks);

        await API.post('hrms_applicant_jd_assesment_answer/updateAnswerInput', formData).then((res) => {
            if (res.data?.success) {
                swalSuccess(res?.data?.data);
                dispatch(Action.applicantJobProfilePercentage({
                    job_id: parseInt(id),
                    applicant_id: parseInt(user?.data?.applicant_id),
                }));
                setTimeout(() => {
                    setShow(true);
                }, 3000);
            } else {
                swalError(res?.data?.message)
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

    return (
        <>
            <Header />

            <HeaderMobile />

            <div className="assessment-page">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb bg-transparent">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item"><Link to="/available-jobs">Available Jobs</Link></li>
                                    <li className="breadcrumb-item"> <Link to={`/jobs-details/${id}`}>Job Details</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Assessment MCQ</li>
                                </ol>
                            </nav>
                        </div>

                        <div className="col-md-12 title_heading_col">
                            <h2> Assessment Question </h2>
                        </div>
                    </div>

                    <div className='card main_card_body'>
                        <div className="row">
                            <div className='col-md-12 give_answer_title'>
                                <h4>Give answer to the given questions. </h4>
                                <hr />
                            </div>
                        </div>

                        <Formik
                            initialValues={qstnList}
                            validationSchema={FormSchema}
                            onSubmit={values => {
                                handleSubmit(values)
                            }}
                            enableReinitialize
                        >
                            {({ handleSubmit, errors, values, setFieldValue, touched }) => (
                                <>
                                    <Form>
                                        <div className="row">
                                            {
                                                values && values.length > 0 && values.map((va, k) => {
                                                    let serialNumber = k + 1;
                                                    return (
                                                        <>
                                                            <div className='col-md-6 question_col' key={k}>
                                                                <h4>{serialNumber}. {va?.question}</h4>
                                                                {va?.image && (
                                                                    <>
                                                                        <img src={DOC_CONTAINER + va?.image + DOC_TOKEN} alt={va?.question} width={150} className='w-50 mb-4' />
                                                                    </>
                                                                )}
                                                                {/* {va?.list?.map((col, key) => {
                                                                    return (
                                                                        <div key={key}>
                                                                            <div className="mb-3">

                                                                                <input
                                                                                    type="radio"
                                                                                    className="ml-4"
                                                                                    value={col?.id}
                                                                                    onChange={(e) => {
                                                                                        setFieldValue(`${k}.input_answer_id`, e.target.value);
                                                                                        setFieldValue(`${k}.is_correct`, col?.is_correct)
                                                                                    }}
                                                                                    checked={parseInt(va?.input_answer_id) === parseInt(col?.id) ? true : false}
                                                                                />

                                                                                <label className="q_label">{col?.answer}</label>

                                                                            </div>

                                                                        </div>
                                                                    )
                                                                })} */}
                                                                <div>
                                                                    <Radio.Group 
                                                                        onChange={(event) => {
                                                                            setFieldValue(`${k}.input_answer_id`, event.target.value);
                                                                            // setFieldValue(`${k}.is_correct`, col?.is_correct);
                                                                        }}
                                                                    >
                                                                        {
                                                                            va?.list?.map((col, key) => {
                                                                                return (
                                                                                    <div key={key}>
                                                                                        <div className="mb-3">
                                                                                            <Radio value={col?.id}>{col?.answer}</Radio>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })
                                                                        }
                                                                    </Radio.Group>
                                                                </div>
                                                                <div className="text-danger">
                                                                    <ErrorMessage name={`${k}.input_answer_id`} />
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                })
                                            }
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <div className='card_footer_btn'>
                                                    <div className='btn_groups'>

                                                        <Link to={`/jobs-details/${id}`} className="cancel_later_btn">Cancel</Link>

                                                        <button type='submit' className="apply_now_btn">Submit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                </>
                            )}
                        </Formik>

                    </div>

                </div>
            </div>

            <ApplyModal
                show={show}
                setShow={setShow}
                selectedData={jobDetails}
                selectedJobId={id}
                totalMarks={totalMarks}
                profileMatched={profileMatched}
                additionalInfo={additionalInfo}
            />

            <Footer />
        </>
    )
}