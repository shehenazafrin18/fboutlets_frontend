import React from 'react';
import { Link } from "react-router-dom"

export function DepartmentCard({
    title,
    total,
    dept_id,
    dept_code
}) {
    return (
        <div className="col mb-5">
            <div className="card department_component_card">
                <Link to={`/available-jobs/${dept_id}`} className="department_card">
                    <h3>{title.length > 15 ? title.slice(0, 15) + '...' : title}</h3>
                    <span className="badge bg-orange">{total}</span>
                </Link>
            </div>
        </div>
    )
} 