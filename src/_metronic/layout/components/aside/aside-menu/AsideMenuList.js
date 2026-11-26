/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { checkIsActive } from "../../../../_helpers";
import { useSelector, useDispatch } from "react-redux";
import * as hractions from "../../../../../app/pages/hr-admin/_redux/hrActions";

export function AsideMenuList({ layoutProps }) {
  const [menus, setMenus] = useState([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, menuList } = useSelector((state) => ({
    user: state.auth.user,
    menuList: state.hr.menuList,
  }));

  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  useEffect(() => {
    if (menuList) {
      const menuData =
        menuList &&
        menuList.length > 0 &&
        menuList
          .map((row, k) => {
            if (row?.granted || row?.menu_name == "Settings") {
              return {
                menu: row?.menu_name,
                url: row?.menu_url,
                icon: row?.menu_icon || "fas fa-briefcase",
                submenu:
                  row.children &&
                  row.children.length > 0 &&
                  row.children.map((col) => {
                    if (
                      col?.granted ||
                      col?.menu_url == "user-setting/user-feature"
                    ) {
                      return {
                        menu: col?.menu_name,
                        url: col?.menu_url,
                      };
                    }
                  }),
              };
            }
          })
          .filter(Boolean);

      setMenus(menuData);
    }
  }, [menuList]);
  console.log({ menuList });
  useEffect(() => {
    if (user?.data) {
      const roles = user?.data?.roles.join(",");
      console.log({ roles });
      dispatch(hractions.getMenuList(roles));
    }
  }, [user]);

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/* dashboard static menu start */}
        {/* <li
                    className={`menu-item ${getMenuItemActive(`/dashboard`, true)}`}
                    aria-haspopup="true"
                >
                    <NavLink className="menu-link menu-toggle active" to={`/dashboard`}>
                        <span className="svg-icon menu-icon">
                            <SVG
                                src={toAbsoluteUrl(
                                    "/media/svg/icons/Layout/Layout-arrange.svg"
                                )}
                            />
                        </span>
                        <span className="menu-text">Dashboard</span>
                    </NavLink>
                </li> */}
        {/* dashboard static menu end */}

        {menuList &&
          menuList?.length > 0 &&
          menuList?.map((menu, key) => (
            <li
              key={key}
              className={`menu-item ${menu?.submenu ? "menu-item-submenu" : ""} ${getMenuItemActive(`/${menu?.url}`, true)}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              {/* {JSON.stringify(menu)} */}
              <NavLink
                className="menu-link menu-toggle"
                to={menu?.url ? `/${menu?.url}` : "/hr-admin/dashboard"}
              >
                <span className="svg-icon menu-icon">
                  <i className={menu?.icon}></i>
                </span>
                <span className="menu-text">{menu?.name}</span>
                {menu?.submenu ? <i className="menu-arrow" /> : ""}
              </NavLink>

              {menu?.submenu ? (
                <div className="menu-submenu">
                  <i className="menu-arrow" />
                  <ul className="menu-subnav">
                    <li key="0" className="menu-item  menu-item-parent">
                      <span className="menu-link">
                        <span className="menu-text">{menu?.menu}</span>
                      </span>
                    </li>
                    {menu?.submenu.map(
                      (submenu, index) =>
                        submenu && (
                          <li
                            key={index + 1}
                            className={`menu-item  ${getMenuItemActive(
                              `/${submenu?.url}`,
                            )}`}
                          >
                            <NavLink
                              className="menu-link  menu-toggle"
                              to={`/${submenu?.url}`}
                            >
                              <i className="menu-bullet menu-bullet-dot">
                                <span />
                              </i>
                              <span className="menu-text">{submenu?.menu}</span>
                              {submenu?.thirdmenu ? (
                                <i className="menu-arrow" />
                              ) : (
                                ""
                              )}
                            </NavLink>
                          </li>
                        ),
                    )}
                  </ul>
                </div>
              ) : (
                ""
              )}
            </li>
          ))}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
