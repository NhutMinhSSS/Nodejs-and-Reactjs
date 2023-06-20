import Table, { ColumnsType } from 'antd/es/table';
import React from 'react';
interface DataType {
    subjecttitle: string;
    subject: string;
    credits: number;
}
const columns: ColumnsType<DataType> = [
    {
        title: 'Tên bộ môn',
        dataIndex: 'subjecttitle',
    },
    {
        title: 'Tín chỉ',
        dataIndex: 'credits',
    },
    {
        title: 'Khoa',
        dataIndex: 'subject',
    },
];
const data: DataType[] = [
    {
        subjecttitle: 'Cơ sở dữ liệu',
        credits: 2,
        subject: 'Công nghệ phần mềm',
    },
    {
        subjecttitle: 'Cơ lý thuyết',
        credits: 3,
        subject: 'Tự động hóa',
    },
    {
        subjecttitle: 'Pháp luật',
        credits: 3,
        subject: 'Giáo dục đại cương',
    },
    {
        subjecttitle: 'Nhập môn lập trình',
        subject: 'Công nghệ phần mềm',
        credits: 3,
    },
    {
        subjecttitle: 'Mạng máy tính',
        credits: 4,
        subject: 'Công nghệ phần mềm',
    },
];
const AppSubject = () => {
    return (
        <>
            <div className="container mt-10">
                <Table dataSource={data} columns={columns} />
            </div>
        </>
    );
};

export default AppSubject;
