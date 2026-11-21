import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router";
import { ContentRoute } from "../../../_metronic/layout";
import { SplashScreen } from "../../../_metronic/_partials/controls";
import AddUser from "./AddUser";
// import UsersList from "./UsersList";
import NewUserList from "./NewUserList";
// import UsersRole from "./UsersRole";
// import UserTypeList from "./UserTypeList";
import NewUserTypeList from "./NewUserTypeList";

function UserPage() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Switch>
        {<Redirect exact from="/users" to="/users/users-list" />}
        <ContentRoute path="/users/users-list" component={NewUserList} />
        <ContentRoute path="/users/user-type-list" component={NewUserTypeList} />
        {/* <ContentRoute path="/users/add-user" component={AddUser} /> */}
        {/* <ContentRoute path="/users/user-roles" component={UsersRole} /> */}
      </Switch>
    </Suspense>
  );
}

export default UserPage;
