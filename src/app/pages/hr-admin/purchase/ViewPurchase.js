import { Form, Modal } from "react-bootstrap";

export default function ViewPurchase({
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
      size="xl"
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
            <div className="col-md-6 mb-3">
              <label>
                <b>Purchase Number</b>
              </label>
              : {selectedData?.purchase_number || "-"}
            </div>

            <div className="col-md-6 mb-3">
              <label>
                <b>Purchase Date</b>
              </label>
              :{" "}
              {selectedData?.purchase_date
                ? new Date(selectedData.purchase_date).toLocaleDateString()
                : "-"}
            </div>

            <div className="col-md-6 mb-3">
              <label>
                <b>Supplier</b>
              </label>
              : {selectedData?.supplier_name || "-"}
            </div>

            <div className="col-md-6 mb-3">
              <label>
                <b>Outlet</b>
              </label>
              : {selectedData?.outlet_name || "-"}
            </div>

            <div className="col-md-6 mb-3">
              <label>
                <b>Status</b>
              </label>
              : {selectedData?.status || "-"}
            </div>

            <div className="col-md-6 mb-3">
              <label>
                <b>Total Amount</b>
              </label>
              : {Number(selectedData?.total_amount || 0).toFixed(2)}
            </div>

            <div className="col-md-12 mt-3">
              <h5>Purchase Items</h5>

              <div className="table-responsive">
                <table className="hr_admin_table table table-centered mb-0">
                  <thead>
                    <tr className="hr_admin_table_tr">
                      <th>SL</th>
                      <th>Inventory Item</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Discount</th>
                      <th>Tax</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedData?.items?.length > 0 ? (
                      selectedData.items.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.inventory_name || "-"}</td>
                          <td>{item?.quantity}</td>
                          <td>{item?.unit_price}</td>
                          <td>{item?.discount || 0}</td>
                          <td>{item?.tax || 0}</td>
                          <td>{Number(item?.total_price || 0).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No purchase items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-12 text-right mt-4">
              <h4>
                Grand Total:{" "}
                {Number(selectedData?.total_amount || 0).toFixed(2)}
              </h4>
            </div>

            <div className="col-md-12 mt-4 mb-3 text-right">
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
        </Form>
      </Modal.Body>
    </Modal>
  );
}
