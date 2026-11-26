import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router";
import { ContentRoute } from "../../../_metronic/layout";
import { SplashScreen } from "../../../_metronic/_partials/controls";
import Dashboard from "./dashboard/index";
import AdminSettings from "./settings";
// import Job from "./job";
// import JobsDetails from "./job/JobsDetails";
import Applicant from "./applicant";
import Resume from "./applicant/Resume";
import ShortResume from "./applicant/Resume/ShortResume";
import Shortlisted from "./applicant/Shortliested";
import ApplicantList from "./applicant/ApplicantList";
import ShortlistedApplicantList from "./applicant/ShortlistedApplicantList";
import ApplicantAnalytics from "./reports/ApplicantAnalytics";
import ProfileSummary from "./reports/ProfileSummary";
import BlackListReport from "./reports/BlackListApplicants";
import BlacklistApplicantList from "./applicant/Blacklisted";
import MenuCategoryList from "./menu_category";
import InventoryItemsList from "./inventory_items";
import OutletMenu from "./outlet_menu";
import Inventories from "./inventories";
import Purchases from "./purchase";
import CreateSales from "./CreateSales";

function HrAdminPanel({ userType }) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Switch>
        {<Redirect exact from="/hr-admin" to="/hr-admin/dashboard" />}
        <ContentRoute path="/hr-admin/dashboard" component={Dashboard} exact />
        <ContentRoute
          path="/hr-admin/menucategory/list"
          component={MenuCategoryList}
        />
        <ContentRoute
          path="/hr-admin/inventory/item"
          component={InventoryItemsList}
        />
        <ContentRoute path="/hr-admin/outletmenu" component={OutletMenu} />
        <ContentRoute path="/hr-admin/inventory" component={Inventories} />
        <ContentRoute path="/hr-admin/purchase" component={Purchases} />
        <ContentRoute path="/hr-admin/sales" component={CreateSales} />
        <ContentRoute
          path="/hr-admin/settings/view"
          component={AdminSettings}
        />

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
          path="/hr-admin/reports/blacklist-applicants"
          component={BlackListReport}
          exact
        />
      </Switch>
    </Suspense>
  );
}

export default HrAdminPanel;
