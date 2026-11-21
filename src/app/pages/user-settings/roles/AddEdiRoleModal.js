import { Select } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Input } from "../../../../_metronic/_partials/controls";
import API from "../../../helpers/devApi";
import { swalError, swalSuccess } from "../../../helpers/swal";

const _init = {
  role_name: "",
  modules: [],
  default_module_id: undefined,
};

export const AddEditRoleModal = ({
  showDetails,
  setShowDetails,
  getEntityList,
  edit,
  setEdit,
  selectedRow,
  setSelectedRow,
}) => {
  const [role, setRole] = useState(_init);
  const [moduleList, setModuleList] = useState([]);
  const [defaultModuleList, setDefaultModuleList] = useState([]);

  // Validation schema
  const validationSchema = Yup.object().shape({
    role_name: Yup.string().required("Role Name is required"),
  });

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

  const handleAddRole = async (values, action) => {
    if (edit) {
      await API.patch(`/sys_roles/${selectedRow?.sys_roles__id}`, values)
        .then(async (res) => {
          if (!res.data?.error) {
            action.resetForm();
            await getEntityList();
            setShowDetails(false);
            setSelectedRow({});
            setEdit(false);
            swalSuccess(res.data?.message);
          } else {
            swalError("something went wrong");
          }
        })
        .catch((error) => {
          console.log(error);
          swalError("something went wrong");
        });
    } else {
      await API.post("/sys_roles", values)
        .then(async (res) => {
          if (!res.data?.error) {
            action.resetForm();
            swalSuccess(res.data?.message);
            await getEntityList();
            setShowDetails(false);
            setSelectedRow({});
          } else {
            swalError("something went wrong");
          }
        })
        .catch((error) => {
          console.log(error);
          swalError("something went wrong");
        });
    }
  };

  const handleDefaultModuleList = (values) => {
    let data = [];
    for (let i = 0; i < moduleList.length; i++) {
      for (let j = 0; j < values.modules?.length; j++) {
        if (moduleList[i]?.value == values.modules[j]) {
          data.push(moduleList[i]);
        }
      }
    }
    setDefaultModuleList(data);
  };

  useEffect(() => {
    getModuleList();
    if (edit) {
      const mod = selectedRow?.modules?.map((item) => {
        return item.id;
      });

      let data = [];
      for (let i = 0; i < moduleList.length; i++) {
        for (let j = 0; j < selectedRow.modules?.length; j++) {
          if (moduleList[i]?.value == selectedRow.modules[j]?.id) {
            data.push(moduleList[i]);
          }
        }
      }
      setDefaultModuleList(data);
      setRole(() => ({
        role_name: selectedRow.sys_roles__role_name,
        modules: mod,
        default_module_id: selectedRow.sys_roles__default_module_id,
      }));
    } else {
      setRole(_init);
    }
  }, [edit, selectedRow]);

  return (
    <Modal
      show={showDetails}
      onHide={() => {
        setShowDetails(false);
        setEdit(false);
        setSelectedRow({});
      }}
      size="md"
      aria-labelledby="example-modal-sizes-title-lg"
      centered={false}
    >
      {/* Base Products */}
      <div className="card card-custom">
        <div className="card-header border-0 py-5 d-flex justify-content-between">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark d-block">
              {edit ? "Update" : "Create"} User Role
            </span>
          </h3>
        </div>
      </div>
      <Formik
        enableReinitialize={true}
        initialValues={role}
        validationSchema={validationSchema}
        onSubmit={(values, action) => {
          handleAddRole(values, action);
        }}
      >
        {({ handleSubmit, errors, values, setFieldValue }) => (
          <Form>
            {JSON.stringify(values)}
            <Modal.Body>
              <div className="row">
                <div className="col-md-12 mb-3">
                  <Field
                    name="role_name"
                    component={Input}
                    placeholder="Enter Role Name"
                    label="Role Name"
                    value={values.role_name ?? ""}
                  />
                </div>
                <div className="col-md-12 mb-3">
                  <label>Select Modules</label>
                  <Select
                    mode="multiple"
                    placeholder="Please select"
                    defaultValue={values.modules ?? []}
                    value={values.modules ?? []}
                    onChange={(val) => {
                      setFieldValue("modules", val);
                    }}
                    onBlur={() => {
                      handleDefaultModuleList(values);
                    }}
                    style={{ width: "100%" }}
                    options={moduleList}
                  />
                </div>
                <div className="col-md-12">
                  <label>Select default Module</label>
                  <Select
                    placeholder="Please select"
                    defaultValue={values.default_module_id}
                    value={values.default_module_id ?? []}
                    onChange={(val) => {
                      setFieldValue("default_module_id", val);
                    }}
                    style={{ width: "100%" }}
                    options={defaultModuleList}
                  />
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="border-0">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setShowDetails(false);
                    setEdit(false);
                    setSelectedRow({});
                  }}
                  className="btn btn-secendary btn-elevate"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary btn-elevate"
                >
                  {edit ? "Update" : "Save"}
                </button>
              </div>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddEditRoleModal;
