import React, { useState, useEffect, Fragment } from "react";
import { TitleWithEditCard } from '../../components/cards/TitleWithEditCard'
import { ItemsLabelRow } from '../../components/toolkit/ItemsLabelRow'
import { ProfileCard } from '../../components/cards/ProfileCard'
import ProfileTabs from '../../components/my_profile/ProfileTabs'

import { useSelector, useDispatch } from "react-redux";
import AddEditTaining from "./modals/AddEditTaining";
import API from "../../helpers/devApi"
import { swalConfirm, swalError, swalSuccess } from "../../helpers/swal";
import moment from "moment";
import * as Action from "./_redux/recruitementActions";
import AddEditProfessional from "./modals/AddEditProfessional";
import AddEditPublication from "./modals/AddEditPublication";
import { yearMonthDifference } from "../../helpers/yearMonthDifference";
import { Checkbox, Tooltip } from "antd";

export default function TrainingSpecialization() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { trainingList, profesionalCertificatesList, publicationInfo, applicantsInfo } = useSelector(
        ({ recruitement }) => ({
            trainingList: recruitement.trainingList,
            profesionalCertificatesList: recruitement.profesionalCertificatesList,
            publicationInfo: recruitement.publicationInfo,
            applicantsInfo: recruitement.applicantsInfo,
        }),
    );


    const applicant_id = user?.data?.applicant_id;
    const [showTrainning, setShowTraining] = useState(false);
    const [trainingId, setTrainingId] = useState(0);
    const [countryList, setCountryList] = useState([]);

    const initalTr = {
        "training_title": "",
        "institution_name": "",
        "country_id": '',
        "year": 0,
        "month": 0,
        "day": 0,
        "start_date": "",
        "end_date": "",
        "applicant_id": applicant_id
    }

    const initProf = {
        "certification_name": '',
        "from_date": null,
        "institute": "",
        // "status": "Enrolled",
        "status": "",
        "to_date": null,
        "valid_till": null,
        modality: null,
        applicant_id: user?.data?.applicant_id,
    };

    const pubInit = {
        "title": "",
        "year": "",
        "organisations": "",
        "authors": "",
        "url": "",
        "applicant_id": user?.data?.applicant_id
    };

    const getCountryInfo = async () => {
        await API.get(`config_countries/`)
            .then((res) => {
                if (res.data?.success) {
                    const resData = res?.data?.data?.config_countries;
                    var result = resData?.map(function (col) {
                        return {
                            value: col?.config_countries__country_id,
                            label: col?.config_countries__country_name,
                        }
                    });
                    setCountryList(result);
                } else {
                    swalError(res?.message);
                }
            })
            .catch((error) => {
                swalError("someting went wrong");
            });
    };

    useEffect(() => {
        getCountryInfo();
    }, [])


    const [selectedData, setSelectedData] = useState(initalTr)
    const [action, setAction] = useState('');


    const [showProfessional, setShowProfessional] = useState(false);
    const [selectedProfessional, setSelectedProfessional] = useState(initProf);
    const [eduId, setEduId] = useState(0)

    const [showPublication, setShowPublication] = useState(false);
    const [selectedPub, setSelectedPub] = useState(pubInit);
    const [editId, setEditId] = useState(0);



    useEffect(() => {
        if (user?.data?.applicant_id) {
            dispatch(Action.getTrainingByApplicants(user?.data?.applicant_id));
            dispatch(Action.getProfessionalCertificatesByApplicants(user?.data?.applicant_id));
            dispatch(Action.getPublicationInfoByApplicants(user?.data?.applicant_id));

        }
    }, [user, dispatch]);


    // console.log("countryList", countryList);



    const handleDelete = async (url, module) => {
        swalConfirm().then(async (res) => {
            if (res.isConfirmed) {
                await API.delete(url)
                    .then(async (res) => {
                        if (res.data.success) {

                            swalSuccess(res.data?.message);
                            if (module == "training") {
                                dispatch(Action.updateProfileScore(['Training'], user?.data?.applicant_id));
                                dispatch(Action.getTrainingByApplicants(user?.data?.applicant_id));
                            }
                            else if (module == "cetificates") {
                                dispatch(Action.updateProfileScore(["Professional Certification"], user?.data?.applicant_id));
                                dispatch(Action.getProfessionalCertificatesByApplicants(user?.data?.applicant_id));
                            }
                            else if (module == "publication") {
                                dispatch(Action.updateProfileScore(['Publication'], user?.data?.applicant_id));
                                dispatch(Action.getPublicationInfoByApplicants(user?.data?.applicant_id))
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

    const handleOnChangeNoTraining = async (value) => {
        API.patch(`/hrms_applicant/update-profile/${user?.data?.applicant_id}`, {
            no_training: value
        })
        .then((res) => {
            if (res?.data?.success) {
                swalSuccess('Data saved successfully!!');
                if(value) {
                    dispatch(Action.insertProfileScore(['Training']));
                } else {
                    dispatch(Action.updateProfileScore(['Training']));
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

    return (
        <div className='main_contents_div'>
            <ProfileCard />
            <ProfileTabs />


            <TitleWithEditCard
                title="Training"
                setShowEdit={setShowTraining}
                btn_label="Add Training"
                btn_icon="fas fa-plus"
                setAction={setAction}
                setSelectedData={setSelectedData}
                initalTr={initalTr}
            >

                {trainingList && trainingList.length > 0 
                    ? trainingList?.map((item, index) => {
                        let count = index + 1;
                        // const yearsPart = item?.year > 0 ? `${item?.year} Years` : '';
                        // const monthsPart = item?.month > 0 ? `${item?.month} Months` : '';
                        // const daysPart = item?.day > 0 ? `${item?.day} Days` : '';

                        // const formattedDuration = [yearsPart, monthsPart, daysPart].filter(Boolean).join(' ');
                        const skillArr = item?.skill && JSON.parse(item?.skill);
                        const commaSeparatedSkill = skillArr?.join(", ");
                        let duration = item?.start_date ? yearMonthDifference(item?.end_date ? moment(item?.end_date).add(1, 'day') : moment().add(1, 'day').format("YYYY-MM-DD"), item?.start_date) : 0;

                        return (
                            <>
                                <div className='row' key={index}>
                                    <div className='col-md-5'>
                                        <ItemsLabelRow lable={`Training title ${count}`} filed={item?.training_title} />
                                        <ItemsLabelRow lable="Country" filed={item?.config_countries__country_name} />
                                        <ItemsLabelRow lable="Start Date" filed={moment(item?.start_date).format("DD/MM/YYYY")} />
                                        <ItemsLabelRow lable="Skill" filed={commaSeparatedSkill} />
                                    </div>

                                    <div className='col-md-6'>
                                        <ItemsLabelRow lable="Institute" filed={item?.institution_name} />
                                        <ItemsLabelRow lable="Duration" filed={duration} />
                                        <ItemsLabelRow lable="End Date" filed={moment(item?.end_date).format("DD/MM/YYYY")} />
                                        <ItemsLabelRow lable="Modality" filed={item?.modality} />
                                    </div>

                                    <div className="col-md-1">
                                        <button className="btn btn-outline-default mr-3"
                                            onClick={() => {
                                                setShowTraining(true);
                                                setSelectedData({
                                                    ...selectedData,
                                                    ["training_title"]: item?.training_title,
                                                    ["institution_name"]: item?.institution_name,
                                                    ["country_id"]: item?.config_countries__country_id,
                                                    ["year"]: item?.year,
                                                    ["month"]: item?.month,
                                                    ["day"]: item?.day,
                                                    ["modality"]: item?.modality,
                                                    ["skill"]: item?.skill ? JSON.parse(item?.skill) : [],
                                                    ["start_date"]: moment(item?.start_date).format("YYYY-MM-DD"),
                                                    ["end_date"]: moment(item?.end_date).format("YYYY-MM-DD"),
                                                });
                                                setAction('Edit');
                                                setTrainingId(item?.id)
                                            }}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn text-danger" onClick={() => { handleDelete(`/hrms_training/${item?.id}`, 'training') }}>
                                            <i className="fas fa-trash-alt text-danger"></i>
                                        </button>
                                    </div>
                                </div>
                                <hr />
                            </>
                        )
                    })
                    : (
                        <div className="col-md-4 mt-4 mb-3">
                            <Checkbox
                                type="checkbox"
                                checked={applicantsInfo?.no_training}
                                id="no_training"
                                onChange={(e) => {
                                    handleOnChangeNoTraining(e.target.checked ? 1 : 0);
                                }}
                            />
                            <label className="form-check-label ml-2" htmlFor="no_training"><b>Don't have any training?</b></label>
                        </div>
                    )
                }

            </TitleWithEditCard>



            <TitleWithEditCard
                title="Certification"
                btn_label="Add Certification"
                btn_icon="fas fa-plus"
                setShowEdit={setShowProfessional}
                setAction={setAction}
                setEduId={setEduId}
                setSelectedData={setSelectedProfessional}
                initalTr={initProf}
            >

                {profesionalCertificatesList?.map((item, i) => {
                    let count = i + 1;
                    // let duration = yearMonthDifference(item?.to_date ? item?.to_date : moment().format("YYYY-MM-DD"), item?.from_date);
                    let duration = item?.to_date &&  item?.from_date && yearMonthDifference(item?.to_date ? moment(item?.to_date).add(1, 'day') : moment().add(1, 'day').format("YYYY-MM-DD"), item?.from_date);
                    let cid = item?.country_id;
                    const countryNameArray = countryList?.filter(col => col.value === cid);
                    const countryName = countryNameArray[0]
                    return (
                        <>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <ItemsLabelRow lable={`Certification Title ${count}`} filed={item?.certification_name} />
                                    <ItemsLabelRow lable="Institute" filed={item?.institute} />
                                    <ItemsLabelRow lable="Duration" filed={duration} />
                                    <ItemsLabelRow lable="End Date" filed={ item?.to_date && moment(item?.to_date).format("DD-MM-YYYY")} />
                                    <ItemsLabelRow lable="Valid Date" filed={ item?.valid_till && moment(item?.valid_till).format("DD-MM-YYYY")} />
                                    <div className='card_items_row_flex'>
                                        <div className='label_box'>Certification URL</div>
                                        <div className='item_data'>
                                            <strong>: </strong>
                                            {item?.certification_url && (
                                                <Tooltip placement="top" title={item?.certification_url}>
                                                    <a href={item?.certification_url} target="_blank" rel="noopener noreferrer" >
                                                        <i className="fa fa-external-link font-weight-bolder text-primary" aria-hidden="true"></i> Link
                                                    </a>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className='col-md-5'>
                                    <ItemsLabelRow lable="Enrolled ID" filed={item?.enrollment_id} />
                                    <ItemsLabelRow lable="Country" filed={countryName?.label} />
                                    <ItemsLabelRow lable="Start Date" filed={ item?.from_date && moment(item?.from_date).format("DD-MM-YYYY")} />
                                    <ItemsLabelRow lable="Modality" filed={item?.modality} />
                                    <ItemsLabelRow lable="Status" filed={item?.status} />
                                </div>

                                <div className='col-md-1'>
                                    <button className="btn btn-outline-default mr-3"
                                        onClick={() => {
                                            setShowProfessional(true);
                                            setSelectedProfessional({
                                                ...selectedProfessional,
                                                ["certification_name"]: item?.certification_name,
                                                ["from_date"]: item?.from_date ? moment(item?.from_date).format("YYYY-MM-DD") : null,
                                                ["institute"]: item?.institute,
                                                ["enrollment_id"]: item?.enrollment_id,
                                                ["country_id"]: item?.country_id,
                                                ["status"]: item?.status,
                                                ["modality"]: item?.modality,
                                                ["certification_url"]: item?.certification_url,
                                                ["to_date"]: item?.to_date ? moment(item?.to_date).format("YYYY-MM-DD") : null,
                                                ["valid_till"]: moment(item?.valid_till).format("YYYY-MM-DD"),
                                            });
                                            setAction('Edit');
                                            setEduId(item?.id)
                                        }}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="btn text-danger" onClick={() => { handleDelete(`/hrms_professional_certification/${item?.id}`, 'cetificates') }}>
                                        <i className="fas fa-trash-alt text-danger"></i>
                                    </button>
                                </div>
                            </div>

                            <hr />
                        </>
                    )
                })}


            </TitleWithEditCard>

            {/* <TitleWithEditCard
                title="Specialization"
                setShowEdit={setShowSpEdit} showEdit={showSpEdit}
            >
                {showSpEdit ? <>
                    <Formik
                        initialValues={selectedData} 
                        onSubmit={values => handleSubmit(values)}
                    >
                        {({ errors, touched }) => (
                            <Form>


                            </Form>
                        )}
                    </Formik>
                </> :
                    <>
                        <div className='badge_custom_style'>
                            <span className="badge bg-custom">Excel</span>
                            <span className="badge bg-custom">Word</span>
                            <span className="badge bg-custom">Email Templating</span>
                            <span className="badge bg-custom">Event Management</span>
                            <span className="badge bg-custom">Event Planning</span>
                        </div>
                    </>
                }
            </TitleWithEditCard> */}

            {/* <TitleWithEditCard
                title="Research & Publication"
                btn_label="Add Research & Publication"
                btn_icon="fas fa-plus"
                setShowEdit={setShowPublication}
                setAction={setAction}
                setSelectedData={setSelectedPub}
                setEduId={setEditId}
                initalTr={pubInit}
            >

                {publicationInfo?.map((row, i) => {
                    let count = i + 1;
                    return (
                        <Fragment key={i}>
                            <div className="row">
                                <div className='col-md-6'>
                                    <ItemsLabelRow lable={`Title ${count} :`} filed={row?.title} />
                                    <ItemsLabelRow lable="Publication Date:" filed={row?.year} />
                                    <div className='card_items_row_flex'>
                                        <div className='label_box'>Journal Link : </div>
                                        <div className='item_data'>
                                            <a href={row?.url} target="_blank" rel="noopener noreferrer"> {row?.url} </a>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-md-5'>
                                    <ItemsLabelRow lable="Journal:" filed={row?.organisations} />
                                    <ItemsLabelRow lable="Document:" filed="paper2017.pdf" />
                                    <ItemsLabelRow lable="Citation:" filed={row?.citation} />
                                </div>

                                <div className='col-md-1'>
                                    <button className="btn btn-outline-default mr-3" onClick={() => {
                                        setShowPublication(true);
                                        setSelectedPub({
                                            ...selectedPub,
                                            "title": row?.title,
                                            "authors": row?.authors,
                                            "year": row?.year,
                                            "organisations": row?.organisations,
                                            "url": row?.url,
                                            "citation": row?.citation,
                                        });
                                        setEditId(row?.id);
                                    }}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="btn text-danger">
                                        <i className="fas fa-trash-alt text-danger" onClick={() => { handleDelete(`/hrms_publication/${row?.id}`, 'publication') }}></i>
                                    </button>
                                </div>
                            </div>
                            <hr />
                        </Fragment>
                    )
                })}

            </TitleWithEditCard> */}




            <AddEditTaining
                show={showTrainning}
                setShow={setShowTraining}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initalTr={initalTr}
                action={action}
                trainingId={trainingId}
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

            {/* <AddEditPublication
                show={showPublication}
                setShow={setShowPublication}
                selectedData={selectedPub}
                setSelectedData={setSelectedPub} 
                editId={editId}
                pubInit={pubInit}
            /> */}

        </div>
    )
}

