import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen } from "../_metronic/layout";
import MyProfilePage from "./pages/my-profile";
import ResumeRoutes from "./pages/resume/Routes";
import Jobs from "./pages/jobs";
import AccountSettings from "./pages/settings";
import DemoJobList from "./pages/DemoJobList";
import HrAdminPanel from "./pages/hr-admin";
import { useSelector } from "react-redux";
// import AllDashboardPages from "./pages/dashboard";

const UserSettingsPage = lazy(() => import("./pages/user-settings"));
const UserPage = React.lazy(() => import("./pages/users"));
const ProfilePage = React.lazy(() => import("./pages/profile"));
const Setting = React.lazy(() => import("./pages/setting"));
// const RecruitmentPage = lazy(() => import("./pages/recruitement"));

export default function BasePage() {
  const { user } = useSelector((state) => state.auth);
  const userType = user && user?.data ? user?.data?.user_type : "";

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact from="/" to="/user-panel" />

        {/* <Route path="/user-panel" component={AllDashboardPages} /> */}
        {/* <Route path="/recruitement" component={RecruitmentPage} /> */}
        <Route path="/users" component={UserPage} />

        {/* Ashiful Code */}
        {/* <Route path="/my-profile" component={userType === 2 && MyProfilePage} /> */}
        <Route path="/user-setting" component={UserSettingsPage} />
        <Route path="/resume" component={ResumeRoutes} />
        <Route path="/jobs" component={Jobs} />
        <Route path="/settings" component={AccountSettings} />
        <Route path="/demo-page" component={DemoJobList} />

        <Route path="/profile" component={ProfilePage} />
        <Route path="/user-setting" component={Setting} />

        <Route
          path="/my-profile"
          render={(props) => <MyProfilePage {...props} userType={userType} />}
        />
        <Route
          path="/hr-admin"
          render={(props) => <HrAdminPanel {...props} userType={userType} />}
        />

        {/* <Redirect to="error/error-v1" /> */}
      </Switch>
    </Suspense>
  );
}
