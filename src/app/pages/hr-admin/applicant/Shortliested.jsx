import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as hractions from "../_redux/hrActions"
import { Button, Input, Space, Table } from 'antd';
import * as jobAction from "../../../_redux/jobActions"
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import { Link } from "react-router-dom"
import { TitleCard } from '../../../components/cards/TitleCard';
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { CSVLink } from "react-csv";


export default function Shortlisted() {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
    const [jobPositionText, setJobPositionText] = useState("");
    const [selectedKey, setSelectedKeys] = useState([]);
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selectedData, setSelectedData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
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

    const { user, shortlistedApplicantList } = useSelector((state) => ({
        user: state.auth.user,
        shortlistedApplicantList: state.hr.shortlistedApplicantList,
    }));

    const params = {
        status: 'Initial Shortlisted'
    }


    useEffect(() => {
        dispatch(hractions.getShortlistedApplicantList(params));
    }, [dispatch, user, searchText]);

    const onSelectChange = (newSelectedRowKeys, selectedRows) => {
        setSelectedKeys(newSelectedRowKeys);
        setSelectedData(selectedRows)
    };
    const rowSelection = {
        selectedKey,
        onChange: onSelectChange,
    };

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


    const selectedIdArr = selected.map(d => d.value);
    const selectedApplicantId = selectedUser.map(d => d.value);

    const dataSource = shortlistedApplicantList && shortlistedApplicantList.hrms_job_application.filter((row) => {
        const positionCheck = row?.sys_designation__designation_name?.toLowerCase().includes(jobPositionText.toLowerCase())
        const applicantCheck = (selectedApplicantId.includes(row.hrms_applicant__id) || selectedApplicantId.includes('all'))
        return (selected.length == 0 ? true : (selectedIdArr.includes(row.m_hrms_job__id) || selectedIdArr.includes('all'))) && (jobPositionText ? positionCheck : true) && (selectedApplicantId.length == 0 ? true : applicantCheck)
    }).map((row, k) => {
        return (
            {
                ...row,
                ['key']: row.m_hrms_job__id,
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
            title: 'Job Code',
            dataIndex: 'm_hrms_job__job_code',
            key: 'm_hrms_job__job_code',
            ...getColumnSearchProps('m_hrms_job__job_code'),
            sorter: (a, b) => a.m_hrms_job__job_code.length - b.m_hrms_job__job_code.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Job Title',
            dataIndex: 'm_hrms_job__job_title',
            key: 'm_hrms_job__job_title',
            ...getColumnSearchProps('m_hrms_job__job_title'),
            sorter: (a, b) => a.m_hrms_job__job_title.length - b.m_hrms_job__job_title.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Applicant Name',
            dataIndex: 'hrms_applicant__full_name',
            key: 'hrms_applicant__full_name',
            ...getColumnSearchProps('hrms_applicant__full_name'),
            sorter: (a, b) => a.hrms_applicant__full_name.length - b.hrms_applicant__full_name.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: ' Applicant ID',
            dataIndex: 'hrms_applicant__pin',
            key: 'hrms_applicant__pin',
            ...getColumnSearchProps('hrms_applicant__pin'),
            sorter: (a, b) => a.hrms_applicant__pin.length - b.hrms_applicant__pin.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Email',
            dataIndex: 'hrms_applicant__email',
            key: 'hrms_applicant__email',
            ...getColumnSearchProps('hrms_applicant__email'),
        },
        {
            title: 'Phone No',
            dataIndex: 'hrms_applicant__contact_number',
            key: 'hrms_applicant__contact_number',
            ...getColumnSearchProps('hrms_applicant__contact_number'),
        },
        {
            title: 'Expected Salary',
            dataIndex: 'hrms_job_application__expected_salary',
            key: 'hrms_job_application__expected_salary',
            ...getColumnSearchProps('hrms_job_application__expected_salary'),
        },
        {
            title: 'Assessments Marks',
            dataIndex: 'hrms_job_application__assessments_marks',
            key: 'hrms_job_application__assessments_marks',
            ...getColumnSearchProps('hrms_job_application__assessments_marks'),
        },
        {
            title: 'Applied On',
            dataIndex: 'hrms_job_application__created_at',
            key: 'hrms_job_application__created_at',

            render: (item, index) => (
                <>
                    {moment(item).format('DD MMMM, YYYY')}
                </>
            )
        },
        {
            title: 'Status',
            dataIndex: 'hrms_job_application__status',
            key: 'hrms_job_application__status',
            ...getColumnSearchProps('hrms_job_application__status'),
            sorter: (a, b) => a.hrms_job_application__status - b.hrms_job_application__status,
            sortDirections: ['descend', 'ascend'],
            render: (item, index) => (
                <>
                    {item ? item : "Applied"}
                </>
            )
        },
        {
            title: 'Total Application',
            dataIndex: 'hrms_job_application__totalAppliedJobs',
            key: 'hrms_job_application__totalAppliedJobs',
            sorter: (a, b) => a.hrms_job_application__totalAppliedJobs - b.hrms_job_application__totalAppliedJobs,
            sortDirections: ['descend', 'ascend'],
            render: (item, index) => (
                <div className='text-center'>
                    {item}
                </div>
            )
        },
        {
            title: 'Action',
            dataIndex: 'hrms_applicant__id',
            key: 'hrms_applicant__id',
            render: (hrms_applicant__id) => (
                <>
                    <Link to={`/hr-admin/detail-resume/${hrms_applicant__id}`} className="btn btn-sm" style={{ backgroundColor: "#BAE7FF", color: "#1890FF" }}>
                        <i className="fa fa-eye" style={{ color: "#1890FF" }} ></i> Resume
                    </Link>
                </>
            ),
        },
    ];
    const headers = [
        {
            label: 'S.L',
            key: 'index',
        },
        {
            label: 'Job Code',
            key: 'm_hrms_job__job_code',
        },
        {
            label: 'Job Title',
            key: 'm_hrms_job__job_title',
        },
        {
            label: 'Applicant Name',
            key: 'hrms_applicant__full_name',
        },
        {
            label: ' Applicant ID',
            key: 'hrms_applicant__pin',
        },
        {
            label: 'Email',
            key: 'hrms_applicant__email',
        },
        {
            label: 'Phone No',
            key: 'hrms_applicant__contact_number',
        },
        {
            label: 'Expected Salary',
            key: 'hrms_job_application__expected_salary',
        },
        {
            label: 'Assessments Marks',
            key: 'hrms_job_application__assessments_marks',
        },
        {
            label: 'Applied On',
            key: 'hrms_job_application__created_at',
            render: (item, index) => (
                <>
                    {moment(item).format('DD MMMM, YYYY')}
                </>
            )
        },
        {
            label: 'Status',
            key: 'hrms_job_application__status',
            render: (item, index) => (
                <>
                    {item ? item : "Applied"}
                </>
            )
        },
        {
            label: 'Total Application',
            key: 'hrms_job_application__totalAppliedJobs',
            render: (item, index) => (
                <div className='text-center'>
                    {item}
                </div>
            )
        }
    ];

    const totalItems = dataSource?.length;
    const paginationConfig = {
        total: totalItems,
        pageSize: 10,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    };

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



    const jobListOption = shortlistedApplicantList && shortlistedApplicantList?.hrms_job_application && shortlistedApplicantList?.hrms_job_application?.map(function (item) {
        return {
            value: item?.hrms_applicant__id,
            label: item?.m_hrms_job__job_title + ' - ' + item?.m_hrms_job__job_code,
        }
    });


    const uniqueApplicantListOption = [...new Set(shortlistedApplicantList?.hrms_job_application?.map(item => JSON.stringify({
        value: item?.hrms_applicant__id,
        label: item?.hrms_applicant__full_name,
        m_hrms_job__id: item?.m_hrms_job__id
    })))].map(str => JSON.parse(str));

    const uniqueOption = [];
    const hashTable = {};

    uniqueApplicantListOption?.forEach(item => {
        const key = `${item.value}-${item.label}`;
        if (!hashTable[key]) {
            hashTable[key] = true;
            uniqueOption.push(item);
        }
    });


    const ApplicantListOption = uniqueOption?.filter(item => { return selected?.length == 0 ? true : selected?.map(d => d.value).includes(item.m_hrms_job__id) }).map(function (item) {
        return {
            value: item?.value,
            label: item?.label,
        }
    })

    const jobhandleChange = (selectedOption) => {
        setSelected(selectedOption);
    };

    const applicantHandleChange = (optionUser) => {
        setSelectedUser(optionUser);
    };



    return (
        <>

            <div className="hr-admin-table-job-list">
                <TitleCard title="Shortlisted Applicant List">
                    <div className='row py-5'>
                        <div className='col-md-8'>
                            <form className='row'>
                                <div className='col-md-6'>
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
                                <div className='col-md-4'>
                                    <Select
                                        options={ApplicantListOption}
                                        placeholder="Select Applicant"
                                        onChange={applicantHandleChange}
                                        isMulti
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                    />
                                </div>
                                {/* <div className='col-md-4'>
                                    <input
                                        type="text"
                                        className="form-control border_input_box"
                                        placeholder="Type job position"
                                        value={jobPositionText}
                                        onChange={e => setJobPositionText(e.target.value)}
                                    />
                                </div> */}
                                {/* <div className='col-md-2'>
                                    <button
                                        type='submit'
                                        className="btn btn-outline-primary px-5"
                                    >
                                        Search
                                    </button>
                                </div> */}
                                <div className='col-md-2'>
                                    <CSVLink
                                        headers={headers}
                                        filename={"Shortlisted Applicant List"}
                                        data={dataSource ? dataSource : []}
                                        className="btn btn-primary"
                                    >
                                        Export to CSV
                                    </CSVLink>
                                </div>
                            </form>
                        </div>
                        <div className='col-md-4 text-right'>
                            {selectedKey && selectedKey.length > 0 && (
                                <>
                                    <button
                                        onClick={() => {
                                            downloadResume()
                                        }}
                                        className="btn btn-outline-primary"
                                    >
                                        Download Resume
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <Table
                        rowSelection={{ ...rowSelection }}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ x: true }}
                        pagination={paginationConfig}
                    />
                </TitleCard>
            </div>
        </>
    )
}