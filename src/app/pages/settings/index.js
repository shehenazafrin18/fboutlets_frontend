import React from "react";
import { Suspense } from "react";
import { Redirect, Switch } from "react-router";
import { ContentRoute } from "../../../_metronic/layout"; 
import { SplashScreen } from "../../../_metronic/_partials/controls";  
import Account from "./Account";

export default function AccountSettings() {
    return (
        <Suspense fallback={<SplashScreen />}> 
            <Switch>

                {<Redirect exact from="/settings" to="/settings/account-settings" />}

                <ContentRoute
                    path="/settings/account-settings"
                    component={Account}
                />   

            </Switch> 
        </Suspense>
    )
} 