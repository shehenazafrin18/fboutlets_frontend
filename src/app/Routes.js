import React, { useEffect } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
import { AuthPage } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";
// import AvailableJobs from "./pages/availableJobs/AvailableJobs";
// import JobsDetails from "./pages/jobs/JobsDetails";
// import HomePage from "./pages/home";
import { HRAuthPage } from "./modules/Auth";
// import AssessmentPage from "./pages/jobs/AssessmentPage";
import * as jobAction from "../app/_redux/jobActions";
import "../_colors.scss";
import Login from "./modules/Auth/pages/Login";

export function Routes() {
  const { user } = useSelector((state) => state.auth);

  const userType = user && user?.data ? user?.data?.user_type : "";

  const dispatch = useDispatch();

  return (
    <Switch>
      <Route path="/auth/login" exact={true} component={AuthPage} />
      <Route path="/auth/hr-login" exact={true} component={HRAuthPage} />
      <Route path="/" exact={true} component={Login} />
      {/* <Route path="/" exact={true} component={HomePage} /> */}
      {/* <Route
        path="/available-jobs/:deptId/:jobTitle"
        component={AvailableJobs}
      /> */}
      {/* <Route path="/available-jobs/:deptId" component={AvailableJobs} />
      <Route path="/available-jobs" component={AvailableJobs} /> */}
      {/* <Route path="/jobs-details/:id" exact={true} component={JobsDetails} /> */}
      {/* <Route
        path="/assessment-question/:id"
        exact={true}
        component={AssessmentPage}
      /> */}

      <Redirect from="/auth" exact={true} to="/auth/login" />
      <Redirect from="/hr-auth" exact={true} to="/auth/hr-login" />

      {user?.length === 0 ? (
        <Route>
          <AuthPage />
        </Route>
      ) : userType === 1 ? (
        <Redirect from="/auth" to="/user-panel" />
      ) : (
        <Redirect from="/hr-auth" to="/hr-panel" />
      )}

      <Route path="/error" component={ErrorsPage} />
      {/* <Route path="/logout" component={Logout} /> */}

      {user?.length === 0 ? (
        <Redirect to="/auth/login" />
      ) : (
        <Layout>
          <BasePage />
        </Layout>
      )}
    </Switch>
  );
}
