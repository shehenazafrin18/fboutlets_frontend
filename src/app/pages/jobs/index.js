import React from "react";
import { Suspense } from "react";
import { Redirect, Switch } from "react-router";
import { ContentRoute } from "../../../_metronic/layout"; 
import { SplashScreen } from "../../../_metronic/_partials/controls";   
import AppliedJobs from "./AppliedJobs";
import ShortListedJobs from "./ShortListedJobs";
import SavedForLater from "./SavedForLater";
import MyJobs from "./myJobs";

export default function Jobs() {
    return (
        <Suspense fallback={<SplashScreen />}> 
            <Switch>

                {<Redirect exact from="/jobs" to="/jobs/applied-jobs" />}

                <ContentRoute
                    path="/jobs/applied-jobs"
                    component={AppliedJobs}
                />  
                <ContentRoute
                    path="/jobs/shortlist-jobs"
                    component={ShortListedJobs}
                />  
                <ContentRoute
                    path="/jobs/saved-jobs"
                    component={SavedForLater}
                />  
                <ContentRoute
                    path="/jobs/my-jobs"
                    component={MyJobs}
                />  

            </Switch> 
        </Suspense>
    )
} 