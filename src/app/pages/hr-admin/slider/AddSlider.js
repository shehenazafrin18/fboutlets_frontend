import { Field, Formik, Form } from 'formik';
import React from 'react'
import { Modal } from 'react-bootstrap';
import * as Yup from 'yup';
// import Editor from '../../../../_metronic/_partials/controls/Editor';
import * as hractions from "../_redux/hrActions"
import { useDispatch } from 'react-redux';


export default function AddSlider({ show, setShow, selectedData, setSelectedData, initSl, action, sliderId, setSubTitle, tagline, setTagLine, setSliderId }) {
    const dispatch = useDispatch();

    const ValidationSchema = Yup.object().shape({
        title: Yup.string().required('Required'),
        sub_title: Yup.string().required('Required'),
        tag_line: Yup.string().required('Tagline is required'),
        file_path: Yup.mixed().required('Slider Image is required'),
    });

    // const handleTextEditor = (values, name) => {
    //     if (name === 'tag_line') {
    //         setTagLine(values);
    //     } else {
    //         setSubTitle(values);
    //     }
    // };


    const handleSubmit = async (values) => {
        var formdata = new FormData();

        for (var key in values) {
            // if (key == "tag_line") {
            //     formdata.append('tag_line', tagline);
            // }
            // if (values[key] && key != "tag_line") {

            if (values[key]) {
                formdata.append(key, values[key]);
            }
        }

        if (sliderId) {
            await dispatch(hractions.updateSlider(formdata, sliderId));
        } else {
            await dispatch(hractions.saveSlider(formdata));
        }
        dispatch(hractions.getSliderList());
        setShow(false);
        setSelectedData(initSl);
        setTagLine('');
        setSliderId();
    }

    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

    return (
        <>

            <Modal
                show={show}
                size="lg"
                centered
                onHide={() => {
                    setShow(false);
                    setSelectedData(initSl)
                }}
            >
                <Formik
                    initialValues={selectedData}
                    validationSchema={ValidationSchema}
                    onSubmit={values => {
                        handleSubmit(values)
                    }}
                >
                    {({ errors, touched, setFieldValue }) => (
                        <>
                            <Form>
                                <Modal.Header>
                                    <Modal.Title className='cover_letter_modal_view'>
                                        <h2>{action}</h2>
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
                                    <div className='row'>
                                        <div className='col-md-12 mx-auto'>
                                            <div className="row mt-4">
                                                <div className="col-md-12 mb-3">
                                                    <label className="required"><b>Title</b></label>
                                                    <Field name="title" type="text" className={`form-control`} />
                                                    {errors.title && touched.title ? (
                                                        <div className="text-danger">{errors.title}</div>
                                                    ) : null}
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label className="required"><b>Subtitle</b></label>
                                                    <Field name="sub_title" type="text" disabled={true} className={`form-control ${errors.sub_title && touched.sub_title ? 'is-invalid' : ''}`} />
                                                    {errors.sub_title && touched.sub_title ? (
                                                        <div className="text-danger">{errors.sub_title}</div>
                                                    ) : null}
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label className="required"><b>Tagline</b></label>
                                                    <Field name="tag_line" type="text" className={`form-control ${errors.tag_line && touched.tag_line ? 'is-invalid' : ''}`} />

                                                    {/* <Editor
                                                        editorHtml={tagline}
                                                        onChange={(e) => {
                                                            handleTextEditor(e, 'tag_line');
                                                            setFieldValue("tag_line", e);
                                                        }}
                                                        required
                                                    /> */}
                                                    {errors.tag_line && touched.tag_line ? (
                                                        <div className="text-danger">{errors.tag_line}</div>
                                                    ) : null}
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label className="required"><b>Slider Images</b><span className='text-danger pl-5'>(Please upload an image file (JPG, PNG) with a recommended size of 1920x500 pixels. )</span>
                                                    </label>
                                                    <input name="file_path" type="file"
                                                        // onChange={(e) => {
                                                        //     setSelectedData({
                                                        //         ...selectedData,
                                                        //         "file_path": e.currentTarget.files[0]
                                                        //     });
                                                        //     setFieldValue("file_path", e.currentTarget.files[0])
                                                        // }}
                                                        onChange={(e) => {
                                                            const file = e.currentTarget.files[0];
                                                            setSelectedData({
                                                                ...selectedData,
                                                                file_path: file,
                                                                filePreview: URL.createObjectURL(file),
                                                            });
                                                            setFieldValue("file_path", file)
                                                        }}

                                                        className="form-control" />

                                                    <div>
                                                        {selectedData?.filePreview ? (
                                                            <>
                                                                {selectedData?.filePreview && (
                                                                    <img className='w-25' src={selectedData?.filePreview} alt='Slide Preview img' />
                                                                )}
                                                            </>

                                                        ) : (
                                                            <>
                                                                {selectedData?.file_path && (
                                                                    <img className='w-25' src={selectedData?.file_path && (DOC_CONTAINER + selectedData?.file_path + DOC_TOKEN)} alt='Slider img' />
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                    {errors.file_path && touched.file_path ? (
                                                        <div className="text-danger">{errors.file_path}</div>
                                                    ) : null}
                                                </div>

                                                <div className="col-md-12 mt-5 mb-3 text-right">
                                                    <button className="btn btn-default mr-3" type="button" onClick={() => { setShow(false); setSelectedData(initSl); }}>Cancel</button>
                                                    <button className="btn btn-primary" type="submit" >Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </Modal.Body>
                            </Form>
                        </>
                    )}
                </Formik>

            </Modal >
        </>
    )
}
