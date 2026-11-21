import React, { useEffect, useState } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { TitleCard } from '../../../components/cards/TitleCard';
import { getApplicantAnalyticsReport, getJobDropDownOptions, getJobSummaryReport, downloadApplicantSummaryReport } from '../_redux/hrRequest'
import { saveAs } from 'file-saver';
import Select from 'react-select';
import { Formik, Form } from 'formik';
import { Table as ReactTable} from 'react-bootstrap';

export default function OverallSummaryForEachJob() {
    const [ dataSource, setDataSource ] = useState([]);
    const { ColumnGroup, Column } = Table;
    const [filters, setFilter] = useState({});
    const [jobDropdown, setJobDropdown] = useState([]);
    const [jobSummary,setJobSummary] = useState({});

    // const paginationConfig = {
    //     total: dataSource?.length,
    //     pageSize: 10,
    //     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    // };

    const getApplicantAnalytics = async () => {
        try{
            const { data: { data } } = await getApplicantAnalyticsReport(filters);
            setDataSource(data);
        } catch(err) {
            console.error(err)
        }
    }

    const getJobSummaryData = async () => {
        try{
            const { data: { data = [] } } = await getJobSummaryReport(filters);
            const [summary] = data;
            setJobSummary(summary);
        } catch(err) {
            console.error(err)
        }
    }

    const getJobDropdownList = async () => {
        try{
            const { data: { data } } = await getJobDropDownOptions();
            setJobDropdown(data.map((item) => ({ label: item.job_title, value: item.id })));
        } catch(err) {
            console.error(err)
        }
    }

    const getOverallSummaryData = () => {
        if(filters.job_id) {
            getJobSummaryData();
            getApplicantAnalytics();
        }
    }

    useEffect(() => {
        getJobDropdownList();
    }, []);

    const downloadExcelFile = () => {
        downloadApplicantSummaryReport(filters).then((res) => {
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'Applicant summary.xlsx');
        }).catch(err => {
            console.error(err);
        })
    }

    const handleFilterChange = (name, value) => {
        setFilter((state) => {
            return {
                ...state,
                [name]: value
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
                        <li className="breadcrumb-item"> <span className="text-dark">Overall Summary Report for each job</span></li>
                    </ol>
                </nav>

                <TitleCard title="Overall Summary Report for each job">

                    <div className='row py-5'>
                        <div className='col-md-10'>
                            <Formik>
                                <Form className='row'>
                                    <div className='col-md-3'>
                                        <label><b>Job postition</b></label>
                                        <Select
                                            options={jobDropdown}
                                            placeholder="Select job"
                                            onChange={(options) => {
                                                handleFilterChange('job_id', options?.value);
                                            }}
                                            isClearable={true}
                                        />
                                    </div>
                                    <div className='col-md-3'>
                                        <button
                                            type='submit'
                                            className="btn btn-outline-primary px-5 mt-8"
                                            onClick={getOverallSummaryData}
                                            disabled={!!!filters.job_id}
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
                                    onClick={downloadExcelFile} disabled={!!!filters.job_id}
                                >
                                    Export to Excel
                                </button> 
                            </Tooltip>
                        </div>
                    </div>

                    <div className='row py-5' style={{ justifyContent: 'center' }}>
                        <div className='col-md-3'>
                            <ReactTable bordered hover>
                                <tbody style={{ backgroundColor: '#ffd966' }}>
                                    <tr>
                                        <td>Job posted on</td>
                                        <td>{jobSummary.published_on_formatted}</td>
                                    </tr>
                                    <tr>
                                        <td>Job post ended on</td>
                                        <td>{jobSummary.application_deadline_formatted}</td>
                                    </tr>
                                    <tr>
                                        <td>Duration</td>
                                        <td>{jobSummary.duration ? jobSummary.duration + ' Days' : ''}</td>
                                    </tr>
                                </tbody>
                            </ReactTable>
                        </div>
                        <div className='col-md-1'></div>
                        <div className='col-md-3'>
                            <ReactTable bordered hover>
                                <tbody style={{ backgroundColor: '#a9d08e' }}>
                                    <tr>
                                        <td>Total applicants</td>
                                        <td>{jobSummary.total_applicant}</td>
                                    </tr>
                                    <tr>
                                        <td>Applicants Shortlisted</td>
                                        <td>{jobSummary.total_shorlisted_applicant}</td>
                                    </tr>
                                    <tr>
                                        <td>Assessment taken</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </ReactTable>
                        </div>
                        <div className='col-md-1'></div>
                        <div className='col-md-3'>
                            <ReactTable bordered hover>
                                <tbody>
                                    <tr style={{ backgroundColor: '#305496', color: 'white' }}>
                                        <td colSpan={4}>Applicant profile match bar percentage</td>
                                    </tr>
                                    <tr style={{ backgroundColor: '#305496', color: 'white' }}>
                                        <td>100%</td>
                                        <td>75%</td>
                                        <td>50%</td>
                                        <td>Below 50%</td>
                                    </tr>
                                    <tr>
                                        <td>{jobSummary.matching_under_100_text}</td>
                                        <td>{jobSummary.matching_under_75_text}</td>
                                        <td>{jobSummary.matching_equal_50_text}</td>
                                        <td>{jobSummary.matching_under_50_text}</td>
                                    </tr>
                                </tbody>
                            </ReactTable>
                        </div>
                    </div>

                    <Table
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
                            title = 'Application date'
                            dataIndex = 'application_date'
                        />
                        <Column
                            title = 'Name'
                            dataIndex = 'applicant_name'
                        />
                        <Column
                            title  = 'Position applied for'
                            dataIndex = 'job_title'
                        />
                        <Column
                            title = 'Work experience(Years)'
                            dataIndex = 'work_experience'
                        />
                        <Column
                            title = 'Work industry'
                            dataIndex = 'industry_type'
                        />
                        <Column
                            title = 'Name of latest organization'
                            dataIndex = 'latest_organization'
                        />
                        <Column
                            title = 'Highest degree(With concentration)'
                            dataIndex = 'highest_degree'
                        />
                        <ColumnGroup title='Masters'>
                            <Column 
                                title="Name of degree" 
                                dataIndex="ms_name_of_degree"
                            />
                            <Column 
                                title="Result" 
                                dataIndex="ms_result"
                            />
                            <Column 
                                title="Concentration" 
                                dataIndex="ms_concentration"
                            />
                            <Column 
                                title="Name of Institute" 
                                dataIndex="ms_institute"
                            />
                        </ColumnGroup>
                        <ColumnGroup title='Bachelors'>
                            <Column 
                                title="Name of degree" 
                                dataIndex="bs_name_of_degree"
                            />
                            <Column 
                                title="Result" 
                                dataIndex="bs_result"
                            />
                            <Column 
                                title="Concentration" 
                                dataIndex="bs_concentration"
                            />
                            <Column 
                                title="Name of Institute" 
                                dataIndex="bs_institute"
                            />
                        </ColumnGroup>
                        <Column 
                            title="No. of publications" 
                            dataIndex="no_of_publications"
                        />
                        <Column 
                            title="Age(Years)" 
                            dataIndex="age"
                        />
                        <Column 
                            title="Location" 
                            dataIndex="location"
                        />
                        <Column 
                            title="Gender" 
                            dataIndex="gender"
                        />
                        <Column 
                            title="Status" 
                            dataIndex="status"
                        />
                        <Column 
                            title="Assessment Score(%)" 
                            dataIndex="assessments_marks"
                        />
                    </Table>
                </TitleCard>
            </div>
            </>
    )
}
