import { Button, Divider } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { MdPersonAdd } from 'react-icons/md';

interface DataType {
    code: string;
    surname: string;
    name: string;
    subject: string;
    // status: boolean;
}
const columns: ColumnsType<DataType> = [
    {
        title: 'Mã giảng viên',
        dataIndex: 'code',
    },
    {
        title: 'Họ giảng viên',
        dataIndex: 'surname',
    },
    {
        title: 'Tên giảng viên',
        dataIndex: 'name',
    },
    {
        title: 'Bộ môn',
        dataIndex: 'subject',
    },
    // {
    //     title: 'Trạng thái',
    //     dataIndex: 'status',
    // },
];
const data: DataType[] = [
    {
        code: '46556',
        surname: 'Trần Tấn',
        name: 'Lộc',
        subject: 'Phần cứng và Mạng máy tính',
    },
    {
        code: '46213',
        surname: 'Lê Dương Nhựt',
        name: 'Minh',
        subject: 'Công nghệ phần mềm',
    },
    {
        code: '46246',
        surname: 'Trần Tấn',
        name: 'Lộc',
        subject: 'Công nghệ phần mềm',
    },
];

const AppTeacher: React.FC = () => {
    const [records, setRecords] = useState(data);
    const hanleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = data.filter((row) => {
            return row.name.toLowerCase().includes(event.target.value.toLowerCase());
        });
        const newSurname = data.filter((row) => {
            return row.surname.toLowerCase().includes(event.target.value.toLowerCase());
        });
        const newCode = data.filter((row) => {
            return row.code.toLowerCase().includes(event.target.value.toLowerCase());
        });
        const newSubject = data.filter((row) => {
            return row.subject.toLowerCase().includes(event.target.value.toLowerCase());
        });
        setRecords(newName);
        setRecords(newSurname);
        setRecords(newCode);
        setRecords(newSubject);
    };
    const handleAddTeacher = () => {
        const randomNumber: number = Math.floor(Math.random() * 100000);

        const newTeacher = {
            code: String(randomNumber),
            surname: 'Họ giảng viên ' + randomNumber,
            name: 'Tên giảng viên ' + randomNumber,
            subject: 'Bộ Môn ' + randomNumber,
        };

        setRecords((prevRecords) => [...prevRecords, newTeacher]);
    };

    return (
        <>
            <div className="container mt-5">
                <div className="flex justify-between mb-5">
                    <div>
                        <input
                            className="outline-none focus:outline-blue-200 h-6 w-52"
                            type="text"
                            onChange={hanleFilter}
                        />
                    </div>
                    <div>
                        <Button onClick={handleAddTeacher}>
                            <MdPersonAdd />
                        </Button>
                    </div>
                </div>
                <Table columns={columns} dataSource={records} size="large" />
            </div>
        </>
    );
};

export default AppTeacher;
