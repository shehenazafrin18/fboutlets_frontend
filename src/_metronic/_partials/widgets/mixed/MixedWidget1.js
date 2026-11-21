/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_helpers";
import { Link } from "react-router-dom";

export function MixedWidget1({ className, data }) {
  // console.log(data);
  // return false;
  return (
    <div className="row">
      <div className="col-xl-4">
        <div
          className="card card-custom bgi-no-repeat card-stretch gutter-b"
          style={{ backgroundColor: "#4AB58E" }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <span className="svg-icon svg-icon-4x svg-icon-white">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Media/Equalizer.svg")}
                ></SVG>
              </span>
              <span className="text-white font-size-h2 font-size-h2">
                Referrals
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <span className="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">
                  {data.referralCount}
                </span>
                <span className="font-weight-bold text-white font-size-sm">
                  Total Referrals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-4">
        <Link to="/customer/customer-list">
          <div className="card card-custom bg-info bgi-no-repeat card-stretch gutter-b">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span className="svg-icon svg-icon-4x svg-icon-white">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/svg/icons/Communication/Group.svg"
                    )}
                  ></SVG>
                </span>
                <span className="text-white font-size-h2">Customers</span>
              </div>
              <div className="d-flex justify-content-between">
                <div>
                  <span className="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">
                    {data.customerCount}
                  </span>
                  <span className="font-weight-bold text-white font-size-sm">
                    Total Customers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-xl-4">
        <Link to="/products/all-product">
          <div className="card card-custom bgi-no-repeat bg-warning card-stretch gutter-b">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span className="svg-icon svg-icon-4x svg-icon-white">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Shopping/Cart2.svg")}
                  ></SVG>
                </span>
                <span className="font-weight-bold text-white font-size-h2">
                  Products
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <div>
                  <span className="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">
                    {data.productCount}
                  </span>
                  <span className="font-weight-bold text-white font-size-sm">
                    Total Products
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="col-xl-4">
        <Link to="/test-drive/test-drive-history">
          <div className="card card-custom bgi-no-repeat bg-dark card-stretch gutter-b">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span className="svg-icon svg-icon-4x svg-icon-white">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/svg/icons/Communication/Flag.svg"
                    )}
                  ></SVG>
                </span>
                <span className="font-weight-bold text-white font-size-h2">
                  Test Drives
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <div>
                  <span className="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">
                    {data.testDriveCount}
                  </span>
                  <span className="font-weight-bold text-white font-size-sm">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="col-xl-4">
        <Link to="/showroom/showroom-list">
          <div className="card card-custom bgi-no-repeat bg-success card-stretch gutter-b">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span className="svg-icon svg-icon-4x svg-icon-white">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Home.svg")}
                  ></SVG>
                </span>
                <span className="font-weight-bold text-white font-size-h2">
                  Showroom
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <div>
                  <span className="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">
                    {data.showroomCount}
                  </span>
                  <span className="font-weight-bold text-white font-size-sm">
                    Total Showroom
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="col-xl-4">
        <Link to="/service-n-spare/service-n-spare-list">
          <div className="card card-custom bgi-no-repeat bg-danger card-stretch gutter-b">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span className="svg-icon svg-icon-4x svg-icon-white">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Tools/Hummer.svg")}
                  ></SVG>
                </span>
                <span className="font-weight-bold text-white font-size-h2">
                  Service Center
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <div>
                  <span className="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block">
                    {data.serviceCount}
                  </span>
                  <span className="font-weight-bold text-white font-size-sm">
                    Total Service Center
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
