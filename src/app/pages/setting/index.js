import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router";
import { ContentRoute } from "../../../_metronic/layout";
import { SplashScreen } from "../../../_metronic/_partials/controls";
import UserType from "./UserType";
import UserRole from "./UserRole";
import UserFeature from "./UserFeature";
import UserRoleWiseFeature from "./UserRoleWiseFeature";
import UserRoleWiseFeatureDev from "./UserRoleWiseFeatureDev";
import UserRoleWiseFeatureList from "./UserRoleWiseFeatureList"
function Setting() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Switch>
        {<Redirect exact from="/user-setting" to="/user-setting/user-type" />}
        <ContentRoute
          path="/user-setting/user-type"
          component={UserType}
          exact
        />
        <ContentRoute path="/user-setting/user-role" component={UserRole} />
        <ContentRoute
          path="/user-setting/user-feature"
          component={UserFeature}
        />
        <ContentRoute
          path="/user-setting/role-wise-features"
          component={UserRoleWiseFeature}
        />
        <ContentRoute
          path="/user-setting/role-wise-features-dev"
          component={UserRoleWiseFeatureDev}
        />
        <ContentRoute
          path="/user-setting/role-wise-feature-list"
          component={UserRoleWiseFeatureList}
        />
      </Switch>
    </Suspense>
  );
}

export default Setting;
