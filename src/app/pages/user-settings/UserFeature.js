import { Breadcrumb, Select, Tree } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import API from "../../helpers/devApi";
import { swalError, swalSuccess } from "../../helpers/swal";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as hractions from "../hr-admin/_redux/hrActions";

export default function UserFeature() {
  const dispatch = useDispatch();
  const { user, menuList } = useSelector((state) => ({
    user: state.auth.user,
    menuList: state.hr.menuList,
  }));
  const [userRole, setUserRole] = useState([]);
  const [userModule, setUserModule] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [moduleId, setModuleId] = useState(1);
  const [menus, setMenus] = useState([]);

  const [expandedKeys, setExpandedKeys] = useState(["0-0-0", "0-0-1"]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    if (user?.data) {
      const roles = user?.data?.roles.join(",");
      console.log({ roles });
      dispatch(hractions.getMenuList(roles));
    }
  }, [user]);

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  // role list
  const fetchUserRole = async () => {
    await API.get(`/career_portal_user_type`, {
      params: { user_type_id: user?.data?.user_type, exclude_applicant: true },
    }).then((res) => {
      if (res.data.success) {
        setUserRole(res.data.data.career_portal_user_type);
      }
    });
  };

  // parent module list
  const fetchParentModule = async () => {
    await API.get(`/sys_modules`).then((res) => {
      if (res.data.success) {
        setUserModule(res.data.data.sys_modules);
      } else {
        setUserModule([]);
      }
    });
  };

  const checked = [];

  const handleCheck = (treeData) => {
    treeData.forEach((data) => {
      if (
        data.checked &&
        (data.parent_menu > 0 || data.children?.length == 0)
      ) {
        checked.push(data.key);
      }
      if (data.children?.length > 0) {
        handleCheck(data.children);
      }
    });

    return checked;
  };

  const getTreeMenu = async (roleId) => {
    setMenus([]);
    await API.get(`/career_portal_menu_priviledge/menus/${roleId}`).then(
      (res) => {
        if (res.data.success) {
          const data = getNewTree(res.data.data);
          setMenus(data);

          const checked = handleCheck(data);
          setCheckedKeys(checked);
        }
      },
    );
  };

  // onchange menus order
  const nodeInfo = async (treeNode, value) => {
    for (let i = 0; i < treeNode.length; i++) {
      if (treeNode[i].id == value.id) {
        treeNode[i].granted = !value.granted;
      }
      treeNode[i].children = getRecure(treeNode[i], value);
      treeNode[i].menu_order = i;
      treeNode[i].parent_menu = 0;
    }

    setMenus(treeNode);
  };

  const getNewTree = (tree) =>
    tree.map(({ id, menu_name, children, granted, parent_menu }) => ({
      id: id,
      title: menu_name,
      key: id,
      checked: granted,
      parent_menu,
      children: getNewTree(children),
    }));

  // recursive
  const getRecure = (item, value) => {
    return (
      item.children &&
      item.children.length > 0 &&
      item.children.map((child, i) => {
        if (child.parent_menu != item.id) {
          child.parent_menu = item.id;
        }
        if (child?.id == value?.id) {
          child.granted = !value.granted;
        }
        child.menu_order = i;
        getRecure(child);
        return child;
      })
    );
  };

  const treeView = (list = menus) => {
    return (
      <ul>
        {list &&
          list.length > 0 &&
          list.map((item, i) => (
            <Fragment key={i}>
              <li className="d-flex align-item-center my-3">
                <input
                  type="checkbox"
                  defaultChecked={item.granted}
                  onChange={(e) => {
                    nodeInfo(menus, item);
                  }}
                  className="mr-3"
                />{" "}
                <span>
                  <h6 className="m-0">{item?.menu_name}</h6>
                </span>
              </li>
              {item.children &&
                item.children.length > 0 &&
                treeView(item.children)}
            </Fragment>
          ))}
      </ul>
    );
  };

  const treeToArr = (list, arr) => {
    for (let i = 0; i < list.length; i++) {
      arr.push(list[i]);
      if (list[i]?.children?.length > 0) {
        treeToArr(list[i]?.children, arr);
      }
    }
  };

  const handleSavetree = async () => {
    const arr = [];
    for (let i = 0; i < menus.length; i++) {
      arr.push(menus[i]);
      if (menus[i]?.children?.length > 0) {
        treeToArr(menus[i]?.children, arr);
      }
    }

    const data = [];
    for (let k = 0; k < arr.length; k++) {
      for (let l = 0; l < checkedKeys.length; l++) {
        if (arr[k].id == checkedKeys[l]) {
          data.push(arr[k]);
        }
      }
    }

    // const data = arr.filter((item) => item.granted == true);

    for (let j = 0; j < data.length; j++) {
      data[j].menu_id = data[j]?.id;
      data[j].role_id = roleId;
      // data[j].module_id = moduleId;
      if (data[j].parent_menu != 0) {
        const obj = arr.find((item) => item?.id == data[j].parent_menu);
        data.push(obj);
      }
    }

    const uniqueObjArray = [
      ...new Map(data.map((item) => [item["id"], item])).values(),
    ];

    const payload = uniqueObjArray?.map((item) => {
      return {
        menu_id: item?.menu_id,
        type_id: item?.role_id,
      };
    });

    await API.post(`/career_portal_menu_priviledge/`, payload)
      .then((res) => {
        if (res.data?.success) {
          swalSuccess();
          getTreeMenu(roleId);
          dispatch(hractions.getMenuList(roleId));
        } else {
          swalError();
        }
      })
      .catch((error) => {
        console.log(error);
        swalError();
      });
  };

  useEffect(() => {
    fetchUserRole();
    // fetchParentModule();
    if (roleId) {
      getTreeMenu(roleId);
    }
    if (roleId) {
      const roleInfo = userRole.filter(
        (data) => data.career_portal_user_type__id == roleId,
      );
      setRoleName(roleInfo && roleInfo[0]?.career_portal_user_type__name);
    }
  }, [roleId]);

  return (
    <>
      <div className="hr-admin-table-job-list">
        <nav>
          <ol className="breadcrumb bg-transparent">
            <li className="breadcrumb-item">
              {" "}
              <Link to="/hr-admin/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              {" "}
              <span className="text-dark">Menu Permission</span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="card">
        <div className="card-header p-5">
          <div className="title">
            <h2>Menu Permission</h2>
          </div>
        </div>
        <div className="card-body">
          <Form>
            <div className="row">
              <div className="col-md-12 mb-4">
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label className="col-md-4 user_role_label_title">
                    <i className="fas fa-user mr-2"></i>
                    User Type :
                  </Form.Label>

                  <Form.Control
                    as="select"
                    name="role_name"
                    value={roleId}
                    onChange={(e) => {
                      setRoleId(e.target.value);
                    }}
                    className="col-md-4 form-control form-control-solid"
                  >
                    <option>Select Role</option>
                    {userRole.length > 0 &&
                      userRole.map((data) => (
                        <option
                          key={data.career_portal_user_type__id}
                          value={data.career_portal_user_type__id}
                        >
                          {data.career_portal_user_type__name}
                        </option>
                      ))}
                    {userRole.length < 1 && <option>NO Data Found </option>}
                  </Form.Control>
                </Form.Group>
              </div>

              {/*   <div className="col-md-6 mb-4 mx-auto">
                            
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Select System Module</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="name"
                                            className="form-control form-control-solid"
                                            onChange={(e) => setModuleId(e.target.value)}
                                        >
                                            <option>Select Module </option>
                                            {userModule.length > 0 &&
                                            userModule.map(({ id, module_name }) => (
                                                <option key={id} value={id}>
                                                {module_name}
                                                </option>
                                            ))}
                                            {userModule.length < 1 && <option>No Data found</option>}
                                        </Form.Control>
                                    </Form.Group> 
                               
                            </div> */}

              {menus && menus.length > 0 && (
                <div className="col-md-12 mb-4">
                  <div className="card user_feature_card">
                    <div
                      className="card-header text-light p-5"
                      style={{ background: "darkblue" }}
                    >
                      <h5 className="mb-0">Menu Permission</h5>
                    </div>

                    <div className="card-body">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          textAlign: "center",
                          margin: "auto",
                        }}
                      >
                        {/* <h3 className="tree_title">
                                                    {" "}
                                                    Menu permission details of Role{" "}
                                                    <strong> {roleName ? roleName : ""}</strong>
                                                </h3> */}

                        <div className="py-5">
                          <Tree
                            showLine
                            // switcherIcon={<DownOutlined />}
                            checkable
                            onExpand={onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onCheck={onCheck}
                            checkedKeys={checkedKeys}
                            treeData={menus}
                          />
                          {/* menus && menus.length > 0 && treeView() */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="save_permission_btn mt-5 text-right">
                    {menus && menus.length > 0 && (
                      <Form.Group as={Row}>
                        <Col>
                          <Button
                            type="button"
                            onClick={handleSavetree}
                            className="btn btn-outline-success text-light"
                          >
                            Save Permission
                          </Button>
                        </Col>
                      </Form.Group>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
