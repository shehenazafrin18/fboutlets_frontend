import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as hractions from "../_redux/hrActions"
import { Button, Dropdown, Input, Space, Switch, Table, Tooltip } from 'antd';
import * as jobAction from "../../../_redux/jobActions"
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Link } from "react-router-dom"
import moment from 'moment';
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { TitleCard } from '../../../components/cards/TitleCard';
import { CSVLink } from "react-csv";
import { swalSuccess } from '../../../helpers/swal';


export default function Job() {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [jobPositionText, setJobPositionText] = useState("");
    const [ageData, setAgeData] = useState("");
    const [experienceData, setExperienceData] = useState("");
    const [expectedSalary, setExpectedSalary] = useState("");
    const [selectionType, setSelectionType] = useState('radio');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [checkStrictly, setCheckStrictly] = useState(false);
    const animatedComponents = makeAnimated();

    const [selected, setSelected] = useState([]);
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

    const { user, allJobs } = useSelector((state) => ({
        user: state.auth.user,
        allJobs: state.hr.allJobs,
    }));



    useEffect(() => {
        const params = { status: ['Published', 'Final Shortlisted', 'Initial Shortlisted', 'In Interview'], age: ageData, experience: experienceData, salary: expectedSalary };
        dispatch(hractions.fetchAllJob(params));
    }, [dispatch, user, page, size, searchText, ageData, experienceData, expectedSalary]);

    const totalPages = allJobs?.totalPages;

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

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
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
        onFilter: (value, record) =>
            record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
    const dataSource = allJobs && allJobs.hrms_job.filter((row) => {
        const positionCheck = row?.sys_designation__designation_name?.toLowerCase().includes(jobPositionText.toLowerCase())
        return (selected.length == 0 ? true : (selectedIdArr.includes(row.hrms_job__id) || selectedIdArr.includes('all'))) && (jobPositionText ? positionCheck : true)
    }).map((row, k) => {
        return (
            {
                ...row,
                formatted_application_deadline: moment(row.hrms_job__application_deadline).format('DD MMM, YYYY'),
                ['key']: row.hrms_job__id,
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
            title: 'Job Title',
            dataIndex: 'hrms_job__job_title',
            key: 'hrms_job__job_title',
            ...getColumnSearchProps('hrms_job__job_title'),
            //sorter: (a, b) => a.hrms_job__job_title.length - b.hrms_job__job_title.length,
            sortDirections: ['descend', 'ascend'],
            render: (item, record) => (
                <span>
                    <Link
                        target="_blank" rel="noopener noreferrer"
                        to={`/hr-admin/applicant-list/${record.hrms_job__id}`}>{item}</Link>
                </span>
            ),
            ellipsis: true,
        },
        {
            title: 'Position',
            dataIndex: 'sys_designation__designation_name',
            key: 'sys_designation__designation_name',
            ...getColumnSearchProps('sys_designation__designation_name'),
            ellipsis: true,
        },
        {
            title: 'Position Purpose',
            dataIndex: 'hrms_job__position_purpose',
            key: 'hrms_job__position_purpose',
            ...getColumnSearchProps('hrms_job__position_purpose'),
            render: text => {
                if (text.length > 60) {
                    return text.slice(0, 60) + '...';
                } else {
                    return text;
                }
            },
            width: 400,
        },
        {
            title: 'Department',
            dataIndex: 'sys_departments__department_name',
            key: 'sys_departments__department_name',
            ...getColumnSearchProps('sys_departments__department_name'),
            //sorter: (a, b) => a.sys_departments__department_name.length - b.sys_departments__department_name.length,
            sortDirections: ['descend', 'ascend'],
            width: 200,
        },
        {
            title: 'Minimum Experience',
            dataIndex: 'hrms_job__minimum_experience',
            key: 'hrms_job__minimum_experience',
            ...getColumnSearchProps('hrms_job__minimum_experience'),
            render: (item) => (
                <div className='text-center'>
                    {item}
                </div>
            ),
            ellipsis: true,
        },
        {
            title: 'Reporting To',
            dataIndex: 'reportings_to__designation_name',
            key: 'reportings_to__designation_name',
            ...getColumnSearchProps('reportings_to__designation_name'),
            // sorter: (a, b) => a.reportings_to__designation_name.length - b.reportings_to__designation_name.length,
            // sortDirections: ['descend', 'ascend'],
            ellipsis: true,
        },
        {
            title: 'Published On',
            dataIndex: 'hrms_job__published_on',
            key: 'hrms_job__published_on',
            render: (item) => (
                <div className='text-center'>
                    {moment(item).format('DD MMM, YYYY')}
                </div>
            ),
            ellipsis: true,
        },
        {
            title: 'Deadline',
            dataIndex: 'hrms_job__application_deadline',
            key: 'hrms_job__application_deadline',
            render: (item) => (
                <div className='text-center'>
                    {moment(item).format('DD MMM, YYYY')}
                </div>
            ),
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'hrms_job__status',
            key: 'hrms_job__status',
            // ...getColumnSearchProps('hrms_job__status'),
            //sorter: (a, b) => a.hrms_job__status.length - b.hrms_job__status.length,
            // sortDirections: ['descend', 'ascend'],
            render: (item) => (
                <div className='text-center'>
                    {item}
                </div>
            ),
            ellipsis: true,
        },
        {
            title: 'Total Application',
            dataIndex: 'hrms_job__totalApplicant',
            key: 'hrms_job__totalApplicant',
            // ...getColumnSearchProps('hrms_job__totalApplicant'),
            //sorter: (a, b) => a.hrms_job__totalApplicant - b.hrms_job__totalApplicant,
            // sortDirections: ['descend', 'ascend'],
            render: (item) => (
                <div className='text-center'>
                    {item}
                </div>
            ),
            ellipsis: true,
        },
        {
            title: 'Total Longlisted',
            dataIndex: 'hrms_job__totalShortlistedApplicant',
            key: 'hrms_job__totalShortlistedApplicant',
            // ...getColumnSearchProps('hrms_job__totalShortlistedApplicant'),
            //sorter: (a, b) => a.hrms_job__totalShortlistedApplicant - b.hrms_job__totalShortlistedApplicant,
            // sortDirections: ['descend', 'ascend'],
            render: (item) => (
                <div className='text-center'>
                    {item}
                </div>
            ),
            ellipsis: true,
        },
        {
            title: 'Action',
            dataIndex: 'hrms_job__id',
            key: 'hrms_job__id',
            render: (hrms_job__id) => (
                <Space size="middle" className='action_btn'>
                    <Dropdown
                        placement="bottomRight"
                        menu={{
                            items: [
                                {
                                    key: '1',
                                    label: (
                                        <Link
                                            // target="_blank" rel="noopener noreferrer"
                                            to={`/hr-admin/jobs/${hrms_job__id}`}>
                                            View Job
                                        </Link>
                                    ),
                                },
                                {
                                    key: '24',
                                    label: (
                                        <Link
                                            className="text-nowrap"
                                            to={`/hr-admin/applicant-list/${hrms_job__id}`}>
                                            View Applicants
                                        </Link>
                                    ),
                                },

                            ]
                        }}
                        trigger={['click']}
                    >
                        <a>
                            <MoreOutlined />
                        </a>
                    </Dropdown>
                </Space>
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
            label: 'Job Title',
            key: 'hrms_job__job_title',
        },
        {
            label: 'Position',
            key: 'sys_designation__designation_name',
        },
        {
            label: 'Position Purpose',
            key: 'hrms_job__position_purpose',
        },
        {
            label: 'Department',
            key: 'sys_departments__department_name',
        },
        {
            label: 'Minimum Experience',
            key: 'hrms_job__minimum_experience',
        },
        {
            label: 'Reporting To',
            key: 'reportings_to__designation_name',
        },
        {
            label: 'Deadline',
            key: 'formatted_application_deadline',
            // render: (item, index) => (
            //     <>
            //         {moment(item).format('DD MMMM, YYYY')}
            //     </>
            // )
        },
        {
            label: 'Status',
            key: 'hrms_job__status',
        },
        {
            label: 'Total Application',
            key: 'hrms_job__totalApplicant',
        },
    ];

    const totalItems = dataSource?.length;

    // const paginationConfig = {
    //     total: totalItems,
    //     pageSize: 10,
    //     showTotal: (total, range) => {
    //         `${range[0]}-${range[1]} of ${total} items`
    //     },
    // };


    const jobListOption = allJobs?.hrms_job?.map(function (item) {
        return {
            value: item?.hrms_job__id,
            label: item?.hrms_job__job_title + ' - ' + item?.hrms_job__job_code,
        }
    });


    //console.log({ allJobs });


    const jobhandleChange = (selectedOption) => {
        setSelected(selectedOption);
    };


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
                        <li className="breadcrumb-item"> <span className="text-dark">Job List</span></li>
                    </ol>
                </nav>

                <TitleCard title="Job List">

                    <div className='row py-5'>
                        <div className='col-md-10'>
                            <form className='row'>
                                <div className='col-md-3'>
                                    <Select
                                        options={jobListOption}
                                        placeholder="Select Job Name"
                                        onChange={jobhandleChange}
                                        autoFocus={true}
                                        isMulti
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                    />
                                </div>
                                {/* <div className='col-md-2'>
                                    <input
                                        type="text"
                                        className="form-control border_input_box"
                                        placeholder="Type job position"
                                        value={jobPositionText}
                                        onChange={e => setJobPositionText(e.target.value)}
                                    />
                                </div> */}

                                <div className='col-md-3'>
                                    <input
                                        type="number"
                                        className="form-control border_input_box"
                                        placeholder="Type Age"
                                        value={ageData}
                                        onChange={e => setAgeData(e.target.value)}
                                    />
                                </div>
                                <div className='col-md-3'>
                                    <input
                                        type="number"
                                        className="form-control border_input_box"
                                        placeholder="Type Experience"
                                        value={experienceData}
                                        onChange={e => setExperienceData(e.target.value)}
                                    />
                                </div>
                                <div className='col-md-3'>
                                    <input
                                        type="text"
                                        className="form-control border_input_box"
                                        placeholder="Type Expected Salary "
                                        value={expectedSalary}
                                        onChange={e => setExpectedSalary(e.target.value)}
                                    />
                                </div>

                                {/* <div className='col-md-3'>
                                    <button
                                        type='button'
                                        className="btn btn-outline-primary px-5"
                                    >
                                        Search
                                    </button>
                                </div> */}
                            </form>
                        </div>
                        <div className='col-md-2 text-right'>
                            <Tooltip title="Export to Excel">
                                <CSVLink
                                    headers={headers}
                                    filename={"Job_List"}
                                    data={dataSource ? dataSource : []}
                                    className="btn btn-outline-primary"
                                >
                                    Export to Excel
                                </CSVLink>
                            </Tooltip>
                        </div>
                    </div>
                    <Table
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
            </div>
        </>
    )
}