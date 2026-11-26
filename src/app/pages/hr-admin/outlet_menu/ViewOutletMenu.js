import { Form, Modal } from "react-bootstrap";

export default function ViewOutletMenu({
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
          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <b>Outlet</b>: {selectedData?.outlet_name || "-"}
            </div>

            <div className="col-md-6 mb-3">
              <b>Menu</b>: {selectedData?.menu_name || "-"}
            </div>

            <div className="col-md-6 mb-3">
              <b>Selling Price</b>: {selectedData?.selling_price || 0}
            </div>

            <div className="col-md-6 mb-3">
              <b>Availability</b>:{" "}
              {selectedData?.is_available ? "Available" : "Unavailable"}
            </div>

            <div className="col-md-12 mt-4 text-right">
              <button
                className="btn btn-default"
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
