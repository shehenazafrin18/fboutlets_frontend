/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { UserProfileDropdown } from "./dropdowns/UserProfileDropdown";

import OneSignal from "react-onesignal";
import Axios from "axios";

export function QuickUserToggler() {
  const { user } = useSelector((state) => state.auth);
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      offcanvas:
        objectPath.get(uiService.config, "extras.user.layout") === "offcanvas",
    };
  }, [uiService]);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const subscibe = async (userid, subid) => {
      const { data } = await Axios.post(
        `${process.env.REACT_APP_API_URL}/user/saveUserDeviceForNoti`,
        {
          user_id: userid,
          device_key: subid,
          device_type: "web",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
            refreshToken: user.refreshToken,
          },
        }
      );
    };
    if (!!user) {
      OneSignal.init({
        appId: "1dc484e0-f2d8-4bdc-9a2d-aa19446f1808",
        serviceWorkerParam: {
          scope: "https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js",
        },
      }).then(() => {
        setInitialized(true);
        OneSignal.showSlidedownPrompt().then(() => {
          console.log("one signal");
        });
      });

      if (initialized && user) {
        OneSignal.isPushNotificationsEnabled(function(isEnabled) {
          if (isEnabled) {
            //console.log("Push notifications are enabled!");
            OneSignal.getUserId(function(userId) {
              console.log("OneSignal User ID:", userId);
              subscibe(user.id, userId);
              // (Output) OneSignal User ID: 270a35cd-4dda-4b3f-b04e-41d7463a2316
            });
          } else {
            //console.log("Push notifications are not enabled!");
          }
        });
      }
    }
  }, [initialized, user]);

  return (
    <>
      {layoutProps.offcanvas && (
        // <OverlayTrigger
        //   placement="bottom"
        //   overlay={<Tooltip id="quick-user-tooltip">View user</Tooltip>}
        // >
        //   <div className="topbar-item">
        //     <div
        //       className="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
        //       id="kt_quick_user_toggle"
        //     >
        //       <>
        //         <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">
        //           Hi,
        //         </span>
        //         <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
        //           {`amit`}
        //         </span>
        //         <span className="symbol symbol-35 symbol-light-success">
        //           <span className="symbol-label font-size-h5 font-weight-bold">
        //             {`A`}
        //           </span>
        //         </span>
        //       </>
        //     </div>
        //   </div>
        <UserProfileDropdown />
        // </OverlayTrigger>
      )}

      {!layoutProps.offcanvas && <UserProfileDropdown />}
    </>
  );
}
