/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { Routes } from "../app/Routes";
import { I18nProvider } from "../_metronic/i18n";
import { LayoutSplashScreen } from "../_metronic/layout";
import { Toaster } from "react-hot-toast";
import 'antd/dist/reset.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LogoutListener from "./LoginoutListener";

export default function App({ store, basename }) {
  return (
    /* Provide Redux store */

    <Provider store={store}>
      {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
      {/* <PersistGate persistor={persistor} loading={<LayoutSplashScreen />}> */}
      {/* Add high level `Suspense` in case if was not handled inside the React tree. */}
      <React.Suspense fallback={<LayoutSplashScreen />}>
        {/* Override `basename` (e.g: `homepage` in `package.json`) */}
        <HashRouter basename={basename}>
          {/*This library only returns the location that has been active before the recent location change in the current window lifetime.*/}

          {/* Provide `react-intl` context synchronized with Redux state.  */}
          <I18nProvider>
            {/* Render routes with provided `Layout`. */}
            <Toaster />
            <Routes />
            <LogoutListener />
          </I18nProvider>
        </HashRouter>
      </React.Suspense>
      {/* </PersistGate> */}
    </Provider>
  );
}
