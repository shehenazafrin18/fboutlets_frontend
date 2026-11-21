import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as hractions from "../_redux/hrActions"
import { Button, Dropdown, Input, Space, Switch, Table, Tooltip } from 'antd';
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import { useParams, Link } from "react-router-dom"
import { TitleCard } from '../../../components/cards/TitleCard';
import API from "../../../helpers/devApi";
import { swalError, swalSuccess } from '../../../helpers/swal';
import { useHistory } from 'react-router-dom';
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { CSVLink } from "react-csv";
import { Modal } from 'react-bootstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { downloadApplicant } from '../_redux/hrRequest';

export default function Applicant() {
    const { id } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const [status, setStatus] = useState(1);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [jobPositionText, setJobPositionText] = useState("");
    const [selectedKey, setSelectedKeys] = useState([]);
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selectedData, setSelectedData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [downloadingData, setDownloading] = useState({ word: false, pdf: false })
    const [blacklistInfo, setBlacklistInfo] = useState({});

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

    const { user, applicantByJobId, applicantList } = useSelector((state) => ({
        user: state.auth.user,
        applicantByJobId: state.hr.applicantByJobId,
        applicantList: state.hr.applicantList,
    }));


    useEffect(() => {
        dispatch(hractions.getApplicantList({ status }));
    }, [dispatch, user, page, size, searchText]);

    const totalPages = applicantList?.totalPages;

    const sizeArr = Array.from({ length: totalPages }, (_, index) => {
        const value = (index + 1) * size;
        return <option key={value} value={value}>{value} / Page</option>;
    });

    const pageArr = Array.from({ length: totalPages }, (_, index) => (
        <li key={index} className="page-item"
            style={{
                backgroundColor: page === index + 1 ? '#007bff' : '',
                color: page === index + 1 ? '#fff' : '',
            }}>
            <a className="page-link" onClick={() => setPage(index + 1)}>{index + 1} </a>
        </li>
    ));

    const downloadCv = async (type, downloadAll) => {
        setDownloading({ ...downloadingData, [type]: true })
        const applicantIds = downloadAll ? dataSource.map(d =>  d.hrms_applicant__id) : selectedData.map(d => d.hrms_applicant__id)
        const response = await downloadApplicant(applicantIds, type);
        if (response.data.success) {
            swalSuccess(response.data.message)
            let a = document.createElement('a')
            console.log(process.env.REACT_APP_API_URL.replace('/api/v1', ''))
            a.target = "_blank"
            a.href = process.env.REACT_APP_API_URL.replace('/api/v1', '') + '/' + response.data.data.file;
            let filename = response.data.data.file.split('/')
            filename = filename[filename.length - 1];
            a.download = filename;
            a.click();

        } else {
            swalError(response.data.message)
        }
        setDownloading({ ...downloadingData, [type]: false })
    }

    const rowSelection = {
        selectedRowKeys: selectedKey,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedKeys([]);

            const rowsWithNullEmptyStatus = selectedRows.filter(row => row.hrms_applicant__is_active === 1);
            const rowIdsWithNullEmptyStatus = rowsWithNullEmptyStatus.map(row => row.hrms_applicant__id);
            setSelectedKeys(rowIdsWithNullEmptyStatus);
            setSelectedData(selectedRows)
        },
    };


    const handleChange = (e) => {
        let value = e.target.value;
        setSearchText(value)
    }

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
        onFilter: (value, record) => {
            if (['hrms_applicant__contact_number', 'userInfo__email'].includes(dataIndex)) {
                return record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase());
            } else {
                return record[dataIndex]?.toString().toLowerCase() === value.toLowerCase();
            }
        },
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
    // console.log({ applicantList })

    const getTextFromHTML = (__html, limit = 0) => {
        let div = document.createElement('div')
        div.innerHTML = __html;
        let text = div.innerText;
        return (limit && text.length > 60) ? text.slice(0, 60) + '...' : text;
    }

    const selectedIdArr = selected.map(d => d.value);
    const dataSource = applicantList && applicantList?.hrms_applicant.filter((row) => {
        return (selected.length == 0 ? true : (selectedIdArr.includes(row.hrms_applicant__id) || selectedIdArr.includes('all')))
    }).map((row, k) => {
        return (
            {
                ...row,
                ['key']: row.hrms_applicant__id,
                ['index']: k + 1,
                phone_text: `${row.hrms_applicant__contact_number ? "'" + row.hrms_applicant__contact_number : ''}`,
                full_name: `${row.hrms_applicant__first_name || ''} ${row.hrms_applicant__middle_name ? row.hrms_applicant__middle_name + ' ' : ''}${row.hrms_applicant__last_name || ''}`,
                status_text: row.hrms_applicant__is_blacklisted === 1 ? 'Blacklisted' : row.hrms_applicant__is_active === 1 ? 'Active' : 'Inactive'
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
            title: 'Applicant Name',
            dataIndex: ['hrms_applicant__first_name', 'hrms_applicant__middle_name', 'hrms_applicant__last_name'],
            key: 'userInfo',
            ellipsis: true,
            render: (text, record) => (
                `${record.hrms_applicant__first_name || ''} ${record.hrms_applicant__middle_name || ''} ${record.hrms_applicant__last_name || ''}`
            ),
            // ...getColumnSearchProps('userInfo__middle_name'),
            // sorter: (a, b) => {
            //     const nameA = `${a.userInfo__first_name || ''} ${a.userInfo__middle_name || ''} ${a.userInfo__last_name || ''}`;
            //     const nameB = `${b.userInfo__first_name || ''} ${b.userInfo__middle_name || ''} ${b.userInfo__last_name || ''}`;
            //     return nameA.localeCompare(nameB);
            // },
            // sortDirections: ['descend', 'ascend'],
            // ellipsis: true,
        },
        // {
        //     title: ' Applicant ID',
        //     dataIndex: 'hrms_applicant__pin',
        //     key: 'hrms_applicant__pin',
        //     ...getColumnSearchProps('hrms_applicant__pin'),
        //     sorter: (a, b) => a.hrms_applicant__pin.length - b.hrms_applicant__pin.length,
        //     sortDirections: ['descend', 'ascend'],
        //     ellipsis: true,
        // },
        {
            title: 'Email',
            dataIndex: 'userInfo__email',
            key: 'userInfo__email',
            ...getColumnSearchProps('userInfo__email'),
        },
        {
            title: 'Phone No',
            dataIndex: 'hrms_applicant__contact_number',
            key: 'hrms_applicant__contact_number',
            ...getColumnSearchProps('hrms_applicant__contact_number'),
            ellipsis: true,
        },
        {
            title: 'Gender',
            dataIndex: 'hrms_applicant__gender',
            key: 'hrms_applicant__gender',
            ...getColumnSearchProps('hrms_applicant__gender'),
            ellipsis: true,
        },
        {
            title: 'Profile Completion(%)',
            dataIndex: 'hrms_applicant__profile_percentage',
            key: 'hrms_applicant__profile_percentage',
            ...getColumnSearchProps('hrms_applicant__profile_percentage'),
            ellipsis: true,
            render: (text) => (
                <div style={{ textAlign: 'center' }}>
                    {text}
                </div>
            ),
            align: 'center',
        },
        {
            title: 'Total Applied Job',
            dataIndex: 'hrms_applicant__totalAppliedJobs',
            key: 'hrms_applicant__totalAppliedJobs',
            sorter: (a, b) => a.hrms_applicant__totalAppliedJobs - b.hrms_applicant__totalAppliedJobs,
            sortDirections: ['descend', 'ascend'],
            render: (item, index) => (
                <div style={{ textAlign: 'center' }}>
                    {item}
                </div>
            ),
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'hrms_applicant__is_active',
            key: 'hrms_applicant__is_active',
            width: "100px",
            ...getColumnSearchProps('hrms_applicant__is_active'),
            sorter: (a, b) => a.hrms_applicant__is_active - b.hrms_applicant__is_active,
            sortDirections: ['descend', 'ascend'],
            align: 'center',
            render: (item, row, index) => {
                return {
                    props: {
                        style: { color: row.hrms_applicant__is_blacklisted === 1 ? "red" : "inherit" }
                    },
                    children: (
                        <div style={{ textAlign: 'center' }}>
                            {row.hrms_applicant__is_blacklisted === 1 ? 'Blacklisted' : item === 1 ? 'Active' : 'Inactive'}
                        </div>
                    )
                }
            },
            ellipsis: true,
        },
        {
            title: 'Action',
            dataIndex: 'hrms_applicant__id',
            key: 'hrms_applicant__id',
            align: 'center',
            render: (hrms_applicant__id, row) => (
                <>
                    <Link to={`/hr-admin/detail-resume/${hrms_applicant__id}`} className="btn btn-sm btn-block mb-3" style={{ backgroundColor: "#BAE7FF", color: "#1890FF" }}>
                        <i className="fa fa-eye" style={{ color: "#1890FF" }} ></i>  View Resume
                    </Link>
                    
                    {
                        row.hrms_applicant__is_blacklisted ? (
                            <button
                                onClick={() => handleShow({ id: hrms_applicant__id, is_blacklisted: 0 })}
                                className="btn btn-sm btn-outline-success btn-block"
                            >
                                Mark as Whitelist
                            </button>

                        ) : (
                            <button
                                onClick={() => handleShow({ id: hrms_applicant__id, is_blacklisted: 1 })}
                                className="btn btn-sm btn-outline-danger btn-block"
                            >
                                Mark as Blacklist
                            </button>
                        )
                    }
                </>
            ),
            ellipsis: true,
            fixed: 'right',
        },
    ];
    const headers = [
        {
            label: 'S.L',
            key: 'index',
        },
        {
            label: 'Applicant Name',
            key: 'full_name'
        },
        {
            label: 'Email',
            key: 'hrms_applicant__email',
        },
        {
            label: 'Phone No',
            key: 'phone_text',
        },
        {
            label: 'Total Applied Job',
            key: 'hrms_applicant__totalAppliedJobs'
        },
        {
            label: 'Status',
            key: 'status_text',
            // render: (item, row, index) => (
            //     <>
            //         {row.hrms_applicant__is_blacklisted === 1 ? 'Blacklisted' : item === 1 ? 'Active' : 'Inactive'}
            //     </>
            // ),
        }
    ];

    const downloadResume = async () => {

        const prfURLArr = selectedData.map((item) => {
            const document = item?.hrms_applicant__hrms_applicant_documents?.[0]?.document;

            if (document) {
                return document;
            }
            return null

        })

        try {
            // Iterate through the PDF URLs
            for (const url of prfURLArr) {
                // Fetch the PDF file
                const response = await fetch(url);

                // Check if the request was successful
                if (!response.ok) {
                    console.error(`Failed to fetch PDF file from ${url}`);
                } else {
                    // Convert the response to a blob
                    const blob = await response.blob();

                    // Create a download link
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = url.substring(url.lastIndexOf('/') + 1);

                    // Append the link to the body and trigger the download
                    document.body.appendChild(link);
                    link.click();

                    // Remove the link from the body
                    document.body.removeChild(link);
                }
            }
        } catch (error) {
            console.error('Error downloading PDFs:', error);
        }
    };

    const totalItems = dataSource?.length;

    const jobListOption = applicantList && applicantList?.hrms_applicant && applicantList?.hrms_applicant?.map(function (item) {
        return {
            value: item?.hrms_applicant__id,
            label: `${item.hrms_applicant__first_name || ''} ${item.hrms_applicant__middle_name || ''} ${item.hrms_applicant__last_name || ''}`
        };
    });

    const jobhandleChange = (selectedOption) => {
        console.log({ selectedOption })
        setSelected(selectedOption);
    };

    const initData = {
        blacklisted_comment: ''
    }


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (blacklistInfo) => {
        setBlacklistInfo(blacklistInfo);
        setShow(true);
    }

    const rejectionSchema = Yup.object().shape({
        blacklisted_comment: Yup.string().nullable()
    })

    const handleSubmit = async (values) => {
        // console.log("submit data :", values);
        let formdata = {
            id: [blacklistInfo.id],
            is_blacklisted: blacklistInfo.is_blacklisted,
            comment: values?.blacklisted_comment
        }
        await API.post(`/hrms_applicant/reject/with/comments`, formdata)
            .then((res) => {
                if (res?.data?.success) {
                    swalSuccess(`${blacklistInfo.is_blacklisted === 1 ? 'Blacklisted' : 'Whitelisted'} successfully`);
                    dispatch(hractions.getApplicantList({ status }));
                    setShow(false);
                } else {
                    swalError(res?.data?.message, " ");
                }
            })
            .catch((error) => {
                console.log({ error })
                swalError("someting went wrong");
            });
    }

    const [paginationConfig, setPaginationConfig] = useState({
        current: 1,
        pageSize: 10,
        total: totalItems, // Total number of data items
    });

    const handleTableChange = (page, pageSize) => {
        setPaginationConfig({
            ...paginationConfig,
            current: page,
            pageSize: pageSize,
        });
    };
    return (
        <>

            <div className="hr-admin-table-job-list">
                <nav>
                    <ol className="breadcrumb bg-transparent">
                        <li className="breadcrumb-item"> <Link to="/hr-admin/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item"> <span className="text-dark">Profile List</span></li>
                    </ol>
                </nav>

                <TitleCard title="Profile List" className="applicant_list_section">
                    <div className='row py-5'>
                        <div className='col-md-8'>
                            <form className='row'>
                                <div className='col-md-5'>
                                    <Select
                                        options={jobListOption}
                                        placeholder="Select Applicant Name"
                                        onChange={jobhandleChange}
                                        autoFocus={true}
                                        isMulti
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                    />
                                </div>
                                {/* <div className='col-md-5'>
                                    <input
                                        type="text"
                                        className="form-control border_input_box"
                                        placeholder="Type job position"
                                        value={jobPositionText}
                                        onChange={e=>setJobPositionText(e.target.value)}
                                    />
                                </div> */}
                                {/* <div className='col-md-2'>
                                    <CSVLink
                                        headers={headers}
                                        filename={"Applicant_List"}
                                        data={dataSource ? dataSource : []}
                                        className="btn btn-primary"
                                    >
                                        Export to Excel
                                    </CSVLink>
                                </div> */}

                            </form>
                        </div>
                        <div className='col-md-4 text-right'>
                            {
                                selectedKey && selectedKey.length === 0 && dataSource?.length > 0 && (
                                    <>
                                        <Tooltip title="Download All PDF">
                                            <button
                                                disabled={downloadingData.pdf}
                                                onClick={() => {
                                                    // downloadResume()
                                                    downloadCv('pdf', true)
                                                }}
                                                className="btn btn-outline-primary mr-2"
                                            >
                                                {downloadingData.pdf ? <i className='fa fa-sync fa-spin'></i> : null} All PDF
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="Download All Word">
                                            <button
                                                disabled={downloadingData.word}
                                                onClick={() => {
                                                    // downloadResume()
                                                    downloadCv('word', true)
                                                }}
                                                className="btn btn-outline-primary"
                                            >
                                                {downloadingData.word ? <i className='fa fa-sync fa-spin'></i> : null} All Word
                                            </button>
                                        </Tooltip>
                                    </>
                                )
                            }
                            {selectedKey && selectedKey.length > 0 && (
                                <>
                                    {/* <button
                                        onClick={() => {
                                            sendForShortlisted()
                                        }}
                                        className="btn btn-outline-primary mr-2"
                                    >
                                        Mark as Basic Shortlisted
                                    </button> */}
                                    {/* <button
                                        onClick={handleShow}
                                        className="btn btn-outline-danger mr-2"
                                    >
                                        Mark as Blacklist
                                    </button> */}
                                    <Tooltip title="Download PDF">
                                        <button
                                            disabled={downloadingData.pdf}
                                            onClick={() => {
                                                // downloadResume()
                                                downloadCv('pdf')
                                            }}
                                            className="btn btn-outline-primary mr-2"
                                        >
                                            {downloadingData.pdf ? <i className='fa fa-sync fa-spin'></i> : null}  PDF
                                        </button>
                                    </Tooltip>
                                    <Tooltip title="Download Word">
                                        <button
                                            disabled={downloadingData.word}
                                            onClick={() => {
                                                // downloadResume()
                                                downloadCv('word')
                                            }}
                                            className="btn btn-outline-primary"
                                        >
                                            {downloadingData.word ? <i className='fa fa-sync fa-spin'></i> : null}  Word
                                        </button>
                                    </Tooltip>
                                </>
                            )}

                            <Tooltip title="Export to Excel">
                                <CSVLink
                                    headers={headers}
                                    filename={"Applicant_List"}
                                    data={dataSource ? dataSource : []}
                                    className="btn btn-outline-primary ml-2"
                                >
                                    Export to Excel
                                </CSVLink>
                            </Tooltip>

                        </div>
                    </div>


                    <Table
                        rowKey={(record) => record.hrms_applicant__id}
                        rowSelection={{ ...rowSelection }}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ x: true }}
                        pagination={{
                            ...paginationConfig,
                            showSizeChanger: true,        // Allow the user to change the number of items per page
                            pageSizeOptions: ['10', '20', '50', '100'],  // Define the page size options
                            onChange: handleTableChange,
                            onShowSizeChange: handleTableChange,
                        }}
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
                        validationSchema={rejectionSchema}
                        onSubmit={values => handleSubmit(values)}
                        enableReinitialize
                    >
                        {({ errors, touched, setFieldValue, values }) => (
                            <>

                                <Form>
                                    <Modal.Header>
                                        <Modal.Title className='cover_letter_modal_view'>
                                            <h2 className='mb-0'>{blacklistInfo.is_blacklisted === 1 ? 'Blacklisted' : 'Whitelisted'} Comments</h2>
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
                                                {/* <label className="required"><b>Rejection Comments</b></label><br/> */}
                                                <Field
                                                    as="textarea"
                                                    name="blacklisted_comment"
                                                    placeholder="Type comments ..."
                                                    style={{ width: "100%" }}
                                                    rows={4}
                                                />
                                                <ErrorMessage name="blacklisted_comment" component="div" className="error text-danger" />
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