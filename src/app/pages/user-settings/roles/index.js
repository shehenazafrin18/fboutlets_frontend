import React, { useEffect, useMemo, useState } from "react";
import API from "../../../helpers/devApi";
import TableComponent from "../../../../_metronic/table/TableComponent";
import moment from "moment";
import { AddEditRoleModal } from "./AddEdiRoleModal";
import SVG from "react-inlinesvg";
import { swalConfirm, swalError, swalSuccess } from "../../../helpers/swal";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";

export const UserRoles = () => {
  const [entities, setEntities] = useState([]);
  const [moduleList, setModuleList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const getModuleList = async () => {
    await API.get("/sys_modules?all=1")
      .then((res) => {
        if (!res.data.error) {
          setModuleList(() =>
            res.data?.data?.sys_modules?.map((item) => {
              return {
                label: item?.module_name,
                value: item?.id,
              };
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // get list
  const getEntityList = async () => {
    await API.get("/sys_roles")
      .then((res) => {
        if (res.data.success) {
          setEntities(res.data?.data?.sys_roles);
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  // handle edit
  const handleEdit = async (data) => {
    setShowModal(true);
    setEdit(true);
    setSelectedRow(data);
  };

  // handle Delete
  const handleDelete = async (id) => {
    swalConfirm().then(async (res) => {
      if (res.isConfirmed) {
        await API.delete(`/sys_roles/${id}`)
          .then(async (res) => {
            if (res.data.success) {
              swalSuccess(res.data.data?.message);
              await getEntityList();
            } else {
              swalError("something went wrong");
            }
          })
          .catch((error) => {
            swalError("something went wrong");
          });
      }
    });
  };

  const data = useMemo(() => entities, [entities]);
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: (row, index) => (
          <div className="d-flex align-items-center pl-4">
            <div>
              <h4 className="font-weight-bolder mb-1 font-size-sm">
                {index + 1}
              </h4>
            </div>
          </div>
        ),
        minWidth: 50,
        width: 50,
      },
      {
        Header: "role name",
        accessor: "sys_roles__role_name",
        paddingLeft: "0px",
      },
      {
        Header: "modules",
        accessor: "modules",
        paddingLeft: "0px",
        Cell: ({ row, cell }) => (
          <div className="d-flex g-5">
            {cell.value?.map((item, i) => (
              <div key={i} className="bg-secondary mr-3 px-3 py-1">
                {item?.module_name}
              </div>
            ))}
          </div>
        ),
      },
      {
        Header: "default module",
        accessor: "sys_roles__default_module_id",
        paddingLeft: "0px",
        Cell: ({ row, cell }) => (
          <div className="d-flex g-5">
            {moduleList?.find((item) => item?.value == cell.value)?.label}
          </div>
        ),
      },
      {
        Header: "Action",
        paddingLeft: "0px",
        width: 160,
        minWidth: 160,
        Cell: ({ row }) => (
          <>
            <button
              onClick={() => {
                handleEdit(row.original);
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
                handleDelete(row.original?.sys_roles__id);
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
    [entities]
  );

  useEffect(() => {
    getModuleList();
    getEntityList();
  }, []);

  return (
    <div className="card">
      <TableComponent
        data={data ?? []}
        columns={columns}
        lists={entities ?? []}
        title="User Role List"
        hideAddButton={false}
        setShowAddDataModal={setShowModal}
      />

      <AddEditRoleModal
        setShowDetails={setShowModal}
        showDetails={showModal}
        getEntityList={getEntityList}
        setEdit={setEdit}
        edit={edit}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
};

export default UserRoles;
