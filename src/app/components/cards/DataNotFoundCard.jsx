import React from 'react'

export function DataNotFoundCard({subtitle, title}) {
    return (
        <div className="not_found_card">
            <img className='icon' src="/images/data_not_found.png" alt="No Data Found!" />
            <h1 className="not_found">{title}</h1>
            <p className="page">{subtitle}</p>
        </div>
    )
} 