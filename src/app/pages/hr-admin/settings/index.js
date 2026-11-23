import React, { useEffect, useState } from "react";
import { TitleWithEditCard } from "../../../components/cards/TitleWithEditCard";
import { Field, Formik, Form } from "formik";
import * as hractions from "../_redux/hrActions";
import { useDispatch, useSelector } from "react-redux";
import * as jobAction from "../../../_redux/jobActions";
import * as Yup from "yup";
import Editor from "../../../../_metronic/_partials/controls/Editor";
import { Modal } from "react-bootstrap";

export default function AdminSettings() {
  const dispatch = useDispatch();
  const [showEdit, setShowEdit] = useState(false);
  const [showTAC, setShowTAC] = useState(false);
  const [selectedData, setSelectedData] = useState({
    logo: "",
    favicon: "",
    report_logo: "",
    title: "",
    primaryColor: "",
    secondaryColor: "",
    tertiary_color: "",
    websiteUrl: "",
    address: "",
    phoneNo: "",
    email: "",
    facebookLink: "",
    twitterLink: "",
    linkedinLink: "",
    instagramLink: "",
    youtubeLink: "",
    profile_percentage: 0,
  });

  const { settingsData, user } = useSelector((state) => ({
    settingsData: state.hr.settingsData,
    user: state.auth.user,
  }));

  useEffect(() => {
    dispatch(hractions.getSettingsData());
  }, [dispatch, user]);

  useEffect(() => {
    if (settingsData && settingsData?.hrms_career_portal_settings.length > 0) {
      const data = settingsData.hrms_career_portal_settings[0];
      setSelectedData({
        logo: data?.hrms_career_portal_settings__logo || "",
        report_logo: data?.hrms_career_portal_settings__report_logo || "",
        favicon: data?.hrms_career_portal_settings__favicon || "",
        title: data?.hrms_career_portal_settings__title || "",
        primary_color: data?.hrms_career_portal_settings__primary_color || "",
        secondary_color:
          data?.hrms_career_portal_settings__secondary_color || "",
        tertiary_color: data?.hrms_career_portal_settings__tertiary_color || "",
        website_url: data?.hrms_career_portal_settings__website_url || "",
        address: data?.hrms_career_portal_settings__address || "",
        phone_no: data?.hrms_career_portal_settings__phone_no || "",
        email: data?.hrms_career_portal_settings__email || "",
        facebook_link: data?.hrms_career_portal_settings__facebook_link || "",
        twitter_link: data?.hrms_career_portal_settings__twitter_link || "",
        linked_in_link: data?.hrms_career_portal_settings__linked_in_link || "",
        instagram_link: data?.hrms_career_portal_settings__instagram_link || "",
        youtube_link: data?.hrms_career_portal_settings__youtube_link || "",
        profile_percentage:
          data?.hrms_career_portal_settings__profile_percentage || 0,
        terms_and_condition:
          data?.hrms_career_portal_settings__terms_and_condition || "",
      });
    }
  }, [settingsData]);

  const FormSchema = Yup.object().shape({
    // logo: Yup.mixed().required('Required'),
    // report_logo: Yup.mixed().required('Required'),
    // favicon: Yup.mixed().required('Required'),
    title: Yup.string().required("Required"),
    primary_color: Yup.string().required("Required"),
    secondary_color: Yup.string().required("Required"),
    phone_no: Yup.string().required("Required"),
    email: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    profile_percentage: Yup.number().typeError("Required").required("Required"),
    terms_and_condition: Yup.string(),
  });

  const handleSubmit = async (values) => {
    const id =
      settingsData?.hrms_career_portal_settings[0]
        ?.hrms_career_portal_settings__id;
    var formdata = new FormData();

    if (selectedData.logo) {
      formdata.append("logo", selectedData?.logo);
    }
    if (selectedData.favicon) {
      formdata.append("favicon", selectedData?.favicon);
    }

    for (var key in values) {
      if (key != "logo" && key != "favicon") {
        formdata.append(key, values[key]);
      }
    }

    if (id) {
      await dispatch(hractions.updateSettings(formdata, id));
    } else {
      await dispatch(hractions.insertSettings(formdata));
    }

    await dispatch(hractions.getSettingsData());
    setShowEdit(false);
  };

  const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
  const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;
  console.log("selectedData", selectedData);

  return (
    <>
      <TitleWithEditCard
        title="Career Portal Settings"
        showEdit={showEdit}
        setShowEdit={setShowEdit}
        btn_icon="fas fa-edit"
        btn={showEdit}
      >
        <div>
          <div></div>
        </div>

        {showEdit === true ? (
          <div className="p-5">
            <Formik
              initialValues={selectedData}
              validationSchema={FormSchema}
              onSubmit={(values) => handleSubmit(values)}
              enableReinitialize={true}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form>
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <label className="">
                        <b>Logo</b>
                      </label>
                      <input
                        name="logo"
                        type="file"
                        className="form-control"
                        onChange={(e) => {
                          const file = e.currentTarget.files[0];
                          setSelectedData({
                            ...selectedData,
                            logo: file,
                            logoPreview: URL.createObjectURL(file),
                          });
                        }}
                      />

                      <div>
                        {selectedData?.logoPreview ? (
                          <img
                            className="w-25"
                            src={selectedData?.logoPreview}
                            alt="logo preview"
                          />
                        ) : (
                          <img
                            className="w-25"
                            src={
                              selectedData?.logo &&
                              DOC_CONTAINER + selectedData?.logo + DOC_TOKEN
                            }
                            alt="logo"
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-md-3 mb-3">
                      <label className="">
                        <b>Favicon</b>
                      </label>
                      <input
                        name="favicon"
                        type="file"
                        className="form-control"
                        onChange={(e) => {
                          const file = e.currentTarget.files[0];
                          setSelectedData({
                            ...selectedData,
                            favicon: file,
                            faviconPreview: URL.createObjectURL(file),
                          });
                        }}
                      />
                      <div>
                        {selectedData?.faviconPreview ? (
                          <img
                            className="w-25"
                            src={selectedData?.faviconPreview}
                            alt="favicon preview"
                          />
                        ) : (
                          <img
                            className="w-25"
                            src={
                              selectedData?.favicon &&
                              DOC_CONTAINER + selectedData?.favicon + DOC_TOKEN
                            }
                            alt="logo"
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-md-3 mb-3">
                      <label className="">
                        <b>Report Logo</b>
                      </label>
                      <input
                        name="favicon"
                        type="file"
                        onChange={(e) => {
                          const file = e.currentTarget.files[0];
                          setSelectedData({
                            ...selectedData,
                            report_logo: file,
                            reportLogoPreview: URL.createObjectURL(file),
                          });
                        }}
                        className="form-control"
                      />
                      <div>
                        {selectedData?.reportLogoPreview ? (
                          <img
                            className="w-25"
                            src={selectedData?.reportLogoPreview}
                            alt="report Logo preview"
                          />
                        ) : (
                          <img
                            className="w-25"
                            src={
                              selectedData?.report_logo &&
                              DOC_CONTAINER +
                                selectedData?.report_logo +
                                DOC_TOKEN
                            }
                            alt="report logo"
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="required">
                        <b>Title</b>
                      </label>
                      <Field
                        name="title"
                        type="text"
                        className="form-control"
                      />
                      {errors.title && touched.title ? (
                        <div className="text-danger">{errors.title}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="row mt-10">
                    <div className="col-md-3 mb-3">
                      <label className="required">
                        <b>Phone No</b>
                      </label>
                      <Field
                        name="phone_no"
                        type="text"
                        className="form-control"
                      />
                      {errors.phone_no && touched.phone_no ? (
                        <div className="text-danger">{errors.phone_no}</div>
                      ) : null}
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="required">
                        <b>Email</b>
                      </label>
                      <Field
                        name="email"
                        type="text"
                        className="form-control"
                      />
                      {errors.email && touched.email ? (
                        <div className="text-danger">{errors.email}</div>
                      ) : null}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="required">
                        <b>Address</b>
                      </label>
                      <Field
                        name="address"
                        type="text"
                        className="form-control"
                      />
                      {errors.address && touched.address ? (
                        <div className="text-danger">{errors.address}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="row mt-10">
                    <div className="col-md-3 mb-3">
                      <label className="">
                        <b>Facebook Url</b>
                      </label>
                      <Field
                        name="facebook_link"
                        type="text"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="">
                        <b>Twitter Url</b>
                      </label>
                      <Field
                        name="twitter_link"
                        type="text"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="">
                        <b>Linkedin Url</b>
                      </label>
                      <Field
                        name="linked_in_link"
                        type="text"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="">
                        <b>Instagram Url</b>
                      </label>
                      <Field
                        name="instagram_link"
                        type="text"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="">
                        <b>Website Url</b>
                      </label>
                      <Field
                        name="website_url"
                        type="text"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="">
                        <b>Profile Percentange</b>
                      </label>
                      <Field
                        name="profile_percentage"
                        type="number"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mt-10">
                    <div className="col-md-6 mb-3">
                      <label className="">
                        <b>Terms and Condition</b>
                      </label>
                      <Editor
                        editorHtml={values.terms_and_condition}
                        onChange={(val) => {
                          setFieldValue("terms_and_condition", val);
                        }}
                      />
                    </div>
                  </div>

                  <div className="row mt-10">
                    <div className="col-md-3 mb-3">
                      <label className="">
                        <b>Primary Color</b>
                      </label>
                      <Field
                        name="primary_color"
                        type="color"
                        className="form-control p-0"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="">
                        <b>Secondary Color</b>
                      </label>
                      <Field
                        name="secondary_color"
                        type="color"
                        className="form-control p-0"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="">
                        <b>Tertiary Color</b>
                      </label>
                      <Field
                        name="tertiary_color"
                        type="color"
                        className="form-control p-0"
                      />
                    </div>
                  </div>

                  <div className="row mt-10">
                    <div className="col-md-12 mb-3 text-right">
                      <button
                        className="btn btn-default"
                        type="button"
                        onClick={() => {
                          setShowEdit(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button className="btn btn-primary" type="submit">
                        Update
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <div className="hr-admin-view p-5">
            {settingsData &&
              settingsData.hrms_career_portal_settings.length > 0 &&
              settingsData.hrms_career_portal_settings.map((item, k) => (
                <>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="item_card">
                        <div className="label_box">Logo :</div>
                        <div className="logo_view">
                          <img
                            src={
                              item?.hrms_career_portal_settings__logo
                                ? DOC_CONTAINER +
                                  item?.hrms_career_portal_settings__logo +
                                  DOC_TOKEN
                                : "https://apsissolutions.com/wp-content/uploads/MicrosoftTeams-image-21-1.png"
                            }
                            alt="log"
                          />
                        </div>
                      </div>
                      <div className="item_card">
                        <div className="label_box">Report Logo :</div>
                        <div className="fav_view">
                          <img
                            src={
                              item?.hrms_career_portal_settings__report_logo
                                ? DOC_CONTAINER +
                                  item?.hrms_career_portal_settings__report_logo +
                                  DOC_TOKEN
                                : "https://apsissolutions.com/wp-content/uploads/MicrosoftTeams-image-21-1.png"
                            }
                            alt="log"
                          />
                        </div>
                      </div>
                      <div className="item_card">
                        <div className="label_box">Favicon Icon :</div>
                        <div className="fav_view">
                          <img
                            src={
                              item?.hrms_career_portal_settings__favicon
                                ? DOC_CONTAINER +
                                  item?.hrms_career_portal_settings__favicon +
                                  DOC_TOKEN
                                : "https://apsissolutions.com/wp-content/uploads/MicrosoftTeams-image-21-1.png"
                            }
                            alt="log"
                          />
                        </div>
                      </div>
                      <div className="item_card">
                        <div className="label_box">Profile Percentange :</div>
                        <div className="item_name">
                          <h4>
                            {
                              item?.hrms_career_portal_settings__profile_percentage
                            }
                          </h4>
                        </div>
                      </div>
                      <div className="item_card">
                        <div className="label_box">
                          <span>Terms and Condition</span>
                        </div>
                        <div
                          className="item_name cursor-pointer"
                          onClick={() => {
                            setShowTAC(true);
                          }}
                        >
                          <i
                            className="fa fa-info"
                            style={{ fontSize: "1.5rem" }}
                          ></i>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="item_card2">
                        <div className="label_box">Company Title :</div>
                        <div className="item_name">
                          <h4>{item?.hrms_career_portal_settings__title}</h4>
                        </div>
                      </div>
                      <div className="item_card2">
                        <div className="label_box">Phone No :</div>
                        <div className="item_name">
                          <h4>{item?.hrms_career_portal_settings__phone_no}</h4>
                        </div>
                      </div>
                      <div className="item_card2">
                        <div className="label_box">Email :</div>
                        <div className="item_name">
                          <h4>{item?.hrms_career_portal_settings__email}</h4>
                        </div>
                      </div>
                      <div className="item_card2">
                        <div className="label_box">Address :</div>
                        <div className="item_name">
                          <h4>{item?.hrms_career_portal_settings__address}</h4>
                        </div>
                      </div>
                      <div className="item_card2">
                        <div className="label_box">Website Url :</div>
                        <div className="item_name">
                          <h4>
                            {item?.hrms_career_portal_settings__website_url}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="item_card">
                        <div className="label_box">Primary Color :</div>
                        <div
                          className="color_view"
                          style={{
                            backgroundColor:
                              item?.hrms_career_portal_settings__primary_color,
                          }}
                        >
                          {" "}
                        </div>
                      </div>
                      <div className="item_card">
                        <div className="label_box">Secondary Color :</div>
                        <div
                          className="color_view"
                          style={{
                            backgroundColor:
                              item?.hrms_career_portal_settings__secondary_color,
                          }}
                        >
                          {" "}
                        </div>
                      </div>
                      <div className="item_card">
                        <div className="label_box">Tertiary Color :</div>
                        <div
                          className="color_view"
                          style={{
                            backgroundColor:
                              item?.hrms_career_portal_settings__tertiary_color,
                          }}
                        >
                          {" "}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <h3>Social Media</h3>
                      <div className="social-icons">
                        <a
                          href={
                            item?.hrms_career_portal_settings__facebook_link
                          }
                          className="fa fa-facebook"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                        </a>
                        <a
                          href={item?.hrms_career_portal_settings__twitter_link}
                          className="fa fa-twitter"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                        </a>
                        <a
                          href={
                            item?.hrms_career_portal_settings__linked_in_link
                          }
                          className="fa fa-linkedin"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                        </a>
                        <a
                          href={item?.hrms_career_portal_settings__youtube_link}
                          className="fa fa-youtube"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                        </a>
                        <a
                          href={
                            item?.hrms_career_portal_settings__instagram_link
                          }
                          className="fa fa-instagram"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              ))}
          </div>
        )}

        <TermsAndConditionModal
          show={showTAC}
          setShow={setShowTAC}
          html={
            settingsData?.hrms_career_portal_settings[0]
              ?.hrms_career_portal_settings__terms_and_condition
          }
        />
      </TitleWithEditCard>
    </>
  );
}

const TermsAndConditionModal = ({ show, setShow, html }) => {
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
    >
      <>
        <Modal.Header>
          <Modal.Title className="cover_letter_modal_view">
            <h2 className="mb-0">Terms and Condition</h2>
            <button
              type="button"
              onClick={() => {
                setShow(false);
              }}
            >
              <i
                className="fas fa-times text-danger"
                style={{ fontSize: "26px" }}
              ></i>
            </button>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div
                className="col-md-12 mb-3"
                dangerouslySetInnerHTML={{ __html: html }}
              ></div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="btn btn-default"
            onClick={() => {
              setShow(false);
            }}
          >
            Close
          </button>
        </Modal.Footer>
      </>
    </Modal>
  );
};
