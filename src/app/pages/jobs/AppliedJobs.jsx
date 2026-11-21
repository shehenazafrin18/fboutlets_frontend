import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { JobsCard2, JobsInfocard } from '../../components/cards'
import { useDispatch, useSelector } from 'react-redux';
import * as ApplicantJobActions from "./_redux/applicantJobActions"

export default function AppliedJobs() {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const { user, appliedJobList } = useSelector((state) => ({
        user: state.auth.user,
        appliedJobList: state.applicantJob.appliedJobList,
    }));

    const [params, setParams] = useState({
        search: searchText
    });

    let timeoutId = 0;
    useEffect(() => {
        setParams({
            ...params,
            search: searchText
        });
        timeoutId = setTimeout(() => {
            dispatch(ApplicantJobActions.getAppliedJobList(user?.data?.applicant_id, page, size, { search: searchText }));
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        }
    }, [searchText]);

    useEffect(() => {
        if (user && user?.data?.user_type == 3) {
            dispatch(ApplicantJobActions.getAppliedJobList(user?.data?.applicant_id, page, size, params));

        }
    }, [dispatch, user, page, size]);

    const totalPages = appliedJobList?.totalPages;

    const sizeArr = Array.from({ length: 50 }, (_, index) => {
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
                            <h2>Applied Jobs</h2>
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

                                                <select className="form-select" aria-label="Default" value={size}
                                                    onChange={(e) => {
                                                        setSize(e.target.value);
                                                    }}
                                                >
                                                    {/* <option key={2} value={2}>  2 / Page  </option>
                                                    <option key={4} value={4}>  4 / Page  </option> */}
                                                    <option key={10} value={10}> 10 / Page  </option>
                                                    <option key={25} value={25}>  25 / Page  </option>
                                                    <option key={50} value={50}>  50 / Page  </option>
                                                    <option key={100} value={100}>  100 / Page  </option>
                                                    {/* {sizeArr} */}

                                                </select>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-5">
                                <div className="col-md-12">
                                    <div className='card card_transparent'>
                                        {/* <JobsInfocard type="Live" status="Applied on" apply_date_time="06 November 2023 01:56PM" />
                                        <JobsInfocard type="Live" status="Applied on" apply_date_time="06 November 2023 01:56PM" />
                                        <JobsInfocard intv="Intv: 10 Nov 23, 11:00 AM" status="Applied on" apply_date_time="07 November 2023 01:56PM" />
                                        <JobsInfocard type="Closed" status="Applied on" apply_date_time="06 November 2023 01:56PM" /> */}

                                        {
                                            (appliedJobList && appliedJobList.hrms_job?.length > 0) ? (
                                                appliedJobList.hrms_job.map((val, key) => (
                                                    <React.Fragment key={key}>
                                                        <JobsInfocard jobData={val} type="Withdraw" page={page} size={size} userId={user?.data?.applicant_id} />
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

