import moment from 'moment';
import React from 'react'
import { Link } from "react-router-dom";
import swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import API from "../../helpers/devApi";
import { swalError, swalSuccess } from '../../helpers/swal';

export function MyJobsInfocard({
    id,
    title,
    type,
    apply_status,
    saved_status,
    apply_date_time,
    department,
    designation,
    experience,
    address,
    deadline,
    intv,
    salary,
    min_salary,
    max_salary,
    fixed_salary,
    job_status,
    job_application_status,
    jobListFn
}) {
    const dispatch = useDispatch();
    const handleJobWithdraw = async (e, jobId) => {
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
            // await dispatch(jobAction.withdrawJobApplication(jobId));
            API.delete(`/hrms_job_application/${id}`).then((response) => {
                if (response.data.success) {
                    swalSuccess("Job Application Withdrawal Successfully");
                    dispatch(jobListFn);
                } else {
                    if (response.data.message) {
                        swalError(response.data.message);
                    } else {
                        swalError(response.message || "someting went wrong");
                    }
                }
            })
        }
    }

    return (
        <Link to={`/jobs-details/${id}`} rel="noopener noreferrer" className="short_jobs_info_card">
            <div className='left_box'>
                <h3>{title}</h3>
                <p><strong>{department}</strong></p>
                <ul>
                    <li className='d-flex align-items-center'><i className="fas fa-business-time"></i>{experience>0?experience+' Years':"Fresher"}</li>
                    <li className='d-flex align-items-center'><i className="fas fa-graduation-cap"></i> {designation}</li>
                    <li className='d-flex align-items-center'>
                        <i className="fa fa-money"></i>
                        {
                            salary === "salary_range" ?
                                `${min_salary} - ${max_salary} BDT`
                                : salary === "fixed" ? fixed_salary
                                    : salary}

                    </li>
                    <li className='d-flex align-items-center'>
                        <i className="fas fa-clock"></i> {type}
                    </li>
                    <li className='d-flex align-items-center'>
                        {address && (
                            <>
                                <i className="fas fa-map-marker-alt"></i> {address}
                            </>
                        )}
                    </li>

                </ul>
            </div>

            {/* <div className='right_box'>
                <div className='d-flex'>  
                    <h4 className='ml-3'><strong>{status}</strong></h4>  
                </div> 
            </div> */}

            <div className='right_box'>
                <div className='d-flex'>
                    {/* {intv && (
                        <p className='intv_btn mr-2'>{intv}</p>
                    )} */}

                    {saved_status && (
                        <p className='save_later_btn mr-2'>{saved_status}</p>
                    )}

                    {apply_status && (
                        <>
                            <p className='applied_btn mr-1'>{apply_status}</p>
                            {
                                job_application_status === 'Pending' && (
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleJobWithdraw(e, id) }
                                        } 
                                        className="withdraw-btn"
                                    >
                                        Withdraw
                                    </button>
                                )
                            }
                        </>
                    )}
                </div>

                {apply_date_time && (
                    <p className='apply_date_time'>

                        <strong>Applied Date :</strong>
                        {/* <br /> */}
                        <i className="fas fa-calendar-/alt mr-2"></i>
                        {apply_date_time ? moment(apply_date_time).format("DD MMMM YYYY") : "N/A"}
                    </p>
                )}
                {/* <h4><span class="text-dark">Job Status:</span> {job_status}</h4> */}
                {deadline && (
                    <p className='date'>
                        <strong>Deadline :</strong>
                        {/* <br /> */}
                        {/* <i className="fas fa-calendar-alt"></i> */}
                        {deadline ? moment(deadline).format("DD MMMM YYYY") : "N/A"}
                    </p>
                )}
            </div>
        </Link >
    )
} 