import React, { useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import swal from "sweetalert";
import Axios from "axios";

function ApproveModal(props) {
  const {
    showApprove,
    setShowApprove,
    selectedData,
    setSelectedData,
    fetchData,
    title,
    accessToken,
    refreshToken,
    url,
  } = props;

  const [loading, setLoading] = useState(false);

  // console.log(selectedData);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const { data } = await Axios.patch(
        `${process.env.REACT_APP_API_URL}/${url}/${selectedData.id}`,
        {
          accept_status:'Accepted',
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            refreshToken: refreshToken,
          },
        }
      );

      if (data.error === false) {
       
        setShowApprove(false);
        setSelectedData(null);
        setLoading(false);

        swal({
          title: data.message,
          icon: "success",
        });

        fetchData();
      }
    } catch (error) {
      swal({
        title: error.message,
        icon: "error",
      });
      setLoading(false);
    }
  };
  return (
    <Modal
      show={showApprove}
      onHide={() => setShowApprove(false)}
      aria-labelledby="example-modal-sizes-title-lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure to approve  ?
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={() => setShowApprove(false)}
            className="btn btn-light btn-elevate mr-3"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={() => handleApprove()}
            className="btn btn-primary "
            disabled={loading}
          >
            Approve
            {loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ApproveModal;
