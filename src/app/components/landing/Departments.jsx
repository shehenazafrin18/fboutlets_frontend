import React, { useEffect } from 'react'

import { DepartmentCard } from "../cards"
import { useDispatch, useSelector } from 'react-redux';
import { fetchjobsDepartmentData } from '../../_redux/jobsDepartmentSlice';

export function Departments() {
    const dispatch = useDispatch();
    const {
        user
    } = useSelector((state) => state.auth);

    const { jobsDepartmentList } = useSelector((state) => state);

    useEffect(() => {
        dispatch(fetchjobsDepartmentData());
    }, [dispatch, user]);


    return (
        <>
            <div className="jobs-departments-section">
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12 title_heading_col">
                            <div>
                                <h2>Department wise Jobs</h2>
                            </div>
                        </div>

                        <div className="col-md-12 mt-5">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-5 g-4 mt-5"> 
                                {jobsDepartmentList?.data?.map((item, i) => (
                                    <>
                                        <DepartmentCard
                                            key={i}
                                            title={item.department_name}
                                            total={item.job_count}
                                            dept_id={item.department_id}
                                            dept_code={item.department_code}
                                        />
                                    </>
                                ))}

                            </div>
                        </div>


                        {/* <div className="col-md-12 departments_jobs mt-5">

                            {jobsDepartmentList?.data?.map((item, i) => (
                                <>
                                    <DepartmentCard
                                        key={i}
                                        title={item.department_name}
                                        total={item.job_count}
                                        dept_id={item.department_id}
                                        dept_code={item.department_code}
                                    />
                                </>
                            ))}
 
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
} 
