import React from 'react'

export function TitleCard({ title, children }) {
    return (
        <div className='card card_body_box mb-5'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card_header_with_edit_btn'>
                        <div className='title'>
                            <h2>{title}</h2>
                        </div>
                    </div>

                    <hr />
                </div>
            </div>

            {children}

        </div>
    )
}
