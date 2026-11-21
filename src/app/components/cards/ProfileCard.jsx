import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as Action from "../../pages/my-profile/_redux/recruitementActions";
import API from "../../helpers/devApi";
import { swalError, swalSuccess } from '../../helpers/swal';
import { toAbsoluteUrl } from '../../../_metronic/_helpers';
import { Progress, Space } from 'antd';

export function ProfileCard() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { applicantsInfo, profilePercentage } = useSelector(
        ({ recruitement }) => ({
            applicantsInfo: recruitement.applicantsInfo,
            profilePercentage: recruitement.profilePercentage,
        }),
    );

    const [images, setImages] = useState(null);
    const [preview, setPreview] = useState(false);
    const [picture, setPicture] = useState(null);



    const handleImage = (e) => {
        const files = e.target.files[0];
        setImages(files);
        setPicture(URL.createObjectURL(files));
        setPreview(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        var formdata = new FormData();
        formdata.append('profile_image', images);
        await API.post(`/hrms_applicant/profile-photo-update/${user?.data?.applicant_id}`, formdata)
            .then((res) => {
                if (res?.data?.success) {
                    swalSuccess("Profile photo updated successfully");
                    dispatch(Action.insertProfileScore(['Profile Image']));
                    setTimeout(() => {
                        dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                    }, "300");
                    // dispatch(Action.getProfilePercentage());
                    setPreview(false);
                } else {
                    swalError(res?.data?.message, " ");
                }
            })
            .catch((error) => {
                swalError("someting went wrong");
            });
    }


    useEffect(() => {
        if (user?.data?.applicant_id) {
            dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
        }
        // dispatch(Action.getProfilePercentage());
    }, [user, dispatch]);


    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card profile_card_main">
                    <div className="left_box">

                        <div className="image_box">
                            {preview ? (
                                <>
                                    <img
                                        src={picture}
                                        alt="upload images"
                                    />
                                </>

                            ) : (
                                <>
                                    {applicantsInfo?.profile_image ? (
                                        <img
                                            src={DOC_CONTAINER + applicantsInfo?.profile_image + DOC_TOKEN}
                                            alt="Profile images"
                                        />
                                    ) : (
                                        <img
                                            src={toAbsoluteUrl("/media/users/default.jpg")}
                                            alt=""
                                        />
                                    )}
                                </>
                            )}




                        </div>
                        <div className="info_box">
                            <h2> {`${applicantsInfo?.m_career_portal_user?.first_name || ''} ${applicantsInfo?.m_career_portal_user?.middle_name || ''} ${applicantsInfo?.m_career_portal_user?.last_name || ''}`.trim()}</h2>
                            {/* <p>{applicantsInfo?.sys_designation?.designation_name}</p> */}
                            <p>{applicantsInfo?.m_hrms_applicant_cateogry?.name}</p>

                            <form onSubmit={(e) => handleSubmit(e)}>
                                {preview ? (
                                    <>
                                        <div className="row mt-10">
                                            <div className="col-md-12 mb-3 text-left">
                                                <button className="btn btn-primary" type="submit">Update</button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="avatar-upload">
                                            <div className="avatar-edit">
                                                <input
                                                    type="file"
                                                    id="imageUpload"
                                                    accept=".png, .jpg, .jpeg"
                                                    onChange={(e) => {
                                                        handleImage(e)
                                                    }}
                                                />
                                                <label htmlFor="imageUpload" className='profile_upload_btn'>
                                                    <i className="fas fa-camera mr-2"></i>
                                                    Change photo
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {/* <button 
                                        className="change_photo_btn"
                                    >
                                        <i className="fas fa-camera mr-2"></i>
                                        Change photo
                                    </button> */}

                            </form>
                        </div>



                    </div>
                    <div className="right_box">

                        <Space wrap>

                            {applicantsInfo?.profile_percentage == 100 ? (
                                <Progress
                                    type="circle"
                                    percent={parseInt(applicantsInfo?.profile_percentage)}
                                    format={(percent) => (
                                        <>
                                            <span className='d-block text-light' style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                                {`${percent}%`}
                                            </span>
                                            <span style={{ color: '#FFF', fontSize: '12px', lineHeight: '5px' }}>
                                                Profile Completed
                                            </span>
                                        </>
                                    )}
                                />
                            ) : (
                                <Progress
                                    type="circle"
                                    percent={parseInt(applicantsInfo?.profile_percentage)}
                                    strokeColor="#ed7784"
                                    format={(percent) => (
                                        <>
                                            <span className='d-block text-light' style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                                {`${percent}%`}
                                            </span>
                                            <span style={{ color: '#ff9ea9', fontSize: '12px', lineHeight: '5px' }}>
                                                Incomplete Profile
                                            </span>
                                        </>
                                    )}
                                />
                            )}
                        </Space>

                        {/* <div className="progress blue">
                            <span className="progress-left">
                                <span className="progress-bar"></span>
                            </span>
                            <span className="progress-right">
                                <span className="progress-bar"></span>
                            </span>
                            <div className="progress-value">
                                <h3>{profilePercentage}%</h3>
                                <p>Profile <br /> Complete</p>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

