import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import swal from "sweetalert";
import Axios from "axios";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import GlobalFilter from "../../../_metronic/table/GlobalFilter";
import DeleteModal from "../../../_metronic/table/DeleteModal";
import TablePagination from "../../../_metronic/table/TablePagination";
import EditRoleWiseFeatureModal from "../../../_metronic/table/EditRoleWiseFeatureModal";

function UserRoleWiseFeatureDev() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [systemFeature, setSystemFeature] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const {
    user: { accessToken, refreshToken },
  } = useSelector((state) => state.auth);

  const data = React.useMemo(() => users, [users]);
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: (row, index) => (
          <div className="d-flex align-items-center pl-4">
            <div>
              <h4 className="text-dark-75 font-weight-bolder mb-1 font-size-sm">
                {index + 1}
              </h4>
            </div>
          </div>
        ),
        minWidth: 40,
        width: 40,
      },
      {
        Header: "Type",
        accessor: "user_type",
        paddingLeft: "0px",
      },
      {
        Header: "Role",
        paddingLeft: "0px",
        accessor: "user_role_name",
      },
      {
        Header: "Module",
        accessor: "system_mdoule_name",
        paddingLeft: "0px",
      },
      {
        Header: "Feauture",
        accessor: "feature_name",
        paddingLeft: "0px",
      },
      {
        Header: "Menu",
        accessor: "frontend_menu",
        paddingLeft: "0px",
      },
      {
        Header: "Controller Function",
        accessor: "controller_function",
        paddingLeft: "0px",
      },
      {
        Header: "URL",
        accessor: "url_path",
        paddingLeft: "0px",
      },
      {
        Header: "Metohod",
        accessor: "http_method",
        paddingLeft: "0px",
      },
      {
        Header: "Actions",
        paddingLeft: "0px",
        minWidth: 100,
        width: 150,
        Cell: ({ row }) => (
          <>
            <button
              onClick={() => {
                setSelectedUser(row.original);
                setShowEdit(true);
              }}
              className="btn btn-icon btn-light btn-hover-primary btn-sm mr-3"
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Write.svg"
                  )}
                />
              </span>
            </button>
            <button
              onClick={() => {
                setSelectedUser(row.original);
                setShowDelete(true);
              }}
              className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                />
              </span>
            </button>
          </>
        ),
      },
    ],
    []
  );

  const fetchUser = async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_API_URL}/user-role-feature/listByCompany`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
      }
    );
    if (!data.error) {
      setUsers(data.data.data);
    }
  };
  const fetchRole = async () => {
    const { data } = await Axios.post(
      `${process.env.REACT_APP_API_URL}/user-role/list`,
      { requiredFields: ["id", "name"] },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
      }
    );
    if (!data.error) {
      setRoles(data.data.data);
    }
  };
  const fetchSystemFeature = async () => {
    const { data } = await Axios.post(
      `${process.env.REACT_APP_API_URL}/system-feature/list`,
      { requiredFields: ["id", "feature_name"] },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
      }
    );
    if (!data.error) {
      setSystemFeature(data.data.data);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchRole();
    fetchSystemFeature();
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <>
      <div className="card card-custom">
        <div className="card-header border-0 py-5 d-flex justify-content-between">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark d-block">
              Role wise feature lists
            </span>
            <span className="text-muted mt-3 font-weight-bold font-size-sm">
              Total {users.length} Role wise feature lists
            </span>
          </h3>
          <div className="card-toolbar">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="card-body py-0">
          <div className="tab-content">
            <div className="table-responsive">
              <table
                {...getTableProps()}
                className="table table-head-custom table-head-bg table-borderless table-vertical-center"
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps({
                              style: {
                                minWidth: column.minWidth,
                                width: column.width,
                                paddingLeft: column.paddingLeft,
                              },
                            })
                          )}
                          className="datatable-cell datatable-cell-sort datatable-cell-sorted"
                        >
                          <span className="text-dark-75">
                            {column.render("Header")}
                          </span>
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <i
                                  className="flaticon2-arrow-up"
                                  style={{
                                    color: "#3699FF",
                                    fontSize: ".6rem",
                                    marginLeft: "10px",
                                  }}
                                ></i>
                              ) : (
                                <i
                                  className="flaticon2-arrow-down"
                                  style={{
                                    color: "#3699FF",
                                    fontSize: ".6rem",
                                    marginLeft: "10px",
                                  }}
                                ></i>
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className="text-dark-75 mb-1"
                        style={{ borderBottom: "1px dashed #EBEDF3" }}
                      >
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="pl-0 py-3 font-size-sm"
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <TablePagination
          canPreviousPage={canPreviousPage}
          gotoPage={gotoPage}
          previousPage={previousPage}
          nextPage={nextPage}
          canNextPage={canNextPage}
          pageIndex={pageIndex}
          pageOptions={pageOptions}
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageCount={pageCount}
        />
      </div>

      {/* Delete Modal */}
      <DeleteModal
        showDelete={showDelete}
        setShowDelete={setShowDelete}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        fetchUser={fetchUser}
        title="Delete Role"
        accessToken={accessToken}
        refreshToken={refreshToken}
        url="user-role-feature"
      />

      {/* Edit Modal */}
      <EditRoleWiseFeatureModal
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        url="user-role-feature"
        fetchUser={fetchUser}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        accessToken={accessToken}
        refreshToken={refreshToken}
        roles={roles}
        systemFeature={systemFeature}
      />
    </>
  );
}

export default UserRoleWiseFeatureDev;
