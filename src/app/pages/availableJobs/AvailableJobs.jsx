import React, { useEffect, useState } from 'react';
import { size as lodashSize } from "lodash";
import { Link } from "react-router-dom"
import { Header, Footer } from "../../../layout";
import { JobsCard2, JobsInfocard, TitleCard } from '../../components/cards'
import { HeaderMobile } from '../../../_metronic/layout/components/header-mobile/HeaderMobile';
import Multiselect from 'multiselect-react-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import * as jobAction from "../../_redux/jobActions"
import { Select } from "antd";
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import DataNotFound from '../../components/DataNotFound';

export default function AvailableJobs(props) {
    const dispatch = useDispatch();
    const { departmentList, user, availableJobList, recommendedJobList } = useSelector((state) => ({
        departmentList: state.job.departmentList,
        user: state.auth.user,
        availableJobList: state.job.availableJobList,
        recommendedJobList: state.job.recommendedJobList,
    }));
    const previousState = props?.location?.state?.from;

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const { deptId, jobTitle } = useParams();
    const [searchText, setSearchText] = useState(jobTitle ? decodeURIComponent(jobTitle) : null);
    const [departmentId, setDepartmentId] = useState(deptId > 0 ? parseInt(deptId) : searchText ? null : null);

    const [params, setParams] = useState({
        previousState: previousState ? previousState : "",
        status: previousState && previousState =="latest_job"?"":"Published",
        department_id: parseInt(deptId),
        search: searchText 
    });
    let timeoutId;

    // useEffect(() => {
    //     dispatch(jobAction.fetchALLDepartmentList());
    //     dispatch(jobAction.fetchAllAvailableJob(params, page, size));
    //     dispatch(jobAction.fetchAllRecommendedJob({ status: "Published" }, 1, 10));
    //     if (searchText) {
    //         const jobIdArr = availableJobList?.hrms_job?.map(job => job.hrms_job__id);
    //         dispatch(jobAction.jobSearchViewCountSave(jobIdArr));
    //     }
    // }, [dispatch, user, page, size, searchText]);

    useEffect(() => {
        fetchJobData();     
    }, [dispatch, user, page, size, departmentId]);

    useEffect(() => {
        if(searchText !== null) {
            timeoutId = setTimeout(() => {
                fetchJobData();
            }, 1000);
          
            return () => clearTimeout(timeoutId);
        }
    }, [dispatch, searchText]);

    // useEffect(() => {
    //     setParams({
    //         ...params,
    //         search: searchText,
    //         department_id: deptId > 0 ? parseInt(deptId) : searchText ? null : null,
    //     })
    // }, [searchText, user]);

    useEffect(() => {
        dispatch(jobAction.fetchALLDepartmentList());
    }, []);

    function fetchJobData() {
        dispatch(jobAction.fetchAllAvailableJob(params, page, size, lodashSize(user) ? true : false));
        dispatch(jobAction.fetchAllRecommendedJob({ status: "Published" }, 1, 10, lodashSize(user) ? true : false));
        if (params.search) {
            const jobIdArr = availableJobList?.hrms_job?.map(job => job.hrms_job__id);
            dispatch(jobAction.jobSearchViewCountSave(jobIdArr));
        }
    }

    const totalPages = availableJobList?.totalPages;

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

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleChange = (e) => {
        let value = e.target.value;
        setSearchText(value);
        setParams((state) => ({
            ...state,
            search: value
        }));
    }

    const handleSubmit = (e) => {
        dispatch(jobAction.fetchAllAvailableJob(params, page, size, lodashSize(user) ? true : false));
    }

    return (
        <>
            <Header />

            <HeaderMobile />

            <div className="available-jobs-page">
                <div className="container-fluid">
                    {/* <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb">
                            <ol  className="breadcrumb">
                                <li  className="breadcrumb-item"><a href="#">Home</a></li>
                                <li  className="breadcrumb-item"><a href="#">Available Jobs</a></li>
                                <li  className="breadcrumb-item active" aria-current="page">Recommended</li>
                            </ol>
                        </nav>
                    </div>
                </div> */}
                    {/* {JSON.stringify(props)} */}
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className='jobs_title_name'>Available Jobs ({availableJobList?.totalItems}) </h2>
                        </div>

                        <div className="col-12 col-md-9">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className='header_search_box'>
                                        <div className="searching">
                                            <div className="search-job-form">

                                                <div className="form-group-div">
                                                    <div className="location input-icons">
                                                        <i className="fas fa-search icon"></i>
                                                        <input type="text" onChange={(e) => handleChange(e)} className="form-control" placeholder="Job title, keyword(s)" aria-label="Job title, keyword(s)" value={searchText} />
                                                    </div>
                                                    <div className="search-job input-icons">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 25 22" fill="none">
                                                            <path d="M22.5788 15.8583C21.4404 15.1994 20.0529 15.3762 19.1181 16.2012L17.6984 15.3789V11.3155C17.6984 10.895 17.4734 10.5039 17.1092 10.295L13.4663 8.19764V6.40031C14.6502 5.99853 15.502 4.87889 15.502 3.55835C15.502 1.90031 14.16 0.55835 12.502 0.55835C10.844 0.55835 9.50201 1.90031 9.50201 3.55835C9.50201 4.87889 10.3538 5.99853 11.5377 6.40031V8.19764L7.89487 10.295C7.53058 10.5039 7.30558 10.895 7.30558 11.3155V15.3762L5.88594 16.1985C4.95112 15.3735 3.56094 15.1967 2.42522 15.8557C0.992188 16.686 0.504688 18.5182 1.32701 19.9512C2.15201 21.3842 3.97612 21.8771 5.4038 21.0494C6.54219 20.3905 7.08326 19.0941 6.83951 17.8673L8.14397 17.1092L11.91 19.2789C12.0922 19.3834 12.2958 19.4369 12.4993 19.4369C12.7029 19.4369 12.9065 19.3834 13.0886 19.2789L16.852 17.1119L18.1565 17.87C17.9127 19.0941 18.4565 20.3932 19.5922 21.0521C21.0199 21.8798 22.8467 21.3896 23.669 19.9539C24.494 18.5182 24.0065 16.686 22.5788 15.8583ZM4.55201 19.5655C4.40652 19.6498 4.2458 19.7044 4.07911 19.7263C3.91241 19.7482 3.74303 19.7369 3.58071 19.6931C3.41839 19.6493 3.26634 19.5738 3.13331 19.471C3.00028 19.3682 2.8889 19.2401 2.80558 19.0941C2.45201 18.4807 2.66094 17.6932 3.27433 17.3396C3.41982 17.2553 3.58054 17.2007 3.74723 17.1788C3.91393 17.1569 4.08331 17.1681 4.24563 17.212C4.40795 17.2558 4.56 17.3313 4.69303 17.4341C4.82606 17.5369 4.93744 17.665 5.02076 17.811C5.37433 18.4244 5.1654 19.2119 4.55201 19.5655ZM11.2136 3.55835C11.2205 3.2219 11.359 2.90155 11.5993 2.66604C11.8397 2.43052 12.1628 2.29861 12.4993 2.29861C12.8358 2.29861 13.159 2.43052 13.3993 2.66604C13.6397 2.90155 13.7782 3.2219 13.785 3.55835C13.7782 3.8948 13.6397 4.21515 13.3993 4.45066C13.159 4.68618 12.8358 4.81809 12.4993 4.81809C12.1628 4.81809 11.8397 4.68618 11.5993 4.45066C11.359 4.21515 11.2205 3.8948 11.2136 3.55835ZM15.7672 15.5101L12.4993 17.3932L9.23147 15.5101V11.7494L12.4993 9.86639L15.7672 11.7494V15.5101ZM22.1931 19.0967C21.8395 19.7101 21.0574 19.9217 20.4467 19.5682C19.8359 19.2146 19.6243 18.4271 19.9779 17.8137C20.3315 17.2003 21.1136 16.9887 21.7243 17.3423C22.3377 17.6958 22.5467 18.4807 22.1931 19.0967Z" fill="#1890FF" />
                                                        </svg>

                                                        <Select
                                                            allowClear={true}
                                                            defaultValue={deptId > 0 ? parseInt(deptId) : departmentId}
                                                            showSearch
                                                            placeholder="Department"
                                                            optionFilterProp="children"
                                                            onChange={(value) => {
                                                                setDepartmentId(value);
                                                                setParams({
                                                                    ...params,
                                                                    department_id: value
                                                                })
                                                            }}
                                                            filterOption={filterOption}
                                                            options={
                                                                departmentList && departmentList.map((val, k) => ({
                                                                    label: val?.department_name,
                                                                    value: val?.department_id,
                                                                }))
                                                            }
                                                        />

                                                    </div>
                                                    <div className="input-icons submit_btn_div">
                                                        <input type="submit" onClick={handleSubmit} className="btn search-submit" value="Search" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="filtering">
                                            <nav className='mr-3' aria-label="Page navigation">
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

                            <div className="row mt-5">
                                <div className="col-md-12">
                                    <div className='card card_transparent'>
                                        {
                                            (availableJobList && availableJobList.hrms_job?.length > 0) ? (
                                                availableJobList.hrms_job.map((val, key) => (
                                                    <React.Fragment key={key}>
                                                        <JobsInfocard type="Applied" jobData={val} />
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                <>
                                                    <DataNotFound />
                                                </>

                                            )
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="col-md-3">
                            <div className='card p-3 card_transparent'>
                                <div className="row">
                                    <div className="col-md-12 title_heading_col">
                                        <div>
                                            <h2>Recommended Jobs </h2>
                                        </div>
                                        {/* <div>
                                            <Link to="/available-jobs" className="see_all_jobs_btn">See more <i className="fas fa-arrow-right ms-2"></i> </Link>
                                        </div> */}
                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-md-12">
                                        {(recommendedJobList && recommendedJobList.hrms_job?.length > 0) ? recommendedJobList.hrms_job.map((val, key) => {
                                            return (
                                                <>
                                                    <JobsCard2 type="Applied" jobData={val} />
                                                </>
                                            )
                                        }) :
                                            (
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

            <Footer />
        </>
    )
}

