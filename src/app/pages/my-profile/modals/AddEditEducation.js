import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import API from "../../../helpers/devApi"
import { swalError, swalSuccess } from "../../../helpers/swal";
import * as Yup from 'yup';
import moment from "moment";
import * as Action from "../_redux/recruitementActions"
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Input } from "antd";

const validationSchema = Yup.object().shape({
    education_level_id: Yup.number().nullable().required('Required'),
    degree_name: Yup.string().nullable().required('Required'),
    result_type_id: Yup.number().nullable().required('Required').typeError('Required'),
    major_subject: Yup.string().nullable().required('Required'),
    passing_year: Yup.string().nullable().required('Required'),
    // board_id: Yup.number().required('Required'),
    institute_name: Yup.string().nullable().required('Required'),
    result: Yup.string().when('result_type_name', {
        is: (value) => value === 'Division' || value === 'Class',
        then: Yup.string().nullable().required('Result is required'),
        otherwise: Yup.string().nullable(),
    }),
    // Validation for "cgpa" and "cgpa_scale" fields
    // cgpa: Yup.string().when('result_type_id', {
    //     is: (value) => value === 1,
    //     then: Yup.string().nullable().required('GPA/CGPA is required'),
    //     otherwise: Yup.string().nullable(),
    // }),
    cgpa: Yup.number().when(['result_type_name', 'cgpa_scale'], (result_type_name, cgpa_scale) => {
        if(result_type_name === 'Grade') {
            return Yup.number().nullable()
                .required('GPA/CGPA is required')
                .typeError('GPA/CGPA must be a number')
                .max(cgpa_scale, `GPA/CGPA must be less than or equal to ${!cgpa_scale || isNaN(cgpa_scale) ? 'GPA/CGPA Scale' : cgpa_scale}`)
        } else {
            return Yup.number().nullable()
        }
    }),
    // cgpa: Yup.string().when('result_type_id', {
    //     is: 'Grade',
    //     then: Yup.string().required('GPA/CGPA is required').test(
    //         'cgpa-valid',
    //         'CGPA must not be greater than CGPA scale',
    //         function (value) {
    //             const cgpaScale = this.resolve(Yup.ref('cgpa_scale'));
    //             return !value || !cgpaScale || parseFloat(value) <= parseFloat(cgpaScale);
    //         }
    //     ),
    //     otherwise: Yup.string().notRequired(),
    // }),
    cgpa_scale: Yup.number().when('result_type_name', {
        is: (value) => value === 'Grade',
        then: Yup.number().nullable()
            .required('GPA/CGPA Scale is required')
            .typeError('GPA/CGPA Scale must be a number'),
        otherwise: Yup.number().nullable(),
    }),
    start_date: Yup.date().nullable().max(Yup.ref('end_date'), 'Start date cannot be greater than End date'),
    end_date: Yup.date().nullable().min(Yup.ref('start_date'), 'End date cannot be less than Start date'),
});


