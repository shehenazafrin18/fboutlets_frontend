import React, { useState, useEffect } from 'react'
import { Header, Footer } from "../../../layout";
import { Link, useParams } from "react-router-dom"
import { JobsCard2 } from '../../components/cards'
import { HeaderMobile } from '../../../_metronic/layout/components/header-mobile/HeaderMobile';
import { useDispatch, useSelector } from 'react-redux';
import * as jobAction from "../../_redux/jobActions"
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import ApplyModal from './ApplyModal';
import swal from "sweetalert2";
import { calculateAge } from '../../helpers/calculateAge';
import { swalError, swalWarning } from '../../helpers/swal';
import * as Action from "../../../app/pages/my-profile/_redux/recruitementActions";
import { calculateDateRangeCount } from '../../helpers/remainingDays';
import { formatCurrency } from '../../helpers/common';

export default function JobsDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;
    const DOC_TOKEN_ENCODED = DOC_TOKEN.replace(/&/g, '%26');

    const [show, setShow] = useState(false);
    const [applicantGender, setApplicantGender] = useState(1);
    const [applicantAge, setApplicantAge] = useState(0);
    const [applicantExp, setApplicantExp] = useState(0);
    const [attachmentOriginalName, setAttachmentOriginalName] = useState('');
    const [attachmentServerName, setAttachmentServerName] = useState('');
    const [fileExt, setFileExt] = useState('');

    const { user, jobDetails, relevantJobList, assessmentQstn, assessmentQstnAns, applicantsInfo, experienceList, systemInfo, profileMatched,additionalInfo } = useSelector((state) => ({
        user: state.auth.user,
        jobDetails: state.job.jobDetails,
        relevantJobList: state.job.relevantJobList,
        assessmentQstn: state.job.assessmentQstn,
        assessmentQstnAns: state.job.assessmentQstnAns,
        applicantsInfo: state.recruitement.applicantsInfo,
        experienceList: state.recruitement.experienceList,
        profileMatched: state.recruitement.profileMatched,
        systemInfo: state.job.systemInfo,
        additionalInfo: state.recruitement.additionalInfo,
    }));



    useEffect(() => {
        dispatch(jobAction.fetchJobDetailsById(user?.length !== 0 ? true : false, id));
        dispatch(jobAction.fetchAllRelevantJob(user?.length !== 0 ? true : false, id));
        if (user?.data?.applicant_id) {
            dispatch(Action.getAdditionalInfoByApplicants(user?.data?.applicant_id));
            dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
            dispatch(Action.getExperienceByApplicants(user?.data?.applicant_id));
            dispatch(Action.applicantJobProfilePercentage({
                job_id: parseInt(id),
                applicant_id: parseInt(user?.data?.applicant_id),
            }));
        }
        dispatch(jobAction.jobDetailsViewCountSave(id));

    }, [dispatch, user, id]);

    useEffect(() => {
        if (jobDetails) {
            if (jobDetails?.requisition_id) {
                dispatch(jobAction.getApplicantAssessmentQstn(jobDetails?.requisition_id));
            }
            dispatch(jobAction.fetchALLSystemInfo());

            if (jobDetails?.attachments) {
                let attachmentArr = jobDetails?.attachments.split('__');
                const file_extension = jobDetails?.attachments?.split('.').pop();
                setFileExt(file_extension);

                if (attachmentArr?.length > 0) {
                    setAttachmentOriginalName(attachmentArr[0]);
                    setAttachmentServerName(attachmentArr[1]);
                }
            }
        }
        if (user?.data?.applicant_id && jobDetails) {
            const param = {
                "hrms_applicant_id": parseInt(user?.data?.applicant_id),
                "hrms_job_description_id": parseInt(jobDetails?.jd_id)
            }
            dispatch(jobAction.getApplicantAssessmentQstnAns(param));
        }
    }, [dispatch, user, jobDetails]);

    useEffect(() => {
        if (applicantsInfo) {
            var currentDate = new Date();
            const age = calculateAge(applicantsInfo?.date_of_birth, currentDate);
            setApplicantAge(age);
            setApplicantGender(applicantsInfo?.gender === "Male" ? 1 : 2)
        }
    }, [applicantsInfo]);

    useEffect(() => {
        if (experienceList && experienceList?.length > 0) {
            const durations = experienceList.map((experience) => {
                const { start_date, end_date, is_currently_working } = experience;
                const end = is_currently_working ? new Date() : new Date(end_date);
                const duration = calculateAge(start_date, end);
                return duration;
            });
            const overallTotalYears = durations.reduce((total, duration) => total + duration, 0);

            setApplicantExp(overallTotalYears)
        }
    }, [experienceList]);



    const handleJobSave = async () => {
        if (id) {
            const param = {
                "applicant_id": user?.data?.applicant_id,
                "job_id": id
            }
            await dispatch(jobAction.saveJob(param));
            await dispatch(jobAction.fetchJobDetailsById(user?.length !== 0 ? true : false, id));
        }
    }

    let applicantIds = [];

    if (jobDetails?.m_hrms_job_applications?.length > 0) {
        applicantIds = jobDetails?.m_hrms_job_applications.map(application => application.applicant_id);
    }

    const handleJobApply = async () => {
        let flag = 1;
        const profile_percentage = systemInfo && systemInfo?.profile_percentage;

        if (jobDetails.gender_id && jobDetails.gender_id !== applicantGender) {
            flag = 0;
            swalWarning(`You have to be ${jobDetails.gender_id === 1 ? 'Male' : 'Female'} to apply this job`, "Sorry")
        }
        if (jobDetails.maximum_age && applicantAge >= jobDetails.maximum_age) {
            flag = 0;
            swalWarning(`Your age must not be greater than ${jobDetails.maximum_age} years `, "Sorry")
        }
        if (jobDetails.minimum_age && applicantAge <= jobDetails.minimum_age) {
            flag = 0;
            swalWarning(`Your age must not be less than ${jobDetails.minimum_age} years `, "Sorry")
        }

        if (jobDetails.minimum_experience && applicantExp < jobDetails.minimum_experience) {
            flag = 0;
            swalWarning(`Your experience must not be less than ${jobDetails.minimum_experience} years`, "Sorry")
        }
        if (applicantsInfo?.profile_percentage < profile_percentage) {
            flag = 0;
            swalWarning(`Your profile must be ${profile_percentage}% completed `, "Sorry")
        }


        if (flag === 1) {
            if (assessmentQstn && assessmentQstn?.totalItems > 0) {
                if (assessmentQstnAns && assessmentQstnAns?.length == 0) {
                    history.push(`/assessment-question/${id}`);
                } else {
                    setShow(true)
                }
            } else {
                setShow(true)
            }
        }
    }

    const handleJobUnsave = async () => {
        const result = await swal.fire({
            text: 'Do you want to unsave this job??',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: "#3699FF",
            heightAuto: false, // Disable auto height to allow custom height
        });

        if (result.isConfirmed) {
            await dispatch(jobAction.unsaveJob(id));
            await dispatch(jobAction.fetchJobDetailsById(user?.length !== 0 ? true : false, id));
        }
    }

    const handleAuthBeforeAct = () => {
        // Navigate to '/auth/login' with state
        history.push({
            pathname: '/auth/login',
            state: { from: location.pathname }
        });
    };

    // const fineRemainingDays = () => {
    //     if (new Date(jobDetails?.application_deadline).getTime() >= new Date().getTime()) {
    //         const diffInDays = moment(jobDetails?.application_deadline).diff(moment(), 'days');
    //         return diffInDays;
    //     }
    //     return 0
    // }

    // const remaining = fineRemainingDays();


    const rangeCount = calculateDateRangeCount(jobDetails?.application_deadline);

    return (
        <>
            <Header />

            <HeaderMobile />


            <div className="jobs-details-page">
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item"><Link to="/available-jobs">Available Jobs</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Job Details</li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className=''>
                                <div className="row">
                                    <div className="col-md-12 title_heading_col">
                                        <div>
                                            <h2> {jobDetails?.job_title} </h2>
                                        </div>
                                        <div className='btn_groups'>

                                            {
                                                user?.data && user?.data?.user_type === 3 ?
                                                    jobDetails?.saved_job_flag === 0 ?
                                                        <button onClick={handleJobSave} className="save_later_btn">Save for Later</button>
                                                        : <button onClick={handleJobUnsave} className="save_later_btn">Saved</button>
                                                    :
                                                    <button onClick={handleAuthBeforeAct} className="save_later_btn">Save for Later</button>

                                            }

                                            {
                                                moment(jobDetails?.application_deadline).isBefore(moment(), 'day') ? (
                                                    <button disabled className="apply_now_btn">
                                                        Expired
                                                    </button>)
                                                    : user?.data && user?.data?.user_type === 3 && user?.data ? jobDetails?.m_hrms_job_applications?.length > 0 && applicantIds.includes(user?.data?.applicant_id) ?
                                                        (
                                                            <button disabled className="apply_now_btn">
                                                                Applied
                                                            </button>
                                                        )
                                                        :
                                                        <button onClick={handleJobApply} className="apply_now_btn">
                                                            Apply Now
                                                        </button>
                                                        : <button onClick={handleAuthBeforeAct} className="apply_now_btn">
                                                            Apply Now
                                                        </button>
                                            }

                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-md-8">
                                        <div className='card-body d_card_one '>
                                            <div className='row'>
                                                <div className='col-12 col-md-7'>
                                                    <div className='left_box'>
                                                        {jobDetails?.job_location_name && (
                                                            <div className='left_sub_box'>
                                                                <div className='lable_box'>
                                                                    <p>Location:</p>
                                                                </div>
                                                                <div className='lable_item'>
                                                                    <p>
                                                                        {jobDetails?.job_location_name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className='left_sub_box'>
                                                            <div className='lable_box'>
                                                                <p>Department:</p>
                                                                <p>Postd On:</p>
                                                                {jobDetails?.position_category && (
                                                                    <p>Job Type:</p>
                                                                )}

                                                            </div>
                                                            <div className='lable_item'>
                                                                <p>{jobDetails?.sys_departments?.department_name}</p>
                                                                <p>
                                                                    {jobDetails?.published_on ?
                                                                        moment(jobDetails?.published_on).format('DD MMMM YYYY') : ""}
                                                                </p>
                                                                {jobDetails?.position_category && (
                                                                    <p>{jobDetails?.position_category}</p>
                                                                )}
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                                <div className='col-12 col-md-5'>
                                                    <div className='right_box position-relative'>
                                                        <div className='lable_box'>
                                                            {jobDetails?.no_of_vacancy > 0 && <p>Vacancy:</p>}
                                                            <p>Experience:</p>
                                                            <p>Deadline:</p>
                                                        </div>
                                                        <div className='lable_item'>
                                                            {jobDetails?.no_of_vacancy > 0 && <p><strong>{jobDetails?.no_of_vacancy}</strong></p>}
                                                            <p>
                                                                <strong> {jobDetails?.minimum_experience > 0 ? jobDetails?.minimum_experience + ' Years' : "Fresher"}</strong>
                                                            </p>
                                                            <p className='text-danger'>
                                                                {jobDetails?.application_deadline ?
                                                                    moment(jobDetails?.application_deadline).format('DD MMMM YYYY') : ""}
                                                            </p>
                                                            {rangeCount && rangeCount > 0 && <p className='text-danger'>Remaining {rangeCount} Days</p>}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {jobDetails?.about_company && (
                                            <div className='card-body about_desc'>
                                                <div dangerouslySetInnerHTML={{ __html: jobDetails?.about_company }} />
                                            </div>
                                        )}
                                        <div className='card-body jobs_desc'>
                                            {/* <h5>Job Description</h5>
                                            <hr /> */}
                                            <div className='column_row'>
                                                {/* <div className='lable_box'>
                                                    // {/* <p>Specific Duties & <br />Responsibilities:</p> */}
                                                {/* </div> */}
                                                <div className='lable_item job_detail_container'>
                                                    <div dangerouslySetInnerHTML={{ __html: jobDetails?.job_details }} />

                                                </div>
                                            </div>
                                            {/* <p>
                                                To assist the student with departmental topics and conduct/help in research
                                            </p> */}

                                            {/* <div className='column_row'>
                                                <div className='lable_box'>
                                                    <p>Job Purpose:</p>
                                                </div>
                                                <div className='lable_item'>
                                                    <p> {jobDetails?.hrms_job_description?.position_purpose}</p>
                                                </div>
                                            </div>
                                            <div className='column_row'>
                                                <div className='lable_box'>
                                                    <p>Specific Duties & <br />Responsibilities:</p>
                                                </div>
                                                <div className='lable_item'>
                                                    <div dangerouslySetInnerHTML={{ __html: jobDetails?.specific_duties_Responsibilites }} />
                                                    
                                                </div>
                                            </div>
                                            <div className='column_row'>
                                                <div className='lable_box'>
                                                    <p>General Duties & <br />Responsibilities:</p>
                                                </div>
                                                <div className='lable_item'>
                                                    <div dangerouslySetInnerHTML={{ __html: jobDetails?.general_duties_Responsibilites }} /> */}
                                            {/* <ul>
                                                        <li>Teaching </li>
                                                        <li>Research </li>
                                                    </ul> */}
                                            {/* </div>
                                            </div>
                                            <div className='column_row'>
                                                <div className='lable_box'>
                                                    <p>Educational <br /> Requirements:</p>
                                                </div>
                                                <div className='lable_item'>
                                                    <div dangerouslySetInnerHTML={{ __html: jobDetails?.educational_requirements }} />
                                                </div>
                                            </div>
                                            <div className='column_row'>
                                                <div className='lable_box'>
                                                    <p>Other Duties:</p>
                                                </div>
                                                <div className='lable_item'>
                                                    <div dangerouslySetInnerHTML={{ __html: jobDetails?.other_duties }} />
                                                </div>
                                            </div>
                                            <div className='column_row'>
                                                <div className='lable_box'>
                                                    <p>Knowledge Skill & <br /> Aptitudes:</p>
                                                </div>
                                                <div className='lable_item'>
                                                    <div dangerouslySetInnerHTML={{ __html: jobDetails?.knowledge_skill_aptitudes }} />
                                                </div>
                                            </div> */}



                                            {/* <div className='column_row'>
                                                <div className='lable_box'>
                                                    <p>Number of <br /> Publication(s):</p>
                                                </div>
                                                <div className='lable_item'>
                                                    <ul>
                                                        <li>At least 2 paper published and 1 as first author </li>
                                                    </ul>
                                                </div>
                                            </div> */}

                                            {/* {jobDetails?.additional_requirements && (
                                                <div className='column_row'>
                                                    <div className='lable_box'>
                                                        <p>Additional <br /> Requirements:</p>
                                                    </div>
                                                    <div className='lable_item'>
                                                        <div dangerouslySetInnerHTML={{ __html: jobDetails?.additional_requirements }} />
                                                    </div>
                                                </div>
                                            )} */}


                                            {/* <div className='column_row'>
                                                <div className='lable_box'>
                                                    <p>Read Before <br /> Apply:</p>
                                                </div>
                                                <div className='lable_item'>
                                                    <div dangerouslySetInnerHTML={{ __html: jobDetails?.read_before_apply }} />
                                                </div>
                                            </div> */}


                                            {/* <div className='column_row'>
                                                <div className='lable_box'>
                                                    <p>Salary:</p>
                                                </div>
                                                <div className='lable_item'>
                                                    <p><strong>
                                                        {jobDetails?.min_salary && jobDetails?.max_salary
                                                            ? `: ${jobDetails.min_salary} - ${jobDetails.max_salary} BDT`
                                                            : 'Salary information not available'}
                                                    </strong></p>
                                                </div>
                                            </div>
                                            <div className='column_row'>
                                                <div className='lable_box'>
                                                    <p>Compensation & <br /> Other Benefits:</p>
                                                </div>
                                                <div className='lable_item'>
                                                    <div dangerouslySetInnerHTML={{ __html: jobDetails?.compensation_and_otherb_enefits }} />
                                                </div>
                                            </div> */}


                                        </div>

                                        {jobDetails?.attachments && (
                                            <div className='card-body about_desc pb-5 d-flex'>
                                                <h4 className='mb-3 mr-5'>Attachment Fille: </h4>
                                                {
                                                    <a href={fileExt == "pdf" ? `${DOC_CONTAINER + jobDetails?.attachments + DOC_TOKEN}` : 'https://docs.google.com/gview?url=' + DOC_CONTAINER + jobDetails?.attachments + DOC_TOKEN_ENCODED + '&embedded=true'} download style={{ fontSize: "14px" }}>
                                                        <i className="far fa-file-pdf mr-2 text-danger"></i>
                                                        {attachmentOriginalName}
                                                    </a>
                                                }

                                            </div>
                                        )}

                                        <div className='card_footer_btn'>
                                            <div className='btn_groups'>
                                                {
                                                    user?.data && user?.data?.user_type === 3 ?
                                                        jobDetails?.saved_job_flag === 0 ?
                                                            <button onClick={handleJobSave} className="save_later_btn">Save for Later</button>
                                                            : <button onClick={handleJobUnsave} className="save_later_btn">Saved</button>
                                                        :
                                                        <button onClick={handleAuthBeforeAct} className="save_later_btn">Save for Later</button>
                                                }
                                                {
                                                    moment(jobDetails?.application_deadline).isBefore(moment(), 'day') ? (
                                                        // new Date().toDateString() < new Date(jobDetails?.application_deadline).toDateString() ? (
                                                        <button disabled className="apply_now_btn">
                                                            Expired
                                                        </button>)
                                                        : user?.data ? jobDetails?.m_hrms_job_applications?.length > 0 && applicantIds.includes(user?.data?.applicant_id) ?
                                                            (
                                                                <button disabled className="apply_now_btn">
                                                                    Applied
                                                                </button>
                                                            )
                                                            :
                                                            <button onClick={handleJobApply} className="apply_now_btn">
                                                                Apply Now
                                                            </button>
                                                            : <button onClick={handleAuthBeforeAct} className="apply_now_btn">
                                                                Apply Now
                                                            </button>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 right_bar">

                                        <div className="row mb-4">
                                            <div className='col-md-12'>
                                                <div className='salary_benefits mb-5'>
                                                    <div className='row'>
                                                        <div className='col-md-12'>
                                                            <div className='card_header_with_edit_btn'>
                                                                <div className='title'>
                                                                    <h2 className='mb-0'>Salary and Benefits</h2>
                                                                </div>
                                                            </div>

                                                            <hr />
                                                        </div>
                                                    </div>

                                                    <div className='card_items_row_flex'>
                                                        <div className='label_box'>Salary: </div>
                                                        <div className='item_data text-primary'>
                                                            {
                                                                jobDetails?.salary === "salary_range" ?
                                                                    `: ${formatCurrency(jobDetails.min_salary)} - ${formatCurrency(jobDetails.max_salary)}`
                                                                    : jobDetails?.salary === "fixed" ? formatCurrency(jobDetails?.fixed_salary)
                                                                        : jobDetails?.salary}
                                                        </div>
                                                    </div>
                                                    {jobDetails?.compensation_and_otherb_enefits && (
                                                        <div className='card_items_row_flex'>
                                                            <div className='label_box'>Compensation & Other Benefits: </div>
                                                            <div className='item_data'>
                                                                <div dangerouslySetInnerHTML={{ __html: jobDetails?.compensation_and_otherb_enefits }} />
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-md-12 title_heading_col">
                                                <div className='card-body'>
                                                    <div className='head_title'>
                                                        <h2>Relevant Jobs</h2>
                                                    </div>
                                                    <div className='btn_groups'>
                                                        <Link className="see_all_jobs_btn" to="/available-jobs">See all jobs <i className="fas fa-arrow-right ml-2"></i> </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row mt-5">
                                            <div className="col-md-12">
                                                {relevantJobList?.hrms_job?.length > 0 && relevantJobList?.hrms_job?.map((item, i) => (
                                                    <>
                                                        <JobsCard2 jobData={item} />
                                                    </>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <ApplyModal
                show={show}
                setShow={setShow}
                selectedData={jobDetails}
                selectedJobId={id}
                totalMarks={0}
                profileMatched={profileMatched}
                additionalInfo={additionalInfo}
            />
            <Footer />
        </>
    )
}
