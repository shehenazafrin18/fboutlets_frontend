import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, Formik } from 'formik';
import API from "../../../helpers/devApi"
import { swalError, swalSuccess } from "../../../helpers/swal";
import * as Yup from 'yup';
import * as Action from "../_redux/recruitementActions"
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Input, Tag } from 'antd';


const year = [];
const month = [];
const day = [];


for (let i = 0; i <= 12; i++) {
    let obj = {
        value: i,
        label: i,
    }
    year.push(obj);
    month.push(obj);
}
for (let i = 0; i <= 29; i++) {
    let obj = {
        value: i,
        label: i,
    }
    day.push(obj);
}

const SignupSchema = Yup.object().shape({
    training_title: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    institution_name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    country_id: Yup.number().required('Required'),
    year: Yup.number().required('Required'),
    month: Yup.number().required('Required'),
    day: Yup.number().required('Required'),
    start_date: Yup.date().required('Required').max(Yup.ref('end_date'), 'Start date cannot be greater than End date'),
    end_date: Yup.date().required('Required').min(Yup.ref('start_date'), 'End date cannot be less than Start date'),
});

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


const AddEditTaining = ({ show, setShow, selectedData, setSelectedData, initalTr, action, trainingId }) => {
    const dispatch = useDispatch();
    const [countries, setCountries] = useState([]);
    const [skillValue, setSkillValue] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [expertizeValue, setExpertizeValue] = useState('');
    const [selectedExpertize, setSelectedExpertize] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        getallCountries();
    }, []);

    useEffect(() => {
        if (selectedData && selectedData?.skill?.length > 0) {
            setSelectedSkills(selectedData?.skill)
        }
    }, [selectedData]);


    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        for (var key in values) {
            if (key == 'country_id' || key == 'year' || key == 'month' || key == 'day') {
                values[key] = values[key] ? parseInt(values[key]) : 0;
            }
        }

        const insertData = {
            ...values,
            modalityObj: undefined,
            'skill': selectedSkills?.length > 0 ? JSON.stringify(selectedSkills) : null
        }
        // console.log({ insertData });
        // return
        if (action == "Add") {
            await API.post(`/hrms_training`, insertData)
                .then((res) => {
                    if (res?.data?.success) {
                        setSelectedSkills([]);
                        swalSuccess('Data saved successfully!!');
                        dispatch(Action.insertProfileScore(["Training"]));
                        //dispatch(Action.getProfilePercentage());
                        dispatch(Action.getTrainingByApplicants(initalTr?.applicant_id));
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(initalTr?.applicant_id));
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
            await API.patch(`/hrms_training/${trainingId}`, insertData)
                .then((res) => {
                    if (res?.data?.success) {
                        setSelectedSkills([]);
                        swalSuccess('Data updated successfully!!');
                        // dispatch(Action.insertProfileScore(["Training"]));
                        //dispatch(Action.getProfilePercentage());
                        dispatch(Action.getTrainingByApplicants(initalTr?.applicant_id));
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(initalTr?.applicant_id));
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





    const handleInputChange = (value, type) => {
        if (type == 'skill') {
            setSkillValue(value);
        } else {
            setExpertizeValue(value)
        }
    };

    const handleKeyPress = (e, type) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (type == 'skill') {
                const newSkill = skillValue.trim();
                if (newSkill && !selectedSkills.includes(newSkill)) {
                    setSelectedSkills([...selectedSkills, newSkill]);
                    setSkillValue('');
                }
            } else {
                const newExpertize = expertizeValue.trim();
                if (newExpertize && !selectedExpertize.includes(newExpertize)) {
                    setSelectedExpertize([...selectedExpertize, newExpertize]);
                    setExpertizeValue('');
                }
            }
        }
    };

    const handleSkillRemove = (skillToRemove) => {
        setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
    };
    return (
        <Modal
            show={show}
            size="lg"
            centered
            onHide={() => {
                setShow(false);
                setSelectedData(initalTr);
                setSelectedSkills([])
            }}
        > <Formik
            initialValues={selectedData}
            validationSchema={SignupSchema}
            onSubmit={values => handleSubmit(values)}
        >
                {({ errors, touched, setFieldValue, values }) => (
                    <>

                        <Form>
                            <Modal.Header>
                                <Modal.Title className='cover_letter_modal_view'>
                                    <h2>{action} Training</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShow(false);
                                            setSelectedData(initalTr);
                                            setSelectedSkills([])
                                        }}
                                    >
                                        <i className="fas fa-times text-danger" style={{ fontSize: '26px' }}></i>
                                    </button>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row pt-5">
                                    <div className="col-md-12 mb-3">
                                        <label className="required"><b>Training title</b></label>
                                        <Field name="training_title" type="text" className="form-control" />
                                        {errors.training_title && touched.training_title ? (
                                            <div className="text-danger">{errors.training_title}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label className="required"><b>Institution Name</b></label>
                                        <Field name="institution_name" type="text" className="form-control" />
                                        {errors.institution_name && touched.institution_name ? (
                                            <div className="text-danger">{errors.institution_name}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="row  pt-5">
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Country</b></label>
                                        <Select
                                            options={countriesOption}
                                            placeholder="Select Country"
                                            defaultValue={countriesOption.find(option => option.value === values?.country_id)}
                                            onChange={(option) => {
                                                setFieldValue("country_id", option ? option.value : null);
                                            }}
                                            isClearable={true}
                                        />
                                        {errors.country_id && touched.country_id ? (
                                            <div className="text-danger">{errors.country_id}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className=""><b>Modality</b></label>
                                        {/* <Field as="select" name="modality" className="form-control">
                                            <option value='' disabled>Select</option>
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
                                            value={values.modalityObj ? values.modalityObj : modality.find((item) => item.value === values.modality)}
                                            onChange={(item) => {
                                                setFieldValue('modality', item?.value || null);
                                                setFieldValue('modalityObj', item);
                                            }}
                                            placeholder="Select Modality"
                                            isClearable={true}
                                        />
                                        {errors.modality && touched.modality ? (
                                            <div className="text-danger">{errors.modality}</div>
                                        ) : null}
                                    </div>
                                    {/* <div className="col-md-6 mb-3">
                                        <label className=""><b>Duration</b></label>
                                        <div className="row duration">
                                            <div className="col-md-4">
                                                <label className=""><b>Year</b></label>
                                                <Field as="select" name="year" className="form-control">
                                                    {year?.map((col, i) => {
                                                        return (
                                                            <>
                                                                <option value={col?.value}>{col?.label}</option>
                                                            </>
                                                        )
                                                    })}
                                                </Field>
                                                {errors.year && touched.year ? (
                                                    <div className="text-danger">{errors.year}</div>
                                                ) : null}
                                            </div>
                                            <div className="col-md-4">
                                                <label className=""><b>Month</b></label>
                                                <Field as="select" name="month" className="form-control">
                                                    {month?.map((col, i) => {
                                                        return (
                                                            <>
                                                                <option value={col?.value}>{col?.label}</option>
                                                            </>
                                                        )
                                                    })}
                                                </Field>
                                                {errors.month && touched.month ? (
                                                    <div className="text-danger">{errors.month}</div>
                                                ) : null}
                                            </div>
                                            <div className="col-md-4">
                                                <label className=""><b>Day</b></label>
                                                <Field as="select" name="day" className="form-control form-control--secondary">
                                                    {day?.map((col, i) => {
                                                        return (
                                                            <>
                                                                <option value={col?.value}>{col?.label}</option>
                                                            </>
                                                        )
                                                    })}
                                                </Field>
                                                {errors.day && touched.day ? (
                                                    <div className="text-danger">{errors.day}</div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="row  pt-5">
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Start date</b></label>
                                        <Field name="start_date" type="date" className="form-control" />
                                        {errors.start_date && touched.start_date ? (
                                            <div className="text-danger">{errors.start_date}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>End date</b></label>
                                        <Field name="end_date" type="date" className="form-control" />
                                        {errors.end_date && touched.end_date ? (
                                            <div className="text-danger">{errors.end_date}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="row  pt-5">

                                    <div className="col-md-6 mb-3">
                                        <label className=""><b>Skill / Expertized</b></label>
                                        <Input
                                            value={skillValue}
                                            onChange={(e) => { handleInputChange(e.target.value, 'skill') }}
                                            onKeyPress={(e) => handleKeyPress(e, 'skill')}
                                            placeholder="Type a skill and press Enter"
                                        />
                                        <div style={{ marginTop: 10 }}>
                                            {selectedSkills.map(skill => (
                                                <Tag key={skill} closable onClose={() => handleSkillRemove(skill)}>{skill}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={() => {
                                        setShow(false);
                                        setSelectedData(initalTr);
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

export default AddEditTaining;
