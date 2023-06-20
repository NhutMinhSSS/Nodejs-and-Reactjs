import Table, { ColumnsType } from 'antd/es/table';
import React from 'react';
import { Column } from 'react-table';

interface DataType {
    facultyname: string;
    numberofsubjects: number;
}
const columns: ColumnsType<DataType> = [
    {
        title: 'Tên khoa',
        dataIndex: 'facultyname',
    },
    {
        title: 'Số lượng bộ môn',
        dataIndex: 'numberofsubjects',
    },
];
const data: DataType[] = [
    {
        facultyname: 'Khoa Kinh Tế',
        numberofsubjects: 1,
    },
    {
        facultyname: 'Khoa Công Nghệ Thông tin',
        numberofsubjects: 5,
    },
    {
        facultyname: 'Khoa Cơ Khí',
        numberofsubjects: 3,
    },
    {
        facultyname: 'Khoa Nhiệt - Lạnh',
        numberofsubjects: 2,
    },
    {
        facultyname: 'Khoa Cơ Động Lực',
        numberofsubjects: 4,
    },
    {
        facultyname: 'Khoa Điện Tử',
        numberofsubjects: 2,
    },
];
const AppFaculty = () => {
    return (
        <>
            <div className="container mt-10 ">
                <Table columns={columns} dataSource={data} />
            </div>
        </>
    );
};

export default AppFaculty;
