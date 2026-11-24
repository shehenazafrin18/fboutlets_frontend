import { Field, Formik, Form } from "formik";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import * as hractions from "../_redux/hrActions";
import { useDispatch, useSelector } from "react-redux";

export default function AddInventories({
  show,
  setShow,
  selectedData,
  setSelectedData,
  initSl,
  action,
  inventoryId,
  setInventoryId,
  setAction,
}) {
  const dispatch = useDispatch();

  const { outletList, user, inventoryItemList } = useSelector((state) => ({
    outletList: state.hr.outletList,
    inventoryItemList: state.hr.inventoryItemList,
    user: state.auth.user,
  }));

  useEffect(() => {
    dispatch(hractions.getInventoryItemList());
    dispatch(hractions.getOutletList());
  }, [dispatch, user]);

  console.log({ inventoryItemList });
  console.log({ outletList });

  const ValidationSchema = Yup.object().shape({
    outlet_id: Yup.string().required("Required"),
    inventory_item_id: Yup.string().required("Required"),
    quantity: Yup.number().required("Required"),
    // reorder_level: Yup.number().required("Required"),
    unit: Yup.string().required("Required"),
  });

  const handleSubmit = async (values) => {
    console.log({ values });
    console.log({ selectedData });
    if (inventoryId) {
      await dispatch(hractions.updateInventories(values, inventoryId));
    } else {
      await dispatch(hractions.saveInventories(values));
    }
    dispatch(hractions.getInventories());
    setShow(false);
    setSelectedData(initSl);
    setInventoryId(0);
    setAction("Add Inventory");
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
          setInventoryId(0);
          setAction("Add Inventory");
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
                        setInventoryId(0);
                        setAction("Add Inventory");
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
                            <b>Outlet</b>
                          </label>

                          <Field
                            as="select"
                            name="outlet_id"
                            className={`form-control ${
                              errors.outlet_id && touched.outlet_id
                                ? "is-invalid"
                                : ""
                            }`}
                          >
                            <option value="">Select Outlet</option>

                            {outletList?.map((outlet) => (
                              <option key={outlet.id} value={outlet.id}>
                                {outlet.name}
                              </option>
                            ))}
                          </Field>

                          {errors.outlet_id && touched.outlet_id ? (
                            <div className="text-danger">
                              {errors.outlet_id}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="required">
                            <b>Inventory Item</b>
                          </label>

                          <Field
                            name="inventory_item_id"
                            as="select"
                            className={`form-control ${
                              errors.inventory_item_id &&
                              touched.inventory_item_id
                                ? "is-invalid"
                                : ""
                            }`}
                          >
                            <option value="">Select Inventory Item</option>

                            {inventoryItemList?.map((inventoryItem) => (
                              <option
                                key={inventoryItem.id}
                                value={inventoryItem.id}
                              >
                                {inventoryItem.name}
                              </option>
                            ))}
                          </Field>

                          {errors.inventory_item_id &&
                            touched.inventory_item_id && (
                              <div className="text-danger">
                                {errors.inventory_item_id}
                              </div>
                            )}
                        </div>
                        {/* 'outlet_id': item?.outlet_id,
            'inventory_item_id': item?.inventory_item_id,
            'quantity': item?.quantity,
            'reserved_quantity': item?.reserved_quantity,
            'reorder_level': item?.reorder_level,
            'unit': item?.unit, */}
                        <div className="col-md-6 mb-3">
                          <label className="required">
                            <b>Unit</b>
                          </label>
                          <Field
                            name="unit"
                            type="text"
                            className={`form-control ${
                              errors.unit && touched.unit ? "is-invalid" : ""
                            }`}
                          />
                          {errors.unit && touched.unit ? (
                            <div className="text-danger">{errors.unit}</div>
                          ) : null}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="required">
                            <b>Quantity</b>
                          </label>
                          <Field
                            name="quantity"
                            type="number"
                            className={`form-control`}
                            placeholder="Enter Number Only"
                          />
                          {errors.quantity && touched.quantity ? (
                            <div className="text-danger">{errors.quantity}</div>
                          ) : null}
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="">
                            <b>Reserver Quantity</b>
                          </label>
                          <Field
                            name="reserved_quantity"
                            type="number"
                            className={`form-control`}
                            placeholder="Enter Number Only"
                          />
                          {errors.reserved_quantity &&
                          touched.reserved_quantity ? (
                            <div className="text-danger">
                              {errors.reserved_quantity}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="">
                            <b>Reorder Level</b>
                          </label>
                          <Field
                            name="reorder_level"
                            type="number"
                            className={`form-control`}
                            placeholder="Enter Number Only"
                          />
                          {errors.reorder_level && touched.reorder_level ? (
                            <div className="text-danger">
                              {errors.reorder_level}
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
                              setInventoryId(0);
                              setAction("Add Inventory");
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
