import React, { useState, useEffect } from "react";
import { TitleWithEditCard } from '../../components/cards/TitleWithEditCard'
import { ItemsLabelRow } from '../../components/toolkit/ItemsLabelRow'
import ProfileTabs from '../../components/my_profile/ProfileTabs'
import { ProfileCard } from '../../components/cards/ProfileCard'

import API from "../../helpers/devApi";
import { swalError, swalSuccess, swalConfirm } from "../../helpers/swal";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { objectKeyReplace } from "../../helpers/objectKeyReplace";
import * as Action from "./_redux/recruitementActions";
import AddEditExperince from "./modals/AddEditExperince";
import { timeDifference } from "../../helpers/timeDifference";
import { yearMonthDifference } from "../../helpers/yearMonthDifference";
import { Checkbox } from "antd";


export default function ProfessionalExperience() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { applicantInfo, experienceList } = useSelector(
        ({ recruitement }) => ({
            experienceList: recruitement.experienceList,
            applicantInfo: recruitement.applicantsInfo,
        }),
    );
    const applicant_id = user?.data?.applicant_id;

    const initExp = {
        "organisation_name": "",
        "designation": "",
        "location": "",
        "department": "",
        "industry_type_id": '',
        "start_date": "",
        "end_date": "",
        "is_currently_working": 0,
        "supervisor_name": "",
        "supervisor_email": "",
        "supervisor_phone": "",
        "achievement": "",
        "responsibilities": "",
        "applicant_id": applicant_id,
        "area_of_expertise": "",
    }
    const [showExperince, setShowExperince] = useState(false);
    const [selectedExperince, setSelectedExperince] = useState(initExp);
    const [loading, setLoading] = useState(false);
    const [fetchedData, setFetchedData] = useState([]);
    const [editorHtml, setEditorHtml] = useState("");
    const [action, setAction] = useState("");
    const [expId, setExpId] = useState(0); 

    const [selectedIndustries, setSelectedIndustries] = useState([]);
 

    useEffect(() => {
        if (applicant_id) {
            dispatch(Action.getExperienceByApplicants(applicant_id));
            dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
        }
    }, [applicant_id, dispatch]);
 

    const handleDelete = async (id) => {
        swalConfirm().then(async (res) => {
            if (res.isConfirmed) {
                await API.delete(`/hrms_experience/${id}`)
                    .then(async (res) => {
                        if (res.data.success) {
                            swalSuccess(res.data?.message);
                            dispatch(Action.updateProfileScore(["Experience"], user?.data?.applicant_id));
                            dispatch(Action.getExperienceByApplicants(applicant_id));
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

    const handleOnChangeIsFresher = async (value) => {
        API.patch(`/hrms_applicant/update-profile/${user?.data?.applicant_id}`, {
            is_fresher: value
        })
        .then((res) => {
            if (res?.data?.success) {
                swalSuccess('Data saved successfully!!');
                if(value) {
                    dispatch(Action.insertProfileScore(['Experience']));
                } else {
                    dispatch(Action.updateProfileScore(['Experience']));
                }
                setTimeout(() => {
                    dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                }, "300");
            } else {
                swalError(res?.data?.message, " ");
            }
        })
        .catch((error) => {
            swalError("someting went wrong");
        });
    }
 

    // const filterData = experienceList?.map((item) => item?.area_of_expertise);
    // console.log("Land fetchedData", filterData);
    

    return (
        <div className='main_contents_div'>
            <ProfileCard />
            <ProfileTabs />

            <TitleWithEditCard
                title="Experience"
                setShowEdit={setShowExperince}
                btn_label="Add Experience"
                btn_icon="fas fa-plus"
                setAction={setAction}
                setSelectedData={setSelectedExperince}
                initalTr={initExp}
                setEduId={setExpId}    
            >

                {experienceList && experienceList.length > 0 
                    ? experienceList?.map((row, key) => {
                        let count = key + 1;
                        let duration =row?.start_date ? yearMonthDifference(row?.end_date ? moment(row?.end_date).add(1, 'day') : moment().add(1, 'day').format("YYYY-MM-DD"), row?.start_date) : '';

                        const expertiseArr = row?.area_of_expertise && JSON.parse(row?.area_of_expertise);
                        const area_of_expertiseString = expertiseArr && expertiseArr?.length > 0 && expertiseArr?.join(", ");
    
                        return (
                            <>

                                <div className='row' key={key}>
                                    <div className='col-md-6'>
                                        <ItemsLabelRow lable={`Position ${count}`} filed={row?.designation} />
                                        <ItemsLabelRow lable="Location" filed={row?.location} />
                                        <ItemsLabelRow lable="Start Date" filed={row?.start_date ? moment(row?.start_date).format("MMMM DD,YYYY") : ""} />
                                        <ItemsLabelRow lable="Duration" filed={duration} />
                                    </div>

                                    <div className='col-md-5'>
                                        <ItemsLabelRow lable="Organization" filed={row?.organisation_name} />
                                        <ItemsLabelRow lable="Job Type" filed="Full Time" />
                                        <ItemsLabelRow lable="End Date" filed={row?.end_date ? moment(row?.end_date).format("MMMM DD,YYYY") : "Currently Working "} /> 
                                        <ItemsLabelRow lable="Area of Expertise:" filed={`${area_of_expertiseString ? area_of_expertiseString : ""}`} />
                                    </div>


                                    <div className="col-md-1 mobile_action">
                                        <button className="btn btn-outline-default mr-3" onClick={() => {
                                            setShowExperince(true);
                                            setSelectedExperince({
                                                "organisation_name": row?.organisation_name,
                                                "designation": row?.designation,
                                                "location": row?.location,
                                                "department": row?.department,
                                                "industry_type_id": row?.industry_type_id,
                                                "start_date": row?.start_date,
                                                "end_date": row?.end_date,
                                                "is_currently_working": row?.is_currently_working,
                                                "supervisor_name": row?.supervisor_name,
                                                "supervisor_email": row?.supervisor_email,
                                                "supervisor_phone": row?.supervisor_phone,
                                                "achievement": row?.achievement,
                                                "responsibilities": row?.responsibilities,
                                                "area_of_expertise": expertiseArr ? expertiseArr : [],
                                            });
                                            setEditorHtml(row?.responsibilities);
                                            setExpId(row?.id);
                                            setAction("Edit");
                                            setSelectedIndustries(expertiseArr); 
                                        }}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn text-danger"
                                            onClick={() => { handleDelete(row?.id) }}
                                        >
                                            <i className="fas fa-trash-alt text-danger"></i>
                                        </button>
                                    </div>


                                    <div className='col-md-12'>
                                        <div className='card_items_row_flex'>
                                            <div className='label_box' style={{ width: "18% !important" }}>Job Responsibilities </div>
                                            <div className='item_data d-flex'>
                                                <strong className="mr-2">: </strong> <span dangerouslySetInnerHTML={{ __html: row?.responsibilities }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <hr />
                            </>
                        )}
                    ) : (
                        <div className="col-md-4 mt-4 mb-3">
                            <Checkbox
                                type="checkbox"
                                checked={applicantInfo?.is_fresher}
                                id="is_fresher"
                                onChange={(e) => {
                                    handleOnChangeIsFresher(e.target.checked ? 1 : 0);
                                }}
                            />
                            <label className="form-check-label ml-2" htmlFor="is_fresher"><b>Are You Fresher?</b></label>
                        </div>
                    )
                }
            </TitleWithEditCard>

            {/* 
            <TitleWithEditCard title="Professional Experience 2" >
                <div className='row'>
                    <div className='col-md-6'>
                        <ItemsLabelRow lable="Position:" filed="HR Executive" />
                        <ItemsLabelRow lable="Location:" filed="Banani, Bangladesh" />
                        <ItemsLabelRow lable="Start Date:" filed="21/01/2022" />
                        <ItemsLabelRow lable="Duration:" filed="2 Years, 0 Month(s)" />
                    </div>

                    <div className='col-md-6'>
                        <ItemsLabelRow lable="Organization:" filed="Apsis Solutions Ltd." />
                        <ItemsLabelRow lable="Job Type:" filed="Full Time" />
                        <ItemsLabelRow lable="End Date:" filed="02/01/2022" />
                    </div>

                    <div className='col-md-12'>
                        <div className='card_items_row_flex'>
                            <div className='label_box' style={{ width: "20%" }}>Responsibilities: </div>
                            <div className='item_data'>
                                <ul>
                                    <li>Design compensation and benefits package.</li>
                                    <li>Develop new HR policies and update the existing ones based on the company's values and ensure employees adhere to and comply with them.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </TitleWithEditCard> */}


            <AddEditExperince
                show={showExperince}
                setShow={setShowExperince}
                selectedData={selectedExperince}
                setSelectedData={setSelectedExperince}
                // fetchedData={getData}
                editorHtml={editorHtml}
                setEditorHtml={setEditorHtml}
                action={action}
                expId={expId}
                initalExp={initExp}

                selectedIndustries={selectedIndustries}
                setSelectedIndustries={setSelectedIndustries}
            />

        </div>
    )
}

