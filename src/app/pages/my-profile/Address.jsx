import React, { useEffect, useState } from 'react'
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

export default function Address() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { applicantsInfo } = useSelector(
        ({ recruitement }) => ({
            applicantsInfo: recruitement.applicantsInfo,
        }),
    );


    const [loading, setLoading] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showEditTwo, setShowEditTwo] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [divisionList, setDivisionList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [upazilaList, setUpazilaList] = useState([]);
    const [nationalityList, setNationalityList] = useState([]);
    const [selectedData, setSelectedData] = useState([]);

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
        // getBasicInfo();
        getCountryInfo();
        getDivisionInfo();
        getDistrictInfo();
        getUpazilatInfo();
        getNationalityInfo();
    }, [])


    useEffect(() => {
        setSelectedData({
            "per_address_line_1": applicantsInfo?.per_address_line_1,
            "per_address_line_2": applicantsInfo?.per_address_line_2,
            "per_districts_id": applicantsInfo?.per_districts_id,
            "per_divisions_id": applicantsInfo?.per_divisions_id,
            "per_thana_id": applicantsInfo?.per_thana_id,
            "per_international_address": applicantsInfo?.per_international_address,
            "per_postal_code": applicantsInfo?.per_postal_code,
            "pre_address_line_1": applicantsInfo?.pre_address_line_1,
            "pre_address_line_2": applicantsInfo?.pre_address_line_2,
            "pre_international_address": applicantsInfo?.pre_international_address,
            "pre_postal_code": applicantsInfo?.pre_postal_code,
            "nationality_id": applicantsInfo?.nationality_id,
            "pre_districts_id": applicantsInfo?.pre_districts_id,
            "pre_divisions_id": applicantsInfo?.pre_divisions_id,
            "pre_thana_id": applicantsInfo?.pre_thana_id,
        })
    }, [applicantsInfo]);

    const PermanentSchema = Yup.object().shape({
        per_address_line_1: Yup.string().required('Full address is Required'),
        per_divisions_id: Yup.number().required('Divisions is Required'),
        per_districts_id: Yup.number().required('Districts is Required'),
        per_thana_id: Yup.number().required('Thana is Required'),
        per_postal_code: Yup.number().required('Post code is Required'),
    });

    const PresentSchema = Yup.object().shape({
        pre_address_line_1: Yup.string().required('Full address is Required'),
        pre_divisions_id: Yup.number().required('Divisions is Required'),
        pre_districts_id: Yup.number().required('Districts is Required'),
        pre_thana_id: Yup.number().required('Thana is Required'),
        pre_postal_code: Yup.number().required('Post code is Required'),
    });

    const handleSubmitPer = async (values) => {
        var formdata = new FormData();
        formdata.append('per_international_address', values?.per_international_address);
        formdata.append('per_address_line_1', values?.per_address_line_1);
        formdata.append('per_address_line_2', values?.per_address_line_2);
        formdata.append('per_divisions_id', values?.per_divisions_id);
        formdata.append('per_districts_id', values?.per_districts_id);
        formdata.append('per_thana_id', values?.per_thana_id);
        formdata.append('per_postal_code', values?.per_postal_code);

        await API.patch(`/hrms_applicant/update-profile/${user?.data?.applicant_id}`, formdata)
            .then((res) => {
                if (res?.data?.success) {
                    swalSuccess(res?.data[0]);
                    dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
                    setShowEdit(false);

                } else {
                    swalError(res?.data?.message, " ");
                }
            })
            .catch((error) => {
                swalError("someting went wrong");
            });
    }


    const handleSubmit = async (values) => {
        var formdata = new FormData();
        formdata.append('pre_international_address', values?.pre_international_address);
        formdata.append('pre_address_line_1', values?.pre_address_line_1);
        formdata.append('pre_address_line_2', values?.pre_address_line_2);
        formdata.append('pre_divisions_id', values?.pre_divisions_id);
        formdata.append('pre_districts_id', values?.pre_districts_id);
        formdata.append('pre_thana_id', values?.pre_thana_id);
        formdata.append('pre_postal_code', values?.pre_postal_code);

        await API.patch(`/hrms_applicant/update-profile/${user?.data?.applicant_id}`, formdata)
            .then((res) => {
                if (res?.data?.success) {
                    swalSuccess(res?.data[0]);
                    // dispatch(Action.getProfilePercentage());
                    dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));

                    setShowEdit(false);
                    setShowEditTwo(false);
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

            <TitleWithEditCard title="Permanent Address" setShowEdit={setShowEdit} showEdit={showEdit}>
                {showEdit ? <>
                    <Formik
                        initialValues={selectedData}
                        validationSchema={PermanentSchema}
                        onSubmit={values => handleSubmitPer(values)}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <div className="row mt-10">
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>International Address :</b></label>
                                        <Field name="per_international_address" type="text" className="form-control" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Full Address:</b></label>
                                        <Field name="per_address_line_1" type="text" className="form-control" />
                                        {errors.per_address_line_1 && touched.per_address_line_1 ? (
                                            <div className="text-danger">{errors.per_address_line_1}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Address line 2:</b></label>
                                        <Field name="per_address_line_2" type="text" className="form-control" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Division</b></label>
                                        <Field name="per_divisions_id" as="select" className="form-control">
                                            <option value="">Select Division</option>
                                            {divisionList?.map((col, i) => {
                                                return (
                                                    <>
                                                        <option value={col?.value}>{col?.label}</option>
                                                    </>
                                                )
                                            })}
                                        </Field>
                                        {errors.per_divisions_id && touched.per_divisions_id ? (
                                            <div className="text-danger">{errors.per_divisions_id}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>District</b></label>
                                        <Field name="per_districts_id" as="select" className="form-control" >
                                            {districtList?.map((col, i) => {
                                                return (
                                                    <>
                                                        <option value={col?.value}>{col?.label}</option>
                                                    </>
                                                )
                                            })}
                                        </Field>
                                        {errors.per_districts_id && touched.per_districts_id ? (
                                            <div className="text-danger">{errors.per_districts_id}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Thana/ Upazila</b></label>
                                        <Field name="per_thana_id" as="select" className="form-control" >
                                            {upazilaList?.map((col, i) => {
                                                return (
                                                    <>
                                                        <option value={col?.value}>{col?.label}</option>
                                                    </>
                                                )
                                            })}
                                        </Field>
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
                                </div>
                                <div className="row mt-10">
                                    <div className="col-md-12 mb-3 text-right">
                                        <button className="btn btn-default" type="button" onClick={() => { setShowEdit(false) }}>Cancel</button>
                                        <button className="btn btn-primary" type="submit">Update</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </> :
                    <>
                        <div className='row'>
                            <div className='col-md-6'>
                                <ItemsLabelRow lable="International Address:" filed={applicantsInfo?.per_international_address} />
                                <ItemsLabelRow lable="Division:" filed={applicantsInfo?.per_sys_geo_divisions?.geo_division_name} />
                                <ItemsLabelRow lable="Thana/Upazilla:" filed={applicantsInfo?.per_hrms_thana?.name} />
                            </div>

                            <div className='col-md-6'>
                                <ItemsLabelRow lable="Full Address:" filed={applicantsInfo?.per_address_line_1} />
                                <ItemsLabelRow lable="District:" filed={applicantsInfo?.per_sys_geo_districts?.geo_district_name} />
                                <ItemsLabelRow lable="Postal Code:" filed={applicantsInfo?.per_postal_code} />
                            </div>
                        </div>
                    </>
                }

            </TitleWithEditCard>



            <TitleWithEditCard title="Present Address" setShowEdit={setShowEditTwo} showEdit={showEditTwo} >
                {showEditTwo ? <>

                    <Formik
                        initialValues={selectedData}
                        validationSchema={PresentSchema}
                        onSubmit={values => handleSubmit(values)}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <div className="row mt-10">
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>International Address :</b></label>
                                        <Field name="pre_international_address" type="text" className="form-control" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Full Address:</b></label>
                                        <Field name="pre_address_line_1" type="text" className="form-control" />
                                        {errors.pre_address_line_1 && touched.pre_address_line_1 ? (
                                            <div className="text-danger">{errors.pre_address_line_1}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className=""><b>Address line 2:</b></label>
                                        <Field name="pre_address_line_2" type="text" className="form-control" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Division</b></label>
                                        <Field name="pre_divisions_id" as="select" className="form-control">
                                            <option value="">Select Division</option>
                                            {divisionList?.map((col, i) => {
                                                return (
                                                    <>
                                                        <option value={col?.value}>{col?.label}</option>
                                                    </>
                                                )
                                            })}
                                        </Field>
                                        {errors.pre_divisions_id && touched.pre_divisions_id ? (
                                            <div className="text-danger">{errors.pre_divisions_id}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>District</b></label>
                                        <Field name="pre_districts_id" as="select" className="form-control" >
                                            {districtList?.map((col, i) => {
                                                return (
                                                    <>
                                                        <option value={col?.value}>{col?.label}</option>
                                                    </>
                                                )
                                            })}
                                        </Field>
                                        {errors.pre_districts_id && touched.pre_districts_id ? (
                                            <div className="text-danger">{errors.pre_districts_id}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="required"><b>Thana/ Upazila</b></label>
                                        <Field name="pre_thana_id" as="select" className="form-control" >
                                            {upazilaList?.map((col, i) => {
                                                return (
                                                    <>
                                                        <option value={col?.value}>{col?.label}</option>
                                                    </>
                                                )
                                            })}
                                        </Field>
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
                                </div>
                                <div className="row mt-10">
                                    <div className="col-md-12 mb-3 text-right">
                                        <button className="btn btn-default" type="button" onClick={() => { setShowEdit(false) }}>Cancel</button>
                                        <button className="btn btn-primary" type="submit">Update</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                </> :
                    <>
                        <div className='row'>
                            <div className='col-md-6'>
                                <ItemsLabelRow lable="International Address:" filed={applicantsInfo?.pre_international_address} />
                                <ItemsLabelRow lable="Division:" filed={applicantsInfo?.pre_sys_geo_divisions?.geo_division_name} />
                                <ItemsLabelRow lable="Thana/Upazilla:" filed={applicantsInfo?.pre_hrms_thana?.name} />
                            </div>

                            <div className='col-md-6'>
                                <ItemsLabelRow lable="Full Address:" filed={applicantsInfo?.pre_address_line_1} />
                                <ItemsLabelRow lable="District:" filed={applicantsInfo?.pre_sys_geo_districts?.geo_district_name} />
                                <ItemsLabelRow lable="Postal Code:" filed={applicantsInfo?.pre_postal_code} />
                            </div>
                        </div>
                    </>
                }

            </TitleWithEditCard>

        </div>
    )
} 