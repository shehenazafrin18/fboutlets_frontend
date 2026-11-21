import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import swal from "sweetalert";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import {
    useTable,
    useSortBy,
    usePagination,
    useGlobalFilter,
} from "react-table";
import GlobalFilter from "../../../_metronic/table/GlobalFilter";
import DeleteModal from "../../../_metronic/table/DeleteModal";
import TablePagination from "../../../_metronic/table/TablePagination";
import EditUserTypeModal from "../../../_metronic/table/EditUserTypeModal";

// Main Component
function UserTypeList() {
    const [users, setUsers] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});

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
                minWidth: 30,
                width: 30,
            },
            {
                Header: "Type",
                accessor: "type",
                paddingLeft: "0px",
            },
            {
                Header: "Status",
                sortType: "basic",
                paddingLeft: "0px",
                accessor: (a) =>
                    a.is_management ? (
                        <span className="label label-lg label-light-primary label-inline">
                            Management
                        </span>
                    ) : (
                        <span className="label label-lg label-light-danger label-inline">
                            Non Management
                        </span>
                    ),
            },
            {
                Header: "Rank",
                accessor: "rank",
                paddingLeft: "0px",
            },
            {
                Header: "Remark",
                accessor: "remark",
                //  accessor:(row)=>(<p>
                //   {
                //   row.remark?`${row.remark}`:"N/A"
                // }
                // </p>),
                paddingLeft: "0px",
            },
            {
                Header: "Actions",
                paddingLeft: "0px",
                minWidth: 70,
                width: 80,
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
                                    title="Edit"
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
                                    title="Delete"
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

    const {
        user: { accessToken, refreshToken },
    } = useSelector((state) => state.auth);

    const fetchUser = async () => {
        try {
            const { data } = await Axios.post(
                `${process.env.REACT_APP_API_URL}/user-type/list`,
                { requiredFields: ["id", "type", "is_management", "rank", "remark"] },
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
        } catch (error) {
            swal({
                title: "Error!",
                text: error.response.data.message,
                icon: "error",
                timer: 3000,
            });
        }
    };

    useEffect(() => {
        fetchUser();
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
                            User Type Lists
                        </span>
                        <span className="text-muted mt-3 font-weight-bold font-size-sm">
                            Total {users.length} Types
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
                url="user-type"
            />

            {/* Edit Modal */}
            <EditUserTypeModal
                setShowEdit={setShowEdit}
                showEdit={showEdit}
                url="user-type"
                fetchUser={fetchUser}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                accessToken={accessToken}
                refreshToken={refreshToken}
            />
        </>
    );
}

export default UserTypeList;
