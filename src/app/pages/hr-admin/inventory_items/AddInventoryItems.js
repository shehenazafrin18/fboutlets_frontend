import { Field, Formik, Form } from "formik";
import React from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import * as hractions from "../_redux/hrActions";
import { useDispatch } from "react-redux";

export default function AddInventoryItems({
  show,
  setShow,
  selectedData,
  setSelectedData,
  initSl,
  action,
  inventoryItemsId,
  setInventoryItemsId,
  setAction,
}) {
  const dispatch = useDispatch();

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    base_unit: Yup.string().required("Required"),
    // sku: Yup.string().required("Required"),
    // description: Yup.string().required("Required"),
  });

  const handleSubmit = async (values) => {
    console.log({ values });
    console.log({ selectedData });
    if (inventoryItemsId) {
      await dispatch(hractions.updateInventoryItem(values, inventoryItemsId));
    } else {
      await dispatch(hractions.saveInventoryItem(values));
    }
    dispatch(hractions.getInventoryItemList());
    setShow(false);
    setSelectedData(initSl);
    setInventoryItemsId(0);
    setAction("Add Inventory Item");
  };

  return (
    <>
      <Modal
        show={show}
        size="lg"
        centered
        onHide={() => {
          setShow(false);
          setSelectedData(initSl);
          setInventoryItemsId(0);
          setAction("Add Inventory Item");
        }}
      >
        <Formik
          initialValues={selectedData}
          validationSchema={ValidationSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <>
              <Form>
                <Modal.Header>
                  <Modal.Title className="cover_letter_modal_view">
                    <h2>{action}</h2>
                    <button
                      type="button"
                      onClick={() => {
                        setShow(false);
                        setInventoryItemsId(0);
                        setAction("Add Inventory Item");
                      }}
                    >
                      <i
                        className="fas fa-times text-danger"
                        style={{ fontSize: "26px" }}
                      ></i>
                    </button>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="row mt-4">
                        <div className="col-md-6 mb-3">
                          <label className="required">
                            <b>Name</b>
                          </label>
                          <Field
                            name="name"
                            type="text"
                            className={`form-control`}
                          />
                          {errors.name && touched.name ? (
                            <div className="text-danger">{errors.name}</div>
                          ) : null}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="required">
                            <b>Base Unit</b>
                          </label>
                          <Field
                            name="base_unit"
                            type="text"
                            className={`form-control`}
                          />
                          {errors.base_unit && touched.base_unit ? (
                            <div className="text-danger">
                              {errors.base_unit}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="">
                            <b>SKU</b>
                          </label>
                          <Field
                            name="sku"
                            type="text"
                            className={`form-control`}
                          />
                          {errors.sku && touched.sku ? (
                            <div className="text-danger">{errors.sku}</div>
                          ) : null}
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="">
                            <b>Standard Cost</b>
                          </label>
                          <Field
                            name="standard_cost"
                            type="number"
                            className={`form-control`}
                          />
                          {errors.standard_cost && touched.standard_cost ? (
                            <div className="text-danger">
                              {errors.standard_cost}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-md-12 mb-3">
                          <label className="">
                            <b>Description</b>
                          </label>
                          <Field
                            name="description"
                            as="textarea"
                            rows={6}
                            className={`form-control description-textarea${
                              errors.description && touched.description
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {errors.description && touched.description ? (
                            <div className="text-danger">
                              {errors.description}
                            </div>
                          ) : null}
                        </div>

                        <div className="col-md-12 mt-5 mb-3 text-right">
                          <button
                            className="btn btn-default mr-3"
                            type="button"
                            onClick={() => {
                              setShow(false);
                              setSelectedData(initSl);
                              setInventoryItemsId(0);
                              setAction("Add Inventory Item");
                            }}
                          >
                            Cancel
                          </button>
                          <button className="btn btn-primary" type="submit">
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Form>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
}
