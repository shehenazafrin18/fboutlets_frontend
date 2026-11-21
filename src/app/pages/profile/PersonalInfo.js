import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import FileBase64 from "react-file-base64";
import { changePhoto } from "../../modules/Auth/redux/authReducer";
import API from "../../helpers/devApi"
import { swalError, swalSuccess } from "../../helpers/swal";

export default function PersonalInfo() {
  const {
    user: { data, accessToken, refreshToken, company },
  } = useSelector((state) => state.auth);
  const dispath = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(false);
  const [picture, setPicture] = useState(null);

  useEffect(() => {
    setFirstName(data.first_name);
    setMiddleName(data.middle_name);
    setLastName(data.last_name);
    setPhone(data.contact_number);
    // setImages(company.image);
  }, []);

  // console.log(data?.id);
  const handleSubmit = async () => {

    var formdata = new FormData();
    formdata.append('first_name', firstName);
    formdata.append('middle_name', middleName);
    formdata.append('last_name', lastName);
    formdata.append('contact_number', phone);
    formdata.append('profile_image', images);

    await API.patch(`/hrms_applicant/${data?.applicant_id}`, formdata)
      .then((res) => {
        if (res?.data?.success) {
          swalSuccess(res?.data[0]);

        } else {
          swalError(res?.data?.message, " ");
        }
      })
      .catch((error) => {
        swalError("someting went wrong");
      });
  };

  const handleImage = (e) => {
    const files = e.target.files[0];
    setPicture(URL.createObjectURL(e.target.files[0]));
    setImages(files);
    setPreview(true);
  };

  console.log({ images });
  return (
    <div className="flex-row-fluid ml-lg-8">
      <div className="card card-custom card-stretch">
        <div className="card-header py-3">
          <div className="card-title align-items-start flex-column">
            <h3 className="card-label font-weight-bolder text-dark">
              Personal Info
            </h3>
            <span className="text-muted font-weight-bold font-size-sm mt-1">
              Update your info
            </span>
          </div>
          <div className="card-toolbar">
            <button className="btn btn-success mr-2" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        </div>
        <div className="form">
          <div className="card-body">
            <div className="form-group row">
              <label htmlFor="" className="col-xl-3 col-lg-3 col-form-label">
                First Name
              </label>
              <div className="col-lg-9 col-xl-6">
                <input
                  value={firstName}
                  type="text"
                  name=""
                  id=""
                  className="form-control form-control-lg form-control-solid "
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="" className="col-xl-3 col-lg-3 col-form-label">
                Middle Name
              </label>
              <div className="col-lg-9 col-xl-6">
                <input
                  value={middleName}
                  type="text"
                  name=""
                  id=""
                  className="form-control form-control-lg form-control-solid "
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="" className="col-xl-3 col-lg-3 col-form-label">
                Last Name
              </label>
              <div className="col-lg-9 col-xl-6">
                <input
                  value={lastName}
                  type="text"
                  name=""
                  id=""
                  className="form-control form-control-lg form-control-solid "
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="" className="col-xl-3 col-lg-3 col-form-label">
                Phone
              </label>
              <div className="col-lg-9 col-xl-6">
                <input
                  value={phone}
                  type="text"
                  name=""
                  id=""
                  className="form-control form-control-lg form-control-solid "
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="col-12 mt-5 row ">
                <div className="col-md-3 mt-5">
                  <label className="">Change Profile Picture</label>
                </div>
                <div className="col-md-8 mt-5  ">
                  <div>
                    <img
                      className="img-fluid mb-3"
                      style={{ width: "150px" }}
                      src={preview ? picture : ''}
                      alt=""
                    />
                    <div className="">
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        onChange={(e) => {
                          handleImage(e)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
