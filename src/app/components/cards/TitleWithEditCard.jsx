import React from 'react';

export function TitleWithEditCard({ 
    title, 
    children, 
    showEdit, 
    setShowEdit, 
    btn_label, 
    btn_icon, 
    btn, 
    setAction,
    setEduId,
    setSelectedData,
    initalTr
}) {

    return (
        <>

            <div className='card card_body_box mb-5'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='card_header_with_edit_btn'>
                            <div className='title'>
                                <h2>{title}</h2>
                            </div>
                            <div className='edit_btn_group'>

                                {btn_label ? <>
                                    <button className="btn btn-outline-default mr-3"
                                        onClick={() => { 
                                            { setShowEdit && (setShowEdit(true))} 
                                            { setAction && ( setAction('Add') )}  
                                            { setEduId && ( setEduId(0)  )}  
                                            { setSelectedData && ( setSelectedData(initalTr) )}  
                                        }}
                                    >
                                        <i className={btn_icon}></i> {btn_label}
                                    </button>
                                </>
                                    :
                                    <> 
                                        {btn === 'no' ? ' '
                                            : <>
                                                {!showEdit ? (
                                                    <>
                                                        <button className="btn btn-outline-default mr-3"
                                                            onClick={() => {
                                                                setShowEdit(true);
                                                            }}
                                                        >
                                                            <i className="fas fa-edit"></i> Edit
                                                        </button>
                                                    </>
                                                ) : <>
                                                    <button className="btn btn-outline-default mr-3"
                                                        onClick={() => {
                                                            setShowEdit(false);
                                                        }}
                                                    >
                                                        <i className="fas fa-eye"></i> View
                                                    </button>
                                                </>}

                                            </>
                                        } 
                                    </>}
                            </div>
                        </div>

                        <hr />
                    </div>
                </div>

                {children}

            </div>
        </>
    )
}

