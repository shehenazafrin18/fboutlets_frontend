import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as jobAction from "../app/_redux/jobActions";

export function Footer() {
  return (
    <>
      <div className="footer-section">
        <div className="container-fluid">
          <div className="footer-wrap">
            <div className="address-div">
              <ul>
                <li>F&B Outlets, Bananni,Dhaka-1213, Bangladesh</li>
                <li>Tel: 988930303</li>
                <li>E-mail: info@fandboutslets.com</li>
              </ul>
            </div>

            <div className="footer-menu-list">
              <ul>
                <li>RESEARCH</li>
                <li>ADVOCACY</li>
                <li>INNOVATION</li>
              </ul>
            </div>

            <div className="footer-social-menu">
              <p>Follow us at</p>
              <ul>
                <li className="pl-0">
                  <i className="fab fa-facebook-square"></i>
                </li>

                <li>
                  <i className="fab fa-twitter-square"></i>
                </li>

                <li>
                  <i className="fab fa-youtube"></i>
                </li>
                <li>
                  <i className="fab fa-linkedin"></i>
                </li>
                <li>
                  <i className="fab fa-instagram"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
