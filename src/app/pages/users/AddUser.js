import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FileBase64 from "react-file-base64";
import swal from "sweetalert";

function AddUser() {
  const [loading, setLoading] = useState("");
  const [userRole, setUserRole] = useState([]);
  const [stores, setStores] = useState([]);
  const [image, setImage] = useState("");
  const [formData, setFormData] = useState({
    user_type_id: 1,
    user_role_id: "",
    store_id: "",
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [confirm_password, setConfirm_password] = useState("");

  const {
    user: { accessToken, refreshToken },
  } = useSelector((state) => state.auth);

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      ...formData,
      user_role_id: Number(formData.user_role_id),
      store_id: Number(formData.store_id),
      image: image.replace("data:image/png;base64,", ""),
    };

    if (!userData.user_role_id) {
      swal({
        title: "Please select user role",
        icon: "error",
      });
      return false;
    }

    if (!userData.name) {
      swal({
        title: "Please select name",
        icon: "error",
      });
      return false;
    }

    if (!userData.email) {
      swal({
        title: "Please select email",
        icon: "error",
      });
      return false;
    }

    try {
      setLoading(true);
      const { data } = await Axios.post(
        `${process.env.REACT_APP_API_URL}/user`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            refreshToken: refreshToken,
          },
        }
      );
      if (!data.error) {
        setLoading(false);
        setFormData({
          user_type_id: 3,
          user_role_id: "",
          store_id: "",
          name: "",
          phone: "",
          email: "",
          password: "",
        });
        setImage("");
        setConfirm_password("");
        swal({
          title: "User created successfully!",
          icon: "success",
        });
      } else {
        swal({
          title: data?.message?.message,
          icon: "error",
        });
      }
    } catch (error) {
      setLoading(false);
      swal({
        title: error?.response?.data?.message?.message,
        icon: "error",
      });
    }
  };

  // Fetch user role
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStores = async () => {
    try {
      const { data } = await Axios.post(
        `${process.env.REACT_APP_API_URL}/store/list`,
        {
          // where: {
          //   is_warehouse: "1",
          // },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            refreshToken: refreshToken,
          },
        }
      );

      if (data) {
        setStores(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchStores();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="card card-custom gutter-b">
      <div className="card-header">
        <h4 className="card-title">Add a New User</h4>
      </div>
      <div className="card-body">
        <>
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="row">
              <div className="col-md-6 mb-4">
                <label>User Role</label>
                <select
                  name="user_role_id"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.user_role_id}
                >
                  <option>Select Role</option>
                  {userRole &&
                    userRole.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                </select>
              </div>

              {formData.user_role_id === 3 && (
                <div className="col-md-6 mb-4">
                  <label>Select Store</label>
                  <select
                    name="store_id"
                    as="select"
                    className="form-control"
                    onChange={handleChange}
                  >
                    <option>Select Store</option>
                    {stores.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Last Name*/}
              <div className="col-md-6 mb-4">
                <label>Name</label>
                <input
                  name="name"
                  placeholder="Name"
                  label="Name"
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>
              {/* Username */}
              <div className="col-md-6 mb-4">
                <label>Phone</label>
                <input
                  name="phone"
                  placeholder="Phone No"
                  label="Phone"
                  className="form-control"
                  type="text"
                  maxLength={11}
                  minLength={11}
                  onChange={handleChange}
                  value={formData.phone}
                />
              </div>
              {/* email */}
              <div className="col-md-6 mb-4">
                <label>Email</label>
                <input
                  name="email"
                  placeholder="Email"
                  label="Email"
                  className="form-control"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              {/* Password */}
              <div className="col-md-6 mb-4">
                <label>Password</label>
                <input
                  name="password"
                  placeholder="Password"
                  label="Password"
                  className="form-control"
                  type="password"
                  onChange={handleChange}
                  autoComplete={`new-password`}
                  onFocus={(e) => {
                    e.target.setAttribute("autoComplete", "new-password");
                  }}
                  value={formData.password}
                />
              </div>
              {/* Confirm Password */}
              <div className="col-md-6 mb-4">
                <label>Confirm Password</label>
                <input
                  name="confirm_password"
                  placeholder="Confirm Password"
                  label="Confirm Password"
                  type="password"
                  className="form-control "
                  value={confirm_password}
                  onChange={(e) => setConfirm_password(e.target.value)}
                  autoComplete={`new-password`}
                  onFocus={(e) => {
                    e.target.setAttribute("autoComplete", "new-password");
                  }}
                />

                {confirm_password.length > 0 &&
                  confirm_password !== formData.password && (
                    <div className="text-danger">Password Should Match</div>
                  )}
              </div>
              <div className="col-md-6 mb-4">
                <label>User Profile Upload</label>
                <div>
                  <div className="form-control">
                    <FileBase64
                      multiple={false}
                      className="form-control"
                      onDone={({ base64, type }) => {
                        const split = base64.split(`data:${type};base64,`)[1];
                        setImage(split);
                      }}
                    />
                  </div>
                  <img
                    className="img-fluid mb-3"
                    style={{ width: "100px" }}
                    src={`data:image/*;base64,${image}`}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="btn btn-primary font-weight-bold px-9 py-4 my-3"
                disabled={loading}
                onSubmit={() => handleSubmit()}
              >
                Add User
                {loading && (
                  <span className="ml-3 spinner spinner-white"></span>
                )}
              </button>
            </div>
          </form>
        </>
      </div>
    </div>
  );
}

export default AddUser;
