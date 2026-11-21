import React, { useEffect, useState, useRef } from 'react'
import { Button, Input, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Link } from "react-router-dom"
import { TitleCard } from '../../components/cards/TitleCard';
import API from "../../helpers/devApi";
import { swalError, swalSuccess } from '../../helpers/swal';
import { Modal } from 'react-bootstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import * as hrRequest from '../hr-admin/_redux/hrRequest';

export default function UserTypeList() {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState('');
    const [dataSource, setDataSource] = useState([]);
    const [initData, setInitData] = useState({
        name: '',
        remark: '',
        id: 0
    });

    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getUserTypesList = () => {
        hrRequest.fetchUserTypes({ exclude_applicant: true })
            .then((res) => {
                const { data: { career_portal_user_type } } = res.data;
                setDataSource(career_portal_user_type);
            })
            .catch(err => {
                console.error(err);
            });
    }

    useEffect(() => {
        getUserTypesList();
    }, []);

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'career_portal_user_type__name',
            key: 'career_portal_user_type__name',
            // ...getColumnSearchProps('career_portal_user_type__name'),
            // sorter: (a, b) => a.career_portal_user_type__name.length - b.career_portal_user_type__name.length,
            // sortDirections: ['descend', 'ascend'],
            ellipsis: true,
            width: "350px",
        },
        {
            title: 'Remark',
            dataIndex: 'career_portal_user_type__remark',
            key: 'career_portal_user_type__remark',
            // ...getColumnSearchProps('career_portal_user_type__remark'),
            // sorter: (a, b) => a.career_portal_user_type__remark.length - b.career_portal_user_type__remark.length,
            // sortDirections: ['descend', 'ascend'],
            ellipsis: true,
        },
        {
            title: 'Action',
            dataIndex: 'career_portal_user_type__id',
            key: 'career_portal_user_type__id',
            align: 'center',
            width: "120px",
            render: (career_portal_user_type__id, item) => {
                return (
                    <div style={{ textAlign: 'center' }}>
                        <i
                            className='fas fa-edit'
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setInitData({
                                    name: item.career_portal_user_type__name,
                                    remark: item.career_portal_user_type__remark,
                                    id: career_portal_user_type__id
                                });
                                setShow(true);
                            }}
                        ></i>
                    </div>
                )
            },
            ellipsis: true,
        }
    ];

    const totalItems = dataSource?.length;
    const paginationConfig = {
        total: totalItems,
        pageSize: 10,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        remarks: Yup.string().nullable(),
    })

    const handleSubmit = async (values) => {
        if (values.id) {
            await API.patch(`/career_portal_user_type/${values.id}`, values)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('User type updated sucessfully');
                        getUserTypesList();
                        setShow(false);
                    } else {
                        swalError(res?.message, " ");
                    }
                })
                .catch((error) => {
                    console.log({ error })
                    swalError("someting went wrong");
                });
        } else {
            await API.post(`/career_portal_user_type`, values)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess('User type created sucessfully');
                        getUserTypesList();
                        setShow(false);
                    } else {
                        swalError(res?.message, " ");
                    }
                })
                .catch((error) => {
                    console.log({ error })
                    swalError("someting went wrong");
                });
        }
    }


    return (
        <>

            <div className="hr-admin-table-job-list">
                <nav>
                    <ol className="breadcrumb bg-transparent">
                        <li className="breadcrumb-item"> <Link to="/hr-admin/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item"> <span className="text-dark">User Type List</span></li>
                    </ol>
                </nav>

                <div className='card card_body_box mb-5'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='card_header_with_edit_btn'>
                                <div className='title'>
                                    <h2>User Type List</h2>
                                </div>

                                <button onClick={() => { setInitData({}); handleShow() }} className='btn btn-outline-primary'>Create user type</button>
                            </div> 
                        </div> 
                    </div>

                    <hr />

                    <Table
                        rowKey={(record) => record.career_portal_user_type__id}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ x: true }}
                        pagination={paginationConfig}
                    /> 
                </div>
 

                <Modal
                    show={show}
                    onHide={handleClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Formik
                        initialValues={initData}
                        validationSchema={validationSchema}
                        onSubmit={values => handleSubmit(values)}
                        enableReinitialize
                    >
                        {({ errors, touched, setFieldValue, values }) => (
                            <>

                                <Form>
                                    <Modal.Header>
                                        <Modal.Title className='cover_letter_modal_view'>
                                            <h2 className='mb-0'>{values.id ? 'Update' : 'Create'} user type</h2>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShow(false);
                                                }}
                                            >
                                                <i className="fas fa-times text-danger" style={{ fontSize: '26px' }}></i>
                                            </button>
                                        </Modal.Title>
                                    </Modal.Header>

                                    <Modal.Body>
                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                <label className="required"><b>Name</b></label><br />
                                                <Field
                                                    name="name"
                                                    component={Input}
                                                    placeholder="Enter name"
                                                    label="Name"
                                                    value={values.name ?? ""}
                                                    onChange={(event) => setFieldValue('name', event.target.value)}
                                                />
                                                <ErrorMessage name="name" component="div" className="error text-danger" />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label><b>Remark</b></label><br />
                                                <Field
                                                    name="remark"
                                                    as="textarea"
                                                    style={{ width: '100%' }}
                                                    rows="3"
                                                    placeholder="Enter Remark"
                                                    label="remark"
                                                    value={values.remark ?? ""}
                                                    onChange={(event) => setFieldValue('remark', event.target.value)}
                                                />
                                                <ErrorMessage name="remark" component="div" className="error text-danger" />
                                            </div>
                                        </div>
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <button
                                            type="button"
                                            className="btn btn-default"
                                            onClick={() => {
                                                setShow(false);
                                            }}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            type="submit"
                                        >
                                            Submit
                                        </button>
                                    </Modal.Footer>

                                </Form>
                            </>
                        )}
                    </Formik>
                </Modal>



            </div>
        </>
    )
}