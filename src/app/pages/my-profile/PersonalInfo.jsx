import React, { useEffect, useState } from "react";
import { TitleWithEditCard } from '../../components/cards/TitleWithEditCard'
import { ItemsLabelRow } from '../../components/toolkit/ItemsLabelRow'
import { ProfileCard } from '../../components/cards/ProfileCard'
import ProfileTabs from '../../components/my_profile/ProfileTabs'
import { useDispatch, useSelector } from 'react-redux'

import API from "../../helpers/devApi";
import { swalError, swalSuccess } from "../../helpers/swal";
import moment from "moment";
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import * as Action from "./_redux/recruitementActions";
import Select from "react-select";

export default function PersonalInfo() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { applicantsInfo, pre_district, pre_thana, per_district, per_thana } = useSelector(
        ({ recruitement }) => ({
            applicantsInfo: recruitement.applicantsInfo,
            pre_district: recruitement.pre_district,
            pre_thana: recruitement.pre_thana,
            per_district: recruitement.per_district,
            per_thana: recruitement.per_thana,
        }),
    );

    const [showEdit, setShowEdit] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [nationalityList, setNationalityList] = useState([]);
    const [perInitialData, setPerInitialData] = useState({
        "per_address_line_1": "",
        "per_address_line_2": "",
        "per_districts_id": null,
        "per_divisions_id": null,
        "per_thana_id": null,
        "per_international_address": "",
        "per_postal_code": '',
    });
    const [preInitialData, setPreInitialData] = useState({
        "pre_address_line_1": "",
        "pre_address_line_2": "",
        "pre_districts_id": null,
        "pre_divisions_id": null,
        "pre_thana_id": null,
        "pre_international_address": "",
        "pre_postal_code": '',
        "is_same_as_permanent_address": '',
    });
    const [selectedData, setSelectedData] = useState({});
    const [showEditOne, setShowEditOne] = useState(false);
    const [showEditTwo, setShowEditTwo] = useState(false);
    const [divisionList, setDivisionList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [upazilaList, setUpazilaList] = useState([]);
    const [submitTracker, setSubmitTracker] = useState({
        profile: false,
        perAddress: false,
        preAddress: false,
    });
    const profileScoreArr = ['Personal Information', "Ex-Brac Employee", "Present Address", "Permanent Address"];

    useEffect(() => {
        if (user?.data?.applicant_id) {
            dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));

        }
    }, [user, dispatch]);


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

    const getNationalityInfo = async () => {
        await API.get(`hrms_nationality/`)
            .then((res) => {
                if (res.data?.success) {
                    const resData = res?.data?.data?.hrms_nationality;
                    var result = resData?.map(function (col) {
                        return {
                            value: col?.hrms_nationality__id,
                            label: col?.hrms_nationality__name,
                        }
                    });
                    setNationalityList(result);
                } else {
                    swalError(res?.message);
                }
            })
            .catch((error) => {
                swalError("someting went wrong");
            });
    };

    useEffect(() => {
        setSelectedData({
            "first_name": applicantsInfo?.m_career_portal_user?.first_name,
            "middle_name": applicantsInfo?.m_career_portal_user?.middle_name,
            "last_name": applicantsInfo?.m_career_portal_user?.last_name,
            'date_of_birth': moment(applicantsInfo?.date_of_birth).format("YYYY-MM-DD"),
            "father_name": applicantsInfo?.father_name,
            "mother_name": applicantsInfo?.mother_name,
            "religion": applicantsInfo?.religion,
            "gender": applicantsInfo?.gender,
            "marital_status": applicantsInfo?.marital_status,
            "country_of_birth": applicantsInfo?.country_of_birth,
            "nationality_id": applicantsInfo?.nationality_id,
            "nationality_type": applicantsInfo?.nationality_type,
            "second_nationality_id": applicantsInfo?.second_nationality_id,
            "second_nationality_type": applicantsInfo?.second_nationality_type,
            "nid": applicantsInfo?.nid,
            "blood_group": applicantsInfo?.blood_group,
            "passport_number": applicantsInfo?.passport_number,
            "pin": applicantsInfo?.pin,
            "contact_number": applicantsInfo?.m_career_portal_user?.contact_number,
            "email": applicantsInfo?.m_career_portal_user?.email,
            "alternative_contact_number": applicantsInfo?.alternative_contact_number,
            "alternative_email": applicantsInfo?.alternative_email,
            "is_disable": applicantsInfo?.is_disable,
            "about_disability": applicantsInfo?.about_disability,
            "is_ex_employee": applicantsInfo?.is_ex_employee,
            'prev_joining_date': applicantsInfo?.prev_joining_date ? moment(applicantsInfo?.prev_joining_date).format("YYYY-MM-DD") : "",
            'prev_last_working_date': applicantsInfo?.prev_last_working_date ? moment(applicantsInfo?.prev_last_working_date).format("YYYY-MM-DD") : "",
            "ex_employee_code": applicantsInfo?.ex_employee_code,
            'ex_superviosor_name': applicantsInfo?.ex_superviosor_name,
            'ex_superviosor_designation': applicantsInfo?.ex_superviosor_designation,
            'ex_superviosor_email': applicantsInfo?.ex_superviosor_email,
            'ex_superviosor_phone': applicantsInfo?.ex_superviosor_phone,
            'spouse_name': applicantsInfo?.spouse_name,
            'height': applicantsInfo?.height,
            'weight': applicantsInfo?.weight,
            'tin': applicantsInfo?.tin,
            'no_of_living_child': applicantsInfo?.no_of_living_child,
            'work_permit_expiry_date': applicantsInfo?.work_permit_expiry_date ? moment(applicantsInfo?.work_permit_expiry_date).format("YYYY-MM-DD") : "",
            'work_permit_issue_date': applicantsInfo?.work_permit_issue_date ? moment(applicantsInfo?.work_permit_issue_date).format("YYYY-MM-DD") : "",
            'passport_issue_date': applicantsInfo?.passport_issue_date ? moment(applicantsInfo?.passport_issue_date).format("YYYY-MM-DD") : "",
            'passport_expiry_date': applicantsInfo?.passport_expiry_date ? moment(applicantsInfo?.passport_expiry_date).format("YYYY-MM-DD") : "",
            'visa_expiry_date': applicantsInfo?.visa_expiry_date ? moment(applicantsInfo?.visa_expiry_date).format("YYYY-MM-DD") : "",
        })

        setPerInitialData({
            "per_address_line_1": applicantsInfo?.per_address_line_1,
            "per_address_line_2": applicantsInfo?.per_address_line_2,
            "per_districts_id": applicantsInfo?.per_districts_id,
            "per_divisions_id": applicantsInfo?.per_divisions_id,
            "per_thana_id": applicantsInfo?.per_thana_id,
            "per_international_address": applicantsInfo?.per_international_address,
            "per_postal_code": applicantsInfo?.per_postal_code,
        })

        setPreInitialData({
            "pre_address_line_1": applicantsInfo?.pre_address_line_1,
            "pre_address_line_2": applicantsInfo?.pre_address_line_2,
            "pre_international_address": applicantsInfo?.pre_international_address,
            "pre_postal_code": applicantsInfo?.pre_postal_code,
            "pre_districts_id": applicantsInfo?.pre_districts_id,
            "pre_divisions_id": applicantsInfo?.pre_divisions_id,
            "pre_thana_id": applicantsInfo?.pre_thana_id,
            "is_same_as_permanent_address": applicantsInfo?.is_same_as_permanent_address,
        })

        setIsChecked(applicantsInfo?.is_same_as_permanent_address ? true : false);

        if (applicantsInfo?.per_divisions_id) {
            dispatch(
                Action.getAllPerDistrictByDivision(applicantsInfo?.per_divisions_id)
            );
        }
        if (
            applicantsInfo?.per_divisions_id &&
            applicantsInfo?.per_districts_id
        ) {
            dispatch(
                Action.getAllPerThanaDistrictByDivision(
                    applicantsInfo?.per_divisions_id,
                    applicantsInfo?.per_districts_id
                )
            );
        }

        if (applicantsInfo?.pre_divisions_id) {
            dispatch(
                Action.getAllPreDistrictByDivision(applicantsInfo?.pre_divisions_id)
            );
        }
        if (applicantsInfo?.pre_divisions_id && applicantsInfo?.pre_districts_id) {
            dispatch(
                Action.getAllPreThanaDistrictByDivision(
                    applicantsInfo?.pre_divisions_id,
                    applicantsInfo?.pre_districts_id
                )
            );
        }

    }, [applicantsInfo]);

    const PersonalSchema = Yup.object().shape({
        first_name: Yup.string()
            .min(2, 'Too Short!')
            .max(30, 'Too Long!')
            .nullable()
            .required('Required'),
        last_name: Yup.string()
            .min(2, 'Too Short!')
            .max(30, 'Too Long!')
            .nullable()
            .required('Required'),
        date_of_birth: Yup.date().nullable().required('Required'),
        father_name: Yup.string()
            .min(2, 'Too Short!')
            .max(30, 'Too Long!')
            .nullable()
            .required('Required'),
        mother_name: Yup.string()
            .min(2, 'Too Short!')
            .max(30, 'Too Long!')
            .nullable()
            .required('Required'),
        religion: Yup.string()
            .min(2, 'Too Short!')
            .max(30, 'Too Long!')
            .nullable()
            .required('Required'),
        gender: Yup.string()
            .min(2, 'Too Short!')
            .max(15, 'Too Long!')
            .nullable()
            .required('Required'),
        marital_status: Yup.string()
            .nullable()
            .required('Required'),
        spouse_name: Yup.string().when('marital_status', {
            is: "Married",
            then: Yup.string().nullable().required('Spouse name is required'),
            otherwise: Yup.string().nullable()
        }),
        country_of_birth: Yup.number()
            .nullable()
            .required('Required'),
        nationality_id: Yup.number().nullable().required('Required'),
        second_nationality_id: Yup.number().nullable(),
        nationality_type: Yup.string()
            .min(2, 'Too Short!')
            .max(20, 'Too Long!')
            .nullable()
            .required('Required'),
        second_nationality_type: Yup.string()
            .min(2, 'Too Short!')
            .max(20, 'Too Long!')
            .nullable(),
        nid: Yup.number().nullable().required('Required'),
        is_disable: Yup.number()
            .nullable()
            .typeError('Required')
            .required('Required'),
        is_ex_employee: Yup.number()
            .nullable()
            .typeError('Required')
            .required('Required'),

        ex_employee_code: Yup.string().when('is_ex_employee', {
            is: 1,
            then: Yup.string().nullable().required('Employee code is required'),
            otherwise: Yup.string().nullable()
        }),

        prev_joining_date: Yup.date().when('is_ex_employee', {
            is: 1,
            then: Yup.date().nullable().required('Joining Date is required'),
            otherwise: Yup.date().nullable()
        }),

        // prev_last_working_date: Yup.string().when('is_ex_employee', {
        //     is: "1",
        //     then: Yup.string().nullable().required('Last working day is required'),
        //     otherwise: Yup.string().nullable()
        // }),
        prev_last_working_date: Yup.string().when(['is_ex_employee', 'prev_joining_date'], (is_ex_employee, prev_joining_date) => {
            if (is_ex_employee === 1) {
                if (prev_joining_date) {
                    return Yup.date()
                        .nullable()
                        .required('Last working day is required')
                        .min(prev_joining_date, 'Last working date must be greater than or equal joining date')
                } else {
                    return Yup.date()
                        .nullable()
                        .required('Last working day is required')
                }
            } else {
                return Yup.date().nullable()
            }
        }),
        ex_superviosor_email: Yup.string().when('is_ex_employee', {
            is: 1,
            then: Yup.string().email('Must be valid email').nullable(),
            otherwise: Yup.string().nullable()
        }),
        ex_superviosor_phone: Yup.string().when('is_ex_employee', {
            is: 1,
            then: Yup.string()
                .matches(/^[0-9]+$/, "Must be only digits")
                .max(11, 'Too Long!')
                .nullable(),
            otherwise: Yup.string().nullable()
        }),
        contact_number: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
            .max(11, 'Too Long!')
            .nullable()
            .required('Required'),
        email: Yup.string().nullable().email('Invalid email').required('Required'),
        no_of_living_child: Yup.number().nullable(),
        alternative_email: Yup.string().nullable().email('Invalid email'),
        alternative_contact_number: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
            .max(11, 'Too Long!')
            .nullable(),
        about_disability: Yup.string().when(['is_disable'], (is_disable) => {
            if (is_disable === 1) {
                return Yup.string().nullable().required('Required')
            } else {
                return Yup.string().nullable()
            }
        }),
        work_permit_expiry_date: Yup.date().when(['work_permit_issue_date'], (work_permit_issue_date) => {
            if (work_permit_issue_date) {
                return Yup.date()
                    .nullable()
                    .min(work_permit_issue_date, 'Expire date must be greater than or equal issue date')
            } else {
                return Yup.date().nullable()
            }
        }),
        passport_expiry_date: Yup.date().when(['passport_issue_date'], (passport_issue_date) => {
            if (passport_issue_date) {
                return Yup.date()
                    .nullable()
                    .min(passport_issue_date, 'Expire date must be greater than or equal issue date')
            } else {
                return Yup.date().nullable()
            }
        }),
    });


    const PermanentAddressSchema = Yup.object().shape({
        per_address_line_1: Yup.string().typeError('Permanent address is Required').required('Required'),
        per_divisions_id: Yup.number().typeError('Permanent divisions is Required').required('Required'),
        per_districts_id: Yup.number().typeError('Permanent district is Required').required('Required'),
        per_thana_id: Yup.number().typeError('Permanent thana is Required').required('Required'),
        per_postal_code: Yup.number().typeError('Permanent postal code is Required').required('Required'),
    });

    const PresentAddressSchema = Yup.object().shape({
        pre_address_line_1: Yup.string().typeError('Present address line  is Required').required('Present Full Address is required'),
        pre_divisions_id: Yup.number().typeError('Present divisions is Required').required('Present divisions is required'),
        pre_districts_id: Yup.number().typeError('Present district is Required').required('Present district is required'),
        pre_thana_id: Yup.number().typeError('Present thana is Required').required('Present thana is required'),
        pre_postal_code: Yup.number().typeError('Present postal code  is Required').required('Present postal code is required'),
    });

    useEffect(() => {
        if (user?.data?.applicant_id) {
            dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));

        }
    }, [user, dispatch]);

    const getDivisionInfo = async () => {
        await API.get(`sys_geo_divisions/`)
            .then((res) => {
                if (res.data?.success) {
                    const resData = res?.data?.data?.sys_geo_divisions;
                    var result = resData?.map(function (col) {
                        return {
                            value: col?.sys_geo_divisions__geo_division_id,
                            label: col?.sys_geo_divisions__geo_division_name,
                        }
                    });
                    setDivisionList(result);
                } else {
                    swalError(res?.message);
                }
            })
            .catch((error) => {
                swalError("someting went wrong");
            });
    };

    const getDistrictInfo = async () => {
        await API.get(`sys_geo_districts/`)
            .then((res) => {
                if (res.data?.success) {
                    const resData = res?.data?.data?.sys_geo_districts;
                    var result = resData?.map(function (col) {
                        return {
                            value: col?.sys_geo_districts__geo_district_id,
                            label: col?.sys_geo_districts__geo_district_name,
                        }
                    });
                    setDistrictList(result);
                } else {
                    swalError(res?.message);
                }
            })
            .catch((error) => {
                swalError("someting went wrong");
            });
    };

    const getUpazilatInfo = async () => {
        await API.get(`hrms_thana/`)
            .then((res) => {
                if (res.data?.success) {
                    const resData = res?.data?.data?.hrms_thana;
                    var result = resData?.map(function (col) {
                        return {
                            value: col?.hrms_thana__id,
                            label: col?.hrms_thana__name,
                        }
                    });
                    setUpazilaList(result);
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
        getDivisionInfo();
        getDistrictInfo();
        getUpazilatInfo();
        getNationalityInfo();
    }, [])

    const handleSubmitPer = async (values) => {
        setSubmitTracker((state) => ({ ...state, perAddress: true }));
        var formdata = new FormData();
        for (let k in values) {
            if (values[k]) {
                formdata.append(k, values[k]);
            }
        }

        let scrArr = [profileScoreArr[3]];

        if (applicantsInfo?.is_same_as_permanent_address === 1) {
            scrArr.push(profileScoreArr[2]);

            formdata.append('pre_address_line_1', values?.per_address_line_1);
            formdata.append('pre_divisions_id', values?.per_divisions_id);
            formdata.append('pre_districts_id', values?.per_districts_id);
            formdata.append('pre_thana_id', values?.per_thana_id);
            formdata.append('pre_international_address', values?.per_international_address);
        }

        await API.patch(`/hrms_applicant/update-profile/${user?.data?.applicant_id}`, formdata)
            .then((res) => {
                if (res?.data?.success) {
                    swalSuccess('Data updated successfully!!');
                    dispatch(Action.insertProfileScore(scrArr));
                    // dispatch(Action.getProfilePercentage());
                    dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                    setShowEditOne(false);
                } else {
                    swalError(res?.data?.message, " ");
                }
            })
            .catch((error) => {
                swalError("someting went wrong");
            });
        setSubmitTracker((state) => ({ ...state, perAddress: false }));
    }

    const handlePreSubmit = async (values) => {
        setSubmitTracker((state) => ({ ...state, preAddress: true }));
        var formdata = new FormData();
        for (let k in values) {
            if (values[k]) {
                formdata.append(k, values[k]);
            }
        }
        // formdata.append('is_same_as_permanent_address', isChecked ? 1 : 0);

        await API.patch(`/hrms_applicant/update-profile/${user?.data?.applicant_id}`, formdata)
            .then((res) => {
                if (res?.data?.success) {
                    swalSuccess('Data updated successfully!!');
                    dispatch(Action.insertProfileScore([profileScoreArr[2]]));
                    // dispatch(Action.getProfilePercentage());
                    dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                    setShowEditTwo(false);
                } else {
                    swalError(res?.data?.message, " ");
                }
            })
            .catch((error) => {
                swalError("someting went wrong");
            });
        setSubmitTracker((state) => ({ ...state, preAddress: false }));
    }



    const handleSubmit = async (values) => {
        setSubmitTracker((state) => ({ ...state, profile: true }));
        var formdata = new FormData();
        let selectedElements = []

        if (values?.is_ex_employee == 1) {
            selectedElements = profileScoreArr.slice(0, 2);
        } else {
            selectedElements = profileScoreArr.slice(0, 1);
        }
        for (let k in values) {
            if (values[k]) {
                // if (k != 'first_name' && k != 'middle_name' && k != 'last_name') {
                if (values["marital_status"] != "Married" && k == "spouse_name") {
                    formdata.append(k, "");
                }
                else if (k == "ex_employee_code" || k == "ex_superviosor_name" || k == "ex_superviosor_designation" || k == "ex_superviosor_email" || k == "ex_superviosor_phone"
                    // || k == "prev_joining_date" || k == "prev_last_working_date"
                ) {
                    if (values["is_ex_employee"] != 1) {
                        formdata.append(k, k == "prev_joining_date" || k == "prev_last_working_date" ? null : "");
                    } else {
                        formdata.append(k, values[k]);
                    }
                }
                else if (k == "about_disability" && values["is_disable"] != 1) {
                    formdata.append(k, "");
                } else {
                    formdata.append(k, values[k]);
                }
            }
            // }
        }

        let userData = {
            // email:values?.email,
            first_name: values?.first_name,
            middle_name: values?.middle_name,
            last_name: values?.last_name,
            contact_number: values?.contact_number,
        };

        await API.patch(`/hrms_applicant/${user?.data?.applicant_id}`, formdata)
            .then((res) => {
                if (res?.data?.success) {
                    swalSuccess('Data updated successfully!!');
                    dispatch(Action.updateUserData(userData, user?.data?.id));
                    // dispatch(Action.getProfilePercentage());
                    dispatch(Action.insertProfileScore(selectedElements));
                    dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                    setShowEdit(false);
                } else {
                    swalError(res?.data?.message, " ");
                }
            })
            .catch((error) => {
                swalError("someting went wrong");
            });
        setSubmitTracker((state) => ({ ...state, profile: false }));
    }

    const countryListOption = countryList?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });

    const nationalityListOption = nationalityList?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });

    const divisionListOption = divisionList?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });

    const districtListOption = districtList?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });

    const upazilaListOption = upazilaList?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });

    const seoncN = nationalityList.filter((col) => col?.value === applicantsInfo?.second_nationality_id);

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckSameAddress = (val, values, setFieldValue) => {
        setIsChecked(!isChecked);
        if (val) {
            setFieldValue("pre_address_line_1", applicantsInfo.per_address_line_1);
            setFieldValue("pre_districts_id", applicantsInfo.per_districts_id);
            setFieldValue("pre_divisions_id", applicantsInfo.per_divisions_id);
            setFieldValue("pre_thana_id", applicantsInfo?.per_hrms_thana?.id);
            setFieldValue("pre_postal_code", applicantsInfo?.per_postal_code);
            setFieldValue("pre_international_address", applicantsInfo?.per_international_address);

            dispatch(
                Action.getAllPreDistrictByDivision(applicantsInfo.per_divisions_id)
            );
            dispatch(
                Action.getAllPreThanaDistrictByDivision(
                    applicantsInfo.per_divisions_id, applicantsInfo.per_districts_id
                )
            );


        } else {
            setFieldValue("pre_address_line_1", "")
            setFieldValue("pre_districts_id", "");
            setFieldValue("pre_divisions_id", null);
            setFieldValue("pre_thana_id", "");
            setFieldValue("pre_postal_code", "");
            setFieldValue("pre_international_address", "");
            setFieldValue("is_same_as_permanent_address", '');
        }
    };

    return (
        <div className='main_contents_div'>
            <ProfileCard />
            <ProfileTabs />

            <TitleWithEditCard title="Personal Information" setShowEdit={setShowEdit} showEdit={showEdit}>
                {showEdit ? <>
                    <Formik
                        initialValues={selectedData}
                        validationSchema={PersonalSchema}
                        onSubmit={values => handleSubmit(values)}
                    >
                        {({ errors, touched, setFieldValue, values }) => (
                            <Form>

                                <div className="row mt-10">
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>First Name</b></label>
                                        <Field name="first_name" type="text" className="form-control" />
                                        {errors.first_name && touched.first_name ? (
                                            <div className="text-danger">{errors.first_name}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Middle Name</b></label>
                                        <Field name="middle_name" type="text" className="form-control" />
                                        {errors.middle_name && touched.middle_name ? (
                                            <div className="text-danger">{errors.middle_name}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Last Name</b></label>
                                        <Field name="last_name" type="text" className="form-control" />
                                        {errors.last_name && touched.last_name ? (
                                            <div className="text-danger">{errors.last_name}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Date of Birth</b></label>
                                        <Field name="date_of_birth" type="date" className="form-control" />
                                        {errors.date_of_birth && touched.date_of_birth ? (
                                            <div className="text-danger">
                                                {/* Date of Birth is */}
                                                Required</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Father’s name</b></label>
                                        <Field name="father_name" type="text" className="form-control" />
                                        {errors.father_name && touched.father_name ? (
                                            <div className="text-danger">{errors.father_name}</div>
                                        ) : null}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Mother’s name</b></label>
                                        <Field name="mother_name" type="text" className="form-control" />
                                        {errors.mother_name && touched.mother_name ? (
                                            <div className="text-danger">{errors.mother_name}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Religion</b></label>
                                        <Field name="religion" type="text" className="form-control" />
                                        {errors.religion && touched.religion ? (
                                            <div className="text-danger">{errors.religion}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Gender</b></label>
                                        <Field name="gender" as="select" className="form-control">
                                            <option value="">Select Gender</option>
                                            <option value='Male'>Male</option>
                                            <option value='Female'>Female</option>
                                            <option value='Other'>Other</option>
                                        </Field>
                                        {errors.gender && touched.gender ? (
                                            <div className="text-danger">{errors.gender}</div>
                                        ) : null}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Marital status</b></label>
                                        <Field name="marital_status" as="select" className="form-control">
                                            <option value="">Select Marital status</option>
                                            <option value='Single'>Single</option>
                                            <option value='Married'>Married</option>
                                            <option value='Divorced '>Divorced </option>
                                            <option value='Separated'>Separated</option>
                                            <option value='Widowed'>Widowed</option>
                                        </Field>
                                        {errors.marital_status && touched.marital_status ? (
                                            <div className="text-danger">{errors.marital_status}</div>
                                        ) : null}
                                    </div>
                                    {values?.marital_status == "Married" && (
                                        <>
                                            <div className="col-md-4 mb-4">
                                                <label className="required"><b>Spouse Name</b></label>
                                                <Field name="spouse_name" type="text" className="form-control" />
                                                {errors.spouse_name && touched.spouse_name && (
                                                    <div className="text-danger">
                                                        {errors.spouse_name}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Country of Birth</b></label>
                                        <Select
                                            options={countryListOption}
                                            placeholder="Select Country"
                                            value={countryListOption.find(option => option.value === values?.country_of_birth)}
                                            onChange={(options) => {
                                                setFieldValue("country_of_birth", options ? options.value : null);
                                            }}
                                            isClearable={true}
                                        />

                                        {errors.country_of_birth && touched.country_of_birth ? (
                                            <div className="text-danger">{errors.country_of_birth}</div>
                                        ) : null}


                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Nationality</b></label>
                                        <Select
                                            options={nationalityListOption}
                                            placeholder="Select Nationality"
                                            value={nationalityListOption.find(option => option.value === values?.nationality_id)}
                                            onChange={(options) => {
                                                setFieldValue("nationality_id", options ? options.value : null);
                                            }}
                                            isClearable={true}
                                        />

                                        {errors.nationality_id && touched.nationality_id ? (
                                            <div className="text-danger">{errors.nationality_id}</div>
                                        ) : null}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Nationality type</b></label>
                                        <Field name="nationality_type" as="select" className="form-control" >
                                            <option value="">Select Nationality Type</option>
                                            <option value="By Birth">By Birth</option>
                                            <option value="Migrated">Migrated</option>
                                        </Field>
                                        {errors.nationality_type && touched.nationality_type ? (
                                            <div className="text-danger">{errors.nationality_type}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>2nd Nationality</b></label>
                                        <Select
                                            options={nationalityListOption}
                                            placeholder="Select Nationality"
                                            value={nationalityListOption.find(option => option.value === values?.second_nationality_id)}
                                            onChange={(options) => {
                                                setFieldValue("second_nationality_id", options ? options.value : null);
                                            }}
                                            isClearable={true}
                                        />

                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>2nd Nationality type</b></label>
                                        <Field name="second_nationality_type" as="select" className="form-control" >
                                            <option value="">Select 2nd Nationality Type</option>
                                            <option value="By Birth">By Birth</option>
                                            <option value="Migrated">Migrated</option>
                                        </Field>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>NID</b></label>
                                        <Field name="nid" type="number" className="form-control" />
                                        {errors.nid && touched.nid ? (
                                            <div className="text-danger">{errors.nid}</div>
                                        ) : null}
                                    </div>
                                    {/* <div className="col-md-4 mb-3">
                                        <label className=""><b>Employee Code</b></label>
                                        <Field name="pin" type="text" className="form-control" />
                                    </div> */}
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Blood group</b></label>
                                        <Field name="blood_group" as="select" className="form-control">
                                            <option value="">Select Blood Group</option>
                                            <option value={'A+'}>A+</option>
                                            <option value={'B+'}>B+</option>
                                            <option value={'AB+'}>AB+</option>
                                            <option value={'O+'}>O+</option>
                                            <option value={'A-'}>A-</option>
                                            <option value={'AB-'}>AB-</option>
                                            <option value={'B-'}>B-</option>
                                            <option value={'O-'}>O-</option>
                                        </Field>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Passport Number</b></label>
                                        <Field name="passport_number" type="number" className="form-control" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Contact Number</b></label>
                                        <Field name="contact_number" type="text" className="form-control" />
                                        {errors.contact_number && touched.contact_number ? (
                                            <div className="text-danger">{errors.contact_number}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Email</b></label>
                                        <Field name="email" type="text" className="form-control" disabled={true} />
                                        {errors.email && touched.email ? (
                                            <div className="text-danger">{errors.email}</div>
                                        ) : null}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Alternative Contact Number</b></label>
                                        <Field name="alternative_contact_number" type="text" className="form-control" />
                                        {errors.alternative_contact_number && touched.alternative_contact_number ? (
                                            <div className="text-danger">{errors.alternative_contact_number}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Alternative Email</b></label>
                                        <Field name="alternative_email" type="text" className="form-control" />
                                        {errors.alternative_email && touched.alternative_email ? (
                                            <div className="text-danger">{errors.alternative_email}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Disability</b></label>
                                        <Field
                                            name="is_disable"
                                            as="select"
                                            className="form-control"
                                            onChange={(e) => {
                                                setFieldValue("is_disable", e.target.value);
                                            }}
                                        >
                                            <option>Select Disability </option>
                                            <option value={1}>Yes</option>
                                            <option value={0}>No</option>
                                        </Field>
                                        {errors.is_disable && touched.is_disable ? (
                                            <div className="text-danger">{errors.is_disable}</div>
                                        ) : null}
                                    </div>

                                    {values?.is_disable == 1 && (
                                        <div className="col-md-4 mb-3">
                                            <label className="required"><b>About Disability</b></label>
                                            <Field name="about_disability" type="text" className="form-control" />

                                            {errors.about_disability && touched.about_disability ? (
                                                <div className="text-danger">{errors.about_disability}</div>
                                            ) : null}
                                        </div>
                                    )}


                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Height(ft)</b></label>
                                        <Field name="height" type="number" className="form-control" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Weight(kg)</b></label>
                                        <Field name="weight" type="number" className="form-control" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>TIN Number</b></label>
                                        <Field name="tin" type="number" className="form-control" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>No of Living Child</b></label>
                                        <Field name="no_of_living_child" type="number" className="form-control" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Work Permit Issue Date</b></label>
                                        <Field
                                            name="work_permit_issue_date"
                                            onChange={(event) => {
                                                setFieldValue('work_permit_issue_date', event.target.value);
                                                setFieldValue('work_permit_expiry_date', "");
                                            }}
                                            type="date"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Work Permit Expiry Date</b></label>
                                        <Field
                                            name="work_permit_expiry_date"
                                            type="date"
                                            className="form-control"
                                            onChange={(event) => {
                                                if (values.work_permit_issue_date) {
                                                    setFieldValue('work_permit_expiry_date', event.target.value);
                                                }
                                            }}
                                        />
                                        {errors.work_permit_expiry_date && touched.work_permit_expiry_date ? (
                                            <div className="text-danger">{errors.work_permit_expiry_date}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Passport Issue Date</b></label>
                                        <Field
                                            name="passport_issue_date"
                                            type="date"
                                            className="form-control"
                                            onChange={(event) => {
                                                setFieldValue('passport_issue_date', event.target.value);
                                                setFieldValue('passport_expiry_date', "");
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Passport Expiry Date</b></label>
                                        <Field
                                            name="passport_expiry_date"
                                            type="date"
                                            className="form-control"
                                            onChange={(event) => {
                                                if (values.passport_issue_date) {
                                                    setFieldValue('passport_expiry_date', event.target.value);
                                                }
                                            }}
                                        />
                                        {errors.passport_expiry_date && touched.passport_expiry_date ? (
                                            <div className="text-danger">{errors.passport_expiry_date}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Visa Expiry Date</b></label>
                                        <Field name="visa_expiry_date" type="date" className="form-control" />
                                    </div>
                                </div>
                                <div className="row mt-10">
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Are you an Ex  Employee?</b></label>
                                        <Field
                                            name="is_ex_employee"
                                            as="select"
                                            className="form-control"
                                            onChange={(e) => {
                                                setFieldValue("is_ex_employee", e.target.value);
                                            }}
                                        >
                                            <option>Select  </option>
                                            <option value={1}>Yes</option>
                                            <option value={0}>No</option>
                                        </Field>
                                        {errors.is_ex_employee && touched.is_ex_employee ? (
                                            <div className="text-danger">{errors.is_ex_employee}</div>
                                        ) : null}
                                    </div>

                                    {values?.is_ex_employee == 1 && (
                                        <>
                                            <div className="col-md-4 mb-3">
                                                <label className="required"><b> PIN</b></label>
                                                <Field name="ex_employee_code" type="number" className="form-control" />

                                                {errors.ex_employee_code && touched.ex_employee_code ? (
                                                    <div className="text-danger">{errors.ex_employee_code}</div>
                                                ) : null}
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <label className="required"><b>Joining Date</b></label>
                                                <Field name="prev_joining_date" type="date" className="form-control" />

                                                {errors.prev_joining_date && touched.prev_joining_date ? (
                                                    <div className="text-danger">{errors.prev_joining_date}</div>
                                                ) : null}
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <label className="required"><b>Last working day</b></label>
                                                <Field name="prev_last_working_date" type="date" className="form-control" />

                                                {errors.prev_last_working_date && touched.prev_last_working_date ? (
                                                    <div className="text-danger">{errors.prev_last_working_date}</div>
                                                ) : null}
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <label ><b>Supervisor Name</b></label>
                                                <Field name="ex_superviosor_name" type="text" className="form-control" />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label ><b>Supervisor Designation</b></label>
                                                <Field name="ex_superviosor_designation" type="text" className="form-control" />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label ><b>Supervisor Email</b></label>
                                                <Field name="ex_superviosor_email" type="email" className="form-control" />
                                                {errors.ex_superviosor_email && touched.ex_superviosor_email ? (
                                                    <div className="text-danger">{errors.ex_superviosor_email}</div>
                                                ) : null}
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label ><b>Supervisor Phone</b></label>
                                                <Field name="ex_superviosor_phone" maxLength="11" type="text" className="form-control" />
                                                {errors.ex_superviosor_phone && touched.ex_superviosor_phone ? (
                                                    <div className="text-danger">{errors.ex_superviosor_phone}</div>
                                                ) : null}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="row mt-10">
                                    <div className="col-md-12 mb-3 text-right">
                                        <button className="btn btn-default mr-3" type="button" onClick={() => { setShowEdit(false) }}>Cancel</button>
                                        <button className="btn btn-primary" type="submit" disabled={submitTracker.profile}>Update</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </> :
                    <>
                        <div className='row'>
                            <div className='col-md-6'>
                                <ItemsLabelRow lable="First Name" filed={applicantsInfo?.m_career_portal_user?.first_name} />
                                <ItemsLabelRow lable="Middle Name" filed={applicantsInfo?.m_career_portal_user?.middle_name} />
                                <ItemsLabelRow lable="Last Name" filed={applicantsInfo?.m_career_portal_user?.last_name} />
                                <ItemsLabelRow lable="Father’s Name" filed={applicantsInfo?.father_name} />
                                <ItemsLabelRow lable="Gender" filed={applicantsInfo?.gender} />
                                <ItemsLabelRow lable="Marital Status" filed={applicantsInfo?.marital_status} />
                                {applicantsInfo?.marital_status == "Married" && (
                                    <>
                                        <ItemsLabelRow lable="Spouse Name" filed={applicantsInfo?.spouse_name} />
                                    </>
                                )}
                                <div className='card_items_row_flex'>
                                    <div className='label_box'>Nationality </div>
                                    <div className='item_data'><strong>: </strong>{applicantsInfo?.hrms_nationality?.name}
                                        {/* - {applicantsInfo?.hrms_nationality?.id} */}
                                    </div>
                                </div>
                                <div className='card_items_row_flex'>
                                    <div className='label_box'>NID</div>
                                    <div className='item_data'><strong>: </strong>{applicantsInfo?.nid}</div>
                                </div>
                                <div className='card_items_row_flex'>
                                    <div className='label_box'>Contact No.</div>
                                    <div className='item_data'><strong>: </strong>{applicantsInfo?.m_career_portal_user?.contact_number}</div>
                                </div>
                                <div className='card_items_row_flex'>
                                    <div className='label_box'>Email</div>
                                    <div className='item_data'><strong>: </strong>{applicantsInfo?.email}</div>
                                </div>
                                <div className='card_items_row_flex'>
                                    <div className='label_box'>Blood Group</div>
                                    <div className='item_data'><strong>: </strong>{applicantsInfo?.blood_group}</div>
                                </div>
                                <ItemsLabelRow lable="2nd Nationality Type" filed={applicantsInfo?.second_nationality_type} />

                                <div className='card_items_row_flex'>
                                    <div className='label_box'>Disability</div>
                                    <div className='item_data'><strong>: </strong>
                                        <strong>
                                            {applicantsInfo?.is_disable === 1 ? (
                                                "Yes"
                                            ) : (
                                                "No"
                                            )}
                                        </strong>
                                        <br />
                                        {applicantsInfo?.is_disable === 1 ? (
                                            <>
                                                {applicantsInfo?.about_disability}
                                            </>
                                        ) : (
                                            " "
                                        )}
                                    </div>
                                </div>
                                <ItemsLabelRow lable="No of Living Child" filed={applicantsInfo?.no_of_living_child} />
                                <ItemsLabelRow lable="Work Permit Expiry Date" filed={applicantsInfo?.work_permit_expiry_date ? moment(applicantsInfo?.work_permit_expiry_date).format("DD-MM-YYYY") : ""} />
                                <ItemsLabelRow lable="Work Permit Issue Date" filed={applicantsInfo?.work_permit_issue_date ? moment(applicantsInfo?.work_permit_issue_date).format("DD-MM-YYYY") : ""} />
                            </div>
                            <div className='col-md-6'>
                                <ItemsLabelRow lable="Date of Birth" filed={applicantsInfo?.date_of_birth ? moment(applicantsInfo?.date_of_birth).format("DD-MM-YYYY") : ""} />
                                <ItemsLabelRow lable="Mother’s Name" filed={applicantsInfo?.mother_name} />
                                <ItemsLabelRow lable="Religion" filed={applicantsInfo?.religion} />
                                <ItemsLabelRow lable="Country of Birth" filed={applicantsInfo?.m_config_countries?.country_name} />
                                <ItemsLabelRow lable="Nationality Type" filed={applicantsInfo?.nationality_type} />
                                {/* <ItemsLabelRow lable="Employee Code" filed={applicantsInfo?.pin} /> */}
                                <ItemsLabelRow lable="Passport" filed={applicantsInfo?.passport_number} />
                                <ItemsLabelRow lable="Alt. Contact No." filed={applicantsInfo?.alternative_contact_number} />
                                <ItemsLabelRow lable="Alt Email" filed={applicantsInfo?.alternative_email} />
                                <div className='card_items_row_flex'>
                                    <div className='label_box'>2nd Nationality </div>
                                    <div className='item_data'><strong>: </strong>
                                        {seoncN && seoncN[0] && seoncN[0].label}
                                        {/* {applicantsInfo?.second_nationality_id} */}
                                    </div>
                                </div>
                                <ItemsLabelRow lable="Height(ft)" filed={applicantsInfo?.height} />
                                <ItemsLabelRow lable="Weight(kg)" filed={applicantsInfo?.weight} />
                                <ItemsLabelRow lable="TIN Number" filed={applicantsInfo?.tin} />
                                <ItemsLabelRow lable="Passport Issue Date" filed={applicantsInfo?.passport_issue_date ? moment(applicantsInfo?.passport_issue_date).format("DD-MM-YYYY") : ""} />
                                <ItemsLabelRow lable="Passport Expiry Date" filed={applicantsInfo?.passport_expiry_date ? moment(applicantsInfo?.passport_expiry_date).format("DD-MM-YYYY") : ""} />
                                <ItemsLabelRow lable="Visa Expiry Date" filed={applicantsInfo?.visa_expiry_date ? moment(applicantsInfo?.visa_expiry_date).format("DD-MM-YYYY") : ""} />

                            </div>
                        </div>

                        <hr />

                        <div className='row'>
                            <div className='col-md-6'>
                                <div className='card_items_row_flex'>
                                    <div className='label_box'>Are you an Ex  Employee?</div>
                                    <div className='item_data'><strong>: </strong>{applicantsInfo?.is_ex_employee === 1 ? ("Yes") : ("No")}</div>
                                </div>
                                {applicantsInfo?.is_ex_employee === 1 && (
                                    <>
                                        <div className='card_items_row_flex'>
                                            <div className='label_box'>Joining Date</div>
                                            <div className='item_data'><strong>: </strong>{applicantsInfo?.prev_joining_date ? moment(applicantsInfo?.prev_joining_date).format("DD-MM-YYYY") : ""}</div>
                                        </div>
                                        <ItemsLabelRow lable="Supervisor Name:" filed={applicantsInfo?.ex_superviosor_name} />
                                        <div className='card_items_row_flex'>
                                            <div className='label_box'>Supervisor Designation:</div>
                                            <div className='item_data'><strong>: </strong>{applicantsInfo?.ex_superviosor_designation}</div>
                                        </div>
                                    </>
                                )}


                            </div>

                            <div className='col-md-6'>
                                {applicantsInfo?.is_ex_employee === 1 && (
                                    <>
                                        <div className='card_items_row_flex'>
                                            <div className='label_box'> PIN</div>
                                            <div className='item_data'><strong>: </strong>{applicantsInfo?.ex_employee_code}</div>
                                        </div>
                                        {/* <ItemsLabelRow lable="Currently Brac Employee:" filed={!applicantsInfo?.is_currently_or_prev_employeed_at_brac === 0 ? ("Yes") : ("No")} /> */}
                                        {applicantsInfo?.prev_last_working_date === null ? (
                                            <ItemsLabelRow lable="Last working day" filed={''} />
                                        ) : (
                                            <ItemsLabelRow lable="Last working day" filed={applicantsInfo?.prev_last_working_date ? moment(applicantsInfo?.prev_last_working_date).format("DD-MM-YYYY") : " "} />
                                        )}

                                        <ItemsLabelRow lable="Supervisor Phone" filed={applicantsInfo?.ex_superviosor_phone} />
                                        <ItemsLabelRow lable="Supervisor Email" filed={applicantsInfo?.ex_superviosor_email} />
                                    </>
                                )}
                            </div>
                        </div>

                    </>
                }

            </TitleWithEditCard>

            <TitleWithEditCard title="Permanent Address" setShowEdit={setShowEditOne} showEdit={showEditOne}>
                {showEditOne ? <>
                    <Formik
                        initialValues={perInitialData}
                        enableReinitialize={true}
                        validationSchema={PermanentAddressSchema}
                        onSubmit={values => handleSubmitPer(values)}
                    >
                        {({ errors, setFieldValue, touched, values }) => {

                            return (

                                <Form>
                                    {/* {JSON.stringify(values)} */}
                                    <div className="row mt-10">
                                        <div className="col-md-4 mb-3">
                                            <label className="required"><b>Full Address</b></label>
                                            <Field name="per_address_line_1" type="text" className="form-control" />
                                            {errors.per_address_line_1 && touched.per_address_line_1 ? (
                                                <div className="text-danger">{errors.per_address_line_1}</div>
                                            ) : null}
                                        </div>
                                        {/* <div className="col-md-4 mb-3">
                                            <label className=""><b>Address line 2:</b></label>
                                            <Field name="per_address_line_2" type="text" className="form-control" />
                                        </div> */}

                                        <div className="col-md-4 mb-3">
                                            <label className="required"><b>Division</b></label>
                                            <Select
                                                options={divisionListOption}
                                                placeholder="Select Division"
                                                defaultValue={divisionListOption?.find(option => option.value === values?.per_divisions_id)}
                                                onChange={(options) => {
                                                    setFieldValue("per_divisions_id", options ? options.value : null);
                                                    if (!options) {
                                                        setFieldValue("per_districts_id", null);
                                                    } else {
                                                        setFieldValue("per_districts_id", null);
                                                        dispatch(
                                                            Action.getAllPerDistrictByDivision(options ? options.value : null)
                                                        );
                                                    }

                                                }}
                                                isClearable={true}
                                            />

                                            {errors.per_divisions_id && touched.per_divisions_id ? (
                                                <div className="text-danger">{errors.per_divisions_id}</div>
                                            ) : null}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="required"><b>District</b></label>
                                            <Select
                                                options={!values.per_divisions_id ? [] : per_district}
                                                placeholder="Select Division"
                                                value={per_district?.find(option => option.value === values?.per_districts_id) ?? null}
                                                onChange={(options) => {
                                                    setFieldValue("per_districts_id", options ? options.value : null);
                                                    setFieldValue("per_thana_id", null)
                                                    dispatch(
                                                        Action.getAllPerThanaDistrictByDivision(
                                                            values.per_divisions_id, options.value
                                                        )
                                                    );
                                                }}
                                                isClearable={true}
                                            />

                                            {errors.per_districts_id && touched.per_districts_id ? (
                                                <div className="text-danger">{errors.per_districts_id}</div>
                                            ) : null}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="required"><b>Thana/ Upazila</b></label>
                                            <Select
                                                options={!values.per_divisions_id && values?.per_districts_id ? [] : per_thana}
                                                placeholder="Select Thana/ Upazila"
                                                defaultValue={per_thana?.find(option => option.value == values?.per_thana_id) ?? null}
                                                onChange={(options) => {
                                                    setFieldValue("per_thana_id", options ? options.value : null);
                                                }}

                                                isClearable={true}
                                            />
                                            {errors.per_thana_id && touched.per_thana_id ? (
                                                <div className="text-danger">{errors.per_thana_id}</div>
                                            ) : null}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="required"><b>Postal code</b></label>
                                            <Field name="per_postal_code" type="number" className="form-control" />
                                            {errors.per_postal_code && touched.per_postal_code ? (
                                                <div className="text-danger">{errors.per_postal_code}</div>
                                            ) : null}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className=""><b>International Address </b></label>
                                            <Field name="per_international_address" type="text" className="form-control" />
                                        </div>

                                    </div>
                                    <div className="row mt-10">
                                        <div className="col-md-12 mb-3 text-right">
                                            <button className="btn btn-default mr-3" type="button" onClick={() => { setShowEditOne(false) }}>Cancel</button>
                                            <button className="btn btn-primary" type="submit" disabled={submitTracker.perAddress}>Update</button>
                                        </div>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </> :
                    <>
                        <div className='row'>
                            <div className='col-md-6'>
                                <ItemsLabelRow lable="Full Address" filed={applicantsInfo?.per_address_line_1} />
                                <ItemsLabelRow lable="Division" filed={applicantsInfo?.per_sys_geo_divisions?.geo_division_name} />
                                <ItemsLabelRow lable="Thana/Upazilla" filed={applicantsInfo?.per_hrms_thana?.name} />
                            </div>

                            <div className='col-md-6'>
                                <ItemsLabelRow lable="District" filed={applicantsInfo?.per_sys_geo_districts?.geo_district_name} />
                                <ItemsLabelRow lable="Postal Code" filed={applicantsInfo?.per_postal_code} />
                                <ItemsLabelRow lable="International Address" filed={applicantsInfo?.per_international_address} />
                            </div>
                        </div>
                    </>
                }

            </TitleWithEditCard>

            <TitleWithEditCard title="Present Address" setShowEdit={setShowEditTwo} showEdit={showEditTwo} >
                {showEditTwo ? <>

                    <Formik
                        initialValues={preInitialData}
                        validationSchema={PresentAddressSchema}
                        onSubmit={values => handlePreSubmit(values)}
                    >
                        {({ errors, touched, setFieldValue, values }) => (
                            <Form>
                                {/* {JSON.stringify(values)} */}
                                <div className="row mt-10">

                                    <div className="col-md-12 mb-5">
                                        <Field
                                            type="checkbox"
                                            checked={isChecked}
                                            id="sameAddress"
                                            onChange={(e) => handleCheckSameAddress(e.target.checked, values, setFieldValue)}
                                        />
                                        <label className="form-check-label ml-2" htmlFor="sameAddress">Same as permanent  address </label>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Full Address</b></label>
                                        <Field name="pre_address_line_1" type="text" className="form-control" />
                                        {errors.pre_address_line_1 && touched.pre_address_line_1 ? (
                                            <div className="text-danger">{errors.pre_address_line_1}</div>
                                        ) : null}
                                    </div>
                                    {/* <div className="col-md-4 mb-3">
                                        <label className=""><b>Address line 2:</b></label>
                                        <Field name="pre_address_line_2" type="text" className="form-control" />
                                    </div> */}
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Division</b></label>
                                        <Select
                                            options={divisionListOption}
                                            placeholder="Select Division"
                                            value={divisionListOption?.find(option => option.value === values?.pre_divisions_id) ?? null}
                                            onChange={(options) => {
                                                setFieldValue("pre_divisions_id", options ? options.value : null);
                                                if (!options) {
                                                    setFieldValue("pre_districts_id", null);
                                                } else {
                                                    setFieldValue("pre_districts_id", null);
                                                    dispatch(
                                                        Action.getAllPreDistrictByDivision(options ? options.value : null)
                                                    );
                                                }

                                            }}
                                            isClearable={true}
                                        />
                                        {errors.pre_divisions_id && touched.pre_divisions_id ? (
                                            <div className="text-danger">{errors.pre_divisions_id}</div>
                                        ) : null}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>District</b></label>
                                        <Select
                                            options={!values.pre_divisions_id ? [] : pre_district}
                                            placeholder="Select Division"
                                            value={pre_district?.find(option => option.value === values?.pre_districts_id) ?? null}
                                            onChange={(options) => {
                                                setFieldValue("pre_districts_id", options ? options.value : null);
                                                setFieldValue("pre_thana_id", null)
                                                dispatch(
                                                    Action.getAllPreThanaDistrictByDivision(
                                                        values.pre_divisions_id, options.value
                                                    )
                                                );
                                            }}
                                            isClearable={true}
                                        />
                                        {errors.pre_districts_id && touched.pre_districts_id ? (
                                            <div className="text-danger">{errors.pre_districts_id}</div>
                                        ) : null}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Thana/ Upazila</b></label>
                                        <Select
                                            options={(!values.pre_divisions_id || !values.pre_districts_id) ? [] : pre_thana}
                                            placeholder="Select Thana/ Upazila"
                                            value={pre_thana?.find(option => option.value === values?.pre_thana_id) ?? null}
                                            onChange={(options) => {
                                                setFieldValue("pre_thana_id", options ? options.value : null);
                                            }}

                                            isClearable={true}
                                        />

                                        {errors.pre_thana_id && touched.pre_thana_id ? (
                                            <div className="text-danger">{errors.pre_thana_id}</div>
                                        ) : null}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Postal code</b></label>
                                        <Field name="pre_postal_code" type="number" className="form-control" />
                                        {errors.pre_postal_code && touched.pre_postal_code ? (
                                            <div className="text-danger">{errors.pre_postal_code}</div>
                                        ) : null}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>International Address</b></label>
                                        <Field name="pre_international_address" type="text" className="form-control" />
                                    </div>
                                </div>

                                <div className="row mt-10">
                                    <div className="col-md-12 mb-3 text-right">
                                        <button className="btn btn-default mr-3" type="button" onClick={() => { setShowEditTwo(false) }}>Cancel</button>
                                        <button className="btn btn-primary" type="submit" disabled={submitTracker.preAddress}>Update</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                </> :
                    <>
                        <div className='row'>
                            <div className='col-md-6'>
                                <ItemsLabelRow lable="Full Address" filed={applicantsInfo?.pre_address_line_1} />
                                <ItemsLabelRow lable="Division" filed={applicantsInfo?.pre_sys_geo_divisions?.geo_division_name} />
                                <ItemsLabelRow lable="Thana/Upazilla" filed={applicantsInfo?.pre_hrms_thana?.name} />
                            </div>

                            <div className='col-md-6'>
                                <ItemsLabelRow lable="District" filed={applicantsInfo?.pre_sys_geo_districts?.geo_district_name} />
                                <ItemsLabelRow lable="Postal Code" filed={applicantsInfo?.pre_postal_code} />
                                <ItemsLabelRow lable="International Address" filed={applicantsInfo?.pre_international_address} />
                            </div>
                        </div>
                    </>
                }

            </TitleWithEditCard>

        </div>
    )
} 