import React, { useEffect, useState } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { TitleCard } from '../../../components/cards/TitleCard';
import { getJobSummaryReport, downloadJobSummaryReport } from '../_redux/hrRequest'
import { saveAs } from 'file-saver';
import Select from 'react-select';
import { Field, Formik, Form } from 'formik';

const statusOptions = [
    { label: 'Closed', value: 'Closed' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Shortlisted', value: 'Final Shortlisted' },
    { label: 'In Interview', value: 'In Interview' },
    { label: 'Longlisted', value: 'Initial Shortlisted' }, // 
    { label: 'Published', value: 'Published' },
];



export default function JobSummary() {
    const [dataSource, setDataSource] = useState([]);
    const { ColumnGroup, Column } = Table;
    const [filters, setFilter] = useState({});

    // const paginationConfig = {
    //     total: dataSource?.length,
    //     pageSize: 10,
    //     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    // };

    const getJobSummary = async () => {
        try {
            const { data: { data } } = await getJobSummaryReport(filters);
            setDataSource(data);
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getJobSummary();
    }, []);

    const downloadExcelFile = () => {
        downloadJobSummaryReport(filters).then((res) => {
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'Job summary.xlsx');
        }).catch(err => {
            console.error(err);
        })
    }

    const handleFilterChange = (name, value) => {
        setFilter((state) => {
            if (!value) delete state[name];
            else {
                state[name] = value;
            }
            return {
                ...state
            }
        })
    }

    const [paginationConfig, setPaginationConfig] = useState({
        current: 1,
        pageSize: 10,
        total: dataSource?.length, // Total number of data items
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
                        <li className="breadcrumb-item"> <span className="text-dark">Job summary</span></li>
                    </ol>
                </nav>

                <TitleCard title="Job Summary Report">

                    <div className='row py-5'>
                        <div className='col-md-10'>
                            <Formik>
                                <Form className='row'>
                                    <div className='col-md-3'>
                                        <label><b>Job post date</b></label>
                                        <Field
                                            name="job_post_date"
                                            type="date"
                                            className="form-control"
                                            onChange={(e) => {
                                                handleFilterChange('job_post_date', e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className='col-md-3'>
                                        <label><b>Application deadline</b></label>
                                        <Field
                                            name="application_deadline"
                                            type="date"
                                            className="form-control"
                                            onChange={(e) => {
                                                handleFilterChange('application_deadline', e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className='col-md-3'>
                                        <label><b>Job status</b></label>
                                        <Select
                                            options={statusOptions}
                                            placeholder="Select status"
                                            onChange={(options) => {
                                                handleFilterChange('status', options?.value);
                                            }}
                                            isClearable={true}
                                        />
                                    </div>
                                    <div className='col-md-3'>
                                        <button
                                            type='submit'
                                            className="btn btn-outline-primary px-5 mt-8"
                                            onClick={getJobSummary}
                                        >
                                            Search
                                        </button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                        <div className='col-md-2 text-right mt-8'>
                            <Tooltip title="Export to Excel">
                                <button 
                                    className="btn btn-outline-primary px-5"
                                    onClick={downloadExcelFile}
                                >
                                    Export to Excel
                                </button>
                                {/* <Button type='primary' className='btn btn-outline-primary' onClick={downloadExcelFile}>
                                    Export to Excel
                                </Button> */}
                            </Tooltip>
                        </div>
                    </div>

                    <Table
                        // columns={columns}
                        dataSource={dataSource}
                        scroll={{ x: true }}
                        pagination={{
                            ...paginationConfig,
                            showSizeChanger: true,        // Allow the user to change the number of items per page
                            pageSizeOptions: ['10', '20', '50', '100'],  // Define the page size options
                            onChange: handleTableChange,
                            onShowSizeChange: handleTableChange,
                        }}
                        bordered={true}
                        rowKey='id'
                    >
                        <Column
                            title='Employee category'
                            dataIndex='employee_category'
                        // sorter = {(a, b) => a.employee_category - b.employee_category}
                        // sortDirections = {['descend', 'ascend']} 
                        />
                        <Column
                            title='Job title'
                            dataIndex='job_title'
                        // sorter = {(a, b) => a.job_title - b.job_title}
                        // sortDirections = {['descend', 'ascend']}
                        />
                        <Column
                            title='Job posting date'
                            dataIndex='published_on_formatted'
                        // sorter = {(a, b) => a.published_on - b.published_on}
                        // sortDirections = {['descend', 'ascend']} 
                        />
                        <Column
                            title='Application deadline'
                            dataIndex='application_deadline_formatted'
                        />
                        <Column
                            title = 'Job post duration(In days)'
                            dataIndex = 'duration'
                        />
                        <Column
                            title='Job status'
                            dataIndex='status'
                        />
                        <Column
                            title = 'Deadline due date left(In days)'
                            dataIndex = 'deadline_due'
                        />
                        <Column
                            title='Total applicants'
                            dataIndex='total_applicant'
                        />
                        <Column
                            title='Sortlisted applicants'
                            dataIndex='total_shorlisted_applicant'
                        />
                        <ColumnGroup title='Applicant profile match bar percentage'>
                            <Column
                                title="100%"
                                dataIndex="matching_under_100"
                                key="matching_under_100"
                                render={(value, record, index) => {
                                    return `${value}(${record.matching_under_100_percentage || 0}%)`
                                }}
                            />
                            <Column
                                title="75%"
                                dataIndex="matching_under_75"
                                key="matching_under_75"
                                render={(value, record, index) => {
                                    return `${value}(${record.matching_under_75_percentage || 0}%)`
                                }}
                            />
                            <Column
                                title="50%"
                                dataIndex="matching_equal_50"
                                key="matching_equal_50"
                                render={(value, record, index) => {
                                    return `${value}(${record.matching_equal_50_percentage || 0}%)`
                                }}
                            />
                            <Column
                                title="Below 50%"
                                dataIndex="matching_under_50"
                                key="matching_under_50"
                                render={(value, record, index) => {
                                    return `${value}(${record.matching_under_50_percentage || 0}%)`
                                }}
                            />
                        </ColumnGroup>
                    </Table>
                </TitleCard>
            </div>
        </>
    )
}
