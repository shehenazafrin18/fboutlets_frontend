import React, { useEffect, useState } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { TitleCard } from '../../../components/cards/TitleCard';
import { getApplicantAnalyticsReport, getJobDropDownOptions, getAllDisticts, downloadApplicantAnalyticsReport } from '../_redux/hrRequest'
import { saveAs } from 'file-saver';
import Select from 'react-select';
import { Field, Formik, Form } from 'formik';

const genderOptions = [
    { label: 'Male', value: 'Male' },
    {label: 'Female', value: 'Female'}
]

export default function ApplicantAnalytics() {
    const [ dataSource, setDataSource ] = useState([]);
    const { ColumnGroup, Column } = Table;
    const [filters, setFilter] = useState({});
    const [jobDropdown, setJobDropdown] = useState([]);
    const [districtDropdown, setDistrictDropdown] = useState([]);

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

    const getJobDropdownList = async () => {
        try{
            const { data: { data } } = await getJobDropDownOptions();
            setJobDropdown(data.map((item) => ({ label: item.job_title, value: item.id })));
        } catch(err) {
            console.error(err)
        }
    }

    const getDistrictsDropdownlist = async () => {
        try{
            const { data: { data: {sys_geo_districts} } } = await getAllDisticts();
            setDistrictDropdown(sys_geo_districts.map((item) => ({ label: item.
                sys_geo_districts__geo_district_name, value: item.sys_geo_districts__geo_district_id })));
        } catch(err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getApplicantAnalytics();
        getJobDropdownList();
        getDistrictsDropdownlist();
    }, []);

    const downloadExcelFile = () => {
        downloadApplicantAnalyticsReport(filters).then((res) => {
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'Applicants analytics.xlsx');
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
                        <li className="breadcrumb-item"> <span className="text-dark">Applicant analytics</span></li>
                    </ol>
                </nav>

                <TitleCard title="Applicant Analytics Report">

                    <div className='row py-5'>
                        <div className='col-md-10'>
                            <Formik>
                                <Form className='row'>
                                    <div className='col-md-3'>
                                        <label><b>Applicant name</b></label>
                                        <Field
                                            name="applicant_name"
                                            type="text"
                                            className="form-control"
                                            placeholder='type applicant name'
                                            onChange={(e) => {
                                                handleFilterChange('applicant_name', e.target.value);
                                            }}
                                        />
                                    </div>
                                    {/* <div className='col-md-3'>
                                        <label><b>Application deadline</b></label>
                                        <Field
                                            name="application_deadline"
                                            type="date"
                                            className="form-control"
                                            onChange={(e) => {
                                                handleFilterChange('application_deadline', e.target.value);
                                            }}
                                        />
                                    </div> */}
                                    <div className='col-md-2'>
                                        <label><b>Position Applied For</b></label>
                                        <Select
                                            options={jobDropdown}
                                            placeholder="Select job"
                                            onChange={(options) => {
                                                handleFilterChange('job_id', options?.value);
                                            }}
                                            isClearable={true}
                                        />
                                    </div>
                                    <div className='col-md-2'>
                                        <label><b>Min Experience</b></label>
                                        <Field
                                            name="total_experience"
                                            type="number"
                                            placeholder='type minimum experience'
                                            className="form-control"
                                            onChange={(e) => {
                                                handleFilterChange('total_experience', e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className='col-md-2'>
                                        <label><b>Location</b></label>
                                        <Select
                                            options={districtDropdown}
                                            placeholder="Select location"
                                            onChange={(options) => {
                                                handleFilterChange('per_districts_id', options?.value);
                                            }}
                                            isClearable={true}
                                        />
                                    </div>
                                    <div className='col-md-2'>
                                        <label><b>Gender</b></label>
                                        <Select
                                            options={genderOptions}
                                            placeholder="Select gender"
                                            onChange={(options) => {
                                                handleFilterChange('gender', options?.value);
                                            }}
                                            isClearable={true}
                                        />
                                    </div>
                                    <div className='col-md-1'>
                                        <button
                                            type='submit'
                                            className="btn btn-outline-primary px-5 mt-8"
                                            onClick={getApplicantAnalytics}
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
                            </Tooltip>
                        </div>
                    </div>

                    <Table
                        // columns={columns}
                        dataSource={dataSource}
                        scroll={{ x: true }}
                        // pagination={paginationConfig}
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
