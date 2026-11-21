import React from 'react'

export default function CardSummary({ bgColor, icon = null, title = '', content = [] }) {
    return (
        <div className="card card-style-1" style={{ background: bgColor }}>
            <div className="header">
                <span> {icon}</span>
                <span className="title-name"> {title} </span>
            </div>

            <div className="content">
                <ul className="list-group list-group-flush">
                    {content.map(({ title, number }, i) => {
                        return <li className="list-group-item" key={i}>
                            <span>{title}</span>
                            <span className="badge badge-pill badge-light px-3">{number}</span>
                        </li>
                    })}

                </ul>
            </div>
        </div>
    )
} 