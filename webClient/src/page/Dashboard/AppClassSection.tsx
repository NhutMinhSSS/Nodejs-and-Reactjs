import Table, { ColumnsType } from 'antd/es/table';
import React from 'react';
interface DataType {
    nameclasssection: string;
    class: string;
    semester: number;
    schoolyear: number;
    status: 'Đang mở' | 'Đang đóng';
}
const columns: ColumnsType<DataType> = [
    {
        title: 'Tên lớp học phần',
        dataIndex: 'nameclasssection',
    },
    {
        title: 'Lớp',
        dataIndex: 'class',
    },
    {
        title: 'Học kỳ',
        dataIndex: 'semester',
    },
    {
        title: 'Năm học',
        dataIndex: 'schoolyear',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (status: DataType['status']) => (
            <span className="text-sm" style={{ color: statusColorMap[status] }}>
                {status}
            </span>
        ),
    },
];
const data: DataType[] = [
    {
        nameclasssection: 'Công nghệ phần mềm CĐ TH 19A',
        class: 'CĐ TH 19A',
        semester: 4,
        schoolyear: 2021,
        status: 'Đang mở',
    },
    {
        nameclasssection: 'Cơ sở dữ liệu CĐ TH 20A',
        class: 'CĐ TH 20A',
        semester: 2,
        schoolyear: 2022,
        status: 'Đang mở',
    },
    {
        nameclasssection: 'Nhập môn lập trình CĐ TH 20A',
        class: 'CĐ TH 19A',
        semester: 4,
        schoolyear: 2021,
        status: 'Đang đóng',
    },
    {
        nameclasssection: 'Phần cứng máy tính CĐ TH 18B',
        class: 'CĐ TH 18B',
        semester: 6,
        schoolyear: 2019,
        status: 'Đang đóng',
    },
    {
        nameclasssection: 'Thiết kế website',
        class: 'CĐ Th 21A',
        semester: 2,
        schoolyear: 2023,
        status: 'Đang mở',
    },
];
const statusColorMap: { [key in DataType['status']]: string } = {
    'Đang mở': 'green',
    'Đang đóng': 'red',
};
const AppClassSection = () => {
    return (
        <>
            <div className="container mt-10">
                <Table dataSource={data} columns={columns} />
            </div>
        </>
    );
};

export default AppClassSection;
