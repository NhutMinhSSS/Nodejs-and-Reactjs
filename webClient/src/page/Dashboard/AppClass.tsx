import Table, { ColumnsType } from 'antd/es/table';
import React from 'react';
import './scss/styleDashboard.scss';
interface DataType {
    nameclass: string;
    subject: string;
    numberofstudent: number;
}
const columns: ColumnsType<DataType> = [
    {
        title: 'Tên lớp',
        dataIndex: 'nameclass',
    },
    {
        title: 'bộ môn',
        dataIndex: 'subject',
    },
    {
        title: 'Số lượng sinh viên',
        dataIndex: 'numberofstudent',
    },
];
const data: DataType[] = [
    {
        nameclass: 'CĐ TH 20A',
        subject: 'Công Nghệ Phần Mềm',
        numberofstudent: 36,
    },
    {
        nameclass: 'CĐ NL 20A',
        subject: 'Công Nhiệt Lạnh',
        numberofstudent: 50,
    },
    {
        nameclass: 'CĐ ÔTÔ 21A',
        subject: 'Công Nghệ Phần Mềm',
        numberofstudent: 20,
    },
    {
        nameclass: 'CĐ TH 18A',
        subject: 'Công Nghệ Phần Mềm',
        numberofstudent: 1,
    },
    {
        nameclass: 'CĐ TH 22A',
        subject: 'Công Nghệ Phần Mềm',
        numberofstudent: 25,
    },
];
const AppClass = () => {
    return (
        <>
            <div className="container mt-10">
                <Table dataSource={data} columns={columns} />
            </div>
        </>
    );
};

export default AppClass;
