// import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { calculateDateRangeCount } from "../../helpers/remainingDays";

export function JobsCard({
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
        <Link to={`jobs-details/${jobId}`} className="jobs_card_style1">
            <h3>{title.length > 20 ? title.slice(0, 20) + '...' : title}</h3>

            <div className="department_box">
                <div className="dept_lable">
                    <p>Department </p>
                </div>
                <div className="dept_content d-flex justify-content-between">
                    <div>
                        <p>
                            <strong> : </strong>
                            <span> {dept.length > 20 ? dept.slice(0, 20) + '...' : dept}</span>
                        </p>
                    </div>
                    <div>
                        <p className="ps-3">Exp: <span> {exp>0?exp:"Fresher"}</span></p>
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
                                `: ${min_salary} - ${max_salary} BDT`
                                : salary === "fixed" ? fixed_salary
                                    : salary}
                        </span>
                    </p>
                </div>
            </div>


            {/* <div className="dept">
                <p>Department: <span>{dept.length > 20 ? dept.slice(0, 20) + '...' : dept}</span></p>
                <p className="ps-3">Exp: <span>{exp}</span></p>
            </div> */}
            <div className="salary">
                {/* <p>
                    Salary:
                    <span>{
                        salary === "salary_range" ?
                            `: ${min_salary} - ${max_salary} BDT`
                            : salary === "fixed" ? fixed_salary
                                : salary}
                    </span>
                </p> */}
                <div className="d-flex justify-content-between">
                    {type ? <p style={{ fontWeight: "700" }}><i className="fas fa-briefcase"></i> <span>{type}</span></p> : <p></p>}

                    {rangeCount && rangeCount > 0 ? (
                        <p className="expried_day text-danger">Remaining {rangeCount} days</p>
                    ) : ''}
                </div>
                {/* <div className="d-flex justify-content-between">
                    <p> Position: <span>{type}</span>  </p>
                    {remaining ? (
                        <p className="expried_day text-danger">Remaining {remaining} days</p>
                    ): ''}
                </div> */}
            </div>
            {/* <button className="btn btn_job_card">{type}</button> */}

            <div className="saved">
                <div className="d-flex justify-content-between">
                    <p>{is_saved ? 'Saved' : ''}</p>
                    <p>{is_applied ? 'Applied' : ''}</p>
                </div>
            </div>
        </Link>
    )
} 
