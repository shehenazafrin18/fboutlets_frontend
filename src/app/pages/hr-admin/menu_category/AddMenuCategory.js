import { Field, Formik, Form } from "formik";
import React from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
// import Editor from '../../../../_metronic/_partials/controls/Editor';
import * as hractions from "../_redux/hrActions";
import { useDispatch } from "react-redux";

export default function AddMenuCategory({
  show,
  setShow,
  selectedData,
  setSelectedData,
  initSl,
  action,
  menuCategoryId,
  setMenuCategoryId,
  setAction,
}) {
  const dispatch = useDispatch();

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
  });

  const handleSubmit = async (values) => {
    if (menuCategoryId) {
      await dispatch(hractions.updateMenuCategory(values, menuCategoryId));
    } else {
      await dispatch(hractions.saveMenuCategory(values));
    }
    dispatch(hractions.getMenuCategoryList());
    setShow(false);
    setSelectedData(initSl);
    setMenuCategoryId(0);
    setAction("Add Menu Category");
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
          setMenuCategoryId(0);
          setAction("Add Menu Category");
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
                        setMenuCategoryId(0);
                        setAction("Add Menu Category");
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
                        <div className="col-md-12 mb-3">
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
                        <div className="col-md-12 mb-3">
                          <label className="required">
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
                              setMenuCategoryId(0);
                              setAction("Add Menu Category");
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
