import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import objectPath from "object-path";
import SVG from "react-inlinesvg";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../_helpers";
import { useDispatch, useSelector } from "react-redux";
import * as jobAction from "../../../../app/_redux/jobActions"


export function Brand() {
  const {
    user,
    systemInfo
  } = useSelector((state) => ({
    user: state.auth,
    systemInfo: state.job.systemInfo
  }));
  const dispatch = useDispatch();
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      brandClasses: uiService.getClasses("brand", true),
      asideSelfMinimizeToggle: objectPath.get(
        uiService.config,
        "aside.self.minimize.toggle"
      ),
      headerLogo: uiService.getLogo(),
      headerStickyLogo: uiService.getStickyLogo(),
    };
  }, [uiService]);


  useEffect(() => {
    dispatch(jobAction.fetchALLSystemInfo());
  }, [dispatch]);

  const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
  const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

  return (
    <>
      {/* begin::Brand */}
      <div
        className={`brand flex-column-auto ${layoutProps.brandClasses}`}
        id="kt_brand"
      >
        {/* begin::Logo */}
        <Link to="/hr-admin/dashboard" className="brand-logo">
          <img
            alt="logo"
            className="img-fluid"
            style={{ height: "70px" }}
            src={systemInfo ? (DOC_CONTAINER + systemInfo?.logo + DOC_TOKEN) : "images/logo.png"}
          // src={layoutProps.headerLogo}
          />
        </Link>
        {/* end::Logo */}

        {layoutProps.asideSelfMinimizeToggle && (
          <>
            {/* begin::Toggle */}
            <button
              className="brand-toggle btn btn-sm px-0"
              id="kt_aside_toggle"
            >
              <span className="svg-icon svg-icon-xl">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Navigation/Angle-double-left.svg"
                  )}
                />
              </span>
            </button>
            {/* end::Toolbar */}
          </>
        )}
      </div >
      {/* end::Brand */}
    </>
  );
}
