import React, { Fragment, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { ProfileViewCard } from '../../components/cards';
import { useDispatch, useSelector } from 'react-redux';
import * as Action from "../my-profile/_redux/recruitementActions";
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import { yearMonthDifference } from '../../helpers/yearMonthDifference';
import { ItemsLabelRow } from '../../components/toolkit/ItemsLabelRow';
import { Tooltip } from 'antd';

export default function ShortResumeView() {
    const componentRef = useRef();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { applicantsInfo, educationList, trainingList, experienceList, referenceInfo, languageInfo, portfolioInfo, publicationInfo, profesionalCertificatesList } = useSelector(
        ({ recruitement }) => ({
            applicantsInfo: recruitement.applicantsInfo,
            // additionalInfo: recruitement.additionalInfo,
            educationList: recruitement.educationList,
            trainingList: recruitement.trainingList,
            experienceList: recruitement.experienceList,
            referenceInfo: recruitement.referenceInfo,
            languageInfo: recruitement.languageInfo,
            portfolioInfo: recruitement.portfolioInfo,
            publicationInfo: recruitement.publicationInfo,
            profesionalCertificatesList: recruitement.profesionalCertificatesList,
        }),
    );

    useEffect(() => {
        if (user?.data?.applicant_id) {
            dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
            dispatch(Action.getAllEducationByApplicants(user?.data?.applicant_id));
            // dispatch(Action.getAdditionalInfoByApplicants(user?.data?.applicant_id));
            dispatch(Action.getTrainingByApplicants(user?.data?.applicant_id));
            dispatch(Action.getExperienceByApplicants(user?.data?.applicant_id));
            dispatch(Action.getLanguageInfoByApplicants(user?.data?.applicant_id));
            dispatch(Action.getReferenceInfoByApplicants(user?.data?.applicant_id));
            dispatch(Action.getPortfolioInfoByApplicants(user?.data?.applicant_id));
            dispatch(Action.getProfessionalCertificatesByApplicants(user?.data?.applicant_id));
            dispatch(Action.getPublicationInfoByApplicants(user?.data?.applicant_id));
        }
    }, [user, dispatch]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    return (
        <>
            <div className='breadcrum_div'>
                <div>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/"> Home </Link></li>
                            <li className="breadcrumb-item">View Resume</li>
                        </ol>
                    </nav>
                </div>

                <div>
                    <button className='btn btn-link' onClick={handlePrint}>
                        Download Resume

                        <svg className='mr-2' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M11.9344 11.5032C11.918 11.4728 11.9016 11.4587 11.8828 11.4564C11.8148 11.5337 11.8313 12.1946 11.9461 12.6611C12.0398 12.3423 12.0563 11.7118 11.9344 11.5032ZM11.8969 14.3275C11.7164 14.7962 11.4563 15.4361 11.1445 16.0009C11.2383 15.9634 11.3344 15.9236 11.4328 15.8837C11.8453 15.715 12.307 15.5251 12.8133 15.4103C12.4641 15.1337 12.1477 14.7611 11.8969 14.3275Z" fill="#E6F7FF" />
                            <path d="M12.5156 8.25V3.1875H5.4375V20.8125H18.5625V9.23438H13.5C13.2389 9.23438 12.9885 9.13066 12.8039 8.94606C12.6193 8.76145 12.5156 8.51107 12.5156 8.25ZM13.8047 14.9906C14.182 14.9461 14.5219 14.925 14.843 14.9367C15.143 14.9461 15.3961 14.9836 15.593 15.0563C15.5977 15.0586 15.6 15.0586 15.6047 15.0609C15.6141 15.0656 15.6234 15.068 15.6328 15.0727C15.6445 15.0773 15.6586 15.082 15.6703 15.0891C15.6727 15.0914 15.6773 15.0914 15.6797 15.0938C15.7758 15.1359 15.8555 15.1875 15.9164 15.2484C16.1297 15.4617 16.193 15.8602 16.0617 16.1766C15.9867 16.357 15.7875 16.657 15.2812 16.657C14.7703 16.657 14.018 16.4297 13.357 16.0758C12.7594 16.1766 12.0984 16.4016 11.4609 16.6172C11.325 16.6641 11.1844 16.7109 11.0484 16.7555C10.1578 18.2836 9.48984 18.6164 9.07734 18.6164C8.97891 18.6164 8.89453 18.5953 8.82422 18.5695C8.6625 18.5086 8.52422 18.382 8.4375 18.218C8.41641 18.1781 8.4 18.1383 8.38594 18.0961C8.34844 17.9836 8.33672 17.8711 8.35547 17.7773L8.36953 17.7141C8.37188 17.7094 8.37187 17.7047 8.37422 17.7C8.37891 17.6836 8.38359 17.6672 8.39062 17.6508C8.39062 17.6484 8.39297 17.6461 8.39297 17.6437C8.48906 17.3648 8.71172 17.0953 9.04219 16.8328C9.33047 16.6031 9.67734 16.3945 10.118 16.1672C10.4906 15.5109 10.9992 14.407 11.318 13.65C11.0648 12.6703 10.9266 11.9016 11.0813 11.3391C11.1023 11.2617 11.1398 11.1891 11.1891 11.1258C11.1937 11.1211 11.1961 11.1164 11.2008 11.1117C11.2031 11.1094 11.2031 11.107 11.2055 11.107C11.3531 10.9312 11.6016 10.8281 11.8641 10.8375C12.2531 10.8539 12.5602 11.107 12.6375 11.543C12.6773 11.7305 12.6891 11.9297 12.682 12.1453V12.1617C12.682 12.1734 12.682 12.1852 12.6797 12.1969C12.6633 12.5086 12.6094 12.8203 12.5086 13.2445C12.4992 13.282 12.4898 13.3195 12.4805 13.3664L12.457 13.4625L12.4547 13.4695C12.457 13.4742 12.457 13.4766 12.4594 13.4813L12.5016 13.5867C12.5039 13.5938 12.5086 13.6031 12.5109 13.6102C12.5273 13.6477 12.5438 13.6875 12.5602 13.7227V13.725C12.7641 14.1656 13.0219 14.5078 13.3547 14.782C13.4555 14.8641 13.5633 14.9391 13.6805 15.0117C13.7227 15 13.7625 14.9953 13.8047 14.9906Z" fill="#E6F7FF" />
                            <path d="M9.17578 17.836C9.30937 17.7328 9.55547 17.4961 9.88125 17.0227C9.63984 17.243 9.33281 17.5477 9.17578 17.836ZM15.525 15.8907L15.5297 15.8836H15.5344C15.5484 15.8743 15.5461 15.8672 15.5437 15.8625C15.5414 15.8602 15.4383 15.6446 14.4867 15.6891C15.314 16.0149 15.5062 15.9024 15.525 15.8907Z" fill="#E6F7FF" />
                            <path d="M20.0297 6.76406L14.9859 1.72031C14.8453 1.57969 14.6555 1.5 14.4562 1.5H4.5C4.08516 1.5 3.75 1.83516 3.75 2.25V21.75C3.75 22.1648 4.08516 22.5 4.5 22.5H19.5C19.9148 22.5 20.25 22.1648 20.25 21.75V7.29609C20.25 7.09688 20.1703 6.90469 20.0297 6.76406ZM14.1094 3.22969L18.5203 7.64062H14.1094V3.22969ZM18.5625 20.8125H5.4375V3.1875H12.5156V8.25C12.5156 8.51107 12.6193 8.76145 12.8039 8.94606C12.9885 9.13066 13.2389 9.23438 13.5 9.23438H18.5625V20.8125Z" fill="#1890FF" />
                            <path d="M12.5603 13.7181C12.5415 13.6783 12.5251 13.6408 12.5087 13.6033C12.5064 13.5962 12.5017 13.5869 12.4993 13.5798L12.4572 13.4744C12.4548 13.4697 12.4548 13.4673 12.4525 13.4626L12.4548 13.4556L12.4595 13.4298C12.5533 13.0478 12.6611 12.6025 12.6798 12.1548V12.1384C12.6868 11.9369 12.6751 11.7353 12.6329 11.5384C12.5439 11.0392 12.1759 10.8447 11.8618 10.8306C11.597 10.8189 11.3509 10.9244 11.2033 11.0978C11.2009 11.1001 11.2009 11.1025 11.1986 11.1025C11.1939 11.1072 11.1892 11.1119 11.1868 11.1165C11.1376 11.1798 11.1001 11.2525 11.079 11.3298C10.9244 11.8923 11.0626 12.6611 11.3158 13.6408C10.997 14.4001 10.4884 15.5017 10.1158 16.158V16.1603C9.46654 16.4955 8.61342 16.9994 8.39076 17.6345C8.39076 17.6369 8.38842 17.6392 8.38842 17.6416C8.38373 17.658 8.3767 17.6744 8.37201 17.6908C8.36967 17.6955 8.36967 17.7002 8.36733 17.7048C8.36264 17.7259 8.35561 17.747 8.35326 17.7681C8.33217 17.8619 8.34389 17.9744 8.38373 18.0869C8.39779 18.1291 8.4142 18.1689 8.43529 18.2088C8.52201 18.3728 8.66029 18.4994 8.82201 18.5603C8.89232 18.5861 8.9767 18.6072 9.07514 18.6072C9.48764 18.6072 10.1556 18.2744 11.0462 16.7462C11.1822 16.7017 11.3228 16.6548 11.4587 16.608C12.0962 16.3923 12.7572 16.1673 13.3548 16.0666C14.0157 16.4205 14.7681 16.6478 15.279 16.6478C15.7853 16.6478 15.9845 16.3478 16.0595 16.1673C16.1907 15.8509 16.1275 15.4525 15.9142 15.2392C15.8532 15.1783 15.7736 15.1267 15.6775 15.0845C15.6751 15.0822 15.6704 15.0822 15.6681 15.0798C15.6564 15.0751 15.6423 15.0705 15.6306 15.0634C15.6212 15.0587 15.6118 15.0564 15.6025 15.0517C15.5978 15.0494 15.5954 15.0494 15.5907 15.047C15.2111 14.9111 14.6134 14.89 13.8025 14.9814L13.6782 14.9955C13.5611 14.9251 13.4533 14.8478 13.3525 14.7658C13.0197 14.5009 12.7642 14.1611 12.5603 13.7181ZM9.17592 17.8361C9.33295 17.5478 9.63998 17.2431 9.88138 17.0228C9.5556 17.4962 9.30951 17.733 9.17592 17.8361ZM11.8829 11.4564C11.9017 11.4587 11.9181 11.4728 11.9345 11.5033C12.0564 11.7119 12.04 12.3423 11.9462 12.6611C11.8314 12.1947 11.815 11.5337 11.8829 11.4564ZM11.4329 15.8837C11.3345 15.9236 11.2384 15.9634 11.1447 16.0009C11.4564 15.4361 11.7165 14.7962 11.897 14.3275C12.1478 14.7611 12.4642 15.1337 12.8134 15.4103C12.3072 15.5251 11.8454 15.715 11.4329 15.8837ZM15.5439 15.8626C15.5462 15.8673 15.5486 15.8744 15.5345 15.8837H15.5298L15.5251 15.8908C15.5064 15.9025 15.3142 16.015 14.4868 15.6892C15.4384 15.6447 15.5415 15.8603 15.5439 15.8626Z" fill="#1890FF" />
                        </svg>
                    </button>
                </div>

                <div className='viewing_btn'>
                    Viewing <Link to={`/resume/view`}>Details</Link> <span className='details_btn px-3 py-1'>Short</span>
                </div>
            </div>

            <div className='main_contents_div' id="viewPrint" ref={componentRef}>

                <ProfileViewCard applicantsInfo={applicantsInfo ? applicantsInfo : {}} />

                <div className='row'>
                    <div className='col-md-6'>
                        <div className='card short_resume_dark_card'>
                            {experienceList && experienceList?.length > 0 && (
                                <>
                                    <div className='title_header'>Experience </div>


                                    {experienceList?.map((row, i) => {
                                        let duration = row?.start_date ? yearMonthDifference(row?.end_date ? moment(row?.end_date).add(1, 'day') : moment().add(1, 'day'), row?.start_date) : 0;
                                        return (
                                            <div className='card_items_row_flex' key={i}>
                                                <div className='label_box text-dark' style={{ width: "45%" }}>
                                                    <strong>{row?.designation}</strong> <br />
                                                    ({duration})
                                                </div>
                                                <div className='item_data' style={{ width: "55%" }}>
                                                    <strong> {row?.organisation_name} </strong> <br />
                                                    {row?.location} <br />
                                                    ({row?.start_date ? moment(row?.start_date).format("MMMM DD,YYYY") : ""} - {row?.end_date ? moment(row?.end_date).format("MMMM DD,YYYY") : "Continuing"})
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <br />
                                </>
                            )}


                            {trainingList && trainingList?.length > 0 && (
                                <>
                                    <div className='title_header'> Training </div>

                                    <br />
                                    {trainingList?.map((item, i) => {
                                        // const yearsPart = item?.year > 0 ? `${item?.year} Years` : '';
                                        // const monthsPart = item?.month > 0 ? `${item?.month} Months` : '';
                                        // const daysPart = item?.day > 0 ? `${item?.day} Days` : '';
                                        // const formattedDuration = [yearsPart, monthsPart, daysPart].filter(Boolean).join(' ');
                                        const formattedDuration = item?.start_date ? yearMonthDifference(item?.end_date ? moment(item?.end_date).add(1, 'day') : moment().add(1, 'day').format("YYYY-MM-DD"), item?.start_date) : 0;
                                        return (
                                            <div className='card_items_row_flex' key={i}>
                                                <div className='label_box text-dark'>
                                                    <strong>{item?.training_title}</strong>
                                                </div>
                                                <div className='item_data'>
                                                    {item?.institution_name} <br />
                                                    {moment(item.end_date).format('YYYY')} <br />
                                                    Duration: {formattedDuration ? formattedDuration : ''}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <br />
                                </>
                            )}

                            {portfolioInfo && portfolioInfo?.length > 0 && (
                                <>
                                    <div className='title_header'> Portfolio </div>
                                    {portfolioInfo?.map((item, i) => (
                                        <div className='card_items_row_flex' key={i}>
                                            <div className='label_box text-dark'> <strong>Website Link </strong></div>
                                            <div className='item_data'>
                                                <Tooltip placement="top" title={item?.url}>
                                                    <a href={item?.url} target="_blank" rel="noopener noreferrer">
                                                        <i class="fas fa-external-link-alt text-primary"></i> Open New Window
                                                    </a>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    ))}
                                    <br />
                                </>
                            )}

                            {referenceInfo && referenceInfo?.length > 0 && (
                                <>
                                    <div className='title_header'> Referenc(s) </div>

                                    {referenceInfo?.map((item, i) => {
                                        let count = i + 1;
                                        return (
                                            <>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>{`Name ${count}`}</strong> </div>
                                                    <div className='item_data'>{item?.name}</div>
                                                </div>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>Organization</strong></div>
                                                    <div className='item_data'>{item?.organisation}</div>
                                                </div>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>Designation</strong></div>
                                                    <div className='item_data'>{item?.designation}</div>
                                                </div>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>Address</strong></div>
                                                    <div className='item_data'>{item?.address}</div>
                                                </div>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>Mobile</strong></div>
                                                    <div className='item_data'>{item?.phone}</div>
                                                </div>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>Email</strong></div>
                                                    <div className='item_data'>{item?.email}</div>
                                                </div>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>Relation</strong></div>
                                                    <div className='item_data'>{item?.relation}</div>
                                                </div>
                                                <hr />
                                            </>
                                        )
                                    })}
                                </>
                            )}
                        </div>
                    </div>

                    <div className='col-md-6'>
                        <div className='card short_resume_light_card'>
                            {educationList && educationList?.length > 0 && (
                                <>
                                    <div className='title_header'> Educational Information </div>

                                    {educationList?.map((item, i) => (
                                        <div className='card_items_row_flex' key={i}>
                                            <div className='label_box text-dark'><strong>{item?.hrms_education_level__name} </strong></div>
                                            <div className='item_data'>
                                                {item?.institute_name}{item?.is_foreign_degree ? '(Foreign Institute)' : ''} <br />
                                                {item?.passing_year} <br />
                                                Result: {
                                                    item?.result
                                                        ? item?.result
                                                        : item?.cgpa
                                                            ? item?.cgpa + ' Out of ' + item?.cgpa_scale
                                                            : ''
                                                }
                                            </div>
                                        </div>
                                    ))}
                                    <br />
                                </>
                            )}

                            {languageInfo && languageInfo?.length > 0 && (
                                <>
                                    <div className='title_header'> Language Proficiency </div>
                                    <br />

                                    {languageInfo?.map((item, i) => (
                                        <Fragment key={i}>
                                            <div className='card_items_row_flex'>
                                                <div className='label_box text-dark'><strong>{item?.language}</strong></div>
                                                <div className='item_data'>
                                                    <strong>Speaking : </strong>{item?.speaking}, <br/>
                                                    <strong>Writing </strong> <span className='ml-5'> <strong>: </strong> {item?.writing},</span><br/>
                                                    <strong>Reading </strong> <span className='ml-3'> <strong>: </strong> {item?.reading}</span>
                                                </div>
                                            </div> 

                                        </Fragment>


                                        // <div className='card_items_row_flex' key={i}>
                                        //     <div className='label_box text-dark'><strong> {item?.language} </strong></div>
                                        //     <div className='item_data'>
                                        //         <strong> {item?.speaking} </strong>
                                        //     </div>
                                        // </div>
                                    ))}
                                    <br />
                                </>
                            )}
                            {/* <div className='title_header'> Specialization </div>
                            <br />

                            <div className='badge_custom_style'>
                                <span className="badge bg-custom">Excel</span>
                                <span className="badge bg-custom">Word</span>
                                <span className="badge bg-custom">Email Templating</span>
                                <span className="badge bg-custom">Event Planning</span>
                            </div> */}
                            {profesionalCertificatesList && profesionalCertificatesList?.length > 0 && (
                                <>
                                    <div className='title_header'> Certification </div> 
                                    {profesionalCertificatesList?.map((item, i) => {
                                        let count = i + 1;
                                        let duration = item?.from_date && item?.to_date ? yearMonthDifference(item?.to_date ? moment(item?.to_date).add(1, 'day') : moment().add(1, 'day').format("YYYY-MM-DD"), item?.from_date) : 0;
                                        return (
                                            <Fragment key={i}>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>{`Certification Title ${count}`}</strong></div>
                                                    <div className='item_data d-flex'>{item?.certification_name}</div>
                                                </div>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>Institute</strong></div>
                                                    <div className='item_data d-flex'>{item?.institute}</div>
                                                </div>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>Duration</strong></div>
                                                    <div className='item_data d-flex'>{duration ? duration : ''}</div>
                                                </div> 
                                                <hr />
                                            </Fragment>
                                        )
                                    })}
                                    <br />
                                </>
                            )}

                            {publicationInfo && publicationInfo?.length > 0 && (
                                <>
                                    <div className='title_header'> Research & Publication </div> 
                                    {publicationInfo?.map((row, i) => {
                                        let count = i + 1;
                                        return (
                                            <>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>{`Title ${count}`}</strong></div>
                                                    <div className='item_data d-flex'>{row?.title}</div>
                                                </div>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>Publication Date</strong></div>
                                                    <div className='item_data d-flex'>{row?.year}</div>
                                                </div>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>Authors</strong></div>
                                                    <div className='item_data d-flex'>{row?.authors}</div>
                                                </div>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>Institute/Organisations</strong></div>
                                                    <div className='item_data d-flex'>{row?.organisations}</div>
                                                </div>
                                                <div className='card_items_row_flex'>
                                                    <div className='label_box text-dark'><strong>Journal Link</strong></div>
                                                    <div className='item_data d-flex'>
                                                        <Tooltip placement="top" title={row?.url}>
                                                            <a href={row?.url} target="_blank" rel="noopener noreferrer">
                                                                <i class="fas fa-external-link-alt text-primary"></i> Open New Window
                                                            </a>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                {/* <ItemsLabelRow lable={`Title ${count}`} filed={row?.title} /> */}
                                                {/* <ItemsLabelRow lable="Publication Date" filed={row?.year} /> */}
                                                {/* <ItemsLabelRow lable="Authors" filed={row?.authors} /> */}
                                                {/* <ItemsLabelRow lable="Institute/Organisations" filed={row?.organisations} /> */}
                                                {/* <div className='card_items_row_flex'>
                                                    <div className='label_box'>Journal Link</div>
                                                    <div className='item_data'>
                                                        <strong>: </strong><a href={row?.url} target="_blank" rel="noopener noreferrer">{row?.url}</a>
                                                    </div>
                                                </div> */}
                                                <hr />

                                            </>
                                        )
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </div>

        </>
    )
}

