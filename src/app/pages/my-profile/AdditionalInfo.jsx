import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { TitleWithEditCard } from '../../components/cards/TitleWithEditCard'
import { ItemsLabelRow } from '../../components/toolkit/ItemsLabelRow'
import { ProfileCard } from '../../components/cards/ProfileCard'
import ProfileTabs from '../../components/my_profile/ProfileTabs'
import { useDispatch, useSelector } from 'react-redux'
import * as Action from "./_redux/recruitementActions";
import API from "../../helpers/devApi";
import AddEditLanguage from './modals/AddEditLanguage'
import { swalConfirm, swalError, swalSuccess } from '../../helpers/swal'
import AddEditPortfolio from './modals/AddEditPortfolio'
import { Form, Field, Formik } from 'formik'
import AddEditReference from './modals/AddEditReference';
import AddEditDocument from './modals/AddEditDocument';
import * as Yup from 'yup';
import { Input, Tag, Tooltip } from 'antd';
import Editor from '../../../_metronic/_partials/controls/Editor';
import { formatCurrency } from '../../helpers/common'

export default function AdditionalInfo() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { applicantsInfo, additionalInfo, referenceInfo, languageInfo, portfolioInfo, relativesInfo, documentsInfo } = useSelector(
        ({ recruitement }) => ({
            additionalInfo: recruitement.additionalInfo,
            referenceInfo: recruitement.referenceInfo,
            languageInfo: recruitement.languageInfo,
            portfolioInfo: recruitement.portfolioInfo,
            applicantsInfo: recruitement.applicantsInfo,
            relativesInfo: recruitement.relativesInfo,
            documentsInfo: recruitement.documentsInfo,
        }),
    );

    const [jobsFacilityData, setjobsFacilityData] = useState({
        "current_salary": '',
        "expected_salary": '',
        "notice_period": '',
        // "extracurricular_activities": '',
        "current_salary_currency": "BDT",
        "expected_salary_currency": "BDT",
    });

    const [declarationData, setDeclarationData] = useState({
        "statement_flag_1": 0,
        "statement_flag_2": 0,
        "statement_flag_3": 0,
        "statement_flag_4": 0,
        "statement_flag_5": 0,
        "e_signature": '',
        "signature_date": '',
    });

    const [showReference, setShowReference] = useState(false);

    const langInit = {
        "language": "",
        "writing": "",
        "speaking": "",
        "reading": "",
        "applicant_id": user?.data?.applicant_id
    };

    const portInit = {
        "title": "",
        "year": "",
        "place": "",
        "author": "",
        "url": "",
        "applicant_id": user?.data?.applicant_id
    };

    const refInit = {
        "name": "",
        "designation": "",
        "organisation": "",
        "phone": "",
        "email": "",
        "applicant_id": user?.data?.applicant_id
    };

    const [relativesData, setRelativesData] = useState({
        "is_relative_working": 0,
        "name": "",
        "phone": "",
        "relation": "",
    });

    const docInit = {
        "applicant_id": user?.data?.applicant_id,
        "name": "",
        "document": "",
        "preview": null,
        "file_type": ''
    };

    // const [isChecked, setIsChecked] = useState(false);
    const [showLanguage, setShowLanguage] = useState(false);
    const [showPortfolio, setShowPortfolio] = useState(false);
    const [showEditCareer, setShowEditCareer] = useState(false);
    const [showEditFacility, setShowEditFacility] = useState(false);
    const [showEditExtraCurriculam, setShowEditExtraCurriculam] = useState(false);
    const [showEditDocument, setShowEditDocument] = useState(false);
    const [showEditRelative, setShowEditRelative] = useState(false);
    const [selectedData, setSelectedData] = useState({
        career_summary: "",
        preferred_industries: [],
        hobbies: [],
        interest: [],
        // is_fresher: 0,
    });
    const [selectedLang, setSelectedLang] = useState(langInit);
    const [selectedPort, setSelectedPort] = useState(portInit);
    const [action, setAction] = useState('');
    const [editId, setEditId] = useState(0);
    const [selectedOption, setSelectedOption] = useState();
    const [selectedRef, setSelectedRef] = useState(refInit);
    const [selectedDocData, setSelectedDocData] = useState(docInit)
    const [showDoc, setShowDoc] = useState(false);
    const [filePath, setFilePath] = useState('');

    const [hobbiesValue, setHobbiesValue] = useState('');
    const [selectedHobbies, setSelectedHobbies] = useState([]);
    const [interestValue, setInterestValue] = useState('');
    const [selectedInterest, setSelectedInterest] = useState([]);
    const [industriesValue, setIndustriesValue] = useState('');
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [extracurricular, setExtracurricular] = useState('');

    useEffect(() => {
        const jobsFacility = additionalInfo?.[0];

        setjobsFacilityData({
            "current_salary": jobsFacility?.current_salary,
            "expected_salary": jobsFacility?.expected_salary,
            "notice_period": jobsFacility?.notice_period,
            // "extracurricular_activities": jobsFacility?.extracurricular_activities,
            "current_salary_currency": "BDT",
            "expected_salary_currency": "BDT",
            "id": jobsFacility?.id,
        });
        setExtracurricular(jobsFacility?.extracurricular_activities);

        if (jobsFacility && Object.keys(jobsFacility).length > 0) {
            setDeclarationData({
                statement_flag_1: jobsFacility?.statement_flag_1,
                statement_flag_2: jobsFacility?.statement_flag_2,
                statement_flag_3: jobsFacility?.statement_flag_3,
                statement_flag_4: jobsFacility?.statement_flag_4,
                statement_flag_5: jobsFacility?.statement_flag_5,
                e_signature: jobsFacility?.e_signature,
                signature_date: jobsFacility?.signature_date,
            });

        } else {
            setDeclarationData({ statement_flag_1: 0, statement_flag_2: 0, e_signature: "", signature_date: "" });
        }


    }, [additionalInfo]);

    useEffect(() => {
        const relatives = relativesInfo?.[0];

        setRelativesData({
            "is_relative_working": applicantsInfo?.is_relative_working,
            "name": relatives?.name,
            "phone": relatives?.phone,
            "relation": relatives?.relation,
        });

    }, [relativesInfo, applicantsInfo]);


    // const handleCheckForeignDegree = (val, values, setFieldValue) => {
    //     setIsChecked(!isChecked);
    //     if (val) {
    //         setFieldValue("is_fresher", !isChecked ? 1 : 0);
    //     } else {
    //         setFieldValue("is_fresher", 0);
    //     }
    // };

    const handleDelete = async (url, module) => {
        swalConfirm().then(async (res) => {
            if (res.isConfirmed) {
                await API.delete(url)
                    .then(async (res) => {
                        if (res.data.success) {
                            swalSuccess(res.data?.message);
                            if (module === "reference") {
                                dispatch(Action.updateProfileScore(['References']));
                                dispatch(Action.getReferenceInfoByApplicants(user?.data?.applicant_id));
                            }
                            else if (module === "lang") {
                                dispatch(Action.updateProfileScore(['Language']));
                                dispatch(Action.getLanguageInfoByApplicants(user?.data?.applicant_id))
                            }
                            else if (module === "portfolio") {
                                dispatch(Action.updateProfileScore(['Portfolio']));
                                dispatch(Action.getPortfolioInfoByApplicants(user?.data?.applicant_id))
                            }
                            else if (module === "relative") {
                                dispatch(Action.updateProfileScore(['Relatives']));
                                dispatch(Action.getRelativesInfoByApplicants(user?.data?.applicant_id))
                            }
                            else if (module === "document") {
                                dispatch(Action.updateProfileScore(['Document']));
                                dispatch(Action.getDocumentsInfoByApplicants(user?.data?.applicant_id));
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

    const handleSubmit = async (values) => {
        // alert(JSON.stringify(values));
        // return false;

        var formdata = new FormData();

        if (showEditCareer === true) {

            let scrArr = ["Career Summary"];
            // if (values?.is_fresher) {
            //     scrArr.push("Experience")
            // }

            formdata.append('career_summary', values?.career_summary);
            formdata.append('interest', selectedInterest?.length > 0 ? JSON.stringify(selectedInterest) : '');
            formdata.append('hobbies', selectedHobbies?.length > 0 ? JSON.stringify(selectedHobbies) : '');
            formdata.append('preferred_industries', selectedIndustries?.length > 0 ? JSON.stringify(selectedIndustries) : '');
            // formdata.append('is_fresher', values?.is_fresher ? 1 : 0);

            await API.patch(`/hrms_applicant/update-profile/${user?.data?.applicant_id}`, formdata)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data saved successfully!!');
                        dispatch(Action.insertProfileScore(scrArr));
                        // dispatch(Action.getProfilePercentage());
                        // dispatch(Action.getProfilePercentage());
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                        }, "300");
                        setShowEditCareer(false);
                    } else {
                        swalError(res?.data?.message, " ");
                    }
                })
                .catch((error) => {
                    swalError("someting went wrong");
                });
        }

        if (showEditFacility === true) {

            let ScoreArr = ["Salary Information"];

            if (jobsFacilityData?.id == undefined) {
                await API.post(`/hrms_additional_information`, values)
                    .then((res) => {
                        if (res?.data?.success) {
                            swalSuccess('Data saved successfully!!');
                            dispatch(Action.insertProfileScore(ScoreArr));
                            // dispatch(Action.getProfilePercentage());
                            dispatch(Action.getAdditionalInfoByApplicants(user?.data?.applicant_id));
                            setTimeout(() => {
                                dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                            }, "300");
                            setShowEditFacility(false);
                        } else {
                            swalError(res?.data?.message, " ");
                        }
                    })
                    .catch((error) => {
                        swalError("someting went wrong");
                    });
            } else {
                await API.patch(`/hrms_additional_information/${jobsFacilityData?.id}`, values)
                    .then((res) => {
                        if (res?.data?.success) {
                            swalSuccess('Data saved successfully!!');
                            dispatch(Action.insertProfileScore(ScoreArr));
                            // dispatch(Action.getProfilePercentage());
                            dispatch(Action.getAdditionalInfoByApplicants(user?.data?.applicant_id));
                            setTimeout(() => {
                                dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                            }, "300");
                            setShowEditFacility(false);
                        } else {
                            swalError(res?.data?.message, " ");
                        }
                    })
                    .catch((error) => {
                        swalError("someting went wrong");
                    });
            }
        }

        if (showEditExtraCurriculam === true) {

            const ScoreArr = ["Extracurricular activities"];
            let profileAction = Action.insertProfileScore(ScoreArr);
            if (values.extracurricular_activities?.trim() === '<p><br></p>') {
                values.extracurricular_activities = '';
                profileAction = Action.updateProfileScore(ScoreArr);
            }

            if (jobsFacilityData?.id == undefined) {
                await API.post(`/hrms_additional_information`, {
                    extracurricular_activities: values.extracurricular_activities
                })
                    .then((res) => {
                        if (res?.data?.success) {
                            swalSuccess('Data saved successfully!!');
                            dispatch(profileAction);
                            // dispatch(Action.getProfilePercentage());
                            dispatch(Action.getAdditionalInfoByApplicants(user?.data?.applicant_id));
                            setTimeout(() => {
                                dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                            }, "300");
                            setShowEditExtraCurriculam(false);
                        } else {
                            swalError(res?.data?.message, " ");
                        }
                    })
                    .catch((error) => {
                        swalError("someting went wrong");
                    });
            } else {
                await API.patch(`/hrms_additional_information/${jobsFacilityData?.id}`, {
                    extracurricular_activities: values.extracurricular_activities
                })
                    .then((res) => {
                        if (res?.data?.success) {
                            swalSuccess('Data saved successfully!!');
                            dispatch(profileAction);
                            dispatch(Action.getAdditionalInfoByApplicants(user?.data?.applicant_id));
                            setTimeout(() => {
                                dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                            }, "300");
                            setShowEditExtraCurriculam(false)
                        } else {
                            swalError(res?.data?.message, " ");
                        }
                    })
                    .catch((error) => {
                        swalError("someting went wrong");
                    });
            }
        }

        if (showEditRelative === true && values.hasOwnProperty('is_relative_working')) {


            formdata.append('is_relative_working', values?.is_relative_working);

            await API.patch(`/hrms_applicant/update-profile/${user?.data?.applicant_id}`, formdata)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data saved successfully!!');
                        if (values?.is_relative_working === 1) {
                            const params = {
                                "name": values?.name,
                                "phone": values?.phone,
                                "relation": values?.relation,
                                "hrms_applicant_id": user?.data?.applicant_id
                            }
                            dispatch(Action.insertProfileScore(["Relatives"]));
                            dispatch(Action.updateRelativesInfo(params))
                        } else if (values?.is_relative_working === 0) {
                            dispatch(Action.deleteRelativesInfo())
                        }
                        // dispatch(Action.getProfilePercentage());
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                            dispatch(Action.getRelativesInfoByApplicants(user?.data?.applicant_id));
                        }, "300");
                        setShowEditRelative(false);
                    } else {
                        swalError(res?.data?.message, " ");
                    }
                })
                .catch((error) => {
                    swalError("someting went wrong");
                });
        }


    }

    const summaryFormSchema = Yup.object().shape({
        career_summary: Yup.string().nullable().required('Required'),
    });

    const statementSchema = Yup.object().shape({
        statement_flag_1: Yup.boolean().typeError('Required').oneOf([true], 'Required'),
        statement_flag_2: Yup.boolean().typeError('Required').oneOf([true], 'Required'),
        statement_flag_3: Yup.boolean().typeError('Required').oneOf([true], 'Required'),
        statement_flag_4: Yup.boolean().typeError('Required').oneOf([true], 'Required'),
        statement_flag_5: Yup.boolean().typeError('Required').oneOf([true], 'Required'),
        e_signature: Yup.string().nullable().required('Required'),
        signature_date: Yup.date().nullable().typeError('Required').required('Required'),
    });

    const jobsFacilityFormSchema = Yup.object().shape({
        current_salary: Yup.number().nullable().required('Required'),
        expected_salary: Yup.number().nullable().required('Required'),
        notice_period: Yup.number().nullable().required('Required'),
    });

    const relativeFormSchema = Yup.object().shape({
        is_relative_working: Yup.number().nullable().required('Please select if you have a relative'),
        name: Yup.string().when('is_relative_working', {
            is: 1,
            then: Yup.string().nullable().required('Name is required when you have a relative'),
            otherwise: Yup.string()
        }),
        // phone: Yup.number().when('is_relative_working', {
        //     is: 1,
        //     then: Yup.number().typeError('Phone must be a number').max(11, "Maximum 11 digits input").required('Phone is required when you have a relative'),
        //     otherwise: Yup.number()
        // }),
        phone: Yup.number().when('is_relative_working', {
            is: 1,
            then: Yup.number()
                .typeError('Phone must be a number')
                .test('len', 'Phone number must be at most 11 digits', val => val && val.toString().length <= 10)
                .required('Phone is required when you have a relative'),
            otherwise: Yup.number()
        }),
        relation: Yup.string().when('is_relative_working', {
            is: 1,
            then: Yup.string().nullable().required('Relation is required when you have a relative'),
            otherwise: Yup.string()
        }),
    });

    const handleSubmitDeclaration = async (values) => {


        await API.post(`/hrms_additional_information`, values)
            .then((res) => {
                if (res?.data?.success) {
                    swalSuccess('Data saved successfully!!');
                    dispatch(Action.getAdditionalInfoByApplicants(user?.data?.applicant_id));
                    setShowEditFacility(false);
                } else {
                    swalError(res?.data?.message, " ");
                }
            })
            .catch((error) => {
                swalError("someting went wrong");
            });
    }


    const handleInputChange = (value, type) => {
        if (type == 'hobby') {
            setHobbiesValue(value);
        } else if (type == 'industry') {
            setIndustriesValue(value);
        } else {
            setInterestValue(value)
        }
    };

    const handleKeyPress = (e, type) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (type == 'hobby') {
                const newSkill = hobbiesValue.trim();
                if (newSkill && !selectedHobbies.includes(newSkill)) {
                    setSelectedHobbies([...selectedHobbies, newSkill]);
                    setHobbiesValue('');
                }
            }
            else if (type == 'industry') {
                const newIndustry = industriesValue.trim();
                if (newIndustry && !selectedIndustries.includes(newIndustry)) {
                    setSelectedIndustries([...selectedIndustries, newIndustry]);
                    setIndustriesValue('');
                }
            }
            else {
                const newValue = interestValue.trim();
                if (newValue && !selectedInterest.includes(newValue)) {
                    setSelectedInterest([...selectedInterest, newValue]);
                    setInterestValue('');
                }
            }
        }
    };

    const handleSkillRemove = (skillToRemove, type) => {
        if (type == 'hobby') {
            setSelectedHobbies(selectedHobbies.filter(skill => skill !== skillToRemove));
        } else if (type == 'industry') {
            setSelectedIndustries(selectedIndustries.filter(skill => skill !== skillToRemove));
        } else {
            setSelectedInterest(selectedInterest.filter(skill => skill !== skillToRemove));
        }
    };

    const hobbiesArr = applicantsInfo?.hobbies && JSON.parse(applicantsInfo?.hobbies);
    const hobbiesString = hobbiesArr?.length > 0 && hobbiesArr?.join(", ");
    const interestArr = applicantsInfo?.interest && JSON.parse(applicantsInfo?.interest);
    const interestString = interestArr?.length > 0 && interestArr?.join(", ");
    const industryArr = applicantsInfo?.preferred_industries && JSON.parse(applicantsInfo?.preferred_industries);
    const industryString = industryArr?.length > 0 && industryArr?.join(", ");

    useEffect(() => {
        const hobbiesData = applicantsInfo?.hobbies ? JSON.parse(applicantsInfo?.hobbies) : [];
        const interestData = applicantsInfo?.interest ? JSON.parse(applicantsInfo?.interest) : [];
        const industriesData = applicantsInfo?.preferred_industries ? JSON.parse(applicantsInfo?.preferred_industries) : [];
        setSelectedData({
            career_summary: applicantsInfo?.career_summary,
            preferred_industries: industriesData,
            hobbies: hobbiesData,
            interest: interestData,
            // is_fresher: applicantsInfo?.is_fresher,

        });
        // setIsChecked(applicantsInfo?.is_fresher ? true : false);
        setSelectedInterest(interestData);
        setSelectedIndustries(industriesData);
        setSelectedHobbies(hobbiesData);


        // setHobbiesValue(hobbiesData?.join(','));
        // setInterestValue(interestData?.join(','));
        // setIndustriesValue(industriesData?.join(','));
        setSelectedOption(applicantsInfo?.is_relative_working);

    }, [applicantsInfo]);


    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;
    const DOC_TOKEN_ENCODED = DOC_TOKEN.replace(/&/g, '%26');
    let delay = 0;

    useEffect(() => {
        if (user?.data?.applicant_id) {
            dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
            dispatch(Action.getAdditionalInfoByApplicants(user?.data?.applicant_id));
            dispatch(Action.getLanguageInfoByApplicants(user?.data?.applicant_id));
            dispatch(Action.getReferenceInfoByApplicants(user?.data?.applicant_id));
            dispatch(Action.getPortfolioInfoByApplicants(user?.data?.applicant_id));
            dispatch(Action.getRelativesInfoByApplicants(user?.data?.applicant_id));
            dispatch(Action.getDocumentsInfoByApplicants(user?.data?.applicant_id));
        }
    }, [user, dispatch]);

    const handleTextEditor = (values, name) => {
        if (name === 'extracurricular_activities') {
            setExtracurricular(values);
        } else {
            setExtracurricular(values.extracurricular_activities);
        }
    };

    return (
        <div className='main_contents_div'>
            <ProfileCard />
            <ProfileTabs />

            <TitleWithEditCard title="Career Objective" setShowEdit={setShowEditCareer} showEdit={showEditCareer} >
                {showEditCareer ?
                    <>
                        <Formik
                            enableReinitialize={true}
                            initialValues={selectedData}
                            validationSchema={summaryFormSchema}
                            onSubmit={values => handleSubmit(values)}
                        >
                            {({ errors, touched, setFieldValue, values }) => (
                                <Form>


                                    <div className="row mt-10">
                                        <div className="col-md-12 mb-3">
                                            <label className="required"><b>Career Summary</b></label>
                                            <Field name="career_summary" type="text" className="form-control" />
                                            {errors.career_summary && touched.career_summary ? (
                                                <div className="text-danger">{errors.career_summary}</div>
                                            ) : null}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className=""><b>Hobbies</b></label>
                                            <Input
                                                value={hobbiesValue}
                                                onChange={(e) => { handleInputChange(e.target.value, 'hobby') }}
                                                onKeyPress={(e) => handleKeyPress(e, 'hobby')}
                                                placeholder="Type a hobbies and press Enter"
                                            />
                                            <div style={{ marginTop: 10 }}>
                                                {selectedHobbies.map(skill => (
                                                    <Tag key={skill} closable onClose={() => handleSkillRemove(skill, 'hobby')}>{skill}</Tag>
                                                ))}
                                            </div>
                                            {errors.hobbies && touched.hobbies ? (
                                                <div className="text-danger">{errors.hobbies}</div>
                                            ) : null}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className=""><b>Interest</b></label>
                                            <Input
                                                value={interestValue}
                                                onChange={(e) => { handleInputChange(e.target.value, 'interest') }}
                                                onKeyPress={(e) => handleKeyPress(e, 'interest')}
                                                placeholder="Type a interests and press Enter"
                                            />
                                            <div style={{ marginTop: 10 }}>
                                                {selectedInterest.map(skill => (
                                                    <Tag key={skill} closable onClose={() => handleSkillRemove(skill, 'interest')}>{skill}</Tag>
                                                ))}
                                            </div>
                                            {errors.interest && touched.interest ? (
                                                <div className="text-danger">{errors.interest}</div>
                                            ) : null}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className=""><b>Preferred Industries</b></label>

                                            <Input
                                                value={industriesValue}
                                                onChange={(e) => { handleInputChange(e.target.value, 'industry') }}
                                                onKeyPress={(e) => handleKeyPress(e, 'industry')}
                                                placeholder="Type a industry and press Enter"
                                            />
                                            <div style={{ marginTop: 10 }}>
                                                {selectedIndustries.map(skill => (
                                                    <Tag key={skill} closable onClose={() => handleSkillRemove(skill, 'industry')}>{skill}</Tag>
                                                ))}
                                            </div>
                                            {errors.preferred_industries && touched.preferred_industries ? (
                                                <div className="text-danger">{errors.preferred_industries}</div>
                                            ) : null}
                                        </div>

                                        {/* <div className="col-md-4 mt-4 mb-3">
                                            <Field
                                                type="checkbox"
                                                checked={isChecked}
                                                id="is_fresher"
                                                onChange={(e) => handleCheckForeignDegree(e.target.checked, values, setFieldValue)}
                                            />
                                            <label className="form-check-label ml-2" htmlFor="is_fresher"><b>Are You Fresher?</b></label>
                                        </div> */}
                                    </div>

                                    <div className="row mt-10">
                                        <div className="col-md-12 mb-3 text-right">
                                            <button className="btn btn-default mr-3" type="button" onClick={() => { setShowEditCareer(false) }}>Cancel</button>
                                            <button className="btn btn-primary" type="submit">Update</button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>

                    </>
                    : <>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='card_items_row_flex'>
                                    <p>
                                        {applicantsInfo?.career_summary}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='row'>
                            <div className='col-md-6'>
                                <ItemsLabelRow lable="Hobbies" filed={`${hobbiesString ? hobbiesString : ""}`} />
                            </div>
                            <div className='col-md-6'>
                                <ItemsLabelRow lable="Interest" filed={`${interestString ? interestString : ""}`} />
                            </div>
                            <div className='col-md-6'>
                                <ItemsLabelRow lable="Preferred Industries" filed={`${industryString ? industryString : ""}`} />
                            </div>
                            {/* <div className='col-md-6'>
                                <ItemsLabelRow lable="Fresher" filed={`${applicantsInfo?.is_fresher ? 'Yes' : "No"}`} />
                            </div> */}
                        </div>

                    </>
                }

            </TitleWithEditCard>

            <TitleWithEditCard title="Salary Information" setShowEdit={setShowEditFacility} showEdit={showEditFacility}>
                {showEditFacility ?
                    <>
                        <Formik
                            enableReinitialize={true}
                            initialValues={jobsFacilityData}
                            validationSchema={jobsFacilityFormSchema}
                            onSubmit={values => handleSubmit(values)}
                        >
                            {({ errors, touched, setFieldValue, values }) => (
                                <Form>


                                    <div className="row mt-10">
                                        <div className="col-md-4 mb-3">
                                            <label className="required"><b>Current Salary: </b></label>
                                            <Field name="current_salary" type="number" className="form-control" />
                                            {errors.current_salary && touched.current_salary ? (
                                                <div className="text-danger">{errors.current_salary}</div>
                                            ) : null}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="required"><b>Expected Salary: </b></label>
                                            <Field name="expected_salary" type="number" className="form-control" />
                                            {errors.expected_salary && touched.expected_salary ? (
                                                <div className="text-danger">{errors.expected_salary}</div>
                                            ) : null}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="required"><b>Notice Period(In days):</b></label>
                                            <Field name="notice_period" type="number" className="form-control" />
                                            {errors.notice_period && touched.notice_period ? (
                                                <div className="text-danger">{errors.notice_period}</div>
                                            ) : null}
                                        </div>
                                        {/* <div className="col-md-12 mb-3"> */}
                                        {/* <label className=""><b>Extracurricular activities:</b></label>
                                            <Editor
                                                editorHtml={extracurricular}
                                                onChange={(e) => {
                                                    handleTextEditor(e, 'extracurricular_activities');
                                                    setFieldValue("extracurricular_activities", e);
                                                }}
                                                required
                                            /> */}


                                        {/* <Field name="extracurricular_activities" type="text" className="form-control" /> */}
                                        {/* <textarea
                                                value={values.extracurricular_activities}
                                                name="extracurricular_activities"
                                                className='textarea-form-control'
                                                rows={4}
                                                placeholder={""}
                                                onChange={(e) => {
                                                    setFieldValue(`extracurricular_activities`, e.target.value);
                                                }}
                                            /> */}
                                        {/* </div> */}
                                    </div>

                                    <div className="row mt-10">
                                        <div className="col-md-12 mb-3 text-right">
                                            <button className="btn btn-default mr-3" type="button" onClick={() => { setShowEditFacility(false) }}>Cancel</button>
                                            <button className="btn btn-primary" type="submit">Update</button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>

                    </>
                    : <>
                        {additionalInfo?.map((item, i) => (
                            <Fragment key={i}>
                                <div className='row' >
                                    <div className='col-md-4'>
                                        {/* <ItemsLabelRow lable="Current Salary" filed={`${item?.current_salary} ${item?.current_salary_currency}`} /> */}
                                        <ItemsLabelRow lable="Current Salary" filed={item?.current_salary ? formatCurrency(item?.current_salary) : ''} />
                                    </div>
                                    <div className='col-md-4'>
                                        {/* <ItemsLabelRow lable="Notice Period:" filed={`${Math.floor(item?.notice_period / 30)} Month`} /> */}
                                        <ItemsLabelRow lable="Notice Period" filed={`${item?.notice_period} Days`} />
                                    </div>
                                    <div className='col-md-4'>
                                        {/* <ItemsLabelRow lable="Expected Salary" filed={`${item?.expected_salary}  ${item?.expected_salary_currency}`} /> */}
                                        <ItemsLabelRow lable="Expected Salary" filed={item?.expected_salary ? formatCurrency(item?.expected_salary) : ''} />
                                    </div>
                                </div>
                                {/* <div className='row' key={i}>
                                    <div className='col-md-12'> */}
                                {/* <ItemsLabelRow lable="Extracurricular activities:" filed={item?.extracurricular_activities} /> */}
                                {/* <div className='card_items_row_flex'>
                                            <div className='label_box' style={{ maxWidth: "130px" }}> Extracurricular activities</div>
                                            <div className='item_data d-flex' style={{ width: "100%" }}>
                                                <strong>: </strong>
                                                <div className='ml-3 text-justify' dangerouslySetInnerHTML={{ __html: item?.extracurricular_activities }} />
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </Fragment>
                        ))}
                    </>
                }

            </TitleWithEditCard>

            <TitleWithEditCard title="Acquaintance working in" setShowEdit={setShowEditRelative} showEdit={showEditRelative}>
                {showEditRelative ?
                    <>
                        <Formik
                            enableReinitialize={true}
                            initialValues={relativesData}
                            validationSchema={relativeFormSchema}
                            onSubmit={values => handleSubmit(values)}
                        >
                            {({ errors, touched, setFieldValue, values }) => (
                                <Form>
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <div className='card_items_row_flex'>
                                                <div className='item_data'>
                                                    <p>
                                                        Are you acquainted with anyone currently employed at BRAC University?
                                                        {/* Do you have a relative <br />
                                                        (Spouse/Father/Mother/Brother/Sister/Son/Daughter) in BRAC? */}
                                                    </p>
                                                    <div className="form-check form-check-inline mr-5">
                                                        <Field
                                                            type="radio"
                                                            value="1"
                                                            checked={values.is_relative_working === 1 ? true : false}
                                                            onChange={(e) => setFieldValue('is_relative_working', e.target.checked ? 1 : 0)}
                                                            name="is_relative_working"
                                                        />
                                                        <label className="form-check-label ml-2" htmlFor="inlineRadio1"> Yes </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <Field
                                                            type="radio"
                                                            value="0"
                                                            checked={values.is_relative_working === 0 ? true : false}
                                                            onChange={(e) => setFieldValue('is_relative_working', e.target.checked ? 0 : 1)}
                                                            name="is_relative_working"
                                                        />
                                                        <label className="form-check-label ml-2" htmlFor="inlineRadio2"> No </label>
                                                    </div>
                                                    {errors.is_relative_working && touched.is_relative_working ? (
                                                        <div className="text-danger">{errors.is_relative_working}</div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        {values.is_relative_working === 1 ? (
                                            <>



                                                <div className="col-md-4 mb-3">
                                                    <label className="required"><b>Acquaintance Name : </b></label>
                                                    <Field name="name" type="text" className="form-control" />
                                                    {errors.name && touched.name ? (
                                                        <div className="text-danger">{errors.name}</div>
                                                    ) : null}
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label className="required"><b>Phone Number :</b></label>
                                                    <Field name="phone" type="text" className="form-control" />
                                                    {errors.phone && touched.phone ? (
                                                        <div className="text-danger">{errors.phone}</div>
                                                    ) : null}
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label className="required"><b>Relation : </b></label>
                                                    <Field name="relation" type="text" className="form-control" />
                                                    {errors.relation && touched.relation ? (
                                                        <div className="text-danger">{errors.relation}</div>
                                                    ) : null}
                                                </div>

                                            </>
                                        ) : ''

                                        }

                                    </div>

                                    <div className="row mt-10">
                                        <div className="col-md-12 mb-3 text-right">
                                            <button className="btn btn-default mr-3" type="button" onClick={() => { setShowEditRelative(false) }}>Cancel</button>
                                            <button className="btn btn-primary" type="submit">Update</button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>

                    </>
                    :
                    <>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='card_items_row_flex'>
                                    <div className='item_data'>
                                        <p>
                                            Are you acquainted with anyone currently employed at BRAC University?
                                            {/* Do you have a relative <br />
                                            (Spouse/Father/Mother/Brother/Sister/Son/Daughter) in BRAC? */}
                                        </p>
                                        <strong>{selectedOption === 1 && "Yes"}</strong>
                                        <strong>{selectedOption === 0 && "No "}</strong>
                                    </div>
                                </div>
                            </div>
                            {selectedOption === 1 &&
                                <>
                                    <div className='col-md-6'>
                                        <ItemsLabelRow lable="Acquaintance Name" filed={relativesInfo && relativesInfo?.length > 0 && relativesInfo[0].name} />
                                        <ItemsLabelRow lable="Phone Number" filed={relativesInfo && relativesInfo?.length > 0 && relativesInfo[0].phone} />
                                        <ItemsLabelRow lable="Relation" filed={relativesInfo && relativesInfo?.length > 0 && relativesInfo[0].relation} />
                                    </div>
                                </>
                            }
                        </div>
                    </>
                }

            </TitleWithEditCard>

            <TitleWithEditCard
                title="References"
                setShowEdit={setShowReference}
                btn_label="Add Reference"
                btn_icon="fas fa-plus"
                setAction={setAction}
                setSelectedData={setSelectedRef}
                initalTr={selectedRef}
                setEduId={setEditId}
            >
                {referenceInfo?.map((row, i) => {
                    let count = i + 1;
                    return (
                        <>
                            <div className='row' key={i}>
                                <div className='col-md-5'>
                                    <ItemsLabelRow lable={`Name ${count}`} filed={row?.name} />
                                    <ItemsLabelRow lable="Organization" filed={row?.organisation} />
                                    <ItemsLabelRow lable="Address" filed={row?.address} />
                                    <ItemsLabelRow lable="Email" filed={row?.email} />
                                </div>

                                <div className='col-md-5'>
                                    <ItemsLabelRow lable="Designation" filed={row?.designation} />
                                    <ItemsLabelRow lable="Phone" filed={row?.phone} />
                                    <ItemsLabelRow lable="Relation" filed={row?.relation} />
                                </div>

                                <div className='col-md-2'>
                                    <button className="btn btn-outline-default mr-3"
                                        onClick={() => {
                                            setShowReference(true);
                                            setSelectedRef({
                                                ...selectedRef,
                                                "name": row?.name,
                                                "designation": row?.designation,
                                                "organisation": row?.organisation,
                                                "address": row?.address,
                                                "phone": row?.phone,
                                                "email": row?.email,
                                                "relation": row?.relation,
                                            });
                                            setEditId(row?.id);
                                            setAction("Edit");
                                        }}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="btn text-danger" onClick={() => { handleDelete(`/hrms_references/${row?.id}`, 'reference') }}>
                                        <i className="fas fa-trash-alt text-danger"></i>
                                    </button>
                                </div>
                            </div>

                            <hr />
                        </>
                    )
                })}

            </TitleWithEditCard>

            <TitleWithEditCard
                title="Languages"
                setShowEdit={setShowLanguage}
                btn_label="Add Language"
                btn_icon="fas fa-plus"
                setAction={setAction}
                setSelectedData={setSelectedLang}
                initalTr={langInit}
                setEduId={setEditId}
            >

                {languageInfo?.map((col, i) => {
                    let count = i + 1;
                    return (
                        <Fragment key={i}>
                            <div className='row'>
                                <div className='col-md-5'>
                                    <ItemsLabelRow lable={`Language ${count}`} filed={col?.language} />
                                    <ItemsLabelRow lable="Speaking" filed={col?.speaking} />
                                </div>

                                <div className='col-md-5'>
                                    <ItemsLabelRow lable="Writing" filed={col?.writing} />
                                    <ItemsLabelRow lable="Reading" filed={col?.reading} />
                                </div>

                                <div className='col-md-2'>
                                    <button className="btn btn-outline-default mr-3" onClick={() => {
                                        setShowLanguage(true);
                                        setSelectedLang({
                                            ...selectedLang,
                                            "language": col?.language,
                                            "writing": col?.writing,
                                            "speaking": col?.speaking,
                                            "reading": col?.reading,
                                        });
                                        setEditId(col?.id);
                                    }}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="btn text-danger" onClick={() => { handleDelete(`/hrms_language_proficiency/${col?.id}`, 'lang') }}>
                                        <i className="fas fa-trash-alt text-danger"></i>
                                    </button>
                                </div>
                            </div>

                            <hr />

                        </Fragment>
                    )
                })}
            </TitleWithEditCard>

            <TitleWithEditCard
                title="Portfolio"
                setShowEdit={setShowPortfolio}
                btn_label="Add Portfolio"
                btn_icon="fas fa-plus"
                setAction={setAction}
                setSelectedData={setSelectedPort}
                initalTr={portInit}
                setEduId={setEditId}
            >
                {portfolioInfo?.map((row, i) => {
                    let count = i + 1;
                    return (
                        <Fragment key={i}>
                            <div className='row'>
                                <div className='col-md-10'>
                                    <ItemsLabelRow lable={`Portfolio Title ${count}`} filed={row?.title} />
                                </div>

                                <div className='col-md-2'>
                                    <button className="btn btn-outline-default mr-3"
                                        onClick={() => {
                                            setShowPortfolio(true);
                                            setSelectedPort({
                                                ...selectedPort,
                                                "title": row?.title,
                                                "year": row?.year,
                                                "place": row?.place,
                                                "author": row?.author,
                                                "url": row?.url,
                                                "document": row?.document
                                            });
                                            setEditId(row?.id);
                                            setAction("Edit");
                                        }}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="btn text-danger">
                                        <i className="fas fa-trash-alt text-danger" onClick={() => { handleDelete(`/hrms_portfolio/${row?.id}`, 'portfolio') }}></i>
                                    </button>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <ItemsLabelRow lable="Institute/place" filed={row?.place} />
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-6'>
                                    {/* <ItemsLabelRow lable={`Portfolio Title ${count}`} filed={row?.title} /> */}
                                    {/* <ItemsLabelRow lable="Institute/place" filed={row?.place} /> */}
                                    <div className='card_items_row_flex'>
                                        <div className='label_box'>URL </div>
                                        {row?.url && (
                                            <div className='item_data'>
                                                <strong>: </strong>
                                                <Tooltip placement="top" title={row?.url}>
                                                    <a href={row?.url} target="_blank" rel="noopener noreferrer">
                                                        <i className="fas fa-link text-primary"></i> Link
                                                        {/* {row?.url} */}
                                                    </a>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </div>
                                    <ItemsLabelRow lable="Publish Year" filed={row?.year} />
                                </div>

                                <div className='col-md-6'>
                                    <ItemsLabelRow lable="Author" filed={row?.author} />
                                    <div className='card_items_row_flex'>
                                        <div className='label_box'>Document</div>
                                        <div className='item_data'>
                                            <strong>: </strong>
                                            {row?.document && (
                                                <Tooltip placement="top" title={row?.document}>
                                                    <a href={DOC_CONTAINER + row?.document + DOC_TOKEN} target="_blank" rel="noopener noreferrer">
                                                        {/* {row?.document} */}
                                                        <i className="fas fa-file text-primary"></i> View
                                                    </a>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </Fragment>
                    )
                })}
            </TitleWithEditCard>

            <TitleWithEditCard title="Extracurricular Activities" setShowEdit={setShowEditExtraCurriculam} showEdit={showEditExtraCurriculam}>
                {showEditExtraCurriculam ?
                    <>
                        <Formik
                            enableReinitialize={true}
                            initialValues={{
                                extracurricular_activities: extracurricular
                            }}
                            onSubmit={values => {
                                handleSubmit(values);
                            }}
                        >
                            {({ errors, touched, setFieldValue, values, handleSubmit: handleFormSubmit }) => (
                                <Form>


                                    <div className="row mt-10">
                                        <div className="col-md-12 mb-3">
                                            {/* <label className=""><b>Extracurricular activities:</b></label> */}
                                            <Editor
                                                editorHtml={extracurricular}
                                                onChange={(e) => {
                                                    handleTextEditor(e, 'extracurricular_activities');
                                                    setFieldValue("extracurricular_activities", e);
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row mt-10">
                                        <div className="col-md-12 mb-3 text-right">
                                            <button className="btn btn-default mr-3" type="button" onClick={() => { setShowEditExtraCurriculam(false) }}>Cancel</button>
                                            <button className="btn btn-primary" type='submit'>Update</button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>

                    </>
                    : <>
                        {additionalInfo?.map((item, i) => (
                            <Fragment key={i}>
                                <div className='row' key={i}>
                                    <div className='col-md-12'>
                                        {/* <ItemsLabelRow lable="Extracurricular activities:" filed={item?.extracurricular_activities} /> */}
                                        <div className='card_items_row_flex'>
                                            {/* <div className='label_box' style={{ maxWidth: "130px" }}> Extracurricular activities</div> */}
                                            <div className='item_data d-flex' style={{ width: "100%" }}>
                                                {/* <strong>: </strong> */}
                                                <div className='text-justify' dangerouslySetInnerHTML={{ __html: item?.extracurricular_activities }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        ))}
                    </>
                }

            </TitleWithEditCard>

            <TitleWithEditCard
                title="Document Upload"
                setShowEdit={setShowDoc}
                btn_label="Upload Document"
                btn_icon="fas fa-plus"
                setAction={setAction}
                setSelectedData={setSelectedDocData}
                initalTr={selectedDocData}
                setEduId={setEditId}
            >

                <div className='row'>
                    <div className='col-md-11 mx-auto'>
                        <div className="row" >
                            {documentsInfo?.map((row, key) => {
                                row = JSON.parse(JSON.stringify(row));
                                if (row.document) {
                                    const file_extension = row.document?.split('.').pop();
                                    row.file_extension = file_extension;
                                    if (file_extension === 'pdf') {
                                        row.document_url = row.document && DOC_CONTAINER + row.document + DOC_TOKEN + '&rsct=application%2Fpdf&embedded=true';
                                        // } else if (['docx', 'doc'].includes(file_extension)) {
                                    } else if (row.file_type == "document") {
                                        row.delay = delay;
                                        // row.document_url = row.document && 'https://docs.google.com/gview?url=' + DOC_CONTAINER + row.document + DOC_TOKEN_ENCODED + '&embedded=true';
                                        row.document_url = row.document && 'https://view.officeapps.live.com/op/embed.aspx?src=' + DOC_CONTAINER + row.document + DOC_TOKEN_ENCODED;
                                        delay += 1000;
                                    } else {
                                        row.document_url = row.document && DOC_CONTAINER + row.document + DOC_TOKEN;
                                    }
                                }

                                return (

                                    <div className="col-md-6 mb-4 doc-gallary" key={key} >
                                        <label>
                                            <b>{row?.name}</b>
                                        </label>
                                        <div className="btn-group doc-action-btn"
                                        >
                                            {
                                                row?.document_url && row?.file_type === 'document' && (
                                                    <button className='btn btn-outline-default mr-3'>
                                                        <a href={row.document_url} target="_blank" rel="noopener noreferrer">
                                                            <i className="fas fa-eye text-dark"></i>
                                                        </a>
                                                    </button>
                                                )
                                            }
                                            {row?.document && (
                                                <button className='btn btn-outline-default mr-3'>
                                                    <a href={DOC_CONTAINER + row?.document + DOC_TOKEN} target="_blank" rel="noopener noreferrer">
                                                        <i className="fas fa-download text-success"></i>
                                                    </a>
                                                </button>
                                            )}
                                            <button className="btn btn-outline-default mr-3"
                                                onClick={() => {
                                                    setShowDoc(true);
                                                    setSelectedDocData({
                                                        ...selectedDocData,
                                                        "applicant_id": user?.data?.applicant_id,
                                                        "name": row?.name,
                                                        "document": row?.document,
                                                        "document_url": row?.document_url,
                                                        "preview": null,
                                                        "file_type": row.file_type,
                                                        "file": null
                                                    });
                                                    setEditId(row?.id);
                                                    setAction("Edit");
                                                }}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="btn text-danger" onClick={() => { handleDelete(`/hrms_applicant_documents/${row?.id}`, 'document') }}>
                                                <i className="fas fa-trash-alt text-danger"></i>
                                            </button>
                                        </div>
                                        <div
                                            className='doc-background'
                                        >
                                            {row?.document && (
                                                <>
                                                    {row.file_type === "image" ? (
                                                        <img src={row.document_url} alt={row.name} className=''
                                                        />
                                                    ) : row.file_type === "video" ? (
                                                        <video controls className='doc-preview'>
                                                            <source src={row.document_url} type="video/mp4" />
                                                        </video>
                                                    ) : row.file_type === 'document' ? (
                                                        row.delay ?
                                                            <IframeViewer url={row.document_url} key={key} delay={row.delay} />
                                                            :
                                                            <iframe style={{ width: '100%', height: '100%' }} title="Preview" src={row.document_url} />
                                                    ) : (
                                                        <p><a target="_blank" href={row.document_url}><i className="fas fa-link"></i></a>&nbsp;{row?.name}</p>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                        {/* {docData?.map((row, key) => {
                            let count = key + 1;
                            return (
                                <>
                                    <div className="row" key={key + parseInt(row?.id)}>
                                        <div className="col-md-10">
                                            <div className="row">

                                                <div className="col-md-6 mb-4">
                                                    <label>
                                                        <b>
                                                            {row?.name}
                                                            {count}
                                                        </b>
                                                    </label>
                                                    <br />
                                                    {row?.document && (
                                                        <>
                                                            {row.file_type === "image" ? (
                                                                <img src={row.document} alt={row.name} style={{ maxWidth: '100%', maxHeight: '100px' }} />
                                                            ) : row.file_type === "video" ? (
                                                                <video controls style={{ maxWidth: '100%', maxHeight: '150px' }}>
                                                                    <source src={row.document} type="video/mp4" />
                                                                </video>
                                                            ) : row.file_type === 'pdf' || row.file_type === 'document' ? (
                                                                <iframe title="Preview" src={row.document} style={{ width: '100%', height: '100px' }} />
                                                            ) : (
                                                                <p><a target="_blank" href={row.document}><i className="fas fa-link"></i></a>&nbsp;{row?.name}</p>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-2'>
                                            <button className="btn btn-outline-default mr-3"
                                                onClick={() => {
                                                    setShowDoc(true);
                                                    setSelectedDocData({
                                                        ...selectedDocData,
                                                        "applicant_id": user?.data?.applicant_id,
                                                        "name": row?.name,
                                                        "document": row?.document,
                                                        "preview": null,
                                                        "file_type": row.file_type,
                                                        "file": null
                                                    });
                                                    setEditId(row?.id);
                                                    setAction("Edit");
                                                }}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="btn text-danger">
                                                <i className="fas fa-trash-alt text-danger" onClick={() => { handleDelete(`/hrms_applicant_documents/${row?.id}`, 'portfolio') }}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <hr />
                                </>
                            )
                        })} */}
                    </div>
                </div>
                {/* </>
                } */}
            </TitleWithEditCard >

            <TitleWithEditCard title="Declaration of Statement" btn="no" >
                <div className='row'>
                    <div className='col-md-11 mx-auto'>
                        <Formik
                            enableReinitialize={true}
                            validationSchema={statementSchema}
                            initialValues={declarationData}
                            onSubmit={values => handleSubmitDeclaration(values)}
                        >
                            {({ errors, touched, values, setFieldValue }) => (
                                <Form>
                                    <div className="row mt-10">
                                        <div className="col-md-12 mb-3">
                                            <label>
                                                <Field
                                                    type="checkbox"
                                                    name="statement_flag_1"
                                                    checked={values.statement_flag_1 === 1 ? true : false}
                                                    onChange={(e) => setFieldValue('statement_flag_1', e.target.checked ? 1 : 0)}
                                                />
                                                <span className='ms-3'> Multiple checkboxes with the same name attribute, but different value attributes will be considered, Multiple checkboxes with the same name attribute </span>
                                            </label>
                                            {errors.statement_flag_1 && touched.statement_flag_1 ? (
                                                <div className="text-danger">{errors.statement_flag_1}</div>
                                            ) : null}
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label>
                                                <Field
                                                    type="checkbox"
                                                    name="statement_flag_2"
                                                    checked={values.statement_flag_2 === 1 ? true : false}
                                                    onChange={(e) => setFieldValue('statement_flag_2', e.target.checked ? 1 : 0)}
                                                />
                                                <span className='ms-3'> Multiple checkboxes with the same name attribute, but different value attributes will be considered Multiple checkboxes with the same name attribute </span>
                                            </label>
                                            {errors.statement_flag_2 && touched.statement_flag_2 ? (
                                                <div className="text-danger">{errors.statement_flag_2}</div>
                                            ) : null}
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label>
                                                <Field
                                                    type="checkbox"
                                                    name="statement_flag_3"
                                                    checked={values.statement_flag_3 === 1 ? true : false}
                                                    onChange={(e) => setFieldValue('statement_flag_3', e.target.checked ? 1 : 0)}
                                                />
                                                <span className='ms-3'> Multiple checkboxes with the same name attribute, but different value attributes will be considered Multiple checkboxes with the same name attribute </span>
                                            </label>
                                            {errors.statement_flag_3 ? (
                                                <div className="text-danger">{errors.statement_flag_3}</div>
                                            ) : null}
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label>
                                                <Field
                                                    type="checkbox"
                                                    name="statement_flag_4"
                                                    checked={values.statement_flag_4 === 1 ? true : false}
                                                    onChange={(e) => setFieldValue('statement_flag_4', e.target.checked ? 1 : 0)}
                                                />
                                                <span className='ms-3'> Multiple checkboxes with the same name attribute, but different value attributes will be considered Multiple checkboxes with the same name attribute </span>
                                            </label>
                                            {errors.statement_flag_4 ? (
                                                <div className="text-danger">{errors.statement_flag_4}</div>
                                            ) : null}
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label>
                                                <Field
                                                    type="checkbox"
                                                    name="statement_flag_5"
                                                    checked={values.statement_flag_5 === 1 ? true : false}
                                                    onChange={(e) => setFieldValue('statement_flag_5', e.target.checked ? 1 : 0)}
                                                />
                                                <span className='ms-3'> Multiple checkboxes with the same name attribute, but different value attributes will be considered Multiple checkboxes with the same name attribute </span>
                                            </label>
                                            {errors.statement_flag_5 ? (
                                                <div className="text-danger">{errors.statement_flag_5}</div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="row mt-10">
                                        <div className="col-md-4 mb-3">
                                            <label className=""><b>E-signature: </b></label>
                                            <Field name="e_signature" type="text" className="form-control" placeholder="e-signature" />
                                            {errors.e_signature && touched.e_signature ? (
                                                <div className="text-danger">{errors.e_signature}</div>
                                            ) : null}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className=""><b>Date:</b></label>
                                            <Field name="signature_date" type="date" className="form-control" />
                                            {errors.signature_date && touched.signature_date ? (
                                                <div className="text-danger">{errors.signature_date}</div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="row mt-10">
                                        <div className="col-md-12 mb-3 text-right">
                                            <button className="btn btn-primary" type="submit">Submit</button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </TitleWithEditCard>



            <AddEditLanguage
                show={showLanguage}
                setShow={setShowLanguage}
                selectedData={selectedLang}
                setSelectedData={setSelectedLang}
                editId={editId}
                langInit={langInit}
            />

            <AddEditReference
                show={showReference}
                setShow={setShowReference}
                selectedData={selectedRef}
                setSelectedData={setSelectedRef}
                editId={editId}
                refInit={refInit}
                referenceInfo={referenceInfo}
            />


            <AddEditPortfolio
                show={showPortfolio}
                setShow={setShowPortfolio}
                selectedData={selectedPort}
                setSelectedData={setSelectedPort}
                action={action}
                editId={editId}
                portInit={portInit}
            />

            <AddEditDocument
                show={showDoc}
                setShow={setShowDoc}
                selectedData={selectedDocData}
                setSelectedData={setSelectedDocData}
                editId={editId}
                docInit={docInit}
            />

        </div >
    )
}

const IframeViewer = ({ url, delay }) => {
    const [previewLink, setPreviewLink] = useState('');
    const [noOfRetry, setNoOfRetry] = useState(0);

    useEffect(() => {
        if (noOfRetry < 5) {
            setTimeout(() => {
                setPreviewLink(url);
            }, delay);

            setTimeout(() => {
                setNoOfRetry((state) => state + 1);
            }, 1500);
        }
    }, [noOfRetry]);

    return <iframe style={{ width: '100%', height: '100%' }} src={previewLink} onLoad={() => { setNoOfRetry(7) }} />
}