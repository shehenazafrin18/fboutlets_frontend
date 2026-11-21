import React, { useEffect, useState } from 'react';
import { size as lodashSize } from "lodash";
import { Link } from "react-router-dom";
import { JobsCard, JobsCardComponent } from '../cards';
import { useDispatch, useSelector } from 'react-redux';
import * as jobAction from "../../_redux/jobActions"


export function AvailableJobs() {
    const dispatch = useDispatch();
    const { user, availableJobList } = useSelector((state) => ({
        user: state.auth.user,
        availableJobList: state.job.availableJobList,
    }));

    const [params, setParams] = useState({
        status: "Published",
        department_id: null
    });
    const page = 1;
    const size = 10;

    // useEffect(() => {
    //     if (user?.data) {
    //         setParams({ ...params, department_id: user.data.department_id });
    //     }
    // }, [user]);

    useEffect(() => {
        dispatch(jobAction.fetchAllAvailableJob(params, page, size, lodashSize(user) ? true : false));
    }, [dispatch, user]);

    return (
        <>
            <div className="available-jobs-section">
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12 title_heading_col">
                            <div>
                                <h2>Available Jobs</h2>
                            </div>
                            <div>
                                <Link to="available-jobs" className="see_all_jobs_btn">See all jobs <i className="fas fa-arrow-right"></i> </Link>
                            </div>
                        </div>





                        <div className="col-md-12 mt-5">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-5 g-4 mt-5">

                                {availableJobList && availableJobList.hrms_job && availableJobList.hrms_job.map((item, i) => (
                                    <JobsCardComponent
                                        key={i}
                                        jobId={item?.hrms_job__id}
                                        title={item.hrms_job__job_title}
                                        dept={item.sys_departments__department_name}
                                        exp={item.hrms_job__minimum_experience}
                                        type={item.hrms_job__position_category}
                                        salary={item?.hrms_job__salary}
                                        min_salary={item?.hrms_job__min_salary}
                                        max_salary={item?.hrms_job__max_salary}
                                        fixed_salary={item?.hrms_job__fixed_salary}
                                        application_deadline={item?.hrms_job__application_deadline}
                                        is_saved={item?.hrms_job__is_saved}
                                        is_applied={item?.hrms_job__is_applied}
                                    />
                                ))} 

                            </div>
                        </div> 
                        
                    </div>
                </div>
            </div>
        </>
    )
} 