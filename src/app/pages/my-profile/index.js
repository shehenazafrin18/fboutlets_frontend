import React from "react";
import { Suspense } from "react";
import { Redirect, Switch } from "react-router";
import { ContentRoute } from "../../../_metronic/layout";
import { SplashScreen } from "../../../_metronic/_partials/controls";
import PersonalInfo from "./PersonalInfo";
import Address from "./Address";
import EducationalInfo from "./EducationalInfo";
import TrainingSpecialization from "./TrainingSpecialization";
import ProfessionalExperience from "./ProfessionalExperience";
import ResearchPublication from "./ResearchPublication";
import AdditionalInfo from "./AdditionalInfo";

export default function MyProfilePage({ userType }) {
    if (userType === 3) {
        return (
            <Suspense fallback={<SplashScreen />}>
                <Switch>

                    {<Redirect exact from="/my-profile" to="/my-profile/personal-info" />}

                    <ContentRoute
                        path="/my-profile/personal-info"
                        component={PersonalInfo}
                    />
                    <ContentRoute
                        path="/my-profile/address"
                        component={Address}
                    />
                    <ContentRoute
                        path="/my-profile/educational-info"
                        component={EducationalInfo}
                    />
                    <ContentRoute
                        path="/my-profile/training-specialization"
                        component={TrainingSpecialization}
                    />
                    <ContentRoute
                        path="/my-profile/research-publication"
                        component={ResearchPublication}
                    />
                    <ContentRoute
                        path="/my-profile/professional-experience"
                        component={ProfessionalExperience}
                    />
                    <ContentRoute
                        path="/my-profile/additional-info"
                        component={AdditionalInfo}
                    />

                </Switch>
            </Suspense>
        );
    } else {
        <Redirect to="/" />
    }
}
