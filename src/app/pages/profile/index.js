import React from "react";
import { Suspense } from "react";
import { Redirect, Switch } from "react-router";
import { ContentRoute } from "../../../_metronic/layout";
import ProfileSidebar from "../../../_metronic/layout/components/ProfileSidebar";
import { SplashScreen } from "../../../_metronic/_partials/controls";
import ChangePassword from "./ChangePassword";
import PersonalInfo from "./PersonalInfo";

export default function ProfilePage() {
    return (
        <Suspense fallback={<SplashScreen />}>
            <div className="d-flex flex-row">
                {/* Profile Sidebar */}
                <ProfileSidebar />


                {/* Profile Pages */}
                <Switch>
                    {<Redirect exact from="/profile" to="/profile/personal-info" />}
                    <ContentRoute
                        path="/profile/personal-info"
                        component={PersonalInfo}
                    />
                    <ContentRoute
                        path="/profile/change-password"
                        component={ChangePassword}
                    />
                </Switch>
            </div>
        </Suspense>
    );
}
