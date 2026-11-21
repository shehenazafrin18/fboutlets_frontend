import React, { useEffect, useMemo } from "react";
import { Dropdown, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import objectPath from "object-path";
import { logout } from "../../../../app/modules/Auth/redux/authReducer";
import { DropdownTopbarItemToggler } from "../../../_partials/dropdowns";
import { toAbsoluteUrl } from "../../../_helpers";
import * as Action from "../../../../app/pages/my-profile/_redux/recruitementActions";

export function Topbar() {
  const {
    user: { data },
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { applicantsInfo } = useSelector(({ recruitement }) => ({
    applicantsInfo: recruitement.applicantsInfo,
  }));

  useEffect(() => {
    if (user?.data?.applicant_id) {
      dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
    }
  }, [user, dispatch]);

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
  };

  const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
  const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

  return (
    <>
      <nav className="navbar navbar-expand-lg hr-custom-navbar mobile-none">
        <div className="container-fluid px-0">
          <button className="navbar-toggler">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mb-2 mb-lg-0">
              {/* <li className="nav-item">
                                <Link className="nav-link" href="#">My Jobs</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={"/available-jobs"} >Available Jobs</Link>
                            </li> */}

              <>
                {data?.sub ? (
                  <Dropdown drop="down" alignRight>
                    <Dropdown.Toggle
                      as={DropdownTopbarItemToggler}
                      id="dropdown-toggle-user-profile"
                    >
                      <a href="!#" className="nav-link profile_icon_box">
                        <div className="user_info_div">
                          <span className="font-weight-bolder font-size-base">
                            {`${data?.first_name || ""} ${data?.middle_name || ""} ${data?.last_name || ""}`.trim()}
                          </span>{" "}
                          <br />
                          <span className="text-muted font-weight-bold font-size-base">
                            {data?.email}
                          </span>
                        </div>

                        <span className="nav_profile_img">
                          {data?.profile_image ? (
                            <img
                              src={
                                DOC_CONTAINER + data.profile_image + DOC_TOKEN
                              }
                              alt={`${data?.first_name || ""} ${data?.middle_name || ""} ${data?.last_name || ""}`.trim()}
                            />
                          ) : (
                            <img
                              src={toAbsoluteUrl("/media/users/default.jpg")}
                              alt=""
                            />
                          )}
                        </span>
                      </a>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
                      <>
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
                                  alt={`${data?.first_name || ""} ${data?.middle_name || ""} ${data?.last_name || ""}`.trim()}
                                />
                              )}
                            </div>
                            <div className="text-white m-0 flex-grow-1 mr-3 font-size-h5">
                              {`${data?.first_name || " "} ${data?.middle_name || " "} ${data?.last_name || " "}`.trim()}
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

                      <div className="navi navi-spacer-x-0 pt-5">
                        {/* <Link to="/my-profile" className="navi-item px-8">
                                                    <div className="navi-link">
                                                        <div className="navi-icon mr-2">
                                                            <i className="flaticon2-calendar-3 text-success" /> 
                                                        </div>
                                                        <div className="navi-text">
                                                            <div className="font-weight-bold">My Profile</div>
                                                        </div>
                                                    </div>
                                                </Link> */}

                        {/* <Link className="navi-item px-8" to="/settings/account-settings">
                                                    <div className="navi-link">
                                                        <div className="navi-icon mr-2">
                                                            <i className="fas fa-user-cog"></i>
                                                        </div>
                                                        <div className="navi-text">
                                                            <div className="font-weight-bold">Account Settings </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className="navi-separator mt-3"></div> */}
                      </div>
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
    </>
  );
}
