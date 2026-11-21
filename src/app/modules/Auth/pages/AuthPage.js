/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link, Switch, Redirect } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { ContentRoute } from "../../../../_metronic/layout";
import Login from "./Login";
// import ForgotPassword from "./ForgotPassword";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";
import Registration from "./Registration";
import ResetPassword from "./ResetPassword";
import ResetPasswordOtp from "./ResetPasswordOtp";


export function AuthPage() {
    return (
        <Switch>
            <ContentRoute path="/auth/login" component={Login} />
            <ContentRoute path="/auth/signup" component={Registration} />
            <ContentRoute path="/auth/forgot-password" component={ResetPassword} />
            <ContentRoute path="/auth/reset-password-otp" component={ResetPasswordOtp} />
            {/* <ContentRoute
                  path="/auth/forgot-password"
                  component={ForgotPassword}
                /> */}
            <Redirect from="/auth" exact={true} to="/auth/login" />
            <Redirect to="/auth/login" />
        </Switch>
    );
}
