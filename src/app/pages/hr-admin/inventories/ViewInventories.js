import { Form, Modal } from "react-bootstrap";

export default function ViewInventories({
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
                <div className="col-md-6 mb-3">
                  <label className=" ">
                    <b>Outlet</b>
                  </label>
                  : {selectedData?.outlet_name}
                </div>
                <div className="col-md-6 mb-3">
                  <label className=" ">
                    <b>Inventory Item</b>
                  </label>
                  : {selectedData?.inventory_name}
                </div>

                <div className="col-md-6 mb-3">
                  <label className=" ">
                    <b>Quantity</b>
                  </label>
                  : {selectedData?.quantity}
                </div>
                <div className="col-md-6 mb-3">
                  <label className=" ">
                    <b>Reserved Quantity</b>
                  </label>
                  : {selectedData?.reserved_quantity}
                </div>

                <div className="col-md-6 mb-3">
                  <label className=" ">
                    <b>Reorder Level</b>
                  </label>
                  : {selectedData?.reorder_level}
                </div>
                <div className="col-md-6 mb-3">
                  <label className=" ">
                    <b>Unit</b>
                  </label>
                  : {selectedData?.unit}
                </div>
                <div className="col-md-6 mb-3">
                  <label className=" ">
                    <b>Status</b>
                  </label>
                  : {selectedData?.is_active ? "Yes" : "NO"}
                </div>

                <div className="col-md-6 mt-5 mb-3 text-right">
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
