import { ErrorMessage, Field, Formik } from "formik";
import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import * as Yup from "yup";
import Editor from "../../../../_metronic/_partials/controls/Editor";

export default function ViewMenuCategory({
  show,
  setShow,
  selectedData,
  setSelectedData,
  initSl,
  action,
  sliderId,
}) {
  const [tagline, setTagLine] = useState();
  const [subTitile, setSubTitle] = useState("");

  const SignupSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    per_divisions_id: Yup.number().required("Required"),
  });

  const handleTextEditor = (values, name) => {
    if (name === "tag_line") {
      setTagLine(values);
    } else {
      setSubTitle(values);
    }
  };

  const handleSubmit = async (values) => {
    alert(JSON.stringify(values, null, 2));
    // return false;
  };

  const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
  const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

  return (
    <Modal
      show={show}
      size="lg"
      centered
      onHide={() => {
        setShow(false);
        setSelectedData(initSl);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{action}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row">
            <div className="col-md-12 mx-auto">
              <div className="row mt-4">
                <div className="col-md-12 mb-3">
                  <label className="required">
                    <b>Title</b>
                  </label>
                  <p>{selectedData?.title}</p>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="required">
                    <b>Subtitle</b>
                  </label>
                  <p>{selectedData?.sub_title}</p>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="required">
                    <b>Tagline</b>
                  </label>
                  <p>
                    {" "}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedData?.tag_line,
                      }}
                    />
                  </p>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="required">
                    <b>Slider Images</b>
                  </label>
                  <br></br>
                  <img
                    width="250"
                    src={DOC_CONTAINER + selectedData?.file_path + DOC_TOKEN}
                    alt="image"
                    className=" rounded"
                  />
                </div>

                <div className="col-md-12 mt-5 mb-3 text-right">
                  <button
                    className="btn btn-default mr-3"
                    type="button"
                    onClick={() => {
                      setShow(false);
                      setSelectedData(initSl);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
