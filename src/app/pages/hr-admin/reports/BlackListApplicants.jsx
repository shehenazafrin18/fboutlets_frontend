import React, { useEffect, useState } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { TitleCard } from '../../../components/cards/TitleCard';
import { getBlackListReport, downloadBlackListReport } from '../_redux/hrRequest'
import { saveAs } from 'file-saver';

export default function BlacklistApplicants() {
    const [ dataSource, setDataSource ] = useState([]);
    const { Column } = Table;

    // const paginationConfig = {
    //     total: dataSource?.length,
    //     pageSize: 10,
    //     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    // };

    const getBlackListApplicants = async () => {
        try{
            const { data: { data } } = await getBlackListReport();
            setDataSource(data);
        } catch(err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getBlackListApplicants();
    }, []);

    const downloadExcelFile = () => {
        downloadBlackListReport().then((res) => {
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'Blacklist applicants.xlsx');
        }).catch(err => {
            console.error(err);
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
                        <li className="breadcrumb-item"> <span className="text-dark">Blacklist Report</span></li>
                    </ol>
                </nav>

                <TitleCard title="Blacklist Report">

                    <div className='row py-5'>
                        <div className='col-md-12 text-right'> 
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
                        dataSource={dataSource}
                        scroll={{ x: true }}
                        pagination={{
                            ...paginationConfig,
                            showSizeChanger: true,        // Allow the user to change the number of items per page
                            pageSizeOptions: ['10', '20', '50', '100'],  // Define the page size options
                            onChange: handleTableChange,
                            onShowSizeChange: handleTableChange,
                        }}
                        // bordered={true}
                        rowKey={(record) => record.id}
                        expandable={{
                            expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.blacklisted_comment}</p>,
                            expandIconAsCell: false,
                            expandIconColumnIndex: 9,
                            rowExpandable: (record) => record?.blacklisted_comment?.length > 50,
                        }}
                    >   
                        <Column
                            title = 'Name'
                            dataIndex = 'full_name'
                            key = 'full_name'
                        />
                        <Column
                            title = 'Email'
                            dataIndex = 'email'
                            key = 'email'
                        />
                        <Column
                            title  = 'Phone'
                            dataIndex = 'contact_number'
                            key = 'contact_number'
                        />
                        <Column
                            title = 'Addess'
                            dataIndex = 'address'
                            key = 'address'
                        />
                        <Column
                            title = 'NID No'
                            dataIndex = 'nid'
                            key = 'nid'
                        />
                        <Column
                            title = 'Highest Education Level'
                            dataIndex = 'highest_education'
                            key = 'highest_education'
                        />
                        <Column
                            title = 'Total Experience(years)'
                            dataIndex = 'total_experience'
                            key = 'total_experience'
                        />
                        <Column
                            title = 'Position Applied For'
                            dataIndex = 'position'
                            key = 'position'
                        />
                        <Column
                            title = 'Date Blacklisted'
                            dataIndex = 'blacklisted_date'
                            key = 'blacklisted_date'
                        />
                        <Column
                            title = 'Reason of Blacklist'
                            dataIndex = 'blacklisted_comment'
                            key='blacklisted_comment'
                            render={(item) => {
                                return item?.substring(0, 50)}
                            }
                        />
                    </Table>
                </TitleCard>
            </div>
            </>
    )
}
