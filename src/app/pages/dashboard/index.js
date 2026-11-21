import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
// import { ContentRoute } from "../../../_metronic/layout";
import { SplashScreen } from "../../../_metronic/_partials/controls";
// import B2CDashboard from "./B2CDashboard";
// import landigPage from "../landingPage";

export default function AllDashboardPages() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Switch>
        {/* {<Redirect exact from="/dashboard" to="/dashboard" />} */}
        {/* <ContentRoute path="/user-panel" component={landigPage} /> */}
      </Switch>
    </Suspense>
  );
}
