import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as hractions from "../hr-admin/_redux/hrActions"
import { Button, Input, Space, Table, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Link } from "react-router-dom"
import { TitleCard } from '../../components/cards/TitleCard';
import API from "../../helpers/devApi";
import { swalError, swalSuccess } from '../../helpers/swal';
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { CSVLink } from "react-csv";
import { Modal } from 'react-bootstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import * as hrRequest from '../hr-admin/_redux/hrRequest';

const _init = {
    first_name: '',
    last_name: '',
    middle_name: '',
    contact_number: '',
    email: '',
    user_type_id: '',
    password: ''
}

export default function UserList() {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selected, setSelected] = useState([]);
    const [userTypes, setUserTypes] = useState([]);
    const [initData, setInitData] = useState(_init);

    const animatedComponents = makeAnimated();

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

    const { user, careerPortalUserList } = useSelector((state) => ({
        user: state.auth.user,
        careerPortalUserList: state.hr.careerPortalUserList
    }));

    const associations = [
        {
            association: 'career_portal_user_type',
            attributes: ['name']
        }
    ]

    useEffect(() => {
        dispatch(hractions.getCareerPortalUserList({}));
    }, [dispatch, user, page, size, searchText]);

    useEffect(() => {
        hrRequest.fetchUserTypes({ exclude_applicant: true })
            .then((res) => {
                const { data: { career_portal_user_type } } = res.data;
                setUserTypes(
                    career_portal_user_type.map((item) => ({ label: item.career_portal_user_type__name, value: item.career_portal_user_type__id }))
                );
            })
            .catch(err => {
                console.error(err);
            });
    }, [])



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
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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


    const selectedIdArr = selected.map(d => d.value);
    const dataSource = careerPortalUserList && careerPortalUserList?.career_portal_user.filter((row) => {
        return (selected.length == 0 ? true : (selectedIdArr.includes(row.career_portal_user__id) || selectedIdArr.includes('all')))
    }).map((row, k) => {
        return (
            {
                ...row,
                ['key']: row.hrms_applicant__id,
                ['index']: k + 1,
            }
        )
    })



    const columns = [
        {
            title: 'S.L',
            dataIndex: 'index',
            sorter: (a, b) => a.index - b.index,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'First Name',
            dataIndex: 'career_portal_user__first_name',
            key: 'career_portal_user__first_name',
            ...getColumnSearchProps('career_portal_user__first_name'),
            sorter: (a, b) => a.career_portal_user__first_name.length - b.career_portal_user__first_name.length,
            sortDirections: ['descend', 'ascend'],
            ellipsis: true,
        },
        {
            title: 'Middle Name',
            dataIndex: 'career_portal_user__middle_name',
            key: 'career_portal_user__middle_name',
            ...getColumnSearchProps('career_portal_user__middle_name'),
            sorter: (a, b) => a.career_portal_user__middle_name.length - b.career_portal_user__middle_name.length,
            sortDirections: ['descend', 'ascend'],
            ellipsis: true,
        },
        {
            title: 'Last Name',
            dataIndex: 'career_portal_user__last_name',
            key: 'career_portal_user__last_name',
            ...getColumnSearchProps('career_portal_user__last_name'),
            sorter: (a, b) => a.career_portal_user__last_name.length - b.career_portal_user__last_name.length,
            sortDirections: ['descend', 'ascend'],
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'career_portal_user__email',
            key: 'career_portal_user__email',
            ...getColumnSearchProps('career_portal_user__email'),
        },
        {
            title: 'Phone No',
            dataIndex: 'career_portal_user__contact_number',
            key: 'career_portal_user__contact_number',
            ...getColumnSearchProps('career_portal_user__contact_number'),
            ellipsis: true,
            align: 'left',
        },
        {
            title: 'User Type',
            dataIndex: 'career_portal_user_type__name',
            key: 'career_portal_user_type__name',
            ...getColumnSearchProps('career_portal_user_type__name'),
            ellipsis: true,
        },
        {
            title: 'Action',
            dataIndex: 'career_portal_user__id',
            key: 'career_portal_user__id',
            fixed: 'right',
            render: (userId, item) => {
                if (['Super Admin', 'Admin'].includes(user.data?.user_type_name)) {
                    return <div style={{ textAlign: 'center' }}> <i style={{ cursor: 'pointer' }} onClick={() => handleEditUser(item)} className='fas fa-edit'></i></div>
                }
            },
            ellipsis: true,
        },
    ];

    const headers = [
        {
            label: 'S.L',
            key: 'index',
        },
        {
            label: 'First Name',
            key: 'career_portal_user__first_name',
        },
        {
            label: 'Middle Name',
            key: 'career_portal_user__middle_name',
        },
        {
            label: 'Last Name',
            key: 'career_portal_user__last_name',
        },
        {
            label: 'Email',
            key: 'career_portal_user__email',
        },
        {
            label: 'Phone No',
            key: 'career_portal_user__contact_number',
        },
        {
            label: 'User Type',
            key: 'career_portal_user_type__name'
        }
    ];


    const totalItems = dataSource?.length;
    const paginationConfig = {
        total: totalItems,
        pageSize: 10,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    };


    const jobListOption = careerPortalUserList && careerPortalUserList?.career_portal_user && careerPortalUserList?.career_portal_user?.map(function (item) {
        return {
            value: item?.career_portal_user__id,
            label: `${item.career_portal_user__first_name || ''} ${item.career_portal_user__middle_name || ''} ${item.career_portal_user__last_name || ''}`
        };
    });

    const jobhandleChange = (selectedOption) => {
        setSelected(selectedOption);
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setInitData(_init);
        setShow(true);
    }

    const handleEditUser = (item) => {
        setInitData({
            id: item.career_portal_user__id,
            first_name: item.career_portal_user__first_name,
            middle_name: item.career_portal_user__middle_name,
            last_name: item.career_portal_user__last_name,
            contact_number: item.career_portal_user__contact_number,
            email: item.career_portal_user__email,
            user_type_id: item.career_portal_user__user_type_id,
            user_type: {
                label: item.career_portal_user_type__name,
                value: item.career_portal_user__user_type_id
            }
        });
        setShow(true);
    }


    const validationSchema = Yup.object().shape({
        first_name: Yup.string().required('First name is Required'),
        middle_name: Yup.string().nullable(),
        last_name: Yup.string().required('Last name is Required'),
        contact_number: Yup.string()
            .nullable()
            .matches(/^\d{1,11}$/, 'Phone number must be a maximum of 11 digits')
            .matches(/^(\+?\d{1,3}[- ]?)?\d{10}$/, 'Please provide a valid phone number'),
        email: Yup.string().email('Please provide a valid email').required('Required'),
        password: Yup.string().when('id', (id) =>
            id ? Yup.string().min(6) : Yup.string().min(6).required('Required')
        ),
        confirm_password: Yup.string().when('password', (password, schema) =>
            password ? schema.min(6).required('Required').oneOf([Yup.ref('password')], "Passwords don't match") : schema
        ),
        user_type_id: Yup.number().required('Required'),
    });


    const handleSubmit = async (values) => {
        let url = '/career_portal_user';
        if (values.id) {
            url = url + '/' + values.id;
            await API.patch(url, values)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess(`User updated sucessfully`);
                        dispatch(hractions.getCareerPortalUserList({}));
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
            await API.post(url, values)
                .then((res) => {
                    if (res?.data?.success) {
                        swalSuccess(`User created sucessfully`);
                        dispatch(hractions.getCareerPortalUserList({}));
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
                        <li className="breadcrumb-item"> <span className="text-dark">User List</span></li>
                    </ol>
                </nav>

                <TitleCard title="User List" className="applicant_list_section">
                    <div className='row py-5'>
                        <div className='col-md-8'>
                            <form className='row'>
                                <div className='col-md-5' style={{ zIndex: 1 }}>
                                    <Select
                                        options={jobListOption}
                                        placeholder="Select User Name"
                                        onChange={jobhandleChange}
                                        autoFocus={true}
                                        isMulti
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className='col-md-4 text-right'>
                            <Tooltip title="Export to Excel">
                                <CSVLink
                                    headers={headers}
                                    filename={"Career_Portal_User_List"}
                                    data={dataSource ? dataSource : []}
                                    className="btn btn-outline-primary mr-2"
                                >
                                    Export to Excel
                                </CSVLink>
                            </Tooltip>

                            {
                                ['Admin', 'Super Admin'].includes(user?.data?.user_type_name) && (
                                    <Tooltip title="Create new user">
                                        <button onClick={handleShow} className='btn btn-outline-primary'>Create user</button>
                                    </Tooltip>
                                )
                            }
                        </div>

                    </div>


                    <Table
                        rowKey={(record) => record.career_portal_user__id}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ x: true }}
                        pagination={paginationConfig}
                    />
                </TitleCard>



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
                                            <h2 className='mb-0'>Create new user</h2>
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
                                                <label className="required"><b>First name</b></label><br />
                                                <Field
                                                    name="first_name"
                                                    component={Input}
                                                    placeholder="Enter First Name"
                                                    label="First Name"
                                                    value={values.first_name ?? ""}
                                                    onChange={(event) => setFieldValue('first_name', event.target.value)}
                                                />
                                                {/* <ErrorMessage name="first_name" component="div" className="error text-danger" /> */}
                                                {errors.first_name && touched.first_name ? (
                                                    <div className="text-danger">{errors.first_name}</div>
                                                ) : null}
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label><b>Middle name</b></label><br />
                                                <Field
                                                    name="middle_name"
                                                    component={Input}
                                                    placeholder="Enter Middle Name"
                                                    label="Middle Name"
                                                    value={values.middle_name ?? ""}
                                                    onChange={(event) => setFieldValue('middle_name', event.target.value)}
                                                />
                                                <ErrorMessage name="middle_name" component="div" className="error text-danger" />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label className="required"><b>Last name</b></label><br />
                                                <Field
                                                    name="last_name"
                                                    component={Input}
                                                    placeholder="Enter Last Name"
                                                    label="Last Name"
                                                    value={values.last_name ?? ""}
                                                    onChange={(event) => setFieldValue('last_name', event.target.value)}
                                                />
                                                <ErrorMessage name="last_name" component="div" className="error text-danger" />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label><b>Phone no</b></label><br />
                                                <Field
                                                    name="contact_number"
                                                    component={Input}
                                                    placeholder="Enter Phone No"
                                                    label="Phone no"
                                                    value={values.contact_number ?? ""}
                                                    onChange={(event) => setFieldValue('contact_number', event.target.value)}
                                                    maxLength={11}
                                                />
                                                <ErrorMessage name="contact_number" component="div" className="error text-danger" />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label className="required"><b>Email</b></label><br />
                                                <Field
                                                    name="email"
                                                    component={Input}
                                                    placeholder="Enter Email"
                                                    label="Email"
                                                    value={values.email ?? ""}
                                                    onChange={(event) => setFieldValue('email', event.target.value)}
                                                />
                                                <ErrorMessage name="email" component="div" className="error text-danger" />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label className={!values.id ? "required" : ""}><b>Password</b></label><br />
                                                <Field
                                                    name="password"
                                                    component={Input}
                                                    placeholder="Enter Password"
                                                    label="Password"
                                                    value={values.password ?? ""}
                                                    onChange={(event) => setFieldValue('password', event.target.value)}
                                                    type='password'
                                                />
                                                <ErrorMessage name="password" component="div" className="error text-danger" />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label className={!values.id ? "required" : ""}><b>Confirm Password</b></label><br />
                                                <Field
                                                    name="confirm_password"
                                                    component={Input}
                                                    placeholder="Enter Confirm Password"
                                                    label="Confirm password"
                                                    value={values.confirm_password ?? ""}
                                                    onChange={(event) => setFieldValue('confirm_password', event.target.value)}
                                                    type='password'
                                                />
                                                <ErrorMessage name="confirm_password" component="div" className="error text-danger" />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label className="required"><b>User type</b></label><br />
                                                <Select
                                                    name='user_type_id'
                                                    placeholder='Select user type'
                                                    onChange={(item) => {
                                                        setFieldValue('user_type_id', item.value);
                                                        setFieldValue('user_type', item);
                                                    }}
                                                    value={values.user_type}
                                                    options={userTypes}
                                                />
                                                <ErrorMessage name="user_type_id" component="div" className="error text-danger" />
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