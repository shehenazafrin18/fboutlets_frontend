import React, { useEffect, useMemo } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { DropdownTopbarItemToggler } from "../_metronic/_partials/dropdowns";
import { useHtmlClassService } from "../_metronic/layout";
import objectPath from "object-path";
import { logout } from "../app/modules/Auth/redux/authReducer";
import { toAbsoluteUrl } from "../_metronic/_helpers";
import * as Action from "../../src/app/pages/my-profile/_redux/recruitementActions";
import * as jobAction from "../../src/app/_redux/jobActions";
import { Tooltip } from "antd";

export function Header() {
  const {
    user: { data },
  } = useSelector((state) => ({
    user: state.auth.user,
  }));
  const dispatch = useDispatch();
  const history = useHistory();
  const { applicantsInfo } = useSelector(({ recruitement }) => ({
    applicantsInfo: recruitement.applicantsInfo,
  }));

  useEffect(() => {
    if (data?.applicant_id) {
      dispatch(Action.getApplicantsInfoById(data?.applicant_id));
    }
  }, [data, dispatch]);

  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      light:
        objectPath.get(uiService.config, "extras.user.dropdown.style") ===
        "light",
    };
  }, [uiService]);

  const logoutClick = () => {
    dispatch(logout({}));
    history.push("/");
  };

  const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
  const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

  const fullName =
    data?.user_type !== 3
      ? `${data?.first_name || ""} ${data?.middle_name || ""} ${data?.last_name || ""}`.trim()
      : `${applicantsInfo?.first_name + " " || ""} ${applicantsInfo?.middle_name + " " || ""} ${" " + applicantsInfo?.last_name || ""}`.trim();

  // Truncate the fullName to 20 characters and add an ellipsis if it exceeds 20 characters
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const userShortName = truncateText(fullName, 18);
  console.log({ data });
  return (
    <nav className="navbar navbar-expand-lg custom-navbar mobile-none">
      <div className="container-fluid">
        <Link className="navbar-brand" to={"/"}>
          <img
            className="img-fluid"
            src={"images/logo.png"}
            alt="Logo"
            style={{ width: "70px" }}
          />
        </Link>
        <button className="navbar-toggler">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to={"/"}>
                {" "}
                <i class="fas fa-home"></i> Home
              </Link>
            </li>

            <>
              <li className="nav-item">
                <Link className="nav-link" to={"/my-profile"}>
                  My Profile
                </Link>
              </li>
            </>

            <li className="nav-item">
              <Link className="nav-link" to={"#!"}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.1429 18.8538H19.5V9.74665C19.5 5.96719 16.7063 2.84397 13.0714 2.32433V1.28237C13.0714 0.690402 12.592 0.210938 12 0.210938C11.408 0.210938 10.9286 0.690402 10.9286 1.28237V2.32433C7.29375 2.84397 4.5 5.96719 4.5 9.74665V18.8538H3.85714C3.38304 18.8538 3 19.2368 3 19.7109V20.5681C3 20.6859 3.09643 20.7824 3.21429 20.7824H9C9 22.4377 10.3446 23.7824 12 23.7824C13.6554 23.7824 15 22.4377 15 20.7824H20.7857C20.9036 20.7824 21 20.6859 21 20.5681V19.7109C21 19.2368 20.617 18.8538 20.1429 18.8538ZM12 22.0681C11.2902 22.0681 10.7143 21.4922 10.7143 20.7824H13.2857C13.2857 21.4922 12.7098 22.0681 12 22.0681ZM6.42857 18.8538V9.74665C6.42857 8.25737 7.00714 6.85915 8.05982 5.80647C9.1125 4.75379 10.5107 4.17522 12 4.17522C13.4893 4.17522 14.8875 4.75379 15.9402 5.80647C16.9929 6.85915 17.5714 8.25737 17.5714 9.74665V18.8538H6.42857Z"
                    fill="white"
                  />
                </svg>
              </Link>
            </li>

            <>
              {data?.id ? (
                <Dropdown drop="down" alignRight>
                  <Dropdown.Toggle
                    as={DropdownTopbarItemToggler}
                    id="dropdown-toggle-user-profile"
                  >
                    <a href="!#" className={"nav-link"}>
                      {/* <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">
                                                Hi,
                                            </span>
                                            <span className="text-light font-weight-bolder font-size-base d-none d-md-inline mr-3">
                                                {`${data?.first_name || ''} ${data?.middle_name || ''} ${data?.last_name || ''}`.trim()}
                                            </span>  */}

                      <span className="nav_profile_img">
                        {data?.user_type != 3 ? (
                          <>
                            {data?.profile_image ? (
                              <img
                                src={
                                  DOC_CONTAINER +
                                  data?.profile_image +
                                  DOC_TOKEN
                                }
                                alt={`${data?.first_name || ""} ${data?.middle_name || ""} ${data?.last_name || ""}`.trim()}
                              />
                            ) : (
                              <img
                                src={toAbsoluteUrl("/media/users/default.jpg")}
                                alt=""
                              />
                            )}
                          </>
                        ) : (
                          <>
                            {applicantsInfo?.profile_image ? (
                              <img
                                src={
                                  DOC_CONTAINER +
                                  applicantsInfo?.profile_image +
                                  DOC_TOKEN
                                }
                                alt={`${applicantsInfo?.first_name || ""} ${applicantsInfo?.middle_name || ""} ${applicantsInfo?.last_name || ""}`.trim()}
                              />
                            ) : (
                              <img
                                src={toAbsoluteUrl("/media/users/default.jpg")}
                                alt=""
                              />
                            )}
                          </>
                        )}
                      </span>
                    </a>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
                    <>
                      {/** ClassName should be 'dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
                      {layoutProps.light && (
                        <>
                          <div className="d-flex align-items-center p-8 rounded-top">
                            <div className="symbol symbol-md bg-light-primary mr-3 flex-shrink-0">
                              {/* <img src={`data:image/png;base64,${company.image}`} /> */}
                              {data?.user_type != 3 ? (
                                <>
                                  {data?.profile_image ? (
                                    <img
                                      src={
                                        DOC_CONTAINER +
                                        data.profile_image +
                                        DOC_TOKEN
                                      }
                                      alt={`${data?.first_name || ""} ${data?.middle_name || ""} ${data?.last_name || ""}`.trim()}
                                    />
                                  ) : (
                                    <img
                                      src={toAbsoluteUrl(
                                        "/media/users/default.jpg",
                                      )}
                                      alt=""
                                    />
                                  )}
                                </>
                              ) : (
                                <>
                                  {applicantsInfo?.profile_image ? (
                                    <img
                                      src={
                                        DOC_CONTAINER +
                                        applicantsInfo.profile_image +
                                        DOC_TOKEN
                                      }
                                      alt={`${applicantsInfo?.first_name || ""} ${applicantsInfo?.middle_name || ""} ${applicantsInfo?.last_name || ""}`.trim()}
                                    />
                                  ) : (
                                    <img
                                      src={toAbsoluteUrl(
                                        "/media/users/default.jpg",
                                      )}
                                      alt=""
                                    />
                                  )}
                                </>
                              )}
                            </div>
                            <div className="text-dark m-0 flex-grow-1 mr-3 font-size-h5">
                              {data?.user_type != 3 ? (
                                <>
                                  {`${data?.first_name || ""} ${data?.middle_name || ""} ${data?.last_name || ""}`.trim()}
                                </>
                              ) : (
                                <>
                                  {`${applicantsInfo?.first_name || ""} ${applicantsInfo?.middle_name || ""} ${applicantsInfo?.last_name || ""}`.trim()}
                                </>
                              )}
                            </div>
                            <button
                              className="btn btn-light-primary btn-bold"
                              onClick={logoutClick}
                            >
                              Sign out
                            </button>
                          </div>
                          <div className="separator separator-solid"></div>
                        </>
                      )}

                      {!layoutProps.light && (
                        <div
                          className="d-flex align-items-center justify-content-between flex-wrap p-8 bgi-size-cover bgi-no-repeat rounded-top"
                          style={{
                            backgroundImage: `url(${toAbsoluteUrl(
                              "/media/misc/bg-1.jpg",
                            )})`,
                          }}
                        >
                          <div className="symbol bg-white-o-15 mr-3">
                            {data?.user_type != 3 ? (
                              <>
                                {data?.profile_image ? (
                                  <img
                                    src={
                                      DOC_CONTAINER +
                                      data?.profile_image +
                                      DOC_TOKEN
                                    }
                                    alt={`${data?.first_name || ""} ${data?.middle_name || ""} ${data?.last_name || ""}`.trim()}
                                  />
                                ) : (
                                  <img
                                    src={toAbsoluteUrl(
                                      "/media/users/default.jpg",
                                    )}
                                    alt=""
                                  />
                                )}
                              </>
                            ) : (
                              <>
                                {applicantsInfo?.profile_image ? (
                                  <img
                                    src={
                                      DOC_CONTAINER +
                                      applicantsInfo?.profile_image +
                                      DOC_TOKEN
                                    }
                                    alt={`${applicantsInfo?.first_name || ""} ${applicantsInfo?.middle_name || ""} ${applicantsInfo?.last_name || ""}`.trim()}
                                  />
                                ) : (
                                  <img
                                    src={toAbsoluteUrl(
                                      "/media/users/default.jpg",
                                    )}
                                    alt=""
                                  />
                                )}
                              </>
                            )}
                          </div>
                          <div className="text-white m-0 flex-grow-1 mr-3 font-size-h5">
                            {data?.user_type != 3 ? (
                              <Tooltip placement="top" title={fullName}>
                                {userShortName}
                              </Tooltip>
                            ) : (
                              <>
                                <Tooltip placement="top" title={fullName}>
                                  {userShortName}
                                </Tooltip>
                                {/* {userShortName} */}
                                {/* {`${applicantsInfo?.first_name + ' ' || ''} ${applicantsInfo?.middle_name + ' ' || ''} ${' ' + applicantsInfo?.last_name || ''}`.trim()} */}
                              </>
                            )}
                            {/* {`${data?.first_name || ''} ${data?.middle_name || ''} ${data?.last_name || ''}`.trim()} */}
                          </div>

                          <button
                            className="btn btn-light-primary btn-bold"
                            onClick={logoutClick}
                          >
                            Sign out
                          </button>
                        </div>
                      )}
                    </>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link login-btn" to={"/auth"}>
                    Login
                  </Link>
                </li>
              )}
            </>
          </ul>
        </div>
      </div>
    </nav>
  );
}
