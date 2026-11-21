import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, Formik } from 'formik';
import API from "../../../helpers/devApi"
import { swalError, swalSuccess } from "../../../helpers/swal";
import * as Yup from 'yup';
import * as Action from "../_redux/recruitementActions"
import { useDispatch } from "react-redux";
import Select from "react-select"; 
const modality = [
    {
        value: "In-Person",
        label: "In-Person",
    },
    {
        value: "Hybrid",
        label: "Hybrid",
    },
    {
        value: "Online",
        label: "Online",
    }
];

const SignupSchema = Yup.object().shape({
    institute: Yup.string()
        .min(2, 'Too Short!')
        .max(255, 'Too Long!')
        .required('Required'),
    certification_name: Yup.string()
        .required('Required')
        .max(255, 'Too Long!'),
    valid_till: Yup.date().typeError('Valid date must be a date').required('Required'),
    modality: Yup.string().nullable().required('Required'),
    status: Yup.string().nullable().required('Required'),
    enrollment_id: Yup.string().max(255, 'Too Long!'),
    from_date: Yup.date().nullable().max(Yup.ref('to_date'), 'Start date cannot be greater than End date'),
    to_date: Yup.date().nullable().min(Yup.ref('from_date'), 'End date cannot be less than Start date'),
});

const currentDate = new Date().toISOString().split('T')[0];

