import React, { useEffect } from "react";
import { CoverSection, Recommended, Departments, AvailableJobs } from "../../components/landing";
import { Header, Footer } from "../../../layout";
import { HeaderMobile } from "../../../_metronic/layout/components/header-mobile/HeaderMobile"; 
import { useDispatch, useSelector } from 'react-redux';   

export default function HomePage() {
    
    // const dispatch = useDispatch();
    // const { jobsDepartmentList } = useSelector((state) => state);

    // useEffect(() => {
    //     dispatch(fetchjobsDepartmentData());
    // }, [dispatch]);

    // console.log("jobsDepartmentList", {jobsDepartmentList});

 
    return (
        <>


            <Header />
            <HeaderMobile />

            <CoverSection />
            <Recommended />
            <Departments />
            <AvailableJobs />

            <Footer />
        </>
    )
} 