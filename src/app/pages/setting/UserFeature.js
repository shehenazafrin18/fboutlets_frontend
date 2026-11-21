import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import Axios from "axios";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { Select } from "antd";

const { Option } = Select;

export default function UserFeature() {
  // const [typeId , setTypeId] = useState();
  const [userRole, setUserRole] = useState([]);
  const [userModule, setUserModule] = useState([]);
  const [userFeature, setUserFeature] = useState([]);
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [system_feature_id, setSystem_feature_id] = useState([]);

  const {
    user: { accessToken, refreshToken, data: authData },
  } = useSelector((state) => state.auth);

  const fetchUserRole = async () => {
    await Axios.post(
      `${process.env.REACT_APP_API_URL}/user-role/list`,
      {},
      {
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${accessToken}`,

          refreshToken: refreshToken,
        },
        where: {
          user_type_id: "",
        },
      }
    ).then((res) => {
      if (res.data.error) {
        console.log("Error or empty data");
        setUserRole([]);
      } else {
        setUserRole(res.data.data.data);
        setId1(res.data.data.data[0].id);
      }
    });
  };

  function handleRoleChange(evt) {
    setId1(evt.target.value);
  }

  // post api for sestem feature list
  const handleModuleChange = (e) => {
    const value = e.target.value;

    Axios.post(
      `${process.env.REACT_APP_API_URL}/system-feature/list`,
      { where: { system_module_id: value } },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
        where: {
          system_module_id: "",
        },
      }
    ).then((res) => {
      if (res.data.error) {
        console.log("Error or empty data");
        setUserFeature([]);
      } else {
        setUserFeature(res.data.data.data);
        setId2(res.data.data.data[0].id);
      }
    });
  };

  // const requiredUserRoleFields = ["id", "user_role_id", "system_feature_id"];
  const handleSubmit = async (e) => {
    e.preventDefault();
    const featuresId = system_feature_id.map((value) => ({
      system_feature_id: value,
    }));
    const userrolefeature = {
      user_role_id: id1,
      system_feature_id: featuresId,
    };

    try {
      const { data } = await Axios.post(
        `${process.env.REACT_APP_API_URL}/user-role-feature`,
        userrolefeature,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            refreshToken: refreshToken,
          },
        }
      );

      if (!data.error) {
        swal({
          title: "Done!",
          text: "New User Feature By Role Added Successfully",
          icon: "success",
          timer: 2000,
          button: false,
        });
      }
    } catch (error) {
      swal({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        timer: 2000,
        button: false,
      });
      console.log("Error Res: ", error.response);
    }
  };

  // system module list
  const fetchUserModule = async () => {
    Axios.post(
      `${process.env.REACT_APP_API_URL}/system-feature/moduleList`,
      { where: { id: "" } },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
        where: {
          name: "",
        },
      }
    ).then((res) => {
      if (res.data.error) {
        console.log("Error or empty data");
        setUserModule([]);
      } else {
        setUserModule(res.data.data.data);
      }
    });
  };

  useEffect(() => {
    fetchUserRole();
    fetchUserModule();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
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
                Role Feature Access
              </h3>
            </div>
            <div className="card-header">
              <div className="card-body">
                <Form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>User Role Select</Form.Label>
                        <Form.Control
                          as="select"
                          name="name"
                          onChange={(e) => handleRoleChange(e)}
                          className="form-control form-control-solid"
                        >
                          {userRole.length > 0 &&
                            userRole.map((data) => (
                              <option key={data.id} value={data.id}>
                                {data.name}
                              </option>
                            ))}
                          {userRole.length < 1 && (
                            <option>NO Data Found </option>
                          )}
                        </Form.Control>
                      </Form.Group>
                    </div>
                    <div className="col-md-4 mb-4">
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Select System Module</Form.Label>
                        <Form.Control
                          as="select"
                          name="name"
                          className="form-control form-control-solid"
                          onChange={(e) => handleModuleChange(e)}
                        >
                          <option>Select Module </option>
                          {userModule.length > 0 &&
                            userModule.map(({ id, name }) => (
                              <option key={id} value={id}>
                                {name}
                              </option>
                            ))}
                          {userModule.length < 1 && (
                            <option>No Data found</option>
                          )}
                        </Form.Control>
                      </Form.Group>
                    </div>
                    <div className="col-md-4 mb-4">
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Select System Features</Form.Label>

                        <Select
                          mode="multiple"
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Please select"
                          onChange={(value) => setSystem_feature_id(value)}
                        >
                          {userFeature.map((item) => (
                            <Option key={item.id} value={item.id}>
                              {item.feature_name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Group>
                    </div>
                  </div>

                  <Form.Group as={Row}>
                    <Col>
                      <Button type="submit">Save</Button>
                    </Col>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
