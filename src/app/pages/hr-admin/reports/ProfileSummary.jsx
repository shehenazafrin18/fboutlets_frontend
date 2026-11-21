import React, { useEffect, useState } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { TitleCard } from '../../../components/cards/TitleCard';
import { getJobDropDownOptions, getProfileSummaryReport, downloadProfileSummaryReport } from '../_redux/hrRequest'
import { saveAs } from 'file-saver';
import Select from 'react-select';
import { Formik, Form } from 'formik';
import { formatCurrency } from '../../../helpers/common';

export default function ProfileSummary() {
    const [ dataSource, setDataSource ] = useState([]);
    const { ColumnGroup, Column } = Table;
    const [filters, setFilter] = useState({});
    const [jobDropdown, setJobDropdown] = useState([]);
    const [jobTitle, setJobTitle] = useState('');

    // const paginationConfig = {
    //     total: dataSource?.length,
    //     pageSize: 10,
    //     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    // };

    const getProfileSummary = async () => {
        try{
            if(filters.job_id) {
                const { data: { data } } = await getProfileSummaryReport(filters);
                setDataSource(data);
            }
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

    useEffect(() => {
        getJobDropdownList();
    }, []);

    const downloadExcelFile = () => {
        downloadProfileSummaryReport(filters).then((res) => {
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            saveAs(blob, 'Profile summary.xlsx');
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
                        <li className="breadcrumb-item"> <span className="text-dark">Profile Summary</span></li>
                    </ol>
                </nav>

                <TitleCard title="Profile Summary Report">

                    <div className='row py-5'>
                        <div className='col-md-10'>
                            <Formik>
                                <Form className='row'>
                                    <div className='col-md-3'>
                                        <label><b>Position applied for</b></label>
                                        <Select
                                            options={jobDropdown}
                                            placeholder="Select job"
                                            onChange={(options) => {
                                                setJobTitle(options?.label);
                                                handleFilterChange('job_id', options?.value);
                                            }}
                                            isClearable={true}
                                        />
                                    </div>
                                    <div className='col-md-3'>
                                        <button
                                            type='submit'
                                            className="btn btn-outline-primary px-5 mt-8"
                                            onClick={getProfileSummary}
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
                        style={{ whiteSpace: 'pre'}}
                        rowKey='id'
                    >   
                        
                        <ColumnGroup title={`Profile Summary \n Position: ${jobTitle ?? ''}`} width="200">
                            <Column 
                                title="Name" 
                                dataIndex="applicant_name"
                            />
                            <ColumnGroup title='Profile Summary' width="200">
                                <Column
                                    title="Education"
                                    dataIndex="education"
                                />
                                <Column
                                    title="Total Year of Experience"
                                    dataIndex="work_experience"
                                />
                                <Column title="Experience" dataIndex="experience"/>
                                <Column
                                    title="Professional Qualification/Certification"
                                    dataIndex="certificate"
                                />
                            </ColumnGroup>
                            <Column 
                                title="Expected Salary" 
                                dataIndex="expected_salary"
                                render={(salary) => formatCurrency(salary)}
                            />
                        </ColumnGroup>
                    </Table>
                </TitleCard>
            </div>
            </>
    )
}
