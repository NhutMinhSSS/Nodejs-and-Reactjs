import React, { useState } from 'react';
import Table, { ColumnsType } from 'antd/es/table';
import { MdPersonAdd } from 'react-icons/md';
import { Button, Input, Modal } from 'antd';
import './scss/styleDashboard.scss';
interface DataType {
    code: string;
    surname: string;
    name: string;
    class: string;
    dateofbirth: string;
}
const columns: ColumnsType<DataType> = [
    {
        title: 'MSSV',
        dataIndex: 'code',
    },
    {
        title: 'Họ sinh viên',
        dataIndex: 'surname',
    },
    {
        title: 'Tên sinh viên',
        dataIndex: 'name',
    },
    {
        title: 'Lớp',
        dataIndex: 'class',
    },
    {
        title: 'Ngày Sinh',
        dataIndex: 'dateofbirth',
    },
];
const data: DataType[] = [
    {
        code: '0306201048',
        surname: 'Trần Tấn',
        name: 'Lộc',
        class: 'CĐ TH 20PMA',
        dateofbirth: '02/09/2002',
    },

    {
        code: '0306201049',
        surname: 'Trần Minh',
        name: 'Anh',
        class: 'CĐ TH 20PMA',
        dateofbirth: '06/02/2002',
    },

    {
        code: '0306201050',
        surname: 'Lê Dương Nhựt',
        name: 'Minh',
        class: 'CĐ TH 20PMA',
        dateofbirth: '04/04/2002',
    },

    {
        code: '0306201048',
        surname: 'Nguyễn Văn',
        name: 'Tèo',
        class: 'CĐ TH 20PMA',
        dateofbirth: '06/09/2002',
    },
];

const AppStudent = () => {
    const [record, setRecords] = useState(data);
    const [openModal, setOpenModal] = useState(false);
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
        const newClass = data.filter((row) => {
            return row.class.toLowerCase().includes(event.target.value.toLowerCase());
        });
        setRecords(newName);
        setRecords(newSurname);
        setRecords(newCode);
        setRecords(newClass);
    };
    // const handleAddTeacher = () => {
    //     const randomNumber: number = Math.floor(Math.random() * 10000000000);

    //     const newStudent = {
    //         code: String(randomNumber),
    //         surname: 'Họ giảng viên ' + randomNumber,
    //         name: 'Tên giảng viên ' + randomNumber,
    //         class: 'CĐ TH' + randomNumber,
    //         dateofbirth: 'ngày sinh' + randomNumber,
    //     };

    //     setRecords((prevRecords) => [...prevRecords, newStudent]);
    // };
    const handleShowModal = () => {
        setOpenModal(true);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpenModal(false);
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
                        <Button onClick={handleShowModal}>
                            <MdPersonAdd />
                        </Button>
                    </div>
                </div>
                <Table columns={columns} dataSource={record} size="large" />
            </div>
            <div className="">
                <Modal className="custom-modal " open={openModal} onCancel={handleCancel} footer={null}>
                    <div className="p-5">
                        <span>Thêm sinh viên</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="">Mã sinh viên</label>
                            <Input />
                        </div>
                        <Button className="mt-5">Lưu</Button>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default AppStudent;
