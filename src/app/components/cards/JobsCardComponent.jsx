import React from "react";
import { Link } from "react-router-dom";
import { calculateDateRangeCount } from "../../helpers/remainingDays";
import { formatCurrency } from "../../helpers/common"

export function JobsCardComponent({
    jobId,
    title,
    dept,
    exp,
    type,
    salary,
    min_salary,
    max_salary,
    fixed_salary,
    application_deadline,
    is_saved,
    is_applied
}) {

    const rangeCount = calculateDateRangeCount(application_deadline);

    return (
        <div className="col mb-5">
            <div className="card jobs_component_card">
                <Link to={`jobs-details/${jobId}`} className="jobs_card">
                    <h3>{title.length > 20 ? title.slice(0, 20) + '...' : title}</h3>

                    <div className="department_box">
                        <div className="dept_lable">
                            <p>Department </p>
                        </div>
                        <div className="dept_content d-flex justify-content-between">
                            <div>
                                <p>
                                    <strong> : </strong>
                                    <span> {dept.length > 25 ? dept.slice(0, 25) + '...' : dept}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="department_box">
                        <div className="dept_lable">
                            <p>Salary </p>
                        </div>
                        <div className="dept_content">
                            <p>
                                <strong> : </strong>
                                <span>
                                    {salary === "salary_range" ?
                                        `: ${formatCurrency(min_salary)} - ${formatCurrency(max_salary)}`
                                        : salary === "fixed" ? formatCurrency(fixed_salary)
                                            : salary}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="salary">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="ps-3">Exp: <span>{exp > 0 ? exp : "Fresher"}</span></p>
                            </div>

                            {rangeCount && rangeCount > 0 ? (
                                <p className="expried_day text-danger">Remaining {rangeCount} days</p>
                            ) : ''}
                        </div>
                    </div>

                    <div className="saved">
                        <div className="d-flex justify-content-between mt-1">
                            {type ? <p className="icon_label_flex job_type"><i class="fi fi-rr-briefcase"></i> <span>{type}</span></p> : <p></p>}


                            {
                                is_applied ? (
                                    <p className="icon_label_flex applied">
                                        <i class="fi fi-rr-checkbox"></i> 
                                        
                                        <span>{is_applied ? 'Applied' : ''}</span>
                                    </p>
                                ) : is_saved ? (
                                    <p className="icon_label_flex saved_bookmark">
                                        {/* <i class="fi fi-rr-bookmark"></i> */} 
                                        <svg xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="12" height="12"><path d="M2.849,23.55a2.954,2.954,0,0,0,3.266-.644L12,17.053l5.885,5.853a2.956,2.956,0,0,0,2.1.881,3.05,3.05,0,0,0,1.17-.237A2.953,2.953,0,0,0,23,20.779V5a5.006,5.006,0,0,0-5-5H6A5.006,5.006,0,0,0,1,5V20.779A2.953,2.953,0,0,0,2.849,23.55Z"/></svg>

                                        <span>{is_saved ? 'Saved' : ''}</span>
                                    </p>
                                ) : ''
                            }
                        </div>
                    </div>

                </Link>
            </div>
        </div>
    )
} 