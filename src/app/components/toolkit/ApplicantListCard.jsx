import React, { useEffect, useState } from 'react'
import { Progress } from 'antd';
import moment from 'moment';
import { Link, useHistory } from "react-router-dom"
import { Modal } from 'react-bootstrap';
import { swalError, swalSuccess } from '../../helpers/swal';
import API from "../../helpers/devApi";
import { useDispatch } from 'react-redux';
import * as hractions from "../../pages/hr-admin/_redux/hrActions"
import { formatCurrency } from '../../helpers/common';

export const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    let end;
    if (endDate) {
        end = new Date(endDate);
    } else {
        end = new Date(); // Current date
    }

    const duration = Math.abs(end - start);
    const years = Math.floor(duration / (365 * 24 * 60 * 60 * 1000));
    const months = Math.floor((duration % (365 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000));
    // const days = Math.floor((duration % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)); 
    return `${years} years, ${months} months`; // , ${days} days
};

export default function ApplicantListCard({
    indexKey,
    profileImage,
    applicantName,
    applicantContactNumber,
    expectedSalary,
    address,
    applied,
    AppliedDate,
    matched,
    age,
    profileLink,
    coverLetter,
    jobTypeOne,
    assessmentScore,

    applicationStatus,
    experienceInfo,
    educationInfo,
    trainingInfo,
    totalExperience,
    applicantId,
    jobId,
    requisitionId,
    applicationType,
    ap_status,
    remarks,
    comments,
    module,
    jobApplicationId,
    perPage,
    page,
    comment,
    fetchApplicantsAction
}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [showComment, setShowComment] = useState(false);

    const formattedAppliedDateDate = moment(AppliedDate).format('MMMM Do, YYYY');
    const ageData = moment().diff(age, 'years');

    const [skillsData, setSkillsData] = useState('');
    const [commentData, setCommentData] = useState(comment);
    const [savedComment, setSavedComment] = useState(comment);

    useEffect(() => {
        if (trainingInfo) {
            const skillsArrays = trainingInfo.map((item) => {
                const skillArr = item?.skill && item?.skill?.length > 0 && JSON.parse(item.skill);
                const commaSeparatedSkill = skillArr?.join(", ");
                return commaSeparatedSkill;
            });
            const concatenatedSkills = skillsArrays.join(", ");
            setSkillsData(concatenatedSkills);
        }
    }, [trainingInfo]);


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    const sendForShortlisted = async (type, status) => {
        const params = {
            ids: [jobApplicationId],//applicantId
            job_id: jobId ? parseInt(jobId) : null,
            requisition_id: null,
            type: type,
            status: status,
            remarks: remarks,
        }
        const response = await API.post('hrms_recruitment_requisition/updateStatusByTytpeNId', params);

        if (response?.data?.success) {
            swalSuccess(`successfully ${type == "applicant_shortlisted" ? "Longlisted" : status == "Pending" ? "withdrawn from longlisted" : status}`);
            if (type == "applicant_shortlisted") {
                history.push(`/hr-admin/shortlisted-applicant-list`)
            }
            if (status === "Pending") {
                history.push(`/hr-admin/applicant-list/${jobId}`)
                // await dispatch(hractions.getShortlistedApplicantList({
                //     size: perPage,
                //     page: page
                // }, { status: 'Initial Shortlisted', }));
            } else if (status === "Rejected") {
                dispatch(fetchApplicantsAction);
            }
        } else {
            swalError(response?.data?.message, 'Action Failed ');
        }
    };

    const handleInputChangeComment = (event) => {
        setCommentData(event.target.value);
    };

    const handleSubmitComment = async () => {
        const response = await API.patch(`hrms_job_application/${jobApplicationId}`, { comment: commentData });

        if (response?.data?.success) {
            swalSuccess('Comments successfully Added');
            setShowComment(false);
            setSavedComment(commentData);
        } else {
            swalError(response?.data?.message, 'Action Failed ');
        }

    };

    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;
    return (
        <div className='applicant_card mt-5'>
            <div className='row'>
                <div className='col-md-5'>
                    <div className='profile_card'>
                        <div className='image_box'>
                            {profileImage && (
                                <img
                                    className='w-50 rounded'
                                    src={DOC_CONTAINER + profileImage + DOC_TOKEN}
                                    alt={applicantName}
                                />
                            )}

                            <p className='date'><i className="fas fa-calendar-alt"></i> {formattedAppliedDateDate}</p>
                            <p className='age'>
                                {ageData ? (
                                    <>
                                        Age: {ageData}
                                    </>
                                ) : (
                                    ''
                                )}

                            </p>
                            <p className='expected'>
                                {expectedSalary ? (
                                    <>
                                        {/* Expected Salary: <br /><span> ৳ {expectedSalary} </span> */}
                                        Expected Salary: <br /><span> {formatCurrency(expectedSalary)} </span>
                                    </>
                                ) : (
                                    ''
                                )}
                            </p>
                        </div>
                        <div className='info_box'>
                            <h2 className='name'>{applicantName}</h2>
                            <p>
                                <i className="fas fa-business-time pr-3"></i>
                                {applicantContactNumber}
                                <i className="fas fa-phone px-3"></i>
                                <i className="fas fa-comment-dots"></i>
                            </p>
                            <p style={{ whiteSpace: 'wrap' }}>
                                {address && (
                                    <> <i className="fas fa-map-marker-alt pr-3"></i>
                                        {address}
                                    </>
                                )}
                            </p>
                            <p>
                                <i className="fas fa-clock pr-3"></i>

                                Applied {applied} times
                            </p>
                            <div className='progress_box'>
                                <Progress
                                    type="circle"
                                    percent={parseInt(matched)}
                                    format={(percent) => (
                                        <>
                                            <span className='d-block' style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                {`${percent}%`}
                                            </span>
                                        </>
                                    )}
                                />
                                <p>Matched</p>
                            </div>

                            {profileLink && (
                                <div className='profile_resume'>
                                    <div className='icon'>
                                        <i className="far fa-file-pdf fa-2x"></i>
                                    </div>
                                    <div>
                                        <p className='profile'>
                                            <Link to={`/hr-admin/short-resume/${profileLink}`}
                                                target="_blank" rel="noopener noreferrer"
                                            >
                                                Resume
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {coverLetter && (
                                <div className='profile_resume'>
                                    <div className='icon'>
                                        <i className="far fa-envelope-open fa-2x"></i>
                                    </div>
                                    <div>
                                        <p className='profile'>
                                            <button
                                                className='btn btn-link p-0'
                                                onClick={handleShow}
                                                style={{ fontSize: '16px' }}
                                            >
                                                Cover Letter
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                <div className='col-md-7'>
                    <div className='information_card'>
                        <div className='info_box_div'>
                            <div style={{ maxWidth: "55% !important" }}>
                                {educationInfo && educationInfo?.map((val, i) => (
                                    <div key={i}>
                                        <h3>{val.hrms_education_level.name}</h3>
                                        {/* <p>{val.hrms_institute.name}</p> */}
                                        {val.institute_name && (
                                            <p>{val.institute_name}</p>
                                        )}

                                        {val.start_date && (
                                            <p>
                                                <i className="fas fa-business-time pr-3"></i>
                                                Duration : {calculateDuration(val.start_date, val.end_date)}
                                            </p>
                                        )}

                                    </div>
                                ))}

                                {experienceInfo && experienceInfo?.map((val, i) => (
                                    <div key={i}>
                                        <h3>{val.organisation_name}</h3>
                                        {val.start_date && (
                                            <p>{val.designation} ({calculateDuration(val.start_date, val.end_date ? moment(val.end_date).add(1, 'day') : moment().add(1, 'day'))})</p>
                                        )}

                                        <p><i className="fas fa-clock pr-3"></i> {jobTypeOne}</p>
                                    </div>
                                ))}

                                {skillsData ? (
                                    <p className='mt-5'>
                                        <span className='skills'>
                                            {skillsData}
                                        </span>
                                    </p>
                                ) : ''}
                            </div>

                            <div className='action_box'>
                                <div className='btn_top'>
                                    {applicationStatus == 'Pending' ? (
                                        <>
                                            {(applicationStatus == null || applicationStatus == 'Pending') ? <button type="button" className="btn btn_shortlist" onClick={(e) => { sendForShortlisted('applicant_shortlisted', 'Initial Shortlisted') }}>
                                                <i className="fas fa-check"></i>
                                                Longlist
                                            </button> : null}

                                            {(applicationStatus == null || applicationStatus == 'Pending') ? <button type="button" className="btn btn-danger btn_reject" onClick={(e) => { sendForShortlisted('applicant_rejected', 'Rejected') }}>
                                                <i className="fas fa-times"></i>
                                                Reject
                                            </button> : null}
                                        </>
                                    ) :
                                        <>
                                            {applicationStatus == "Final Shortlisted" ||
                                                applicationStatus == "Initial Shortlisted" ? (
                                                <span className="label label-xl label-inline label-light-primary">
                                                    {/* {applicationStatus} */}
                                                    {applicationStatus == "Initial Shortlisted" ? 'Longlisted' : 'Shortlisted'}
                                                </span>
                                            ) : applicationStatus == "Approved" ? (
                                                <span className="label label-xl label-inline label-light-success">
                                                    {applicationStatus}
                                                </span>
                                            ) : applicationStatus == "Rejected" ? (
                                                <span className="label label-xl label-inline label-light-danger">
                                                    {applicationStatus}
                                                </span>
                                            ) : (
                                                <span className="label label-xl label-inline label-light-warning">
                                                    {applicationStatus}
                                                </span>
                                            )}
                                        </>
                                    }
                                    {(applicationStatus == 'Initial Shortlisted') ? <button type="button" className="btn btn-danger btn_reject" onClick={(e) => { sendForShortlisted('applicant_rejected', 'Pending') }}>
                                        <i className="fas fa-times"></i>
                                        Withdrawn
                                    </button> : null}
                                </div>

                                {/* {assessmentScore ? ( */}
                                <div className='assessmen_div'>
                                    {/* <h2>{assessmentScore}</h2> */}
                                    <h4>Assessment Score : <span className='score_nember'>{assessmentScore ? assessmentScore : 0}</span> </h4>
                                    <span><b>Year of Experience: {Number(totalExperience).toFixed(2)}</b></span>
                                </div>
                                {/* ) : ''} */}
                                {module && module == "applicant_list" && (
                                    <>
                                        <div className='comment_btn'>
                                            {savedComment && !showComment && (
                                                <i className='fas fa-info pr-5 text-warning' title={savedComment} style={{ cursor: 'pointer' }}></i>
                                            )}

                                            {showComment && (
                                                <div className='shadow p-3 mb-5 bg-body rounded'>
                                                    <textarea
                                                        rows="2"
                                                        style={{ width: "300px" }}
                                                        placeholder='Type comment ...'
                                                        onChange={handleInputChangeComment}
                                                        value={commentData}
                                                    />
                                                </div>
                                            )}

                                            {showComment ? (
                                                <div className='text-right'>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn_reject mr-3"
                                                        onClick={() => {
                                                            setShowComment(false);
                                                        }}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={handleSubmitComment}
                                                    >
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                </div>

                                            ) : (
                                                (applicationStatus == null || applicationStatus == 'Pending') ? <button
                                                    type="button"
                                                    className="btn btn-outline-primary"
                                                    onClick={() => {
                                                        setShowComment(true);
                                                    }}
                                                >
                                                    <i className="fas fa-plus mr-3"></i>
                                                    Comment
                                                </button> : null
                                            )}

                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title className='cover_letter_modal_view'>
                        <h2>{applicantName} Cover Letter</h2>
                        <button onClick={handleClose}>
                            <i className="fas fa-times fa-2x text-danger"></i>
                        </button>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div dangerouslySetInnerHTML={{ __html: coverLetter }} />
                </Modal.Body>
            </Modal>

        </div >
    )
} 