const AddEditEducation = ({ show, setShow, selectedData, setSelectedData, initEdu, action, eduId }) => {
    const dispatch = useDispatch();
    const currentYear = moment().format("YYYY");
    const year = [];

    for (let i = currentYear; i >= 1800; i--) {
        let obj = {
            value: i,
            label: i,
        };
        year.push(obj);
    }
    const [initData, setInitData] = useState(selectedData);
    const [eduLevel, setEduLevel] = useState([]);
    const [degreeList, setDegreeList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [institueList, setInstitueList] = useState([]);
    const [resultTypes, setResultTypes] = useState([]);
    const [boardList, setBoardList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getallEduLevel = async () => {
        await API.get(`/hrms_education_level`)
            .then((res) => {
                if (res.data?.success) {
                    const resData = res?.data?.data?.hrms_education_level;
                    var result = resData?.map(function (col) {
                        return {
                            value: col?.hrms_education_level__id,
                            label: col?.hrms_education_level__name,
                            slug: col?.hrms_education_level__slug,
                        }
                    });
                    setEduLevel(result)
                } else {
                    swalError(res?.data?.msg)
                }
            }).catch((error) => {
                swalError("Somthing went wrong")
            })
    }
    const getallDegree = async () => {
        await API.get(`/hrms_degree`)
            .then((res) => {
                if (res.data?.success) {
                    const resData = res?.data?.data?.hrms_degree;
                    var result = resData?.map(function (col) {
                        return {
                            value: col?.hrms_degree__name,
                            label: col?.hrms_degree__name,
                        }
                    });
                    setDegreeList(result)
                } else {
                    swalError(res?.data?.msg)
                }
            }).catch((error) => {
                swalError("Somthing went wrong")
            })
    }
    // const getallSubject = async () => {
    //     await API.get(`/hrms_major_subject`)
    //         .then((res) => {
    //             if (res.data?.success) {
    //                 const resData = res?.data?.data?.hrms_major_subject;
    //                 var result = resData?.map(function (col) {
    //                     return {
    //                         value: col?.hrms_major_subject__id,
    //                         label: col?.hrms_major_subject__name,
    //                     }
    //                 });
    //                 setSubjectList(result)
    //             } else {
    //                 swalError(res?.data?.msg)
    //             }
    //         }).catch((error) => {
    //             swalError("Somthing went wrong")
    //         })
    // }
    const getallInstitute = async () => {
        await API.get(`/hrms_institute`)
            .then((res) => {
                if (res.data?.success) {
                    const resData = res?.data?.data?.hrms_institute;
                    var result = resData?.map(function (col) {
                        return {
                            value: col?.hrms_institute__id,
                            label: col?.hrms_institute__name,
                        }
                    });
                    setInstitueList(result)
                } else {
                    swalError(res?.data?.msg)
                }
            }).catch((error) => {
                swalError("Somthing went wrong")
            })
    }
    const getAllResultType = async () => {
        await API.get(`/hrms_result_type`)
            .then((res) => {
                if (res.data?.success) {
                    const resData = res?.data?.data?.hrms_result_type;
                    var result = resData?.map(function (col) {
                        return {
                            value: col?.hrms_result_type__id,
                            label: col?.hrms_result_type__name,
                        }
                    });
                    setResultTypes(result)
                } else {
                    swalError(res?.data?.msg)
                }
            }).catch((error) => {
                swalError("Somthing went wrong")
            })
    }
    const getallBoard = async () => {
        await API.get(`/hrms_board`)
            .then((res) => {
                if (res.data?.success) {
                    const resData = res?.data?.data?.hrms_board;
                    var result = resData?.map(function (col) {
                        return {
                            value: col?.hrms_board__id,
                            label: col?.hrms_board__name,
                        }
                    });
                    setBoardList(result)
                } else {
                    swalError(res?.data?.msg)
                }
            }).catch((error) => {
                swalError("Somthing went wrong")
            })
    }

    const handleSubmitForm = async (values) => {
        setIsSubmitting(true);
        for (var key in values) {
            // if (values[key]) {
            if (key == 'board_id' || key == 'applicant_id' || key == 'education_level_id' || key == 'result_type_id') {
                values[key] = values[key] ? parseInt(values[key]) : null;
            }
            // }
        }
        values.cgpa = values.cgpa ? values.cgpa.toString() : null;
        values.cgpa_scale = values.cgpa_scale ? values.cgpa_scale.toString() : null;
        values.marks = values.marks ? values.marks.toString() : null;

        if (action == "Add") {
            await API.post(`/hrms_education`, values)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data saved successfully!!');
                        dispatch(Action.insertProfileScore(["Education"]));
                        dispatch(Action.getAllEducationByApplicants(initEdu?.applicant_id));
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(initEdu?.applicant_id));
                        }, "300");
                        setSelectedData(initEdu);
                        setShow(false);
                    } else {
                        swalError(res?.data?.message, " ");
                    }
                })
                .catch((error) => {
                    swalError("someting went wrong");
                });
        } else {
            await API.patch(`/hrms_education/${eduId}`, values)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data updated successfully!!');
                        // dispatch(Action.insertProfileScore(["Education"]));
                        dispatch(Action.getAllEducationByApplicants(initEdu?.applicant_id));
                        setTimeout(() => {
                            dispatch(Action.getApplicantsInfoById(initEdu?.applicant_id));
                        }, "300");
                        setSelectedData(initEdu);
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

    const eduLevelOption = eduLevel?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
            slug: item?.slug,
        }
    });
    const degreeListOption = degreeList?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });
    const subjectListOption = subjectList?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });
    const yearListOption = year?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });
    const boardListOption = boardList?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });
    const institueListOption = institueList?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckForeignDegree = (val, values, setFieldValue) => {
        setIsChecked(!isChecked);
        if (val) {
            setFieldValue("is_foreign_degree", !isChecked ? 1 : 0);
        } else {
            setFieldValue("is_foreign_degree", 0);
        }
    };

    useEffect(() => {
        getallEduLevel();
        getallDegree();
        // getallSubject();
        getallInstitute();
        getAllResultType();
        getallBoard();
        if (selectedData?.is_foreign_degree === 1) {
            setIsChecked(true);
        }
        if(selectedData) {
            selectedData.result_type_name = resultTypes.find(item => item.value === selectedData.result_type_id)?.label;
            setInitData({...selectedData});
        }
    }, [selectedData]);

    return (
        <Modal
            show={show}
            size="lg"
            centered
            onHide={() => {
                setShow(false);
                setSelectedData(initEdu)
            }}
        > <Formik
            initialValues={initData}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={values => {
                handleSubmitForm(values);
            }}
        >
                {({ errors, touched, setFieldValue, values }) => (
                    <>
                        <Form>
                            <Modal.Header>
                                <Modal.Title className='cover_letter_modal_view'>
                                    <h2>{action} Education</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShow(false);
                                            setSelectedData(initEdu)
                                        }}
                                    >
                                        <i className="fas fa-times text-danger" style={{ fontSize: '26px' }}></i>
                                    </button>
                                </Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label className="required"><b>Education level</b></label>
                                        <Select
                                            options={eduLevelOption}
                                            placeholder="Select Education Level"
                                            value={eduLevelOption.find(option => option.value === values?.education_level_id)}
                                            onChange={(options) => {
                                                setFieldValue("education_level_id", options ? options.value : null);
                                            }}
                                            isClearable={true}
                                        />
                                        {errors.education_level_id && touched.education_level_id ? (
                                            <div className="text-danger">{errors.education_level_id}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label className="required"><b>Degree</b></label>
                                        <Select
                                            className="basic-single"
                                            options={degreeListOption}
                                            placeholder="Select Your Degree"
                                            value={degreeListOption.find(option => option.value === values?.degree_name)}
                                            onChange={(options) => {
                                                setFieldValue("degree_name", options ? options.value : null);
                                            }}
                                            isClearable={true}
                                        />
                                        {errors.degree_name && touched.degree_name ? (
                                            <div className="text-danger">{errors.degree_name}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label className="required"><b>Group/Major subject</b></label>
                                        {/* <Select
                                            options={subjectListOption}
                                            placeholder="Select Group/subject"
                                            defaultValue={subjectListOption.find(option => option.value === values?.major_subject)}
                                            onChange={(options) => {
                                                setFieldValue("major_subject", options.value);
                                            }}
                                        /> */}
                                        <Field name="major_subject" type="text" className="form-control" />
                                        {errors.major_subject && touched.major_subject ? (
                                            <div className="text-danger">{errors.major_subject}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label className="required"><b>Division/Class/Grade</b></label>
                                        {/* <Field
                                            as="select"
                                            name="result_type_id"
                                            className="form-control"
                                            onChange={(event) => {
                                                setFieldValue('result_type_id', event.target.value);
                                                setFieldValue('result', null);
                                                setFieldValue('cgpa', null);
                                                setFieldValue('cgpa_scale', null);
                                            }}
                                        >
                                            <option>Select Grade</option>
                                            {resultTypes?.map((col, i) => {
                                                return (
                                                    <>
                                                        <option value={col?.value}>{col?.label}</option>
                                                    </>
                                                )
                                            })}
                                        </Field> */}
                                        <Select
                                            className="basic-single"
                                            options={resultTypes}
                                            placeholder="Division/Class/Grade"
                                            value={resultTypes.find(option => option.value === values?.result_type_id)}
                                            onChange={(item) => {
                                                setFieldValue('result_type_id', item?.value || null);
                                                setFieldValue('result_type_name', item?.label || null);
                                                setFieldValue('result', null);
                                                setFieldValue('cgpa', null);
                                                setFieldValue('cgpa_scale', null);
                                            }}
                                            isClearable={true}
                                        />
                                        {errors.result_type_id && touched.result_type_id ? (
                                            <div className="text-danger">{errors.result_type_id}</div>
                                        ) : null}
                                    </div>

                                    {(values.result_type_name === "Division" ||
                                        values.result_type_name === "Class") && (
                                            <div className="col-md-6 mb-4">
                                                <label className="required"><b>Result</b></label>
                                                <Input 
                                                    name="result" 
                                                    value={values.result} 
                                                    type="text" 
                                                    className="form-control"
                                                    onChange={(event) => {
                                                        setFieldValue('result', event.target.value);
                                                    }}
                                                />
                                                {errors.result && touched.result ? (
                                                    <div className="text-danger">{errors.result}</div>
                                                ) : null}
                                            </div>
                                        )}
                                    {(values.result_type_name === "Grade") && (
                                            <>
                                                <div className="col-md-6 mb-4">
                                                    <label className="required"><b>GPA/ CGPA</b></label>
                                                    <Field name="cgpa" type="number" className="form-control" />
                                                    {errors.cgpa && touched.cgpa ? (
                                                        <div className="text-danger">{errors.cgpa}</div>
                                                    ) : null}
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <label className="required"><b>GPA/ CGPA Scale</b></label>
                                                    <Field name="cgpa_scale" type="number" className="form-control" />.
                                                    {errors.cgpa_scale && touched.cgpa_scale ? (
                                                        <div className="text-danger">{errors.cgpa_scale}</div>
                                                    ) : null}
                                                </div>
                                            </>
                                        )}
                                    <div className="col-md-6 mb-4">
                                        <label className="required"><b>Passing year</b></label>
                                        <Select
                                            options={yearListOption}
                                            placeholder="Select Passing Year"
                                            value={yearListOption.find(option => option.value == values?.passing_year)}
                                            onChange={(option) => {
                                                setFieldValue("passing_year", option ? option.value.toString() : null);
                                            }}
                                            isClearable={true}
                                        />
                                        {errors.passing_year && touched.passing_year ? (
                                            <div className="text-danger">{errors.passing_year}</div>
                                        ) : null}
                                    </div>

                                    {["SSC", "HSC", "JSC", "PSC"].includes(
                                        eduLevelOption?.find(row => row?.value == values.education_level_id)?.slug
                                    ) && (
                                            <>
                                                <div className="col-md-6 mb-4">
                                                    <label className="required"><b>Board </b></label>
                                                    <Select
                                                        required
                                                        options={boardListOption}
                                                        placeholder="Select Board"
                                                        value={boardListOption.find(option => option.value == values?.board_id)}
                                                        onChange={(options) => {
                                                            setFieldValue("board_id", options.value);
                                                        }}
                                                    />
                                                    {errors.board_id && touched.board_id ? (
                                                        <div className="text-danger">{errors.board_id}</div>
                                                    ) : null}
                                                </div>
                                            </>
                                        )}

                                    {/* {(resultTypes?.find(
                                        (row) => row?.value == values.result_type_id
                                    )?.label == "Grade" ||
                                        resultTypes?.find(
                                            (row) => row.value == values.result_type_id
                                        )?.label == "Class") && ( */}
                                    <div className="col-md-6 mb-4">
                                        <label className=""><b>Marks (%) </b></label>
                                        <Field name="mark" type="number" className="form-control" />
                                    </div>
                                    {/* )} */}

                                    <div className="col-md-6 mb-4">
                                        <label className="required"><b>Institute</b></label>
                                        {/* <Select
                                            options={institueListOption}
                                            placeholder="Select Institute"
                                            defaultValue={institueListOption.find(option => option.value === values?.institute_id)}
                                            onChange={(options) => {
                                                setFieldValue("institute_id", options.value);
                                            }}
                                        /> */}
                                        <Field name="institute_name" type="text" className="form-control" />
                                        {errors.institute_name && touched.institute_name ? (
                                            <div className="text-danger">{errors.institute_name}</div>
                                        ) : null}

                                        <div className="mt-3 mb-3">
                                            <Field
                                                type="checkbox"
                                                checked={isChecked}
                                                id="foreign_degree"
                                                onChange={(e) => handleCheckForeignDegree(e.target.checked, values, setFieldValue)}
                                            />
                                            <label className="form-check-label ml-2" htmlFor="foreign_degree"><b>Foreign Institute</b></label>
                                        </div>

                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className=""><b>Start date</b></label>
                                        <Field name="start_date" type="date" className="form-control" />
                                        {errors.start_date && touched.start_date ? (
                                            <div className="text-danger">{errors.start_date}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className=""><b>End date</b></label>
                                        <Field
                                            name="end_date"
                                            type="date"
                                            className="form-control"
                                            value={values.end_date}
                                            onChange={(e) => {
                                                setFieldValue('end_date', e.target.value);
                                            }}
                                        />
                                        {errors.end_date && touched.end_date ? (
                                            <div className="text-danger">{errors.end_date}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className=""><b>Achievement</b></label>
                                        <Field name="achievement" type="text" className="form-control" />
                                        <div className="text-danger">
                                            <ErrorMessage name={`achievement`} />
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
                                        setSelectedData(initEdu);
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    className="btn btn-primary"
                                    // onClick={() => {
                                    //   handleSubmit();
                                    // }}
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

export default AddEditEducation;
