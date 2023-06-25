import { Button, Divider, Input, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { MdPersonAdd } from 'react-icons/md';

interface DataType {
    code: string;
    surname: string;
    name: string;
    subject: string;
    // status: boolean;
    action: React.ReactNode;
}

const AppTeacher: React.FC = () => {
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
        {
            title: 'Hành động',
            dataIndex: 'action',
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
            code: '46213',
            surname: 'Lê Dương Nhựt',
            name: 'Minh',
            subject: 'Công nghệ phần mềm',
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
            code: '46246',
            surname: 'Trần Tấn',
            name: 'Lộc',
            subject: 'Công nghệ phần mềm',
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
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedDeleteData, setSelectedDeleteData] = useState<DataType | null>(null);
    const [editedData, setEditedData] = useState<DataType | null>(null); // Lưu trữ dữ liệu được chỉnh sửa
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [records, setRecords] = useState(data);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const handleShowModal = () => {
        setOpenModal(true);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpenModal(false);
    };
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
    // const handleAddTeacher = () => {
    //     const randomNumber: number = Math.floor(Math.random() * 100000);

    //     const newTeacher = {
    //         code: String(randomNumber),
    //         surname: 'Họ giảng viên ' + randomNumber,
    //         name: 'Tên giảng viên ' + randomNumber,
    //         subject: 'Bộ Môn ' + randomNumber,
    //     };

    //     setRecords((prevRecords) => [...prevRecords, newTeacher]);
    // };
    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    const handleEdit = (row: DataType) => {
        setEditedData(row);
        setOpenModalEdit(true);
    };
    const handleDelete = (row: DataType) => {
        setSelectedDeleteData(row);
        setDeleteModalVisible(true);
    };
    const handleSubmitCreateTeacher = () => {};
    const handleSubmitEditTeacher = () => {
        setEditModalVisible(false);
    };
    const handleSubmitDeleteTeacher = () => {
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
                <Table columns={columns} dataSource={records} size="large" />
            </div>
            <>
                <Modal
                    className="custom-modal-teacher_create-edit "
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-base font-medium">Thêm giáo viên</span>
                        <div className="grid grid-cols-2 gap-y-5 gap-2 mt-10">
                            <div>
                                <label htmlFor="">Mã giảng viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Họ giảng viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Tên giảng viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Bộ môn</label>
                                <Input className="bg-slate-200" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end px-5 py-20">
                        <Button onClick={handleSubmitCreateTeacher} type="primary">
                            Lưu
                        </Button>
                    </div>
                </Modal>
            </>
            {/* Modal sửa giảng viên  */}
            <>
                <Modal
                    className="custom-modal-teacher_create-edit "
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span>Sửa giáo viên</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">Mã giảng viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Họ giảng viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Tên giảng viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Bộ môn</label>
                                <Input className="bg-slate-200" />
                            </div>
                        </div>
                    </div>
                    <div onClick={handleSubmitEditTeacher} className="flex justify-end px-5 ctmTeacher ">
                        <Button type="primary">Lưu</Button>
                    </div>
                </Modal>
            </>
            {/* Modal xóa giảng viên */}
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
                        <Button onClick={handleSubmitDeleteTeacher} type="primary" className="mr-5">
                            Xóa
                        </Button>
                        <Button onClick={() => setDeleteModalVisible(false)} type="default" className="mr-5">
                            Hủy
                        </Button>
                    </div>
                </Modal>
            </>
        </>
    );
};

export default AppTeacher;
