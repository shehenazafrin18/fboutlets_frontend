import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import Axios from "axios";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { Select } from "antd";

export default function UserFeatureModuleByRole() {
  const [state, setState] = useState();
  // const [typeId , setTypeId] = useState();
  const [userRole, setUserRole] = useState([]);
  const [userModule, setUserModule] = useState([]);
  const [userFeature, setUserFeature] = useState([]);
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState([]);
   
console.log(id2);
  const { Option } = Select;

  const {
    user: { accessToken, refreshToken, data: authData },
  } = useSelector((state) => state.auth);

  function handleChange(evt) {
    const value = evt.target.value;
    setId1(value); // id 1
    setState({
      ...state,
      [evt.target.name]: value,
    });
  }

  // post api for user type list

  const [userType, setUserType] = useState([]);

  const requiredFields = ["id", "type"];

  const fetchUser = async () => {
    const { data } = await Axios.post(
      `${process.env.REACT_APP_API_URL}/user-type/list`,
      { requiredFields: requiredFields },
      {
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${accessToken}`,

          refreshToken: refreshToken,
        },
      }
    );

    if (!data.error) {
      setUserType(data.data.data);
    }
  };
  const roleRequiredFields = ["id", "name"];
  const fetchUserRole = async () => {
    try {
      const { data } = await Axios.post(
        `${process.env.REACT_APP_API_URL}/user-role/list`,
        { requiredFields: roleRequiredFields },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            refreshToken: refreshToken,
          },
        }
      );

      if (data) {
        setUserRole(data.data.data);
        console.log(data.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // post api for user role list

  const handleTypeSelect = (e) => {
    let value = e.target.value;
    setId1(value);
    Axios.post(
      `${process.env.REACT_APP_API_URL}/user-role/list`,
      { where: { user_type_id: value } },
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
      `${process.env.REACT_APP_API_URL}/user-role-feature/getFeatureListByModuleId`,
      {
        module_id: value
      },
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
      console.log(res);

      if (res.data.error) {
        console.log("Error or empty data");
        setUserFeature([]);
      } else {
        setUserFeature(res.data.data.data);
        setId2(res.data.data.data[0].id);
      }
    });
  };

  // post api for user role feature list

  // const requiredUserRoleFields = ["user_role_id", "system_feature_id"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userFeature.length) {
      const system_feature_id = id2.map((id)=> {
        return (
          {"id":id}
        )
      } )
    
      console.log(system_feature_id,id1);
  
      try {
        const { data } = await Axios.post(
          `${process.env.REACT_APP_API_URL}/user-role-feature/addUserRoleFeature`,
          {
            system_feature_id: system_feature_id,
            user_role_id:id1
  
          },
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
      
    }else{
     // alert("User Feature cant be empty")
       swal({
          title: "Error!",
          text: "User Feature cant be empty",
          icon: "error",
          timer: 2000,
          button: false,
        });
    }
   
  };

  // system module list


  const fetchUserModule = async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_API_URL}/user-role-feature/getSystemModuleList`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
      }
    );
    if (!data.error) {
      setUserModule(data.data.data);
      //console.log(data.data.data);
    } else {
      setUserModule([]);
     // console.log(data.error);
    }
  };
  useEffect(() => {
    fetchUser();
    fetchUserModule();
    fetchUserRole();
  }, []);

  console.log(userModule)

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
                User Feature & Module By Role
              </h3>
            </div>
            <div className="card-header">
              <div className="card-body">
                <Form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12 mb-4">
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Select Module</Form.Label>
                        <Form.Control
                          as="select"
                          name="name"
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
                    <div className="col-md-12 mb-4">
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Select Features</Form.Label>
                      
                          <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            name="user_type_id"
                            onChange={(value) => setId2(value)}
                          >
                          {userFeature.length > 0 &&
                            userFeature.map(({ id, feature_name }) => (
                              <Option key={id} value={id}>
                                {feature_name}
                              </Option>
                            ))}
                          {userFeature.length < 1 && (
                            <option>No Data Found</option>
                          )}
                       </Select>
                      </Form.Group>
                    </div>

                    <div className="col-md-12 mb-4">
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Select Role </Form.Label>
                        <Form.Control
                          as="select"
                          name="name"
                          onChange={(e) => handleRoleChange(e)}
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
