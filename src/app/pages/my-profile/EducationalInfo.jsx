import React, { useEffect, useState } from 'react'
import { TitleWithEditCard } from '../../components/cards/TitleWithEditCard'
import { ItemsLabelRow } from '../../components/toolkit/ItemsLabelRow'
import { ProfileCard } from '../../components/cards/ProfileCard'
import ProfileTabs from '../../components/my_profile/ProfileTabs'

import AddEditEducation from "./modals/AddEditEducation";
import AddEditProfessional from "./modals/AddEditProfessional";

import API from "../../helpers/devApi";
import { swalConfirm, swalError, swalSuccess } from "../../helpers/swal";
import * as Action from "./_redux/recruitementActions";
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { yearMonthDifference } from '../../helpers/yearMonthDifference'

export default function EducationalInfo() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { educationList, profesionalCertificatesList } = useSelector(
        ({ recruitement }) => ({
            educationList: recruitement.educationList,
            profesionalCertificatesList: recruitement.profesionalCertificatesList,
        }),
    );
    const initEdu = {
        cgpa: "",
        cgpa_scale: "",
        education_level_id: "",
        degree_name: "",
        major_subject: "",
        result_type_id: "",
        result: "",
        passing_year: "",
        board_id: "",
        institute_name: "",
        achievement: "",
        applicant_id: user?.data?.applicant_id,
        mark: '',
        is_foreign_degree: 0,
    };

    const initProf = {
        "certification_id": '',
        "from_date": "",
        "institute": "",
        "status": "Enrolled",
        "to_date": "",
        "valid_till": null,
        applicant_id: user?.data?.applicant_id,
    };
    const [showEducation, setShowEducation] = useState(false);
    const [showProfessional, setShowProfessional] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState(initEdu);
    const [selectedProfessional, setSelectedProfessional] = useState(initProf);
    const [action, setAction] = useState('')
    const [eduId, setEduId] = useState(0)


    const handleDeleteEducation = async (url, module) => {
        swalConfirm().then(async (res) => {
            if (res.isConfirmed) {
                await API.delete(url)
                    .then(async (res) => {
                        if (res.data.success) {
                            swalSuccess(res.data?.message);
                            if (module == "education") {
                                dispatch(Action.updateProfileScore(['Education'], user?.data?.applicant_id));
                                dispatch(Action.getAllEducationByApplicants(user?.data?.applicant_id));
                            }
                            else if (module == "cetificates") {
                                dispatch(Action.updateProfileScore(["Professional Certificates"], user?.data?.applicant_id));
                                dispatch(Action.getProfessionalCertificatesByApplicants(user?.data?.applicant_id));
                            }
                            setTimeout(() => {
                                dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                            }, "300");
                        } else {
                            swalError("something went wrong");
                        }
                    })
                    .catch((error) => {
                        swalError("something went wrong");
                    });
            }
        });
    };

    useEffect(() => {
        if (user?.data?.applicant_id) {
            dispatch(Action.getAllEducationByApplicants(user?.data?.applicant_id));
            dispatch(Action.getProfessionalCertificatesByApplicants(user?.data?.applicant_id));

        }
    }, [user, dispatch]);


    return (
        <div className='main_contents_div'>
            <ProfileCard />
            <ProfileTabs />

            <TitleWithEditCard
                title="Educational Information"
                setShowEdit={setShowEducation}
                btn_label="Add Education"
                btn_icon="fas fa-plus"
                setAction={setAction}
                setEduId={setEduId}
                setSelectedEducation={initEdu}
            >

                {educationList && educationList.length > 0 && educationList.map((item, i) => {
                    let count = i + 1;
                    let duration = item?.start_date ? yearMonthDifference(item?.end_date ? moment(item?.end_date).add(1, 'day') : moment().add(1, 'day').format("YYYY-MM-DD"), item?.start_date) : 0;
                    return (
                        <div key={i}>
                            <div className='row'>
                                <div className='col-md-5'>
                                    <ItemsLabelRow lable={`Education Level ${count}`} filed={item?.hrms_education_level__name} />
                                    <ItemsLabelRow lable="Group/Major Subject:" filed={item?.major_subject} />
                                    <ItemsLabelRow lable="Division/Grade:" filed={item?.hrms_result_type__name} />
                                    <ItemsLabelRow lable="Passing Year:" filed={item?.passing_year} />
                                    <ItemsLabelRow lable="Institute:" filed={item?.institute_name} />
                                </div>

                                <div className='col-md-6'>
                                    <ItemsLabelRow lable="Degree" filed={item?.degree_name} />
                                    {/* <ItemsLabelRow lable="Other Subject:" filed="--" /> */}
                                    {/* <ItemsLabelRow lable="Result:" filed={item?.result} /> */}

                                    <div className='card_items_row_flex'>
                                        <div className='label_box'>Result</div>
                                        <div className='item_data'>
                                            <strong>: </strong>
                                            {item?.result ? item?.result : (
                                                <>
                                                    {item?.cgpa ? (
                                                        <>
                                                            {item?.cgpa} Out of {item?.cgpa_scale}
                                                        </>
                                                    ) : ''}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {item?.mark && <ItemsLabelRow lable="Marks(%)" filed={item?.mark} />}
                                    {item?.hrms_board__name && <ItemsLabelRow lable="Board" filed={item?.hrms_board__name} />}
                                    {duration !== 0 && (
                                        <ItemsLabelRow lable="Duration" filed={duration} />
                                    )}
                                    <ItemsLabelRow lable="Achievement" filed={item?.achievement} />
                                    <ItemsLabelRow lable="Foreign Institute" filed={item?.is_foreign_degree ? 'YES' : 'NO'} />
                                </div>

                                <div className='col-md-1'>
                                    <button
                                        className="btn btn-outline-default mr-3"
                                        type="button"
                                        onClick={() => {
                                            setSelectedEducation({
                                                ...selectedEducation,
                                                ['cgpa']: item?.cgpa,
                                                ['cgpa_scale']: item?.cgpa_scale,
                                                ['education_level_id']: item?.hrms_education_level__id,
                                                ['degree_name']: item?.degree_name,
                                                ['major_subject']: item?.major_subject,
                                                ['result_type_id']: item?.result_type_id,
                                                ['result']: item?.result,
                                                ['passing_year']: item?.passing_year,
                                                ['board_id']: item?.board_id,
                                                ['institute_name']: item?.institute_name,
                                                ['start_date']: item?.start_date,
                                                ['end_date']: item?.end_date,
                                                ['achievement']: item?.achievement,
                                                ['mark']: item?.mark,
                                                ['is_foreign_degree']: item?.is_foreign_degree,
                                            });
                                            setShowEducation(true);
                                            setAction('Edit');
                                            setEduId(item?.id)
                                        }}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        className="btn text-danger"
                                        type="button"
                                        onClick={() => { handleDeleteEducation(`/hrms_education/${item?.id}`, 'education') }}
                                    >
                                        <i className="fas fa-trash-alt text-danger"></i>
                                    </button>
                                </div>

                            </div>

                            <hr />

                        </div>
                    )

                })}



                {/* <div className='row'>
                    <div className='col-md-6'>
                        <ItemsLabelRow lable="Education Level 1:" filed="Bachelor" />
                        <ItemsLabelRow lable="Group/Major Subject:" filed="Human Resource" />
                        <ItemsLabelRow lable="Division/Grade:" filed="Grade" />
                        <ItemsLabelRow lable="Passing Year:" filed="2018" />
                        <ItemsLabelRow lable="Institute:" filed="Rajshahi University" />
                    </div>

                    <div className='col-md-6'>
                        <ItemsLabelRow lable="Degree:" filed="B.B.A" />
                        <ItemsLabelRow lable="Other Subject:" filed="--" />
                        <ItemsLabelRow lable="Result:" filed="3.62" />
                        <ItemsLabelRow lable="Board:" filed="Rajshahi" />
                    </div>
                </div> */}

            </TitleWithEditCard>



            <AddEditEducation
                show={showEducation}
                setShow={setShowEducation}
                selectedData={selectedEducation}
                setSelectedData={setSelectedEducation}
                initEdu={initEdu}
                action={action}
                // getEducationInfo={getEducationInfo}
                eduId={eduId}
            />
            <AddEditProfessional
                show={showProfessional}
                setShow={setShowProfessional}
                selectedData={selectedProfessional}
                setSelectedData={setSelectedProfessional}
                initProf={initProf}
                action={action}
                // getProfCertificates={getProfCertificates}
                profId={eduId}
            />

        </div>

    )
}

