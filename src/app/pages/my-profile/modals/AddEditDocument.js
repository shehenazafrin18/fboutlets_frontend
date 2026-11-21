import React from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, Formik } from 'formik';
import API from "../../../helpers/devApi"
import { swalError, swalSuccess } from "../../../helpers/swal";
import * as Yup from 'yup';
import * as Action from "../_redux/recruitementActions";
import { useDispatch } from "react-redux";
import { useDropzone } from 'react-dropzone';


const AddEditDocument = ({ show, setShow, selectedData, setSelectedData, editId, docInit }) => {
    const dispatch = useDispatch();
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const file_type = getFileType(file.type);
        if (file.size > 5 * 1024 * 1024) {
            swalError("File size exceeds 5MB. Please choose a smaller file.", "");
            return;
        }
        setSelectedData({
            ...selectedData,
            file,
            preview: URL.createObjectURL(file),
            file_type
        });
    };

    // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*, video/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    const getFileType = (file_type) => {
        if (file_type.startsWith('image')) {
            return 'image';
        } else if (file_type.startsWith('video')) {
            return 'video';
        } else {
            return 'document';
        }
    };



    const handleCancel = () => {
        setSelectedData({
            ...selectedData,
            file: null,
            preview: null
        });
    };
    const FormSchema = Yup.object().shape({
        name: Yup.string()
            .required('Required'),
        file: editId === 0 && Yup.mixed()
            .required('Required'),
    })

    const handleSubmit = async (values) => {
        // alert(JSON.stringify(selectedData, null, 2));
        // return false;

        var formdata = new FormData();
        formdata.append("applicant_id", docInit?.applicant_id);
        formdata.append("document", selectedData?.file);
        formdata.append("file_type", selectedData?.file_type);
        formdata.append("name", values['name']);

        if (editId == 0) {
            await API.post(`/hrms_applicant_documents`, formdata)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data saved successfully');
                        dispatch(Action.insertProfileScore(["Document"]));
                        setSelectedData(docInit);
                        setShow(false);
                    } else {
                        swalError(res?.data?.message, " ");
                    }
                })
                .catch((error) => {
                    console.log({ error })
                    swalError("someting went wrong");
                });
        } else {
            await API.patch(`/hrms_applicant_documents/${editId}`, formdata)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('Data updated successfully');
                        dispatch(Action.insertProfileScore(["Document"]));
                        setSelectedData(docInit);
                        setShow(false);
                    } else {
                        swalError(res?.data?.message, " ");
                    }
                })
                .catch((error) => {
                    swalError("someting went wrong");
                });
        }
        dispatch(Action.getDocumentsInfoByApplicants(docInit?.applicant_id));

    }





    return (
        <Modal
            show={show}
            size="lg"
            centered
            onHide={() => {
                setShow(false);
                setSelectedData(docInit)
            }}
        >
            <Formik
                initialValues={selectedData}
                validationSchema={FormSchema}
                onSubmit={values => handleSubmit(values)}
                enableReinitialize
            >
                {({ errors, touched }) => (
                    <>
                        <Form>
                            <Modal.Header>
                                <Modal.Title className='cover_letter_modal_view'>
                                    <h2>{editId > 0 ? "Edit" : "Add"} Documents</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShow(false);
                                            setSelectedData(docInit)
                                        }}
                                    >
                                        <i className="fas fa-times text-danger" style={{ fontSize: '26px' }}></i>
                                    </button>
                                </Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-12 mb-4">
                                        <label className="required"><b>Name</b></label>
                                        <Field name="name" type="text" className="form-control"
                                            onChange={(e) => {
                                                setSelectedData({
                                                    ...selectedData,
                                                    name: e.target.value
                                                })
                                            }} />
                                        {errors.name && touched.name ? (
                                            <div className="text-danger">{errors.name}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-12 mb-4">
                                        {/* <label className="required"><b>Documents</b></label>
                                            {
                                                filePath &&
                                                <>
                                                    <span>&nbsp;<a target="_blank" title="Download" href={filePath}><i className='fas fa-link'></i></a></span>
                                                </>
                                            } */}

                                        {/* <input name="document" type="file" onChange={(e) => {
                                                setSelectedData({
                                                    ...selectedData,
                                                    "document": e.currentTarget.files[0]
                                                });
                                            }} className="form-control" />
                                            */}
                                        <label className="required"><b>Files</b></label>
                                        {selectedData.file && (
                                            <button onClick={handleCancel} style={{ float: 'right', border: '1px solid red', color: 'red' }}>
                                                <i className="fa fa-times" aria-hidden="true" style={{ color: 'red' }}></i>
                                            </button>
                                        )}
                                        <div {...getRootProps()} className="dropzone" style={{ width: '100%', minHeight: '200px', border: '2px dashed #cccccc', padding: '20px', borderRadius: '5px', textAlign: 'center' }}>
                                            <input name="document" {...getInputProps()} />
                                            {selectedData.preview && (
                                                <div>

                                                    {selectedData.file.type.startsWith('image/') && (
                                                        <img src={selectedData.preview} alt="Preview" style={{ width: '100%', height: 'auto' }} />
                                                    )}
                                                    {selectedData.file.type.startsWith('video/') && (
                                                        <video controls style={{ width: '100%' }}>
                                                            <source src={selectedData.preview} type={selectedData.file.type} />
                                                        </video>
                                                    )}
                                                    {selectedData.file.type.startsWith('application/pdf') && (
                                                        <iframe title="Preview" src={selectedData.preview} style={{ width: '100%', height: '500px', pointerEvents: 'none' }} />
                                                    )}
                                                    {(selectedData.file.type.startsWith('application/msword') || selectedData.file.type.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) && (
                                                        <p className="text-dark">This is a Word document preview. You have to save form to show file !!</p>
                                                    )}
                                                </div>
                                            )}

                                            {!selectedData.file && (
                                                <>
                                                    {selectedData.file_type === "image" && (
                                                        <img src={selectedData.document_url} alt="Preview" style={{ width: '100%', height: 'auto' }} />
                                                    )}
                                                    {selectedData.file_type === "video" && (
                                                        <video controls style={{ width: '100%' }}>
                                                            <source src={selectedData.document_url} type="video/mp4" />
                                                        </video>
                                                    )}

                                                    {(selectedData.file_type === 'pdf' || selectedData.file_type === 'document') && (
                                                        <iframe title="Preview" src={selectedData.document_url} style={{ width: '100%', height: '500px', pointerEvents: 'none' }} />
                                                    )}
                                                    {/* {selectedData.file_type.startsWith('application/msword') && (
                                                        <p>This is a Word document preview.</p>
                                                    )} */}
                                                </>
                                            )}
                                            {!selectedData.preview && (
                                                isDragActive ?
                                                    <p>Drop the files here ...</p> :
                                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                            )}
                                        </div>
                                        {/* <ErrorMessage name="document" render={msg => <div className="text-danger">{msg}</div>} /> */}
                                        {errors.document && touched.document ? (
                                            <div className="text-danger">{errors.document}</div>
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
                                        setSelectedData(docInit)
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
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

export default AddEditDocument;
