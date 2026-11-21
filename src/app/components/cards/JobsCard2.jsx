import React from 'react'
import { Link } from "react-router-dom";
import { calculateDateRangeCount } from '../../helpers/remainingDays';
import { formatCurrency } from '../../helpers/common';

export function JobsCard2({ jobData }) {

    const rangeCount = calculateDateRangeCount(jobData?.hrms_job__application_deadline);

    return (
        <Link to={`/jobs-details/${jobData?.hrms_job__id}`} className="jobs_card_style2">
            <h3>{jobData?.hrms_job__job_title}</h3>
            <div className="dept">
                <p>Dept: <span>{jobData?.sys_departments__department_name}</span></p>
                {/* <p>Full Time</p> */}
                
            </div>
            <div className="dept">
                <p>
                    Salary:
                    <span>{
                        jobData?.hrms_job__salary === "salary_range" ?
                            `${formatCurrency(jobData.hrms_job__min_salary)} - ${formatCurrency(jobData.hrms_job__max_salary)}`
                            : jobData?.hrms_job__salary === "fixed" ? formatCurrency(jobData?.hrms_job__fixed_salary)
                                : jobData?.hrms_job__salary}
                    </span>
                </p>
            </div>
            <div className="d-flex justify-content-between">
                {/* <p> Position: <span>{jobData?.hrms_job__position_status}</span>  </p> */}

                <p className="ps-3">Exp:
                    <span>
                        {/* {jobData?.hrms_job__minimum_experience}  yrs  */}
                        {jobData?.hrms_job__minimum_experience > 0 ? jobData?.hrms_job__minimum_experience + ' yrs' : "Fresher"}
                    </span>
                </p>

                {/* <p style={{ fontWeight: "700" }}><i className="fas fa-briefcase"></i> <span>{jobData?.hrms_job__position_category}</span></p> */}

                {rangeCount && rangeCount > 0 ? (
                    <p className="expried_day text-danger">Remaining {rangeCount} days</p>
                ) : ''}
            </div>
            {/* <button className="btn btn_job_card">{jobData?.hrms_job__position_status}</button> */}
            {/* <div className="saved">
                <div className="d-flex justify-content-between">
                    <p>{jobData?.hrms_job__is_saved ? 'Saved' : ''}</p>
                    <p>{jobData?.hrms_job__is_applied ? 'Applied' : ''}</p>
                </div>
            </div> */}

            <div className="saved">
                <div className="d-flex justify-content-between mt-1">

                    {jobData?.hrms_job__position_category ? <p className="icon_label_flex job_type"><i class="fi fi-rr-briefcase"></i> <span>{jobData?.hrms_job__position_category}</span></p> : <p></p>}


                    {
                        jobData?.hrms_job__is_applied ? (
                            <p className="icon_label_flex applied">
                                <i class="fi fi-rr-checkbox"></i>

                                <span>{jobData?.hrms_job__is_applied ? 'Applied' : ''}</span>
                            </p>
                        ) : jobData?.hrms_job__is_saved ? (
                            <p className="icon_label_flex saved_bookmark"> 
                                <svg xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="12" height="12"><path d="M2.849,23.55a2.954,2.954,0,0,0,3.266-.644L12,17.053l5.885,5.853a2.956,2.956,0,0,0,2.1.881,3.05,3.05,0,0,0,1.17-.237A2.953,2.953,0,0,0,23,20.779V5a5.006,5.006,0,0,0-5-5H6A5.006,5.006,0,0,0,1,5V20.779A2.953,2.953,0,0,0,2.849,23.55Z" /></svg>

                                <span>{jobData?.hrms_job__is_saved ? 'Saved' : ''}</span>
                            </p>
                        ) : ''
                    }
                </div>
            </div>
        </Link>
    )
} 