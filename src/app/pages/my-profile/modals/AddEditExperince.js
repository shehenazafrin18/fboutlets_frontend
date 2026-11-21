import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, Formik } from 'formik';
import API from "../../../helpers/devApi"
import { swalError, swalSuccess } from "../../../helpers/swal";
import * as Yup from 'yup';
import Editor from "../../../../_metronic/_partials/controls/Editor";
import * as Action from "../_redux/recruitementActions";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Input, Tag } from "antd";


const AddEditExperince = ({ 
    show, 
    setShow, 
    selectedData, 
    setSelectedData, 
    fetchedData, 
    editorHtml, 
    setEditorHtml, 
    action,
    expId, 
    initalExp,  
    selectedIndustries,
    setSelectedIndustries,
}) => {
    const dispatch = useDispatch();
    const [options, setoptions] = useState([]);
    const [industriesValue, setIndustriesValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [selectedIndustries, setSelectedIndustries] = useState([]);
    const SignupSchema = Yup.object().shape({
        organisation_name: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Organisation name is Required'),
        designation: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Designation is Required'),
        location: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Location is Required'),
        department: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Department is Required'),
        industry_type_id: Yup.number().required('Required'),
        // start_date: Yup.date().required('Start date is Required'),
        // end_date: Yup.date().when('isChecked', {
        //     is: true,
        //     then: Yup.date().required('End date is required'),
        //     otherwise: Yup.date(),
        // }),
        start_date: Yup.date().when(['end_date'], {
            is: (endDate) => endDate,
            then: Yup.date().typeError('End date must be a date')
                .max(Yup.ref('end_date'), 'Start date must be before end date')
                .max(new Date(), 'Start date must be less than or equal to today')
                .required('Start date is required'),
            otherwise: Yup.date().max(new Date(), 'Start date must be less than or equal to today').required('Start date is required'),
        }),
        end_date: Yup.date().nullable().when('is_currently_working', {
            is: 0,
            then: Yup.date().nullable().typeError('End date must be a date')
                .max(new Date(), 'End date must be less than or equal to today')
                .required('End date is required').test({
                    name: 'start-date-before-end-date',
                    exclusive: true,
                    message: 'Start date must be before end date',
                    test: function (endDate) {
                        const startDate = this.resolve(Yup.ref('start_date'));
                        return startDate < endDate;
                    }
            }),
            otherwise: Yup.date(),
        }),
        responsibilities: Yup.string().nullable()
            .required('Responsibilities is Required'),
        supervisor_email: Yup.string().email('Must be valid email').nullable(),
        supervisor_phone: Yup.string()
            .max(11, 'Too long!')
            .matches(/^[0-9]+$/, "Must be only digits")
            .nullable()
    });
  
    const getIndustryType = async () => {
        await API.get(`hrms_industry_type`)
            .then((res) => {
                if (res.data?.success) {
                    const result = res?.data?.data?.hrms_industry_type;
                    const optArr = result.map((row) => {
                        return {
                            value: row?.hrms_industry_type__id,
                            label: row?.hrms_industry_type__name,
                        }
                    });
                    setoptions(optArr);
                } else {
                    swalError(res?.message);
                }
            })
            .catch((error) => {
                swalError("someting went wrong");
            });
    }
  
    useEffect(() => {
        getIndustryType(); 
    }, []);

     
    const handleTextEditor = (values) => {
        setEditorHtml(values);
    };

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        if (editorHtml == "") {
            swalError("Please enter responsibilities", "");
        } else {
            for (var key in values) {
                if (key == 'industry_type_id') {
                    values[key] = values[key] ? parseInt(values[key]) : 0;
                }
                if (key == 'is_currently_working') {
                    values['end_date'] = values?.is_currently_working === 0 ? values['end_date'] : null;
                    values['is_currently_working'] = values?.is_currently_working;
                }
            }
            // formdata.append('preferred_industries', selectedIndustries?.length > 0 ? JSON.stringify(selectedIndustries) : '');
            values['area_of_expertise'] =  selectedIndustries?.length > 0 ? JSON.stringify(selectedIndustries) : '';
            values['responsibilities'] = editorHtml;

            // alert(JSON.stringify(values, null, 2))
            // return false;
            if (action == "Add") {
                await API.post(`/hrms_experience`, values)
                    .then((res) => {
                        if (res?.data?.success) {
                            setEditorHtml('');
                            swalSuccess('Data saved successfully!!');
                            dispatch(Action.insertProfileScore(["Experience"]));
                            // dispatch(Action.getProfilePercentage());
                            dispatch(Action.getExperienceByApplicants(initalExp?.applicant_id));
                            setTimeout(() => {
                                dispatch(Action.getApplicantsInfoById(initalExp?.applicant_id));
                            }, "300");
                            setShow(false);
                            setSelectedIndustries([]);
                        } else {
                            swalError(res?.data?.message, " ");
                        }
                    })
                    .catch((error) => {
                        swalError("someting went wrong");
                    });
            } else {
                await API.patch(`/hrms_experience/${expId}`, values)
                    .then((res) => {
                        if (res?.data?.success) {
                            setEditorHtml('');
                            swalSuccess('Data updated successfully!!');
                            // dispatch(Action.insertProfileScore(["Experience"]));
                            //dispatch(Action.getProfilePercentage());
                            dispatch(Action.getExperienceByApplicants(initalExp?.applicant_id));
                            setTimeout(() => {
                                dispatch(Action.getApplicantsInfoById(initalExp?.applicant_id));
                            }, "300");
                            setShow(false);
                            setSelectedIndustries([]);
                        } else {
                            swalError(res?.data?.message, " ");
                        }
                    })
                    .catch((error) => {
                        swalError("someting went wrong");
                    });
            }

            

        }

        setIsSubmitting(false);
    }

    const handleInputChange = (value, type) => { 
        setIndustriesValue(value); 
    };

    const handleKeyPress = (e, type) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            const newIndustry = industriesValue.trim();
            if (newIndustry && !selectedIndustries.includes(newIndustry)) {
                setSelectedIndustries([...selectedIndustries, newIndustry]);
                setIndustriesValue('');
            } 
        }
    };
    const handleSkillRemove = (skillToRemove, type) => { 
        setSelectedIndustries(selectedIndustries.filter(skill => skill !== skillToRemove)); 
    };

    const IndustryTypeListOption = options?.map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    });

    return (
        <Modal
            show={show}
            size="lg"
            centered
            onHide={() => {
                setShow(false);
                setSelectedData(initalExp); 
                setSelectedIndustries([]);
                setEditorHtml('');
            }}
        > <Formik
            initialValues={selectedData}
            validationSchema={SignupSchema}
            onSubmit={values => handleSubmit(values)}
            enableReinitialize
        >
                {({ errors, touched, setFieldValue, values }) => (
                    <>

                        <Form>
                            <Modal.Header>
                                <Modal.Title className='cover_letter_modal_view'>
                                    <h2>{action} Experience</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShow(false);
                                            setSelectedData(initalExp)
                                        }}
                                    >
                                        <i className="fas fa-times text-danger" style={{ fontSize: '26px' }}></i>
                                    </button>
                                </Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Organization name</b></label>
                                        <Field
                                            name="organisation_name"
                                            placeholder="Organization name"
                                            className="form-control"
                                        />
                                        {errors.organisation_name && touched.organisation_name ? (
                                            <div className="text-danger">{errors.organisation_name}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Designation</b></label>
                                        <Field
                                            name="designation"
                                            placeholder="Designation"
                                            className="form-control"
                                        />
                                        {errors.designation && touched.designation ? (
                                            <div className="text-danger">{errors.designation}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="row  pt-5">
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Location</b></label>
                                        <Field
                                            name="location"
                                            placeholder="Location"
                                            className="form-control"
                                        />
                                        {errors.location && touched.location ? (
                                            <div className="text-danger">{errors.location}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Department</b></label>
                                        <Field
                                            name="department"
                                            placeholder="Department"
                                            className="form-control"
                                        />
                                        {errors.department && touched.department ? (
                                            <div className="text-danger">{errors.department}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="row  pt-5">
                                    <div className="col-md-6 mb-3">
                                        <label className="required">Industry type</label>
                                        <Select
                                            options={IndustryTypeListOption}
                                            placeholder="Select Industry Type"
                                            defaultValue={IndustryTypeListOption.find(option => option.value === values?.industry_type_id)}
                                            onChange={(option) => {
                                                setFieldValue("industry_type_id", option.value);
                                            }}
                                        />
                                        {errors.industry_type_id && touched.industry_type_id ? (
                                            <div className="text-danger">{errors.industry_type_id}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required"><b>Start date</b></label>
                                        <Field name="start_date" type="date" className="form-control" />
                                        {errors.start_date && touched.start_date ? (
                                            <div className="text-danger">{errors.start_date}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="row  pt-5">
                                    <div className="col-md-6 mb-3">

                                        <label className=""><b>End date</b></label>
                                        <Field
                                            name="end_date"
                                            type="date"
                                            className="form-control"
                                            disabled={values.is_currently_working}
                                            value={values.is_currently_working ? "" : values.end_date} // Reset value if isChecked is true
                                            onChange={(e) => {
                                                setFieldValue('end_date', e.target.value);
                                            }}
                                        />
                                        {errors.end_date && touched.end_date ? (
                                            <div className="text-danger">{errors.end_date}</div>
                                        ) : null}


                                        <div className="form-group mt-3">
                                            <div className="checkbox-inline">
                                                <input type="checkbox"
                                                    name="is_currently_working"
                                                    // value={values?.is_currently_working} 
                                                    onChange={(e) => {
                                                        setFieldValue('is_currently_working', e.target.checked ? 1 : 0);
                                                        if (e.target.checked) {
                                                            setFieldValue('end_date', null);
                                                        }
                                                    }}
                                                    checked={values.is_currently_working}
                                                />
                                                {/* <Field type="checkbox" name="is_currently_working" /> */}

                                                <span className="ml-3">I am currently working in this role</span>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-md-6 mb-3">
                                        <label ><b>Supervisor's name (optional)</b></label>
                                        <Field
                                            placeholder={"Supervisor's name (optional)"}
                                            name="supervisor_name"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="row  pt-5">
                                    <div className="col-md-6 mb-3">
                                        <label ><b>Supervisor's email (optional)</b></label>
                                        <Field
                                            placeholder={"Supervisor's email (optional)"}
                                            name="supervisor_email"
                                            className="form-control"
                                        />
                                        {errors.supervisor_email && touched.supervisor_email ? (
                                            <div className="text-danger">{errors.supervisor_email}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label ><b>Supervisor's phone number (optional)</b></label>
                                        <Field
                                            placeholder={"Supervisor's phone number (optional)"}
                                            name="supervisor_phone"
                                            className="form-control"
                                        />
                                        {errors.supervisor_phone && touched.supervisor_phone ? (
                                            <div className="text-danger">{errors.supervisor_phone}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="row  pt-5">
                                    <div className="col-md-6 mb-3">
                                        <label className=""><b>Achievement (optional)</b></label>
                                        <Field
                                            placeholder={"achievement (optional)"}
                                            name="achievement"
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                            <label className=""><b>Area Of Expertise</b></label> 

                                            <Input
                                                value={industriesValue}
                                                onChange={(e) => { handleInputChange(e.target.value, 'area_of_expertise') }}
                                                onKeyPress={(e) => handleKeyPress(e, 'area_of_expertise')}
                                                placeholder="Type a area of expertise and press Enter"
                                            />
                                            <div style={{ marginTop: 10 }}>
                                                {selectedIndustries && selectedIndustries.map(skill => (
                                                    <Tag key={skill} closable onClose={() => handleSkillRemove(skill, 'area_of_expertise')}>{skill}</Tag>
                                                ))}
                                            </div>
                                            {/* {errors.preferred_industries && touched.preferred_industries ? (
                                                <div className="text-danger">{errors.preferred_industries}</div>
                                            ) : null} */}
                                        </div>
                                </div>

                                <div className="col-md-12 pt-5 mb-10">
                                    <label className="required">Responsibilities</label>
                                    <Editor
                                        setEditorHtml={setEditorHtml}
                                        editorHtml={editorHtml}
                                        onChange={(e) => {
                                            handleTextEditor(e);
                                            setFieldValue("responsibilities", e === '<p><br></p>' ? null : e);
                                        }}
                                    />
                                    {errors.responsibilities && touched.responsibilities ? (
                                        <div className="text-danger">{errors.responsibilities}</div>
                                    ) : null}
                                </div>

                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={() => {
                                        setShow(false);
                                        setSelectedData(initalExp); 
                                        setSelectedIndustries([]);
                                        setEditorHtml('');
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

export default AddEditExperince;
