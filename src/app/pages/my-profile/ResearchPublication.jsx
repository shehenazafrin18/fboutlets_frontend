import React, { Fragment, useEffect, useState } from 'react'
import { ProfileCard } from '../../components/cards/ProfileCard'
import ProfileTabs from '../../components/my_profile/ProfileTabs'
import { TitleWithEditCard } from '../../components/cards/TitleWithEditCard';
import { useDispatch, useSelector } from 'react-redux';
import * as Action from "./_redux/recruitementActions";
import { ItemsLabelRow } from '../../components/toolkit/ItemsLabelRow';
import API from "../../helpers/devApi"
import { swalConfirm, swalError, swalSuccess } from '../../helpers/swal';
import AddEditPublication from './modals/AddEditPublication';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Checkbox, Tooltip } from 'antd';

function ResearchPublication() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { applicantsInfo, publicationInfo, publicationCommonData } = useSelector(
        ({ recruitement }) => ({
            publicationInfo: recruitement.publicationInfo,
            publicationCommonData: recruitement.publicationCommonData,
            applicantsInfo: recruitement.applicantsInfo,
        }),
    );


    const pubInit = {
        "title": "",
        "citation": "",
        "year": "",
        "organisations": "",
        "authors": "",
        "url": "",
        "applicant_id": user?.data?.applicant_id
    };

    const [journalInitialData, setJournalInitialData] = useState({
        "no_of_q1": "",
        "no_of_q2": "",
        "no_of_q3": null,
        "no_of_q4": null,
        "national_publication": null,
        "international_publication": "",
        "google_scholar_link": '',
        "research_details": '',
        "documents": null,
    });
    const [isSubmitJournal, setIsSubmitJournal] = useState(false);

    const journalSchema = Yup.object().shape({
        no_of_q1: Yup.string().typeError('No. of Q1 Journal must be required').required('Required'),
        no_of_q2: Yup.string().typeError('No. of Q2 Journal must be required').required('Required'),
        no_of_q3: Yup.string().typeError('No. of Q3 Journal must be required').required('Required'),
        no_of_q4: Yup.string().typeError('No. of Q4 Journal must be required').required('Required'),
        national_publication: Yup.string().typeError('National Publication must be Required').required('Required'),
        international_publication: Yup.string().typeError('Permanent district must be required').required('Required'),
        google_scholar_link: Yup.string().typeError(' Google Scholar Link must be required').required('Required'),
        research_details: Yup.string().typeError('Research Detail must be required').required('Required'),
    });


    const [action, setAction] = useState('');

    const [showPublication, setShowPublication] = useState(false);
    const [selectedPub, setSelectedPub] = useState(pubInit);
    const [journalSelected, setJournalSelected] = useState(false);
    const [editId, setEditId] = useState(0);

    useEffect(() => {
        if (user?.data?.applicant_id) {
            dispatch(Action.getPublicationInfoByApplicants(user?.data?.applicant_id));
            dispatch(Action.getPublicationCommonData(user?.data?.applicant_id));

        }
    }, [user, dispatch]);

    const handleDelete = async (url, module) => {
        swalConfirm().then(async (res) => {
            if (res.isConfirmed) {
                await API.delete(url)
                    .then(async (res) => {
                        if (res.data.success) {
                            swalSuccess(res.data?.message);
                            dispatch(Action.updateProfileScore(['Publication'], user?.data?.applicant_id));
                            dispatch(Action.getPublicationInfoByApplicants(user?.data?.applicant_id));
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
        setJournalInitialData({
            "no_of_q1": publicationCommonData?.no_of_q1,
            "no_of_q2": publicationCommonData?.no_of_q2,
            "no_of_q3": publicationCommonData?.no_of_q3,
            "no_of_q4": publicationCommonData?.no_of_q4,
            "national_publication": publicationCommonData?.national_publication,
            "international_publication": publicationCommonData?.international_publication,
            "google_scholar_link": publicationCommonData?.google_scholar_link,
            "research_details": publicationCommonData?.research_details,
            // "documents": publicationCommonData?.documents,
        })
    }, [publicationCommonData]);




    const handleSubmitJournal = async (values) => {
        setIsSubmitJournal(true);
        var formdata = new FormData();
        formdata.append('no_of_q1', values?.no_of_q1);
        formdata.append('no_of_q2', values?.no_of_q2);
        formdata.append('no_of_q3', values?.no_of_q3);
        formdata.append('no_of_q4', values?.no_of_q4);
        formdata.append('national_publication', values?.national_publication);
        formdata.append('international_publication', values?.international_publication);
        formdata.append('google_scholar_link', values?.google_scholar_link);
        formdata.append('research_details', values?.research_details);

        if (values?.documents) {
            formdata.append('documents', values?.documents);
        }


        if (publicationCommonData?.id) {
            try {
                await dispatch(Action.updatePublicationCommonData(formdata, publicationCommonData?.id));
                swalSuccess("Journal Update successfully!");
                dispatch(Action.getPublicationCommonData(user?.data?.applicant_id));
                setJournalSelected(false);
                console.log("Journal Update successfully!");
            } catch (error) {
                swalError("someting went wrong");
                console.error("Error submitting journal:", error);
            }
        } else {
            try {
                await dispatch(Action.insertPublicationCommonData(formdata));
                swalSuccess("Journal submitted successfully!");
                dispatch(Action.getPublicationCommonData(user?.data?.applicant_id));
                dispatch(Action.insertProfileScore(['Publication']));
                setTimeout(() => {
                    dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                }, "300");
                setJournalSelected(false);
                console.log("Journal submitted successfully!");
            } catch (error) {
                swalError("someting went wrong");
                console.error("Error submitting journal:", error);
            }
        }
        setIsSubmitJournal(false);
    }

    const handleOnChangeNoPublication = async (value) => {
        API.patch(`/hrms_applicant/update-profile/${user?.data?.applicant_id}`, {
            no_research: value
        })
            .then((res) => {
                if (res?.data?.success) {
                    swalSuccess('Data saved successfully!!');
                    if (value) {
                        dispatch(Action.insertProfileScore(['Publication']));
                    } else {
                        dispatch(Action.updateProfileScore(['Publication']));
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

    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

    return (
        <div className='main_contents_div'>
            <ProfileCard />
            <ProfileTabs />

            <TitleWithEditCard
                title="Research & Publication"
                btn_label="Add Research & Publication"
                btn_icon="fas fa-plus"
                setShowEdit={setShowPublication}
                setAction={setAction}
                setSelectedData={setSelectedPub}
                setEduId={setEditId}
                initalTr={pubInit}
            >

                {publicationInfo && publicationInfo.length > 0
                    ? publicationInfo?.map((row, i) => {
                        let count = i + 1;
                        return (
                            <Fragment key={i}>
                                <div className='row'>
                                    <div className='col-md-10'>
                                        <ItemsLabelRow lable={`Title ${count}`} filed={row?.title} />
                                    </div>

                                    <div className='col-md-2'>
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
                                                "documents": row?.documents
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
                                {/* <div className='row'>
                                    <div className='col-md-5'>
                                        <ItemsLabelRow lable="Institute/Organisations" filed={row?.organisations} />
                                        <div className='card_items_row_flex'>
                                            <div className='label_box'>Document</div>
                                            <div className='item_data'>
                                                <strong>:</strong> {row?.documents && <a href={DOC_CONTAINER + row?.documents + DOC_TOKEN} target="_blank" rel="noopener noreferrer">
                                                    <Tooltip placement='top' title={row?.documents}>
                                                        <i className="fas fa-file text-primary"></i> Open New Window
                                                    </Tooltip>
                                                </a>}
                                            </div>
                                        </div>
                                        <ItemsLabelRow lable="Citation" filed={row?.citation} />
                                    </div>
                                </div> */}

                                <div className="row">
                                    <div className='col-md-6'>
                                        <ItemsLabelRow lable="Institute/Organisations" filed={row?.organisations} />

                                        <div className='card_items_row_flex'>
                                            <div className='label_box'>Journal link</div>
                                            <div className='item_data'>
                                                <strong>: </strong>
                                                {row?.url &&
                                                    <Tooltip placement="top" title={row?.url}>
                                                        <a href={row?.url} target="_blank" rel="noopener noreferrer">
                                                            <i className="fas fa-external-link-alt text-primary"></i> Link
                                                        </a>
                                                    </Tooltip>
                                                }
                                            </div>
                                        </div>
                                        <ItemsLabelRow lable="Authors" filed={row?.authors} />
                                    </div>

                                    <div className='col-md-6'>
                                        <ItemsLabelRow lable="Year" filed={row?.year} />
                                        <div className='card_items_row_flex'>
                                            <div className='label_box'>Document</div>
                                            <div className='item_data'>
                                                <strong>: </strong>
                                                {row?.documents &&
                                                    <Tooltip placement="top" title={row?.documents}>
                                                        <a href={DOC_CONTAINER + row?.documents + DOC_TOKEN} target="_blank" rel="noopener noreferrer">
                                                            <i className="fas fa-file text-primary"></i>  Download Document
                                                        </a>
                                                    </Tooltip>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <ItemsLabelRow lable="Citation" filed={row?.citation} />
                                    </div>
                                </div>
                                <hr />
                            </Fragment>
                        )
                    })
                    : (
                        <div className="col-md-4 mt-4 mb-3">
                            <Checkbox
                                type="checkbox"
                                checked={applicantsInfo?.no_research}
                                id="no_research"
                                onChange={(e) => {
                                    handleOnChangeNoPublication(e.target.checked ? 1 : 0);
                                }}
                            />
                            <label className="form-check-label ml-2" htmlFor="no_research"><b>Don't have any research and publication?</b></label>
                        </div>
                    )
                }

            </TitleWithEditCard>


            <TitleWithEditCard title="Overall Research Publication Summary" setShowEdit={setJournalSelected} showEdit={journalSelected}>
                {journalSelected ? <>
                    <Formik
                        initialValues={journalInitialData}
                        validationSchema={journalSchema}
                        onSubmit={values => handleSubmitJournal(values)}
                    >
                        {({ errors, setFieldValue, touched, values }) => (
                            <Form>
                                <div className="row mt-10">
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>No. of Q1 Journal:</b></label>
                                        <Field name="no_of_q1" type="text" className="form-control" />
                                        {errors.no_of_q1 && touched.no_of_q1 ? (
                                            <div className="text-danger">{errors.no_of_q1}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>No. of Q2 Journal:</b></label>
                                        <Field name="no_of_q2" type="text" className="form-control" />
                                        {errors.no_of_q2 && touched.no_of_q2 ? (
                                            <div className="text-danger">{errors.no_of_q2}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>No. of Q3 Journal:</b></label>
                                        <Field name="no_of_q3" type="text" className="form-control" />
                                        {errors.no_of_q3 && touched.no_of_q3 ? (
                                            <div className="text-danger">{errors.no_of_q3}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>No. of Q4 Journal:</b></label>
                                        <Field name="no_of_q4" type="text" className="form-control" />
                                        {errors.no_of_q4 && touched.no_of_q4 ? (
                                            <div className="text-danger">{errors.no_of_q4}</div>
                                        ) : null}
                                    </div>


                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>No. of national publication:</b></label>
                                        <Field name="national_publication" type="text" className="form-control" />
                                        {errors.national_publication && touched.national_publication ? (
                                            <div className="text-danger">{errors.national_publication}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>No. of international publication:</b></label>
                                        <Field name="international_publication" type="text" className="form-control" />
                                        {errors.international_publication && touched.international_publication ? (
                                            <div className="text-danger">{errors.international_publication}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Google scholar link:</b></label>
                                        <Field name="google_scholar_link" type="text" className="form-control" />
                                        {errors.google_scholar_link && touched.google_scholar_link ? (
                                            <div className="text-danger">{errors.google_scholar_link}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Text Box (Research Detail):</b></label>
                                        <Field name="research_details" type="text" className="form-control" />
                                        {errors.research_details && touched.research_details ? (
                                            <div className="text-danger">{errors.research_details}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Document Upload:</b></label>
                                        <input
                                            name="documents"
                                            type="file"
                                            className="form-control"
                                            onChange={(event) => {
                                                setFieldValue("documents", event.target.files[0]);
                                            }}
                                        />
                                        {
                                            !values.documents && publicationCommonData.documents && (
                                                <a href={DOC_CONTAINER + publicationCommonData?.documents + DOC_TOKEN} target="_blank" rel="noopener noreferrer">
                                                    {publicationCommonData?.documents}
                                                </a>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="row mt-10">
                                    <div className="col-md-12 mb-3 text-right">
                                        <button className="btn btn-default mr-3" type="button" onClick={() => { setJournalSelected(false) }}>Cancel</button>
                                        <button className="btn btn-primary" type="submit" disabled={isSubmitJournal}>Update</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </> :
                    <>

                        <div className='row'>
                            <div className='col-md-6'>
                                <ItemsLabelRow lable="No. of Q1 Journal" filed={publicationCommonData?.no_of_q1} />
                                <ItemsLabelRow lable="No. of Q2 Journal" filed={publicationCommonData?.no_of_q2} />
                                <ItemsLabelRow lable="No. of Q3 Journal" filed={publicationCommonData?.no_of_q3} />
                                <ItemsLabelRow lable="No. of Q4 Journal" filed={publicationCommonData?.no_of_q4} />
                            </div>

                            <div className='col-md-6'>
                                <ItemsLabelRow lable="No. of national publication" filed={publicationCommonData?.national_publication} />
                                <ItemsLabelRow lable="No. of international publication" filed={publicationCommonData?.international_publication} />
                                <div className='card_items_row_flex'>
                                    <div className='label_box'>Google Scholar Link  </div>
                                    {publicationCommonData?.google_scholar_link && (
                                        <div className='item_data'>
                                            <strong>: </strong>
                                            <Tooltip placement="top" title={publicationCommonData?.google_scholar_link}>
                                                <a href={publicationCommonData?.google_scholar_link} target="_blank" rel="noopener noreferrer">
                                                    <i className="fas fa-external-link-alt text-primary"></i> Link
                                                    {/* {publicationCommonData?.google_scholar_link} */}
                                                </a>
                                            </Tooltip>
                                        </div>
                                    )}
                                </div>

                                <div className='card_items_row_flex'>
                                    <div className='label_box'>Document  </div>
                                    {publicationCommonData?.documents && (
                                        <div className='item_data'>
                                            <strong>: </strong>
                                            <Tooltip placement="top" title={publicationCommonData?.documents}>
                                                <a href={DOC_CONTAINER + publicationCommonData?.documents + DOC_TOKEN} target="_blank" rel="noopener noreferrer">
                                                    <i className="fas fa-file text-primary"></i>  Download Document
                                                    {/* {publicationCommonData?.google_scholar_link} */}
                                                </a>
                                            </Tooltip>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-12'>
                                <ItemsLabelRow lable="Text Box (Research Detail)" filed={publicationCommonData?.research_details} />
                            </div>
                        </div>
                    </>
                }

            </TitleWithEditCard>

            {/* Start research & publication common data insert & edit here  */}
            <AddEditPublication
                show={showPublication}
                setShow={setShowPublication}
                selectedData={selectedPub}
                setSelectedData={setSelectedPub}
                // //fetchedData={getPublicationInfo}
                editId={editId}
                pubInit={pubInit}
            />
        </div >
    )
}

export default ResearchPublication