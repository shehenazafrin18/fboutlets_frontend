import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import Axios from "axios";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import UsersRole from "../users/UsersRole";

export default function UserRole() {
  // post api for user role

  const [state, setState] = useState({
    user_type_id: "",
    name: "",
    remark: "",
    company_id: "",
  });
  const [newRoleAdded, setNewRoleAdded] = useState(false);

  const {
    user: { accessToken, refreshToken, data },
  } = useSelector((state) => state.auth);

  function handleChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const userrole = {
      //user_type_id: state.user_type_id,
      name: state.name,
      remark: state.remark,
      //company_id: data.companyId,
    };

    Axios.post(`${process.env.REACT_APP_API_URL}/user-role`, userrole, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        refreshToken: refreshToken,
      },
    })
      .then((res) => {
        if (res) {
          swal({
            title: "Done!",
            text: "New User Role Added Successfully",
            icon: "success",
            timer: 2000,
            button: false,
          });
          setNewRoleAdded(true);
        }
      })
      .catch((err) => console.log("error:", err));
    setState({ name: "", remark: "" });
  }

  // post api for user type list

  const requiredFields = ["id", "type"];

  return (
    <>
      <div className="row">
        <div className="col-md-5">
          <div className="card card-custom gutter-b example example-compact">
            <div className="card-title">
              <h3
                className="card-label"
                style={{
                  marginTop: "1.5rem",
                  marginBottom: "-1rem",
                  marginLeft: "60px",
                }}
              >
                User Role Form
              </h3>
            </div>
            <div className="card-header">
              <div className="card-body">
                <Form onSubmit={handleSubmit}>
                  <fieldset>
                    <Form.Group controlId="formHorizontalEmail">
                      <Form.Label>Role Name</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Role Name"
                        name="name"
                        value={state.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </fieldset>

                  <fieldset>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="3"
                        name="remark"
                        value={state.remark}
                        placeholder="write remarks"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </fieldset>

                  <Form.Group as={Row}>
                    <Col>
                      <Button type="submit">Submit</Button>
                    </Col>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <UsersRole newRoleAdded={newRoleAdded} setNewRoleAdded={setNewRoleAdded}/>
        </div>
      </div>
    </>
  );
}
