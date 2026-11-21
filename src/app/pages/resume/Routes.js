import React from "react";
import { Suspense } from "react";
import { Redirect, Switch } from "react-router";
import { ContentRoute } from "../../../_metronic/layout"; 
import { SplashScreen } from "../../../_metronic/_partials/controls";  
import ViewResume from "./ViewResume";
import ShortResumeView from "./ShortResumeView";

export default function ResumeRoutes() {
    return (
        <Suspense fallback={<SplashScreen />}> 
            <Switch>

                {<Redirect exact from="/resume" to="/resume/view" />}

                <ContentRoute
                    path="/resume/view"
                    component={ViewResume}
                />  
                <ContentRoute
                    path="/resume/short-resume"
                    component={ShortResumeView}
                />  

            </Switch> 
        </Suspense>
    )
} 