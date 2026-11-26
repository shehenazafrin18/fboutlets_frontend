import { Field, Formik, Form } from "formik";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import * as hractions from "../_redux/hrActions";
import { useDispatch, useSelector } from "react-redux";

export default function AddPurchase({
  show,
  setShow,
  selectedData,
  setSelectedData,
  initSl,
  action,
  purchaseId,
  setPurchaseId,
  setAction,
}) {
  const dispatch = useDispatch();

  const { outletList, supplierList, inventoryItemList, user } = useSelector(
    (state) => ({
      outletList: state.hr.outletList,
      supplierList: state.hr.supplierList,
      inventoryItemList: state.hr.inventoryItemList,
      user: state.auth.user,
    }),
  );

  useEffect(() => {
    dispatch(hractions.getOutletList());
    dispatch(hractions.getInventoryItemList());
    dispatch(hractions.getSupplierList());
  }, [dispatch, user]);

  const ValidationSchema = Yup.object().shape({
    outlet_id: Yup.string().required("Select outlet"),
    supplier_id: Yup.string().required("Select supplier"),
    purchase_date: Yup.string().required("Purchase date is required"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          inventory_item_id: Yup.string().required("Select item"),
          quantity: Yup.number()
            .positive("Quantity must be greater than 0")
            .required("Required"),
          unit_price: Yup.number().min(0, "Invalid price").required("Required"),
          discount: Yup.number().min(0).default(0),
          tax: Yup.number().min(0).default(0),
        }),
      )
      .min(1, "Add at least one item"),
  });

  const calculateItemTotal = (item) => {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.unit_price || 0);
    const discount = Number(item.discount || 0);
    const tax = Number(item.tax || 0);

    return Math.max(0, quantity * unitPrice - discount + tax);
  };

  const calculateTotal = (items = []) => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      outlet_id: Number(values.outlet_id),
      supplier_id: Number(values.supplier_id),
      total_amount: calculateTotal(values.items),
      items: values.items.map((item) => ({
        inventory_item_id: Number(item.inventory_item_id),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        discount: Number(item.discount || 0),
        tax: Number(item.tax || 0),
        total_price: calculateItemTotal(item),
      })),
    };

    if (purchaseId) {
      await dispatch(hractions.updatePurchase(payload, purchaseId));
    } else {
      await dispatch(hractions.savePurchase(payload));
    }

    await dispatch(hractions.getPurchaseList());

    setShow(false);
    setSelectedData(initSl);
    setPurchaseId(0);
    setAction("Add Purchase");
  };

  return (
    <Modal
      show={show}
      size="xl"
      centered
      onHide={() => {
        setShow(false);
        setSelectedData(initSl);
        setPurchaseId(0);
        setAction("Add Purchase");
      }}
    >
      <Formik
        enableReinitialize
        initialValues={{
          ...initSl,
          ...selectedData,
          items: selectedData?.items?.length
            ? selectedData.items
            : [
                {
                  inventory_item_id: "",
                  quantity: 1,
                  unit_price: 0,
                  discount: 0,
                  tax: 0,
                },
              ],
        }}
        validationSchema={ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form>
            <Modal.Header>
              <Modal.Title>
                <h2>{action}</h2>
              </Modal.Title>

              <button
                type="button"
                onClick={() => {
                  setShow(false);
                  setPurchaseId(0);
                  setAction("Add Purchase");
                }}
              >
                <i
                  className="fas fa-times text-danger"
                  style={{ fontSize: "26px" }}
                ></i>
              </button>
            </Modal.Header>

            <Modal.Body>
              <div className="row mt-3">
                {/* Supplier */}
                <div className="col-md-6 mb-3">
                  <label className="required">
                    <b>Supplier</b>
                  </label>

                  <Field
                    as="select"
                    name="supplier_id"
                    className="form-control"
                  >
                    <option value="">Select Supplier</option>
                    {supplierList?.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </Field>

                  {errors.supplier_id && touched.supplier_id && (
                    <div className="text-danger">{errors.supplier_id}</div>
                  )}
                </div>

                {/* Outlet */}
                <div className="col-md-6 mb-3">
                  <label className="required">
                    <b>Outlet</b>
                  </label>

                  <Field as="select" name="outlet_id" className="form-control">
                    <option value="">Select Outlet</option>
                    {outletList?.map((outlet) => (
                      <option key={outlet.id} value={outlet.id}>
                        {outlet.name}
                      </option>
                    ))}
                  </Field>

                  {errors.outlet_id && touched.outlet_id && (
                    <div className="text-danger">{errors.outlet_id}</div>
                  )}
                </div>

                {/* Purchase Number */}
                <div className="col-md-6 mb-3">
                  <label>
                    <b>Purchase Number</b>
                  </label>

                  <Field
                    name="purchase_number"
                    className="form-control"
                    placeholder="Enter purchase number"
                  />
                </div>

                {/* Purchase Date */}
                <div className="col-md-6 mb-3">
                  <label className="required">
                    <b>Purchase Date</b>
                  </label>

                  <Field
                    name="purchase_date"
                    type="date"
                    className="form-control"
                  />

                  {errors.purchase_date && touched.purchase_date && (
                    <div className="text-danger">{errors.purchase_date}</div>
                  )}
                </div>
              </div>

              <hr />

              {/* Purchase Items */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Purchase Items</h5>

                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  disabled={values.items.length >= inventoryItemList?.length}
                  onClick={() => {
                    if (values.items.length < inventoryItemList?.length) {
                      setFieldValue("items", [
                        ...values.items,
                        {
                          inventory_item_id: "",
                          quantity: 1,
                          unit_price: 0,
                          discount: 0,
                          tax: 0,
                        },
                      ]);
                    }
                  }}
                >
                  <i className="fas fa-plus mr-1"></i>
                  Add Item
                </button>
              </div>

              {values.items.map((item, index) => (
                <div className="row border rounded p-3 mb-3" key={index}>
                  <div className="col-md-3 mb-2">
                    <label>
                      <b>Inventory Item</b>
                    </label>

                    <Field
                      as="select"
                      name={`items.${index}.inventory_item_id`}
                      className="form-control"
                    >
                      <option value="">Select Item</option>

                      {inventoryItemList?.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name}
                        </option>
                      ))}
                    </Field>

                    {errors.items?.[index]?.inventory_item_id &&
                      touched.items?.[index]?.inventory_item_id && (
                        <div className="text-danger">
                          {errors.items[index].inventory_item_id}
                        </div>
                      )}
                  </div>

                  <div className="col-md-2 mb-2">
                    <label>
                      <b>Quantity</b>
                    </label>

                    <Field
                      type="number"
                      step="0.001"
                      name={`items.${index}.quantity`}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-2 mb-2">
                    <label>
                      <b>Unit Price</b>
                    </label>

                    <Field
                      type="number"
                      step="0.01"
                      name={`items.${index}.unit_price`}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-2 mb-2">
                    <label>
                      <b>Discount</b>
                    </label>

                    <Field
                      type="number"
                      step="0.01"
                      name={`items.${index}.discount`}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-2 mb-2">
                    <label>
                      <b>Tax</b>
                    </label>

                    <Field
                      type="number"
                      step="0.01"
                      name={`items.${index}.tax`}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-1 mb-2 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={values.items.length === 1}
                      onClick={() => {
                        setFieldValue(
                          "items",
                          values.items.filter((_, i) => i !== index),
                        );
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>

                  <div className="col-md-12 text-right">
                    <b>Item Total: {calculateItemTotal(item).toFixed(2)}</b>
                  </div>
                </div>
              ))}

              {typeof errors.items === "string" && (
                <div className="text-danger">{errors.items}</div>
              )}

              <div className="text-right mt-4">
                <h4>Grand Total: {calculateTotal(values.items).toFixed(2)}</h4>
              </div>

              <hr />

              <div className="text-right mt-4">
                <button
                  type="button"
                  className="btn btn-default mr-3"
                  onClick={() => {
                    setShow(false);
                    setSelectedData(initSl);
                    setPurchaseId(0);
                    setAction("Add Purchase");
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </Modal.Body>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
