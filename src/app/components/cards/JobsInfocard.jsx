import moment from 'moment';
import React, { useMemo } from 'react'
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import swal from "sweetalert2";
import * as jobAction from "../../_redux/jobActions";
import * as ApplicantJobActions from "../../pages/jobs/_redux/applicantJobActions"
import { calculateDateRangeCount } from '../../helpers/remainingDays';
import { formatCurrency } from '../../helpers/common';

export function JobsInfocard(
    { jobData, type, userId, page, size }
) {
    const dispatch = useDispatch();
    const handleJobUnsave = async (e, jobId) => {
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
            await dispatch(jobAction.unsaveJob(jobId));
            await dispatch(ApplicantJobActions.getSavedJobList(userId, page, size));

        }
    }
    const handleJobWithdraw = async (e, jobId) => {
        // if (jobData?.hrms_job__status === "Pending" || "Published") {
            const result = await swal.fire({
                text: 'Do you want to withdrawal this job application??',
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                confirmButtonColor: "#3699FF",
                heightAuto: false, // Disable auto height to allow custom height
            });
            if (result.isConfirmed) {
                await dispatch(jobAction.withdrawJobApplication(jobId));
                await dispatch(ApplicantJobActions.getAppliedJobList(userId, page, size));

            }
        // } else {
        //     await swal.fire({
        //         text: `You can't withdrawal this job application now!!`,
        //         icon: "warning",
        //         heightAuto: false,
        //     });
        // }
    }

    const rangeCount = calculateDateRangeCount(jobData?.hrms_job__application_deadline);

    const today = moment().startOf('day');
    const deadline = moment(jobData?.hrms_job__application_deadline).startOf('day');

    return (
        <div className='short_jobs_info_card'>

            <div className='left_box'>
                <Link to={`/jobs-details/${jobData?.hrms_job__id}`} rel="noopener noreferrer" className="">
                    <h3>{jobData?.hrms_job__job_title}</h3>
                </Link>
                <p><strong>{jobData?.sys_departments__department_name}</strong></p>
                <ul>
                    <li className='d-flex'>
                        <i className="fas fa-business-time"></i>
                        <div> {jobData?.hrms_job__minimum_experience>0?jobData?.hrms_job__minimum_experience+' Years':"Fresher"}  </div>
                    </li>
                    <li className='d-flex'>
                        <i className="fas fa-clock"></i>
                        <div> {jobData?.hrms_job__position_status} </div>
                    </li>
                    <li className='d-flex'>
                        <i className="fas fa-graduation-cap"></i>
                        <div> {jobData?.sys_designation__designation_name} </div>
                    </li>
                    <li>
                        <i className="fa fa-money"></i>
                        <span>{
                            jobData?.hrms_job__salary === "salary_range" ?
                                `${formatCurrency(jobData.hrms_job__min_salary)} - ${formatCurrency(jobData.hrms_job__max_salary)}`
                                : jobData?.hrms_job__salary === "fixed" ? formatCurrency(jobData?.hrms_job__fixed_salary)
                                    : jobData?.hrms_job__salary}
                        </span>
                    </li>
                    <li className='d-flex'>
                        {jobData?.hrms_job__job_location_name && (
                            <>
                                <i className="fas fa-map-marker-alt"></i>
                                <div> {jobData?.hrms_job__job_location_name} </div>
                            </>
                        )}
                    </li>
                </ul>
            </div>
            <div className='right_box'>
                <div className='d-flex status_info_box'>
                    {/* {moment().isAfter(moment(jobData?.hrms_job__application_deadline)) ? */}
                    {today.isAfter(deadline) ?
                        (<p className='ml-3 expired_btn mr-2'><strong>Expired</strong></p>)
                        :
                        jobData?.hrms_job__status && (
                            <p className='ml-3 applied_btn mr-2'>
                                <strong>
                                    {/* {jobData?.hrms_job__status == 'Published' ? 'Live' : jobData?.hrms_job__status == 'Closed' ? 'Closed' : 'Recruitment Ongoing'} */}
                                    {jobData?.hrms_job__status == 'Published' || type === 'Applied' ? 'Live' : jobData?.hrms_job__status == 'Draft' ? 'Unpublished' : jobData?.hrms_job__status}
                                </strong>
                            </p>
                        )
                    }
                    {
                        type && type === 'Applied' ? (
                            <>
                                {
                                    jobData?.hrms_job__is_saved && <p className='ml-3 save_later_btn mr-2'><strong>Saved</strong></p>
                                }
                                {
                                    jobData?.hrms_job__is_applied && <p className='ml-3 applied_btn mr-2'><strong>Applied</strong></p>
                                }
                            </>
                        ) : ''
                    }
                    {type && type == "Saved" && (
                        <button onClick={(e) => { handleJobUnsave(e, jobData?.hrms_job__id) }} className="unsave_btn">Unsave</button>
                    )}
                    {type && type == "Withdraw" && jobData?.hrms_job_application__status === 'Pending' && (
                        <button onClick={(e) => { handleJobWithdraw(e, jobData?.hrms_job__id) }} className="withdraw-btn">Withdraw</button>
                    )}
                </div>
                {/* <h4><b>Job Status:</b> <span className='text-success'>{jobData?.hrms_job__status}</span></h4> */}
                <div className='remaining_date_div'>
                    <p>
                        <i className="fas fa-calendar-alt mr-2"></i>
                        {jobData?.hrms_job__application_deadline ? moment(jobData?.hrms_job__application_deadline).format("DD MMMM YYYY") : "N/A"}
                    </p>
                    {rangeCount && rangeCount> 0 && <p className='remaining_day'> 
                        Remaining {rangeCount} Days
                    </p>}
                </div>

            </div>

            {/* <div className='right_box'>
                <div className='d-flex'>
                    {intv && (
                        <p className='intv_btn mr-2'>{intv}</p>
                    )}

                    {type && (
                        <p className='applied_btn'>{type}</p>
                    )}

                    {status && (
                        <h4 className='ml-3'><strong>{status}</strong></h4>
                    )}
                </div>

                {apply_date_time && (
                    <p className='apply_date_time'>{apply_date_time}</p>
                )}
                

                <p className='date'><i className="fas fa-calendar-alt"></i> 10 Novenber 2023</p>
            </div> */}

        </div>
    )
} 