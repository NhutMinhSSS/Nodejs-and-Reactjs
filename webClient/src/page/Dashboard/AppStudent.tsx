import React, { useState } from 'react';
import Table, { ColumnsType } from 'antd/es/table';
import { MdPersonAdd } from 'react-icons/md';
import { Button, Input, Modal } from 'antd';
import './scss/styleDashboard.scss';
import SelectOption from '../../components/SelectOption';
interface DataType {
    code: string;
    surname: string;
    name: string;
    class: string;
    dateofbirth: string;
    action: React.ReactNode;
}

const AppStudent = () => {
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
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];
    const data: DataType[] = [
        {
            code: '0306201048',
            surname: 'Trần Tấn',
            name: 'Lộc',
            class: 'CĐ TH 20PMA',
            dateofbirth: '02/09/2002',
            action: (
                <>
                    <div className="flex gap-x-1">
                        <button
                            className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
                            onClick={() => handleEdit(data[0])}
                        >
                            Sửa
                        </button>
                        <button
                            className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
                            onClick={() => handleDelete(data[0])}
                        >
                            Xóa
                        </button>
                    </div>
                </>
            ),
        },

        {
            code: '0306201049',
            surname: 'Trần Minh',
            name: 'Anh',
            class: 'CĐ TH 20PMA',
            dateofbirth: '06/02/2002',
            action: (
                <>
                    <div className="flex gap-x-1">
                        <button
                            className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
                            onClick={() => handleEdit(data[0])}
                        >
                            Sửa
                        </button>
                        <button
                            className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
                            onClick={() => handleDelete(data[0])}
                        >
                            Xóa
                        </button>
                    </div>
                </>
            ),
        },

        {
            code: '0306201050',
            surname: 'Lê Dương Nhựt',
            name: 'Minh',
            class: 'CĐ TH 20PMA',
            dateofbirth: '04/04/2002',
            action: (
                <>
                    <div className="flex gap-x-1">
                        <button
                            className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
                            onClick={() => handleEdit(data[0])}
                        >
                            Sửa
                        </button>
                        <button
                            className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
                            onClick={() => handleDelete(data[0])}
                        >
                            Xóa
                        </button>
                    </div>
                </>
            ),
        },

        {
            code: '0306201048',
            surname: 'Nguyễn Văn',
            name: 'Tèo',
            class: 'CĐ TH 20PMA',
            dateofbirth: '06/09/2002',
            action: (
                <>
                    <div className="flex gap-x-1">
                        <button
                            className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
                            onClick={() => handleEdit(data[0])}
                        >
                            Sửa
                        </button>
                        <button
                            className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
                            onClick={() => handleDelete(data[0])}
                        >
                            Xóa
                        </button>
                    </div>
                </>
            ),
        },
    ];

    const [record, setRecords] = useState(data);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedDeleteData, setSelectedDeleteData] = useState<DataType | null>(null);
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
    const [editedData, setEditedData] = useState<DataType | null>(null); // Lưu trữ dữ liệu được chỉnh sửa
    const handleEdit = (row: DataType) => {
        setEditedData(row);
        setOpenModalEdit(true);
    };
    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    const handleDelete = (row: DataType) => {
        setSelectedDeleteData(row);
        setDeleteModalVisible(true);
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
    const [selectedOptionClass, setSelectedOptionClass] = useState<number | null>(null);
    const [selectedOptionSubject, setSelectedOptionSubject] = useState<number | null>(null);

    const handleOptionChangeClass = (value: number | null) => {
        setSelectedOptionClass(value);
    };
    const handleOptionChangeSubject = (value: number | null) => {
        setSelectedOptionClass(value);
    };
    const handleShowModal = () => {
        setOpenModal(true);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpenModal(false);
    };
    const handleSubmitEditModalStudent = () => {
        setOpenModalEdit(false);
    };
    const handleSubmitDeleteModalStudent = () => {
        setDeleteModalVisible(false);
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
                        <Button type="primary" onClick={handleShowModal}>
                            <MdPersonAdd />
                        </Button>
                    </div>
                </div>
                <Table columns={columns} dataSource={record} size="large" />
            </div>
            <div className="">
                <Modal className="custom-modal" open={openModal} onCancel={handleCancel} footer={null}>
                    <div className="p-5">
                        <span>Thêm sinh viên</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">MSSV</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Họ sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Tên sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Lớp sinh viên</label>
                                <div className="flex flex-col">
                                    <SelectOption
                                        value={selectedOptionClass}
                                        onChange={handleOptionChangeClass}
                                        apiUrl=""
                                    ></SelectOption>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="">Ngày sinh</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Số điện thoại</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">CCCD</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Bộ Môn</label>
                                <div className="flex flex-col">
                                    <SelectOption
                                        value={selectedOptionSubject}
                                        onChange={handleOptionChangeSubject}
                                        apiUrl=""
                                    ></SelectOption>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="">Địa chỉ</label>
                            <Input className="bg-slate-200" />
                        </div>
                        <div className="flex justify-end">
                            <Button type="primary" className="mt-5">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
                {/* Modal Sửa sinh viên */}
                <Modal className="custom-modal" open={openModalEdit} onCancel={handleCancelEdit} footer={null}>
                    <div className="p-5">
                        <span>Sửa sinh viên</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">MSSV</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Họ sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Tên sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Lớp sinh viên</label>
                                <div className="flex flex-col">
                                    <SelectOption
                                        value={selectedOptionClass}
                                        onChange={handleOptionChangeClass}
                                        apiUrl=""
                                    ></SelectOption>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="">Ngày sinh</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Số điện thoại</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">CCCD</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Bộ Môn</label>
                                <div className="flex flex-col">
                                    <SelectOption
                                        value={selectedOptionSubject}
                                        onChange={handleOptionChangeSubject}
                                        apiUrl=""
                                    ></SelectOption>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="">Địa chỉ</label>
                            <Input className="bg-slate-200" />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSubmitEditModalStudent} type="primary" className="mt-5">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
                <></>
                <>
                    <Modal
                        className="custom-delete "
                        title="Xác nhận xóa"
                        visible={deleteModalVisible}
                        onCancel={() => setDeleteModalVisible(false)}
                        footer={null}
                    >
                        <div>
                            <p>Bạn có chắc chắn muốn xóa không?</p>
                        </div>
                        <div className="flex justify-end h-full mt-20">
                            <Button onClick={handleSubmitDeleteModalStudent} type="primary" className="mr-5">
                                Xóa
                            </Button>
                            <Button onClick={() => setDeleteModalVisible(false)} type="default" className="mr-5">
                                Hủy
                            </Button>
                        </div>
                    </Modal>
                </>
            </div>
        </>
    );
};

export default AppStudent;
