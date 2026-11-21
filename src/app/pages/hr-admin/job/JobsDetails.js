import React, { useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import * as jobAction from "../../../_redux/jobActions"
import moment from 'moment';
import { formatCurrency } from '../../../helpers/common';

export default function JobsDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { user, jobDetails } = useSelector((state) => ({
        user: state.auth.user,
        jobDetails: state.job.jobDetails,
    }));

    useEffect(() => {
        dispatch(jobAction.fetchJobDetailsById(user?.length !== 0 ? true : false, id));
    }, [dispatch, user, id]);

    return (
        <>
            <div className='breadcrum_div2 hr-admin-job-details-breadcrum position-relative'>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"> <Link to="/hr-admin/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item"> <Link to="/hr-admin/jobs/jobs-list">Job List</Link></li>
                        <li className="breadcrumb-item"> <span>Job Details</span></li>
                    </ol>
                </nav>

                <h2 className='mb-4'>
                    <Link to="/hr-admin/jobs/jobs-list">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M19.6423 8.98172H3.96999L13.3503 0.838867C13.5003 0.707617 13.4093 0.463867 13.2111 0.463867H10.8405C10.7361 0.463867 10.6369 0.501367 10.5593 0.568331L0.436949 9.35137C0.344241 9.43173 0.269889 9.53108 0.218931 9.64269C0.167974 9.7543 0.141602 9.87555 0.141602 9.99824C0.141602 10.1209 0.167974 10.2422 0.218931 10.3538C0.269889 10.4654 0.344241 10.5648 0.436949 10.6451L10.6182 19.4817C10.6584 19.5165 10.7066 19.5353 10.7575 19.5353H13.2084C13.4066 19.5353 13.4977 19.2889 13.3477 19.1603L3.96999 11.0174H19.6423C19.7602 11.0174 19.8566 10.921 19.8566 10.8032V9.19601C19.8566 9.07815 19.7602 8.98172 19.6423 8.98172Z" fill="#40A9FF" />
                        </svg>
                    </Link>
                    <span className='ml-3'> Job Details</span>
                </h2>

                <div className='right_btn_group_div mt-4'>
                    <Link to={`/hr-admin/applicant-list/${jobDetails?.id}`} className="btn_view">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12.7502 0.751892H1.25024C0.973682 0.751892 0.750244 0.97533 0.750244 1.25189V12.7519C0.750244 13.0285 0.973682 13.2519 1.25024 13.2519H6.87525C6.94399 13.2519 7.00025 13.1956 7.00025 13.1269V12.2519C7.00025 12.1831 6.94399 12.1269 6.87525 12.1269H1.87524V1.87689H12.1252V6.87689C12.1252 6.94564 12.1815 7.00189 12.2502 7.00189H13.1252C13.194 7.00189 13.2502 6.94564 13.2502 6.87689V1.25189C13.2502 0.97533 13.0268 0.751892 12.7502 0.751892ZM9.20806 8.36752L10.0237 7.55189C10.0402 7.53529 10.0517 7.51438 10.057 7.49155C10.0622 7.46871 10.0609 7.44487 10.0533 7.42273C10.0456 7.40059 10.0319 7.38105 10.0137 7.36631C9.99547 7.35158 9.97349 7.34225 9.95024 7.33939L7.14712 7.01127C7.06743 7.00189 6.99868 7.06908 7.00806 7.15033L7.33618 9.95346C7.34868 10.0566 7.47524 10.1003 7.54868 10.0269L8.36743 9.20814L12.3706 13.2113C12.419 13.2597 12.4987 13.2597 12.5471 13.2113L13.2096 12.5488C13.2581 12.5003 13.2581 12.4206 13.2096 12.3722L9.20806 8.36752Z" fill="white" />
                        </svg>
                        <span className='ml-3'>View Applicants</span>
                    </Link>
                </div>
            </div>

            <div className='hr-admin-job-details'>
                <div className='row my-5'>
                    <div className='col-md-3'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Job Title: </div>
                            <div className='item_data'> {jobDetails?.job_title}</div>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Department:</div>
                            <div className='item_data'> {jobDetails?.sys_departments?.department_name} </div>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Job Code:</div>
                            <div className='item_data'> {jobDetails?.job_code} </div>
                        </div>
                    </div>
                </div>

                <div className='row mb-5'>
                    <div className='col-md-12 title_box'>
                        <h4>General Information</h4>
                    </div>
                </div>

                <div className='row mb-3'>
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Requisition Code:</div>
                            <div className='item_data'> {jobDetails?.requisition_code} </div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Designation:</div>
                            <div className='item_data'>{jobDetails?.sys_designation?.designation_name}</div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Recruitment Type:</div>
                            <div className='item_data'> {jobDetails?.recruitment_type} </div>
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Working Hour Schedule:</div>
                            <div className='item_data'> {jobDetails?.working_hours}</div>
                        </div>
                    </div>
                    {jobDetails?.no_of_vacancy && (
                        <div className='col-md-4'>
                            <div className='card_items_row_flex'>
                                <div className='label_box'>No. of Position:</div>
                                <div className='item_data'>{jobDetails?.no_of_vacancy}</div>
                            </div>
                        </div>
                    )}
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Position Purpose:</div>
                            <div className='item_data'>{jobDetails?.position_purpose}</div>
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    {jobDetails?.position_type && (
                        <div className='col-md-4'>
                            <div className='card_items_row_flex'>
                                <div className='label_box'>Position Type:</div>
                                <div className='item_data'> {jobDetails?.position_type} </div>
                            </div>
                        </div>
                    )}
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Expected Joining Date:</div>
                            <div className='item_data'> {moment(jobDetails?.approximate_start_date).format("DD-MM-YYYY")} </div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Recruitment Remarks:</div>
                            <div className='item_data'> {jobDetails?.recruitment_type_note} </div>
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Application Deadline:</div>
                            <div className='item_data text-danger'> {moment(jobDetails?.application_deadline).format("DD-MM-YYYY")} </div>
                        </div>
                    </div>
                </div>


                <div className='row mb-5'>
                    <div className='col-md-12 title_box'>
                        <h4>Organizational Relationships</h4>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Reporting To:</div>
                            <div className='item_data'>{jobDetails?.reportings_to?.designation_name} </div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Internal Contact Person:</div>
                            <div className='item_data'>{jobDetails?.internals_contact?.full_name}</div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>External Contact:</div>
                            <div className='item_data'>
                                <div dangerouslySetInnerHTML={{ __html: jobDetails?.external_contacts }} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    {/* <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>External Contact Person’s Phone:</div>
                            <div className='item_data'>  </div>
                        </div>
                    </div> */}
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Workstation:</div>
                            {/* <div className='item_data'>{jobDetails?.hrms_work_station?.name}</div> */}
                            <div className='item_data'>{jobDetails?.work_station}</div>
                        </div>
                    </div>
                </div>

                <div className='row mb-5'>
                    <div className='col-md-12 title_box'>
                        <h4>Descriptions</h4>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Salary Type:</div>
                            <div className='item_data'>
                                {
                                    jobDetails?.salary === "salary_range" ?
                                        'Salary Range'
                                        : jobDetails?.salary === "fixed" ? "Fixed"
                                            : jobDetails?.salary}
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Salary Range:</div>
                            <div className='item_data'>
                                {
                                    jobDetails?.salary === "salary_range" ?
                                        `: ${formatCurrency(jobDetails.min_salary)} - ${formatCurrency(jobDetails.max_salary)}`
                                        : jobDetails?.salary === "fixed" ? formatCurrency(jobDetails?.fixed_salary)
                                            : jobDetails?.salary}
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Experience:</div>
                            <div className='item_data'>{jobDetails?.minimum_experience ? jobDetails?.minimum_experience + ' Years' : 'Fresher'}</div>
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    {/* <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>External Contact Person’s Phone:</div>
                            <div className='item_data'></div>
                        </div>
                    </div> */}
                    <div className='col-md-4'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Job Location:</div>
                            <div className='item_data'>{jobDetails?.job_location_name}</div>
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-md-6 col_6_lab_itm'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>About Company:</div>
                            <div className='item_data'>
                                Brac University (BracU) established in 2001 is located in Dhaka Bangladesh. BracU follows a liberal arts approach to education which nurtures fresh ideas and gives new impetus to the field of tertiary education.
                                It ensures a high quality of education and aims to meet the demands of contemporary times.
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 col_6_lab_itm'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Key Responsibilities:</div>
                            <div className='item_data'>
                                {/* <div dangerouslySetInnerHTML={{ __html: jobDetails?.job_responsibilities }} /> */}
                                <div dangerouslySetInnerHTML={{ __html: jobDetails?.specific_duties_Responsibilites }} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-md-6 col_6_lab_itm'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Educational Requirements:</div>
                            <div className='item_data'>
                                {/* <div dangerouslySetInnerHTML={{ __html: jobDetails?.educational_requirements }} /> */}
                                { jobDetails?.minimum_education ? `${jobDetails?.minimum_education}${jobDetails?.maximum_education ? ' - '+jobDetails?.maximum_education : ''}` : '' }
                            </div>
                        </div>
                    </div>
                    {/* <div className='col-md-6 col_6_lab_itm'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Number of Publication:</div>
                            <div className='item_data'> */}
                                {/* <ul>
                                    <li>At least 2 paper published and 1 </li>
                                    <li>as first author</li>
                                </ul> */}
                            {/* </div>
                        </div>
                    </div> */}
                </div>
                <div className='row mb-3'>
                    {/* <div className='col-md-6 col_6_lab_itm'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Additional Requirements:</div>
                            <div className='item_data'>
                                <div dangerouslySetInnerHTML={{ __html: jobDetails?.additional_requirements }} />
                            </div>
                        </div>
                    </div> */}
                    <div className='col-md-6 col_6_lab_itm'>
                        <div className='card_items_row_flex'>
                            <div className='label_box'>Compensation & Other Benefits:</div>
                            <div className='item_data'>
                                <div dangerouslySetInnerHTML={{ __html: jobDetails?.compensation_and_otherb_enefits }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}  