const AddEditProfessional = ({ show, setShow, selectedData, setSelectedData, initProf, action, getProfCertificates, profId }) => {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [certificationList, setCertificationList] = useState([]);
    // const getallCertifications = async () => {
    //     await API.get(`/hrms_certification`)
    //         .then((res) => {
    //             if (res.data?.success) {
    //                 const resData = res?.data?.data?.hrms_certification;
    //                 var result = resData?.map(function (col) {
    //                     return {
    //                         value: col?.hrms_certification__id,
    //                         label: col?.hrms_certification__name,
    //                     }
    //                 });
    //                 setCertificationList(result)
    //             } else {
    //                 swalError(res?.data?.msg)
    //             }
    //         }).catch((error) => {
    //             swalError("Somthing went wrong")
    //         })
    // }

    const [countries, setCountries] = useState([]);

    const getallCountries = async () => {
        await API.get(`/config_countries`)
            .then((res) => {
                if (res.data?.success) {
                    const resData = res?.data?.data?.config_countries;
                    var result = resData?.map(function (col) {
                        return {
                            value: col?.config_countries__country_id,
                            label: col?.config_countries__country_name,
                        }
                    });
                    setCountries(result)
                } else {
                    swalError(res?.data?.msg)
                }
            }).catch((error) => {
                swalError("Somthing went wrong")
            })
    }


    useEffect(() => {
        // getallCertifications();
        getallCountries();
    }, []);


    const handleSubmit = async (values) => {
        // console.log(values)
        setIsSubmitting(true);
        for (var key in values) {
            if (key == 'country_id') {
                values[key] = values[key] ? parseInt(values[key]) : null;
            }else{
                values[key] = values[key] ? values[key] :null;
            }
        }
        values.statusObj = undefined;
        values.modalityObj = undefined;

        if (action == "Add") {
            await API.post(`/hrms_professional_certification`, values)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data saved successfully!!');
                        dispatch(Action.insertProfileScore(["Professional Certification"]));
                        //dispatch(Action.getProfilePercentage());
                        dispatch(Action.getProfessionalCertificatesByApplicants(initProf?.applicant_id));
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(initProf?.applicant_id));
                        }, "300");
                        setShow(false);
                    } else {
                        swalError(res?.data?.message, " ");
                    }
                })
                .catch((error) => {
                    swalError("someting went wrong");
                });
        } else {
            await API.patch(`/hrms_professional_certification/${profId}`, values)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data updated successfully!!');
                        dispatch(Action.insertProfileScore(["Professional Certification"]));
                        //dispatch(Action.getProfilePercentage());
                        dispatch(Action.getProfessionalCertificatesByApplicants(initProf?.applicant_id));
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(initProf?.applicant_id));
                        }, "300");
                        setShow(false);
                    } else {
                        swalError(res?.data?.message, " ");
                    }
                })
                .catch((error) => {
                    swalError("someting went wrong");
                });
        }

        setIsSubmitting(false);
    }

    const countriesOption = countries?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });
    // const certificationListOption = certificationList?.map(function (item) {
    //     return {
    //         value: item?.value,
    //         label: item?.label,
    //     }
    // });
    const statusOptions = [
        {
            label: 'Awarded',
            value: 'Awarded'
        },
        {
            label: 'Enrolled',
            value: 'Enrolled'
        },
        {
            label: 'In Progress',
            value: 'In Progress'
        },
    ];

    return (
        <Modal
            show={show}
            size="lg"
            centered
            onHide={() => {
                setShow(false);
                setSelectedData(initProf)
            }}
        > <Formik
            initialValues={selectedData}
            validationSchema={SignupSchema}
            onSubmit={values => {
                handleSubmit(values)
            }}
        >
                {({ errors, touched, setFieldValue, values }) => (
                    <>

                        <Form>
                            <Modal.Header>
                                <Modal.Title className='cover_letter_modal_view'>
                                    <h2>{action} Professional Certification</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShow(false);
                                        }}
                                    >
                                        <i className="fas fa-times text-danger" style={{ fontSize: '26px' }}></i>
                                    </button>
                                </Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label className="required"><b>Certification</b></label>
                                        {/* <Select
                                            options={certificationListOption}
                                            placeholder="Select Certification"
                                            defaultValue={certificationListOption.find(option => option.value === values?.certification_name)}
                                            onChange={(option) => {
                                                setFieldValue("certification_name", option.value);
                                            }}
                                        /> */}
                                        <Field name="certification_name" maxLength={255} type="text" className="form-control" />
                                        {errors.certification_name && touched.certification_name ? (
                                            <div className="text-danger">{errors.certification_name}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label className="required"><b>Institution Name</b></label>
                                        <Field name="institute" maxLength={255} type="text" className="form-control" />
                                        {errors.institute && touched.institute ? (
                                            <div className="text-danger">{errors.institute}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="row pt-5">
                                    <div className="col-md-6 mb-3">
                                        <label className=""><b>Start date</b></label>
                                        <Field name="from_date" type="date" className="form-control" />
                                        {errors.from_date && touched.from_date ? (
                                            <div className="text-danger">{errors.from_date}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className=""><b>End date</b></label>
                                        <Field name="to_date" type="date" className="form-control" />
                                        {errors.to_date && touched.to_date ? (
                                            <div className="text-danger">{errors.to_date}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="row pt-5">
                                    <div className="col-md-6 mb-3">
                                        <label className=" "><b>Enrolled ID</b></label>
                                        <Field name="enrollment_id" maxLength={255} type="text" className="form-control" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className=""><b>Country</b></label>
                                        <Select
                                            options={countriesOption}
                                            placeholder="Select Country"
                                            defaultValue={countriesOption.find(option => option.value === values?.country_id)}
                                            onChange={(option) => {
                                                setFieldValue("country_id", option ? option.value : null);
                                            }}
                                            isClearable={true}
                                        />
                                    </div>
                                </div>
                                <div className="row  pt-5">

                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Status</b></label>
                                        {/* <Field as="select" name="status" type="date" className="form-control" >
                                            <option value={'Enrolled'}>Enrolled</option>
                                            <option value={'Awarded'}>Awarded</option>
                                            <option value={'In Progress'}>In Progress</option>
                                        </Field> */}
                                        <Select
                                            options={statusOptions}
                                            placeholder="Select Status"
                                            value={values.statusObj ? values.statusObj : statusOptions.find((item) => item.value === values.status)}
                                            onChange={(item) => {
                                                setFieldValue('status', item?.value || null);
                                                setFieldValue('statusObj', item);
                                            }}
                                            isClearable
                                        />
                                        {errors.status && touched.status ? (
                                            <div className="text-danger">{errors.status}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">

                                        <label className="required"><b>Valid date</b></label>
                                        <Field name="valid_till" type="date" className="form-control" min={currentDate} />
                                        {/* <DatePicker className="form-control" value={values.valid_till} onChange={v=>{
                                            setFieldValue("valid_till",v);
                                        }}/> */}
                                        {errors.valid_till && touched.valid_till ? (
                                            <div className="text-danger">{errors.valid_till}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="row  pt-5">

                                    <div className="col-md-6 mb-3">
                                        <label className=""><b>Certification URL</b></label>
                                        <Field name="certification_url" type="text" className="form-control" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Modality</b></label>
                                        {/* <Field as="select" name="modality" className="form-control">
                                            <option value=''>Select</option>
                                            {modality?.map((col, i) => {
                                                return (
                                                    <>
                                                        <option value={col?.value}>{col?.label}</option>
                                                    </>
                                                )
                                            })}
                                        </Field> */}
                                        <Select
                                            options={modality}
                                            placeholder="Select Modality"
                                            value={values.modalityObj ? values.modalityObj : modality.find((item) => item.value === values.modality)}
                                            onChange={(item) => {
                                                setFieldValue('modality', item?.value || null);
                                                setFieldValue('modalityObj', item);
                                            }}
                                            isClearable
                                        />
                                        {errors.modality && touched.modality ? (
                                            <div className="text-danger">{errors.modality}</div>
                                        ) : null}
                                    </div>
                                </div>



                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={() => {
                                        setShow(false);
                                        setSelectedData(initProf);
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Submit
                                </button>
                            </Modal.Footer>
                        </Form>
                    </>
                )}
            </Formik>

        </Modal >
    );
};

export default AddEditProfessional;
