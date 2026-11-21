import React, { useMemo } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../_core/MetronicLayout";
import { HeaderMobile } from "./header-mobile/HeaderMobile";
import { Aside } from "./aside/Aside";
import { LayoutInit } from "./LayoutInit";
import { SubHeader } from "./subheader/SubHeader";
import { ScrollTop } from "./extras/ScrollTop";
import { Header, Footer } from "../../../layout";
import { Sidebar } from "../../../app/components/layout";
import { MainContent } from "../../../app/components/layout/MainContent";
import { useSelector } from "react-redux";
import { Topbar } from "../components/header/Topbar";

export function Layout({ children }) {
    const uiService = useHtmlClassService();

    const { user: { data }, } = useSelector((state) => state.auth);

    const layoutProps = useMemo(() => {
        return {
            layoutConfig: uiService.config,
            selfLayout: objectPath.get(uiService.config, "self.layout"),
            asideDisplay: objectPath.get(uiService.config, "aside.self.display"),
            subheaderDisplay: objectPath.get(uiService.config, "subheader.display"),
            desktopHeaderDisplay: objectPath.get(
                uiService.config,
                "header.self.fixed.desktop"
            ),
            contentCssClasses: uiService.getClasses("content", true),
            contentContainerClasses: uiService.getClasses("content_container", true),
            contentExtended: objectPath.get(uiService.config, "content.extended"),
        };
    }, [uiService]);


    return layoutProps.selfLayout !== "blank" ? (
        <>

            {data.user_type === 3 ? (
                <>
                    <Header />

                    <HeaderMobile />
                </>
            ) : (
                <>
                    <Topbar />

                    <HeaderMobile />

                </>
            )}




            <div className="d-flex flex-column flex-root">
                <div className="d-flex flex-row flex-column-fluid page">
                    <div className="d-flex flex-column flex-row-fluid wrapper mt-5" id="kt_wrapper" >
                        <div id="kt_content" className={`content ${layoutProps.contentCssClasses} d-flex flex-column flex-column-fluid`} >


                            {data.user_type != 3 && (
                                <>
                                    {layoutProps.asideDisplay && <Aside />}

                                    {layoutProps.subheaderDisplay && <SubHeader />}
                                </>
                            )}

                            {!layoutProps.contentExtended && (
                                <div className={`d-flex flex-column-fluid ${data.user_type != 3 && "hr-admin-wrapper"} `}>
                                    <div className="container-fluid">

                                        {data.user_type != 3 ? (
                                            <div className={`row ${data.user_type != 3 && "hr-row-ml"}`}>
                                                <div className="col-md-12">
                                                    <MainContent>
                                                        {children}
                                                    </MainContent>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="row">
                                                <div className="col-12 col-md-3">
                                                    <Sidebar />
                                                </div>
                                                <div className="col-12 col-md-9">
                                                    <MainContent>
                                                        {children}
                                                    </MainContent>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}

                            {layoutProps.contentExtended && { children }}
                        </div>

                        {data.user_type != 3 ? (
                            <>
                                HR ADMIN Footer
                            </>
                        ) : (
                            <>
                                <Footer />
                            </>
                        )}



                    </div>
                    {/*end::Wrapper*/}
                </div>
                {/*end::Page*/}
            </div>
            {/* <QuickUser /> */}
            {/* <QuickPanel /> */}
            <ScrollTop />
            {/* <StickyToolbar/> */}
            {/*end::Main*/}
            <LayoutInit />
        </>
    ) : (
        // BLANK LAYOUT
        <div className="d-flex flex-column flex-root">{children}</div>
    );
}
