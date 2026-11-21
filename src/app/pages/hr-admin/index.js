import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router";
import { ContentRoute } from "../../../_metronic/layout";
import { SplashScreen } from "../../../_metronic/_partials/controls";
import Dashboard from "./dashboard/index";
import SliderList from "./slider";
import AdminSettings from "./settings";
import Job from "./job";
import JobsDetails from "./job/JobsDetails";
import Applicant from "./applicant";
import Resume from "./applicant/Resume";
import ShortResume from "./applicant/Resume/ShortResume";
import Shortlisted from "./applicant/Shortliested";
import ApplicantList from "./applicant/ApplicantList";
import JobSummary from "./reports/JobSummary";
import ShortlistedApplicantList from "./applicant/ShortlistedApplicantList";
import ApplicantAnalytics from "./reports/ApplicantAnalytics";
import ProfileSummary from "./reports/ProfileSummary";
import OverallSummary from "./reports/OverallSummaryForEachJob";
import BlackListReport from "./reports/BlackListApplicants";
import BlacklistApplicantList from "./applicant/Blacklisted";

function HrAdminPanel({ userType }) {
  // if (userType != 3) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Switch>
        {<Redirect exact from="/hr-admin" to="/hr-admin/dashboard" />}
        <ContentRoute path="/hr-admin/dashboard" component={Dashboard} exact />
        <ContentRoute path="/hr-admin/slider/list" component={SliderList} />
        <ContentRoute
          path="/hr-admin/settings/view"
          component={AdminSettings}
        />
        <ContentRoute path="/hr-admin/jobs/jobs-list" component={Job} />
        <ContentRoute path="/hr-admin/jobs/:id" component={JobsDetails} exact />
        {/* <ContentRoute path="/hr-admin/applicant-list/:id" component={Applicant} exact /> */}

        <ContentRoute
          path="/hr-admin/applicant-list"
          component={Applicant}
          exact
        />

        <ContentRoute
          path="/hr-admin/applicant-list/:id"
          component={ApplicantList}
          exact
        />

        <ContentRoute
          path="/hr-admin/detail-resume/:id"
          component={Resume}
          exact
        />
        <ContentRoute
          path="/hr-admin/short-resume/:id"
          component={ShortResume}
          exact
        />
        <ContentRoute
          path="/hr-admin/shortlisted-applicant"
          component={Shortlisted}
          exact
        />
        <ContentRoute
          path="/hr-admin/shortlisted-applicant-list"
          component={ShortlistedApplicantList}
          exact
        />
        <ContentRoute
          path="/hr-admin/blacklisted-applicant-list"
          component={BlacklistApplicantList}
          exact
        />
        <ContentRoute
          path="/hr-admin/reports/jobs-summary"
          component={JobSummary}
          exact
        />
        <ContentRoute
          path="/hr-admin/reports/applicant-analytics"
          component={ApplicantAnalytics}
          exact
        />
        <ContentRoute
          path="/hr-admin/reports/profile-summary"
          component={ProfileSummary}
          exact
        />
        <ContentRoute
          path="/hr-admin/reports/applicant-summary"
          component={OverallSummary}
          exact
        />
        <ContentRoute
          path="/hr-admin/reports/blacklist-applicants"
          component={BlackListReport}
          exact
        />
      </Switch>
    </Suspense>
  );
  // } else {
  //   <Redirect to="/" />
  // }
}

export default HrAdminPanel;
