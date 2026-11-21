import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SVG from "react-inlinesvg";
// import moment from "moment";
import Axios from "axios";
import { Button, Spinner } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import RoleFeatureTable from "../../../_metronic/table/RoleWiseFeatureTable";
// import { Link } from 'react-router-dom'
import DeleteModal from "../../../_metronic/table/DeleteModal";

// const dateFormat = "YYYY-MM-DD";

function UserRoleWiseFeatureList() {
    const [lists, setLists] = useState([]);
    const [productTypes, setProductTypes] = useState([]);

    // const [status, setStatus] = useState("");
    const [types, setTypes] = useState("");
    const [loading, setLoading] = useState(true);
    // const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showAddDataModal, setShowAddDataModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const {
        user: { accessToken, refreshToken },
    } = useSelector((state) => state.auth);

    const data = React.useMemo(() => lists, [lists]);
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
                minWidth: 50,
                width: 50,
            },
            {
                Header: "Module Name",
                accessor: "system_mdoule_name",
                paddingLeft: "0px",
            },
            {
                Header: "Feature Name",
                accessor: "feature_name",
                paddingLeft: "0px",
            },

            {
                Header: "Actions",
                paddingLeft: "0px",
                minWidth: 120,
                width: 120,
                Cell: ({ row }) => (
                    <>
                        <button
                            onClick={() => {
                                setSelectedData(row.original);
                                setShowDelete(true);
                            }}
                            className="btn btn-icon btn-light btn-hover-danger btn-sm mx-3"
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

    const fetchLists = async () => {
        const { data } = await Axios.post(
            `${process.env.REACT_APP_API_URL}/user-role-feature/userRoleFeatureByUserRoleId`,
            {
                user_role_id: types
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    refreshToken: refreshToken,
                },
            }
        );
        if (!data.error) {
            setLists(data.data.data);
            setLoading(false);
            // console.log(date_from,date_to);
            //console.log(status,types);
        } else {
            setLists([]);
        }
    };
    const fetchProductTypes = async () => {
        const { data } = await Axios.post(
            `${process.env.REACT_APP_API_URL}/user-role/list`,
            {

            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    refreshToken: refreshToken,
                },
            }
        );
        if (!data.error) {
            setProductTypes(data.data.data);
        } else {
            setProductTypes([]);
        }
    };

    useEffect(() => {
        fetchProductTypes();
    }, []);
    useEffect(() => {
        fetchLists();
    }, [types]);

    if (loading) {
        return (
            <div className="card py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <Button variant="primary" disabled>
                            <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            Loading...
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <RoleFeatureTable
                columns={columns}
                data={data}
                setShowAddDataModal={setShowAddDataModal}
                title="Role Wise Feature Lists"
                lists={lists}
                hideAddButton={true}
                categoryList={productTypes}
                types={types}
                setTypes={setTypes}
            />

            {/* Delete Modal */}
            <DeleteModal
                showDelete={showDelete}
                setShowDelete={setShowDelete}
                selectedUser={selectedData}
                setSelectedUser={setSelectedData}
                fetchUser={fetchLists}
                title="Delete User Role Feature Item"
                accessToken={accessToken}
                refreshToken={refreshToken}
                url="user-role-feature"
            />
        </>
    );
}

export default UserRoleWiseFeatureList;
