import React from "react";
import { Link, Switch, Redirect } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { ContentRoute } from "../../../../_metronic/layout";
import HRLogin from "./HRLogin";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";

export function HRAuthPage() {
    return ( 
        <Switch>
            <ContentRoute path="/auth/hr-login" component={HRLogin} />
            <Redirect from="/hr-auth" exact={true} to="/auth/hr-login" />
            <Redirect to="/auth/hr-login" />
        </Switch> 
    );
}
