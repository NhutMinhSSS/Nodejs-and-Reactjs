import { Button, Input, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { MdAddBox, MdPersonAdd } from 'react-icons/md';
import SelectOption from '../../components/SelectOption';
interface DataType {
    subjecttitle: string;
    subject: string;
    credits: number;
    action: React.ReactNode;
}

const AppSubject = () => {
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
        { title: 'Hành động', dataIndex: 'action' },
    ];
    const data: DataType[] = [
        {
            subjecttitle: 'Cơ sở dữ liệu',
            credits: 2,
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
            subjecttitle: 'Cơ lý thuyết',
            credits: 3,
            subject: 'Tự động hóa',
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
            subjecttitle: 'Pháp luật',
            credits: 3,
            subject: 'Giáo dục đại cương',
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
            subjecttitle: 'Nhập môn lập trình',
            subject: 'Công nghệ phần mềm',
            credits: 3,
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
    const [editedData, setEditedData] = useState<DataType | null>(null); // Lưu trữ dữ liệu được chỉnh sửa
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedDeleteData, setSelectedDeleteData] = useState<DataType | null>(null);
    const [selectOptionSubject, setSelectOptionSubject] = useState<number | null>(null);
    const handleEdit = (row: DataType) => {
        setEditedData(row);
        setOpenModalEdit(true);
    };
    const handleDelete = (row: DataType) => {
        setSelectedDeleteData(row);
        setDeleteModalVisible(true);
    };
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const handleShowModal = () => {
        setOpenModal(true);
    };
    const handleCancel = () => {
        setOpenModal(false);
    };
    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    const handleSubmitDeleteSubject = () => {
        setDeleteModalVisible(false);
    };
    const handleOptionChangeSubject = (value: number | null) => {
        setSelectOptionSubject(value);
    };
    return (
        <>
            <div className="container mt-5">
                <div className="flex justify-end mb-5">
                    <Button type="primary" onClick={handleShowModal}>
                        <MdAddBox />
                    </Button>
                </div>
                <Table dataSource={data} columns={columns} />
            </div>
            <div className="">
                <Modal className="custom-modal " open={openModal} onCancel={handleCancel} footer={null}>
                    <div className="p-5">
                        <span>Thêm sinh viên</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">Tên bộ môn</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Tín chỉ</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="">Khoa</label>
                                <SelectOption
                                    onChange={handleOptionChangeSubject}
                                    value={selectOptionSubject}
                                    apiUrl=""
                                />
                            </div>
                        </div>

                        <Button className="mt-5">Lưu</Button>
                    </div>
                </Modal>

                {/* Modal sửa subject */}
                <Modal className="custom-modal " open={openModalEdit} onCancel={handleCancelEdit} footer={null}>
                    <div className="p-5">
                        <span>Sửa sinh viên</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Mã sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="">Mã sinh viên</label>
                            <Input className="bg-slate-200" />
                        </div>
                        <Button className="mt-5">Lưu</Button>
                    </div>
                </Modal>
                {/* Modal xóa subject */}
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
                            <Button onClick={handleSubmitDeleteSubject} type="primary" className="mr-5">
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

export default AppSubject;
