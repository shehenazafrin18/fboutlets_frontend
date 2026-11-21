import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { JobsCard2, JobsInfocard } from '../../components/cards'
import { useDispatch, useSelector } from 'react-redux';
import * as ApplicantJobActions from "./_redux/applicantJobActions"
import { MyJobsInfocard } from '../../components/cards/MyJobsInfocard';

export default function MyJobs() {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const { user, myJobList } = useSelector((state) => ({
        user: state.auth.user,
        myJobList: state.applicantJob?.myJobList,
    }));


    const [params, setParams] = useState({
        status: "Published",
        search: searchText
    });

    useEffect(() => {
        setParams({
            ...params,
            search: searchText
        })
    }, [searchText]);


    useEffect(() => {
        if (user && user?.data?.user_type == 3) {
            dispatch(ApplicantJobActions.getMyJobList(params, page, size));

        }
    }, [dispatch, user, page, size, searchText, params]);


    const totalPages = myJobList?.totalPages;

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


    return (
        <>
            <div className="available-jobs-page">
                <div className="container ">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>My Jobs</h2>
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
                                        {myJobList && myJobList?.hrms_job?.length > 0 ? (myJobList?.hrms_job.map((item, i) => (

                                            <MyJobsInfocard
                                                key={i}
                                                id={item?.hrms_job__id}
                                                title={item?.hrms_job__job_title}
                                                department={item?.sys_departments__department_name}
                                                type={item?.hrms_job__position_status}
                                                apply_status={item?.hrms_job__job_applied_status === 1 ? "Applied" : ""}
                                                saved_status={item?.hrms_job__job_saved_status === 1 ? "Saved" : ""}
                                                apply_date_time={item?.hrms_job_applicantion__created_at}
                                                designation={item?.sys_designation__designation_name}
                                                experience={item?.hrms_job__minimum_experience}
                                                address={item?.hrms_job__job_location_name}
                                                deadline={item?.hrms_job__application_deadline}
                                                intv={item?.hrms_job_applicantion__status ? "Interview" : ""}
                                                salary={item?.hrms_job__salary}
                                                min_salary={item?.hrms_job__min_salary}
                                                max_salary={item?.hrms_job__max_salary}
                                                fixed_salary={item?.hrms_job__fixed_salary}
                                                job_status={item?.hrms_job__status}
                                                jobListFn={ApplicantJobActions.getMyJobList(params, page, size)}
                                                job_application_status={item?.hrms_job_applicantion__status}
                                            />

                                        ))) : (
                                            <div className="short_jobs_info_card"><h3>No data Found</h3></div>
                                        )}


                                        {/* <MyJobsInfocard type="Live" status="Applied on" apply_date_time="06 November 2023 01:56PM" />
                                        <MyJobsInfocard intv="Intv: 10 Nov 23, 11:00 AM" status="Applied on" apply_date_time="07 November 2023 01:56PM" />
                                        <MyJobsInfocard type="Closed" status="Applied on" apply_date_time="06 November 2023 01:56PM" /> */}

                                        {/* {
                                            (myJobList && myJobList?.hrms_job_application?.length > 0) ? (
                                                myJobList?.hrms_job_application.map((val, key) => (
                                                    <React.Fragment key={key}>
                                                        <JobsInfocard jobData={val} />
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                <div className="short_jobs_info_card"><h3>No data Found</h3></div>
                                            )
                                        } */}
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