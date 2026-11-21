import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { JobsInfocard } from '../../components/cards'
import { useDispatch, useSelector } from 'react-redux';
import * as ApplicantJobActions from "./_redux/applicantJobActions"

export default function ShortListedJobs() {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const { user, appliedJobList: shortlistedApplicantList } = useSelector((state) => ({
        user: state.auth.user,
        appliedJobList: state.applicantJob.appliedJobList,
    }));


    const [params, setParams] = useState({
        status: "Final Shortlisted",
        search: searchText
    });

    useEffect(() => {
        setParams({
            ...params,
            search: searchText
        })
    }, [searchText]);


    useEffect(() => {
        dispatch(ApplicantJobActions.getAppliedJobList(user?.data?.applicant_id, page, size, params));
    }, [dispatch, user, page, size, searchText, params]);

    const totalPages = shortlistedApplicantList?.totalPages;

    const sizeArr = Array.from({ length: totalPages }, (_, index) => {
        const value = (index + 1) * size;
        return <option key={value} value={value}>{value} / Page</option>;
    });

    const pageArr = Array.from({ length: totalPages }, (_, index) => (
        <li key={index} className="page-item"
            style={{
                backgroundColor: page === index + 1 ? '#007bff' : '',
                color: page === index + 1 ? '#fff' : '',
            }}>
            <a className="page-link" onClick={() => setPage(index + 1)}>{index + 1} </a>
        </li>
    ));

    const handleChange = (e) => {
        let value = e.target.value;
        setSearchText(value)
    }

    // console.log({ shortlistedApplicantList })
    return (
        <>
            <div className="available-jobs-page">
                <div className="container ">
                    <div className="row">
                        <div className="col-md-12">
                            <h2> Shortlisted Jobs</h2>
                        </div>

                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className='card p-3 card_transparent'>
                                        <div className='header_search_box'>
                                            <div className="searching">
                                                <div className="form-group-div">
                                                    <div className="input-icons w-100">
                                                        <input type="text" onChange={(e) => handleChange(e)} className="form-control" placeholder="Job title, keyword(s)" aria-label="Job title, keyword(s)" />
                                                    </div>
                                                    {/* <div className="input-icons">
                                                        <button className="btn search-submit">
                                                            <i className="fas fa-search icon"></i>
                                                        </button>
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className="filtering">
                                                <nav className='mr-4' aria-label="Page navigation">
                                                    <ul className="pagination justify-content-end">
                                                        <li className="page-item">
                                                            <a className="page-link" aria-label="Previous" onClick={() => { if (page > 1) setPage(page - 1) }}>
                                                                <span aria-hidden="true">&laquo;</span>
                                                            </a>
                                                        </li>
                                                        {pageArr}
                                                        <li className="page-item">
                                                            <a className="page-link" aria-label="Next" onClick={() => { if (page > 0 && totalPages != page) setPage(page + 1) }}>
                                                                <span aria-hidden="true">&raquo;</span>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </nav>

                                                <select className="form-select" aria-label="Default" value={size} onChange={(e) => { setSize(e.target.value) }}>
                                                    <option key={10} value={10}> 10 / Page  </option>
                                                    <option key={25} value={25}>  25 / Page  </option>
                                                    <option key={50} value={50}>  50 / Page  </option>
                                                    <option key={100} value={100}>  100 / Page  </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-5">
                                <div className="col-md-12">
                                    <div className='card card_transparent'>
                                        {
                                            (shortlistedApplicantList && shortlistedApplicantList.hrms_job?.length > 0) ? (
                                                shortlistedApplicantList.hrms_job.map((val, key) => (
                                                    <React.Fragment key={key}>
                                                        <JobsInfocard
                                                            jobData={{
                                                                hrms_job__id: val?.hrms_job__id,
                                                                hrms_job__job_title: val?.hrms_job__job_title,
                                                                sys_departments__department_name: val?.sys_departments__department_name,
                                                                sys_designation__designation_name: val?.sys_designation__designation_name,
                                                                hrms_job__status: val?.hrms_job__status,
                                                                hrms_job__application_deadline: val?.hrms_job__application_deadline,
                                                                hrms_work_station__address: val?.hrms_job__work_station,
                                                                hrms_job__minimum_experience: val?.hrms_job__minimum_experience,
                                                                hrms_job__position_status: val?.hrms_job__position_status,
                                                                hrms_job__max_salary: val?.hrms_job__max_salary,
                                                                hrms_job__min_salary: val?.hrms_job__min_salary,
                                                                hrms_job__fixed_salary: val?.hrms_job__fixed_salary,
                                                                hrms_job__salary: val?.hrms_job__salary,
                                                                hrms_job__m_hrms_job_applications: ['Yes'],
                                                            }}
                                                        />
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                <div className="short_jobs_info_card"><h3>No data Found</h3></div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

