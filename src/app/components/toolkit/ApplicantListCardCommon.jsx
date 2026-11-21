import React, { useEffect, useState } from 'react'
import { Progress } from 'antd';
import moment from 'moment';
import { Link } from "react-router-dom"
import { Modal } from 'react-bootstrap';

export default function ApplicantListCardCommon({
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

}) {

    const [showComment, setShowComment] = useState(false);

    const formattedAppliedDateDate = moment(AppliedDate).format('MMMM Do, YYYY');
    const ageData = moment().diff(age, 'years');


    const calculateDuration = (startDate, endDate) => {
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



    const [skillsData, setSkillsData] = useState('');

    useEffect(() => {
        if (trainingInfo) {
            const skillsArrays = trainingInfo.map((item) => {
                const skillArr = item?.skill && JSON.parse(item.skill);
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


    return (
        <div className='applicant_card mt-5'>
            <div className='row'>
                <div className='col-md-5'>
                    <div className='profile_card'>
                        <div className='image_box'>
                            <img
                                className='w-50 rounded'
                                src={profileImage}
                                alt={applicantName}
                            />
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
                                        Expected: <br /><span> ৳ {expectedSalary} </span>
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
                            <p>
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
                                            <Link to={`/hr-admin/detail-resume/${profileLink}`}
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
                                        <i class="far fa-envelope-open fa-2x"></i>
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
                            <div>
                                {educationInfo && educationInfo?.map((val) => (
                                    <>
                                        <h3>{val.hrms_education_level.name}</h3>
                                        <p>{val.hrms_institute.name}</p>

                                        <p>
                                            <i className="fas fa-business-time pr-3"></i>
                                            Duration : {calculateDuration(val.start_date, val.end_date)}
                                        </p>
                                    </>
                                ))}

                                {experienceInfo && experienceInfo?.map((val) => (
                                    <>
                                        <h3>{val.organisation_name}</h3>
                                        <p>{val.designation} ({calculateDuration(val.start_date, val.end_date)})</p>
                                        <p><i className="fas fa-clock pr-3"></i> {jobTypeOne}</p>
                                    </>
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
                                    {applicationStatus !== 'Initial Shortlisted' && (
                                        <>
                                            <button type="button" className="btn btn_shortlist">
                                                <i className="fas fa-check"></i>
                                                Shortlist
                                            </button>

                                            <button type="button" className="btn btn-danger btn_reject">
                                                <i className="fas fa-times"></i>
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>

                                {assessmentScore ? (
                                    <div className='assessmen_div'>
                                        {/* <h2>{assessmentScore}</h2> */}
                                        <h4>Assessment Score : <span className='score_nember'>{assessmentScore}</span> </h4>
                                    </div>
                                ) : ''}

                                <div className='comment_btn'>
                                    {showComment && (
                                        <div className='shadow p-3 mb-5 bg-body rounded'>
                                            <textarea
                                                // className="form-control"
                                                rows="2"
                                                style={{ width: "350px" }}
                                                placeholder='Type comment ...'
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
                                            >
                                                <i class="fas fa-check"></i>
                                            </button>
                                        </div>

                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            onClick={() => {
                                                setShowComment(true);
                                            }}
                                        >
                                            <i className="fas fa-plus mr-3"></i>
                                            Comment
                                        </button>
                                    )}

                                </div>

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
                            <i class="fas fa-times fa-2x text-danger"></i>
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