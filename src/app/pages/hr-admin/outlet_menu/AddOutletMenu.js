import { Field, Formik, Form } from "formik";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import * as hractions from "../_redux/hrActions";
import { useDispatch, useSelector } from "react-redux";

export default function AddOutletMenu({
  show,
  setShow,
  selectedData,
  setSelectedData,
  initSl,
  action,
  OutletMenuId,
  setOutletMenuId,
  setAction,
}) {
  const dispatch = useDispatch();

  const { outletList, menuItemList, user } = useSelector((state) => ({
    outletList: state.hr.outletList,
    menuItemList: state.hr.menuItemList,
    user: state.auth.user,
  }));

  useEffect(() => {
    dispatch(hractions.getOutletList());
    dispatch(hractions.getMenuItemList());
  }, [dispatch, user]);

  const ValidationSchema = Yup.object().shape({
    outlet_id: Yup.string().required("Select outlet"),
    menu_item_id: Yup.string().required("Select menu"),
    selling_price: Yup.number()
      .min(0, "Selling price cannot be negative")
      .required("Selling price is required"),
    is_available: Yup.boolean().required(),
  });

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      outlet_id: Number(values.outlet_id),
      menu_item_id: Number(values.menu_item_id),
      selling_price: Number(values.selling_price).toFixed(2),
    };
    const menu_item_id = Number(values.menu_item_id);
    const outlet_id = Number(values.outlet_id);
    console.log({ outlet_id });
    console.log({ menu_item_id });
    if (OutletMenuId) {
      await dispatch(
        hractions.updateOutletMenu(outlet_id, menu_item_id, payload),
      );
    } else {
      await dispatch(
        hractions.saveOutletMenu(outlet_id, menu_item_id, payload),
      );
    }

    await dispatch(hractions.getMenuItemList());

    setShow(false);
    setSelectedData(initSl);
    setOutletMenuId(0);
    setAction("Add Outlet Menu");
  };

  return (
    <Modal
      show={show}
      size="lg"
      centered
      onHide={() => {
        setShow(false);
        setSelectedData(initSl);
        setOutletMenuId(0);
        setAction("Add Outlet Menu");
      }}
    >
      <Formik
        enableReinitialize
        initialValues={{
          ...initSl,
          ...selectedData,
        }}
        validationSchema={ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Modal.Header>
              <Modal.Title>
                <h2>{action}</h2>
              </Modal.Title>

              <button
                type="button"
                onClick={() => {
                  setShow(false);
                  setSelectedData(initSl);
                  setOutletMenuId(0);
                  setAction("Add Outlet Menu");
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
                <div className="col-md-6 mb-3">
                  <label className="required">
                    <b>Outlet</b>
                  </label>

                  <Field
                    as="select"
                    name="outlet_id"
                    className={`form-control ${
                      errors.outlet_id && touched.outlet_id ? "is-invalid" : ""
                    }`}
                  >
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

                <div className="col-md-6 mb-3">
                  <label className="required">
                    <b>Menu Item</b>
                  </label>

                  <Field
                    as="select"
                    name="menu_item_id"
                    className={`form-control ${
                      errors.menu_item_id && touched.menu_item_id
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option value="">Select Menu</option>

                    {menuItemList?.map((menu) => (
                      <option key={menu.id} value={menu.id}>
                        {menu.name}
                      </option>
                    ))}
                  </Field>

                  {errors.menu_item_id && touched.menu_item_id && (
                    <div className="text-danger">{errors.menu_item_id}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="required">
                    <b>Selling Price</b>
                  </label>

                  <Field
                    name="selling_price"
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${
                      errors.selling_price && touched.selling_price
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter selling price"
                  />

                  {errors.selling_price && touched.selling_price && (
                    <div className="text-danger">{errors.selling_price}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label>
                    <b>Availability</b>
                  </label>

                  <Field
                    as="select"
                    name="is_available"
                    className="form-control"
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </Field>
                </div>

                <div className="col-md-12 mt-5 mb-3 text-right">
                  <button
                    type="button"
                    className="btn btn-default mr-3"
                    onClick={() => {
                      setShow(false);
                      setSelectedData(initSl);
                      setOutletMenuId(0);
                      setAction("Add Outlet Menu");
                    }}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
