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
}) {
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
      <Modal.Header>
        <Modal.Title>{action}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row">
            <div className="col-md-12 mx-auto">
              <div className="row mt-4">
                <div className="col-md-12 mb-3">
                  <label className="required">
                    <b>Name</b>
                  </label>
                  <p>{selectedData?.name}</p>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="required">
                    <b>Base Unit</b>
                  </label>
                  <p>{selectedData?.base_unit}</p>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="required">
                    <b>SKU</b>
                  </label>
                  <p>{selectedData?.sku}</p>
                </div>

                <div className="col-md-12 mb-3">
                  <label className="required">
                    <b>Standard Cost</b>
                  </label>
                  <p>{selectedData?.standard_cost}</p>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="required">
                    <b>Description</b>
                  </label>
                  <p>{selectedData?.description}</p>
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
