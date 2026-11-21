import React, { useEffect, useState } from 'react'
import { size as lodashSize } from "lodash";
import { Link } from "react-router-dom"
import { JobsCard, JobsCardComponent } from "../cards";
import Slider from 'react-slick';
import { useDispatch, useSelector } from 'react-redux';
import * as jobAction from "../../_redux/jobActions"

export function Recommended() {
    const dispatch = useDispatch();
    const {
        user, recommendedJobList
    } = useSelector((state) => ({
        user: state.auth.user,
        recommendedJobList: state.job.recommendedJobList
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
        dispatch(jobAction.fetchAllRecommendedJob(params, page, size, lodashSize(user) ? true : false));
    }, [dispatch, user, params]);



    var RecommendedSlidersettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
 

    return (
        <>
            <div className="recommended-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 title_heading_col">
                            <div>
                                <h2>Recommended Jobs</h2>
                            </div>
                            <div>
                                <Link to="available-jobs" className="see_all_jobs_btn">See all jobs <i className="fas fa-arrow-right"></i> </Link>
                            </div>
                        </div>

                        {recommendedJobList?.hrms_job?.length > 4 ?
                            <div className='col-md-12 recommended_jobs_slider mt-5'>
                                <Slider {...RecommendedSlidersettings}>
                                    {recommendedJobList?.hrms_job?.map((item, i) => (
                                        <JobsCardComponent
                                            key={i}
                                            title={item.hrms_job__job_title}
                                            dept={item.sys_departments__department_name}
                                            exp={item.hrms_job__minimum_experience}
                                            type={item.hrms_job__position_category}
                                            jobId={item?.hrms_job__id}
                                            salary={item?.hrms_job__salary}
                                            min_salary={item?.hrms_job__min_salary}
                                            max_salary={item?.hrms_job__max_salary}
                                            fixed_salary={item?.hrms_job__fixed_salary}
                                            application_deadline={item?.hrms_job__application_deadline}
                                            is_saved={item?.hrms_job__is_saved}
                                            is_applied={item?.hrms_job__is_applied}
                                        />
                                    ))}
                                </Slider>
                            </div>
                            :
                            <div className='col-md-12 recommended_jobs_slider d-flex mt-5'>
                                {recommendedJobList?.hrms_job?.map((item, i) => (
                                    <JobsCard
                                        key={i}
                                        title={item.hrms_job__job_title}
                                        dept={item.sys_departments__department_name}
                                        exp={item.hrms_job__minimum_experience}
                                        type={item.hrms_job__position_status}
                                        jobId={item?.hrms_job__id}
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
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

