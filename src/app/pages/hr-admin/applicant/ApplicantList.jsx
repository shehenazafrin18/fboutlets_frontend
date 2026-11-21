import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom"

import { Pagination } from 'antd';
import * as hractions from "../_redux/hrActions"
import ApplicantListCard, { calculateDuration } from '../../../components/toolkit/ApplicantListCard';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import FilterByRequirement from '../../../components/toolkit/FilterByRequirement';
import { downloadApplicant, fetchJobById } from '../_redux/hrRequest';
import { swalError, swalSuccess } from '../../../helpers/swal';
import { DataNotFoundCard } from '../../../components/cards';
import { CSVLink } from 'react-csv';

const filtersStatus = {
    all: "",
    shortlisted: "Initial Shortlisted",
    finalselection: "Final Shortlisted",
    rejected: "Rejected",
}
export default function ApplicantList() {
    const dispatch = useDispatch();
    const { id } = useParams();

    const { user, shortlistedApplicantList, actionsLoading } = useSelector((state) => ({
        user: state.auth.user,
        shortlistedApplicantList: state.hr.shortlistedApplicantList,
        actionsLoading: state.hr.actionsLoading,
    }));
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(50)
    const [selectedOption, setSelectedOption] = useState('25');
    const [activeFilter, setActiveFilter] = useState(filtersStatus.all)
    const [openDownloadOption, setOpenDownloadOption] = useState(false)
    const [downloadingData, setDownloading] = useState({ word: false, pdf: false })
    const [filterData, setFilterData] = useState({})
    const [jobData, setJobData] = useState(null)



    const toggleDownloadOptions = () => {
        setOpenDownloadOption(!openDownloadOption);
    }
    const downloadCv = async (type) => {
        setDownloading({ ...downloadingData, [type]: true })
        const applicantIds = shortlistedApplicantList.hrms_job_application.map((d) => d.hrms_applicant__id)
        const response = await downloadApplicant(applicantIds, type);
        setOpenDownloadOption(false)
        if (response.data.success) {
            swalSuccess("Downloaded successfully")
            let a = document.createElement('a')
            // console.log(process.env.REACT_APP_API_URL.replace('/api/v1', ''))
            a.target = "_blank"
            a.href = process.env.REACT_APP_API_URL.replace('/api/v1', '') + '/' + response.data.data.file;
            let filename = response.data.data.file.split('/')
            filename = filename[filename.length - 1];
            a.download = filename;
            a.click();

        } else {
            swalError(response.data.message)
        }
        setDownloading({ ...downloadingData, [type]: false })
    }



    // Calculate index range for current page
    // const startIndex = (page - 1) * perPage;
    // const endIndex = page * perPage;

    // const paginatedList = shortlistedApplicantList?.hrms_job_application?.slice(startIndex, endIndex) || [];

    const handleButtonClick = (id) => {
        setSelectedOption(id);
    };




    const onFilter = (filterObj) => {
        setFilterData({ ...filterObj, page, perPage })
    }

    useEffect(() => {
        dispatch(hractions.getShortlistedApplicantList({
            size: perPage,
            page: page
        }, {
            status: activeFilter,
            ...filterData,
            job_id: id
        }));
    }, [page, perPage, activeFilter, filterData]);

    const jobDetails = async () => {
        const response = await fetchJobById(id);
        if (response.data.success) {
            // console.log("Job data:", response.data.data)
            setJobData(response.data.data)
        } else {
            swalError(response.data.message)
        }
    }
    useEffect(() => {
        jobDetails()
        dispatch(hractions.getShortlistedApplicantList({
            size: perPage,
            page: page
        }, {
            status: activeFilter,
            job_id: id
        }));
    }, [])

    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    // const paginatedList = applicantByJobId?.hrms_job_application?.slice(startIndex, endIndex) || [];

    // const applicationCreated = applicantByJobId?.hrms_job_application[0]?.hrms_job_application__created_at;
    // const applicationDeadline = applicantByJobId?.hrms_job_application[0]?.m_hrms_job__application_deadline;

    // const deadlineDate = moment(applicationDeadline).format('YYYY-MM-DD');



    // const currentDate = moment();

    // const deadlineDateMoment = moment(deadlineDate);

    // if (deadlineDateMoment.isBefore(currentDate)) {
    //     console.log('Expired');
    // } else {
    //     console.log('Published');
    // }

    const processJobStatus = (jobStatus) => {
        if (jobStatus == 'Published') return "Live";
        if (jobStatus == 'In Interview') return "Recruitment Ongoing";
        if (jobStatus == 'Closed') return "Closed";
    }

    const headers = [
        {
            label: 'S.L',
            key: 'serialNumber',
        },
        {
            label: 'Applicant Name',
            key: 'fullName',
        },
        {
            label: 'Gender',
            key: 'hrms_applicant__gender',
        },
        {
            label: 'Date of Birth',
            key: 'date_of_birth_text',
        },
        {
            label: ' Address',
            key: 'hrms_applicant__pre_address_line_1',
        },
        {
            label: 'Email',
            key: 'hrms_applicant__email',
        },
        {
            label: 'Phone No',
            key: 'phone_no_text',
        },
        {
            label: 'Total Applied Job',
            key: 'hrms_job_application__totalAppliedJobs'
        },
        {
            label: 'Profile Percentage',
            key: 'hrms_applicant__profile_percentage'
        },
        {
            label: 'Year of Experience',
            key: 'hrms_applicant__total_experience'
        },
        {
            label: 'Educations',
            key: 'education_text'
        },
        {
            label: 'Experiences',
            key: 'experience_text'
        },
        {
            label: 'Status',
            key: 'is_active_status',
        }
    ];

    const getEducationTextForXlsx = (educations = []) => {
        let formula = '';
        let count = 1;
        for (const education of educations) {
            if (education.major_subject) {
                formula += (
                    `${count}. ${education.degree_name ?? ''} in ` +
                    `${education.major_subject ?? ''} from ` +
                    `${education.institute_name ?? ''} \n` +
                    `Result: ${education.cgpa ? education.cgpa + ' out of ' + education.cgpa_scale : education.result}, Year: ${education.passing_year} \n\n`
                );
            } else {
                formula += (
                    `${count}. ${education.degree_name ?? ''} from ` +
                    `${education.institute_name ?? ''} \n` +
                    `Result: ${education.cgpa ? education.cgpa + ' out of ' + education.cgpa_scale : education.result}, Year: ${education.passing_year} \n\n`
                );
            }

            count++;
        }
        return formula;
    }

    const getExperiencesTextForXlsx = (experiences = []) => {
        let formula = '';
        for (let index = 0; index < experiences.length; index++) {
            const experience = experiences[index];
            // const diff = moment(experience.end_date ?? new Date()).diff(experience.start_date, 'months');
            // const total_exp = diff ? (diff / 12).toFixed(2) : 0;
            const total_exp = experience.start_date ? calculateDuration(experience.start_date, experience.end_date ? moment(experience.end_date).add(1, 'day') : moment().add(1, 'day')) : '';
            formula += (
                `${index + 1}. ${experience.designation ?? ''} at ${experience.organisation_name ?? ''} ` +
                `(${experience.start_date ? moment(experience.start_date).format('DD-MMM-YYYY') : ''} ` +
                `- ${experience.end_date ? moment(experience.end_date).format('DD-MMM-YYYY') : 'Present'}) (${total_exp}) \n\n`
            );
        }

        return formula;
    }

    const dataSource = shortlistedApplicantList?.hrms_job_application && shortlistedApplicantList?.hrms_job_application.map((item, index) => ({
        serialNumber: index + 1, // Add serial number starting from 1
        fullName: item.hrms_applicant__first_name + ' ' + item.hrms_applicant__middle_name + ' ' + item.hrms_applicant__last_name,
        is_active_status: item.hrms_applicant__is_active === 1 ? 'Active' : 'Inactive',
        education_text: getEducationTextForXlsx(item.hrms_applicant__education?.slice(0, 2) || []),
        experience_text: getExperiencesTextForXlsx(item.hrms_applicant__experience?.slice(0, 2) || []),
        date_of_birth_text: item.hrms_applicant__date_of_birth ? moment(item.hrms_applicant__date_of_birth).format('DD/MM/YYYY') : '',
        phone_no_text: `'${item.hrms_applicant__contact_number}`,
        ...item,
    }));

    return (
        <>
            <div className="hr-admin-table-job-list">
                <nav>
                    <ol className="breadcrumb bg-transparent">
                        <li className="breadcrumb-item"> <Link to="/hr-admin/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item"> <Link to="/hr-admin/jobs/jobs-list">Job List</Link></li>
                        <li className="breadcrumb-item"> <span className="text-dark">Applicant List</span></li>
                    </ol>
                </nav>
            </div>

            <div className="applicant_list_main_wrapper">
                <div className='card card_body_box'>
                    <div className='row'>
                        <div className='col-md-3 d-flex align-items-center'>
                            <div className='title'>
                                <h2>{(jobData && jobData?.job_title) && jobData?.job_title}</h2>
                            </div>
                        </div>

                        <div className='col-md-9'>
                            <div className="row">
                                <div className="col-md-12 text-right">
                                    <div className="top_btn_group">
                                        {jobData?.application_deadline && moment(jobData?.application_deadline).isBefore(moment(), 'day') ? (
                                            <button type="button" className="btn btn-link btn_expired">
                                                <i className="fas fa-exclamation-circle"></i>
                                                Expired
                                            </button>
                                        ) : jobData && jobData.status && (
                                            <button type="button" className="btn btn-link btn-primary">
                                                {(jobData && jobData?.status) && processJobStatus(jobData?.status)}
                                            </button>
                                        )
                                        }

                                        {/* <button type="button" className="btn btn-outline-primary">
                                            <i className="far fa-edit"></i>
                                            Edit
                                        </button>
                                        <button type="button" className="btn btn-outline-primary">
                                            <i className="fas fa-retweet"></i>
                                            Repost
                                        </button>
                                        <button type="button" className="btn btn-outline-primary">
                                            <i className="fas fa-share-alt"></i>
                                            Share
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 text-right">
                                    <div className="top_sub_btn_group">
                                        <button type="button" className="btn btn-link">
                                            <i className="fas fa-calendar-alt"></i>
                                            {jobData?.published_on ? moment(jobData?.published_on).format('MMM DD, YYYY') : null} - {jobData?.application_deadline ? moment(jobData?.application_deadline).format('MMM DD, YYYY') : null}
                                        </button>
                                        {/* <button type="button" className="btn btn-link"><i className="far fa-folder-open"></i> Preview</button>
                                        <button type="button" className="btn btn-link"><i className="fas fa-chart-bar"></i> Analytics</button>
                                        <button type="button" className="btn btn-link"> <i className="far fa-question-circle"></i> User Guide</button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-5'>
                    <div className="col-md-3">
                        {/* {shortlistedApplicantList?.hrms_job_application?.length > 0 && */}
                        <FilterByRequirement onFilter={onFilter} />
                        {/* } */}
                    </div>

                    <div className="col-md-9">
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className="btn_group_one">

                                    <div className='left_btn_div' style={{ position: 'relative' }}>
                                        <button
                                            disabled={downloadingData.pdf}
                                            onClick={() => {
                                                downloadCv('pdf')
                                            }}
                                            className="btn btn-success btn-md mr-2"
                                        >
                                            <i className={"fa " + (downloadingData.pdf ? "fa fa-sync fa-spin" : "fa-download")}></i>   PDF
                                        </button>
                                        <button
                                            disabled={downloadingData.word}
                                            onClick={() => {
                                                downloadCv('word')
                                            }}
                                            className="btn btn-success btn-md"
                                        >
                                            <i className={"fa " + (downloadingData.word ? "fa fa-sync fa-spin" : "fa-download")}></i>  Word
                                        </button>

                                        <CSVLink
                                            headers={headers}
                                            filename={"Applicant_List"}
                                            data={dataSource ? dataSource : []}
                                            className="btn btn-success btn-md"
                                        >
                                            <i className="fa fa-download"></i> Excel
                                        </CSVLink>

                                        {/* {(shortlistedApplicantList?.hrms_job_application.length > 0 && !actionsLoading) && (<>
                                            <button disabled={downloading} className="btn btn-md btn-success" onClick={toggleDownloadOptions}><i className={"fa " + (downloading ? "fa fa-sync fa-spin" : "fa-download")}></i> {downloading ? "Downloading" : "Download"}</button>
                                            {(openDownloadOption && !downloading) && <div
                                                style={{
                                                    position: "absolute",
                                                    zIndex: 9999,
                                                    top: "36px",
                                                    width: "150px",
                                                    boxShadow: "2px 2px 3px lightgray",
                                                    background: 'white'
                                                }}
                                            >
                                                <button type="button" className="btn btn-success btn-md mb-2 btn-block" onClick={() => { downloadCv('pdf') }}><i className="fas fa-download"></i> Download PDF</button>
                                                <button type="button" className="btn btn-success btn-md btn-block" onClick={() => { downloadCv('word') }}><i className="fas fa-download"></i> Download Word</button>
                                            </div>}
                                        </>)} */}
                                    </div>

                                    <div className='right_btn_div'>
                                        <button type="button" onClick={e => { setActiveFilter(filtersStatus.all) }} className={"btn " + (filtersStatus.all == activeFilter ? "btn-primary  text-light" : "btn-outline-primary")}><i className="far fa-user text-light"></i> All applicants ({shortlistedApplicantList?.allApplicantCount ?? 0})</button>
                                        <button type="button" onClick={e => { setActiveFilter(filtersStatus.shortlisted) }} className={"btn " + (filtersStatus.shortlisted == activeFilter ? "btn-primary  text-light" : "btn-outline-primary")}><i className="far fa-user"></i> Longlisted ({shortlistedApplicantList?.shortedAlitedApplicantCount ?? 0})</button>
                                        {/* <button type="button" onClick={e => { setActiveFilter(filtersStatus.finalselection) }} className={"btn " + (filtersStatus.finalselection == activeFilter ? "btn-primary  text-light" : "btn-outline-primary")}><i className="far fa-user"></i> Final Selection ({shortlistedApplicantList?.finalAlitedApplicantCount ?? 0})</button> */}
                                        <button type="button" onClick={e => { setActiveFilter(filtersStatus.rejected) }} className={"btn " + (filtersStatus.rejected == activeFilter ? "btn-primary  text-light" : "btn-outline-primary")}><i className="far fa-user"></i> Rejected ({shortlistedApplicantList?.rejectedApplicantCount ?? 0})</button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* <div className='row mt-3'>
                            <div className='col-md-12 text-right'>
                                <div className="top_btn_group">
                                    <button type="button" className="btn btn-link text-dark">
                                        All (106)
                                    </button>
                                    <button type="button" className="btn btn-outline-primary">
                                        Not viewed (40)
                                    </button>
                                    <button type="button" className="btn btn-outline-primary">
                                        Viewed (66)
                                    </button>
                                    <button type="button" className="btn btn-outline-primary">
                                        Rejected (0)
                                    </button>
                                </div>
                            </div>
                        </div> */}

                        {/* <div className='row mt-3'>
                            <div className='col-md-12 text-right'>
                                <div className="btn_group_one">
                                    <div className='left_btn_div'>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Select all (50 of 106)
                                            </label>
                                        </div>
                                    </div>
                                    <div className='right_btn_div'>
                                        <div className="top_btn_group">
                                            <button type="button" className="btn btn-outline-primary text-dark">
                                                <i className="fas fa-sort-alpha-down"></i>
                                                Short
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}


                        {actionsLoading && <div className='text-center px-15 mx-15'><i className='fa fa-sync fa-spin'></i> Please Wait...</div>}
                        {!actionsLoading && shortlistedApplicantList?.hrms_job_application?.map((item, i) => {
                            // const designation = item?.hrms_job_application__experienceInfo.map((val) => val.designation);
                            // const organisation_name = item?.hrms_job_application__experienceInfo.map((val) => val.organisation_name);  

                            let applicantName = "";
                            // console.log(item)

                            if (item?.m_career_portal_user__first_name !== null && item?.m_career_portal_user__first_name !== undefined) {
                                applicantName += item?.m_career_portal_user__first_name + " ";
                            }

                            if (item?.m_career_portal_user__middle_name !== null && item?.m_career_portal_user__middle_name !== undefined) {
                                applicantName += item?.m_career_portal_user__middle_name + " ";
                            }

                            if (item?.m_career_portal_user__last_name !== null && item?.m_career_portal_user__last_name !== undefined) {
                                applicantName += item?.m_career_portal_user__last_name;
                            }

                            let address = "";

                            if (item?.hrms_applicant__per_address_line_1 !== null && item?.hrms_applicant__per_address_line_1 !== undefined) {
                                address += item?.hrms_applicant__per_address_line_1 + " ";
                            }

                            if (item?.hrms_applicant__per_address_line_2 !== null && item?.hrms_applicant__per_address_line_2 !== undefined) {
                                address += item?.hrms_applicant__per_address_line_2 + " ";
                            }

                            let educationInfo = (item && item?.hrms_applicant__education?.length) ? [...item?.hrms_applicant__education].slice(0, 2) : []
                            let expInfo = (item && item?.hrms_applicant__experience?.length) ? [...item?.hrms_applicant__experience].slice(0, 2) : []
                            return <ApplicantListCard
                                key={i}
                                experienceInfo={expInfo}
                                educationInfo={educationInfo}
                                applicationStatus={item?.hrms_job_application__status}
                                trainingInfo={item?.hrms_applicant__training}
                                totalExperience={item?.hrms_applicant__total_experience}
                                profileImage={item?.hrms_applicant__profile_image ? item?.hrms_applicant__profile_image : '/media/users/default.jpg'}
                                applicantName={applicantName}
                                applicantContactNumber={item?.hrms_applicant__contact_number}
                                expectedSalary={item?.hrms_job_application__expected_salary}
                                address={address}
                                applied={item?.hrms_job_application__totalAppliedJobs}
                                age={item?.hrms_applicant__date_of_birth}
                                AppliedDate={item?.hrms_job_application__created_at}
                                matched={item?.hrms_job_application__profile_matching}
                                profileLink={item?.hrms_job_application__applicant_id}
                                coverLetter={item?.hrms_job_application__cover_letter}
                                jobTypeOne={'Full Time'}
                                jobTypeTwo={'Full Time'}
                                assessmentScore={item?.hrms_job_application__assessments_marks}
                                module={'applicant_list'}
                                jobApplicationId={item?.hrms_job_application__id}
                                jobId={item?.hrms_job_application__job_id}
                                applicantId={item?.hrms_applicant__id ?? item?.hrms_job_application__applicant_id}
                                comment={item?.hrms_job_application__comment}
                                fetchApplicantsAction = {
                                    hractions.getShortlistedApplicantList({
                                        size: perPage,
                                        page: page
                                    }, {
                                        status: activeFilter,
                                        ...filterData,
                                        job_id: id
                                    })
                                }
                            />
                        })}

                        <div className='row'>
                            <div className='col-md-12 mt-5 text-right'>
                                {shortlistedApplicantList?.hrms_job_application && shortlistedApplicantList?.hrms_job_application?.length > 0 && (<>

                                    <Pagination
                                        total={shortlistedApplicantList?.totalPages ?? 0}
                                        // showTotal={(total) => `Total ${total} items`}
                                        current={page}
                                        pageSize={perPage}

                                        onChange={(page, pageSize) => {
                                            setPage(page);
                                            setPerPage(pageSize);
                                        }}
                                    />
                                </>)}
                            </div>
                        </div>

                    </div>
                </div>

                {shortlistedApplicantList?.hrms_job_application?.length == 0 &&
                    <div className='row'>
                        <div className='col-md-12'>
                            <DataNotFoundCard
                                title={'No data found'}
                                subtitle={'Shortlisted Applicant data is empty or Try adjucting your filter'}
                            />
                        </div>
                    </div>
                }

            </div>
        </>
    )
} 