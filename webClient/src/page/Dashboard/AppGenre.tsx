import Table, { ColumnsType } from 'antd/es/table';
import React from 'react';
interface DataType {
    namesubject: string;
    faculty: string;
    numberofclasses: number;
}
const columns: ColumnsType<DataType> = [
    {
        title: 'Tên bộ môn',
        dataIndex: 'namesubject',
    },
    {
        title: 'Khoa',
        dataIndex: 'faculty',
    },
    {
        title: 'Số lượng lớp',
        dataIndex: 'numberofclasses',
    },
];
const data: DataType[] = [
    {
        namesubject: 'Kinh Tế',
        faculty: 'Khoa Kinh Tế',
        numberofclasses: 1,
    },
    {
        namesubject: 'Công nghệ Phần mềm',
        faculty: 'Khoa Công Nghệ Thông Tin',
        numberofclasses: 2,
    },
    {
        namesubject: 'Lý Luận Chính Trị - Pháp Luật',
        faculty: 'Khoa Giáo Dục Đại Cương',
        numberofclasses: 1,
    },
    {
        namesubject: 'Văn Hóa - Ngoại Ngữ',
        faculty: 'Khoa Giáo Dục Đại Cương',
        numberofclasses: 3,
    },
    {
        namesubject: 'Phần Cứng Máy T',
        faculty: 'Khoa Công Nghệ Thông Tin',
        numberofclasses: 3,
    },
];
const AppGenre = () => {
    return (
        <>
            <div className="container mt-10">
                <Table dataSource={data} columns={columns} />
            </div>
        </>
    );
};

export default AppGenre;
