import React from "react";
import { useSelector } from "react-redux";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BasicInformation from "../recruitement/ResumeDetails/BasicInformation";
import AvailableJobs from "../job/AvailableJobs";
import AppliedJob from "../job/AppliedJob";

const landigPage = () => {
    return (
        <>
            <div className="row pt-7">
                {/* <div className="col-md-1"></div> */}
                <div className="col-md-12">
                    <Tabs
                        defaultActiveKey="profile"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="profile" title="My Profile" key={1}>
                            <BasicInformation />
                        </Tab>
                        <Tab eventKey="applied-jobs" title="Applied Jobs" key={2}>
                            <AppliedJob />
                        </Tab>
                        <Tab eventKey="available-jobs" title="Available Jobs" key={3}>
                            <AvailableJobs />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )
}
export default landigPage;