import Table, { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import './scss/styleDashboard.scss';
import { Button, Modal, Input } from 'antd';
import { MdPersonAdd } from 'react-icons/md';
import SelectOption from '../../components/SelectOption';
interface DataType {
    nameclass: string;
    subject: string;
    numberofstudent: number;
    action: React.ReactNode;
}

const AppClass = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên lớp',
            dataIndex: 'nameclass',
        },
        {
            title: 'Bộ môn',
            dataIndex: 'subject',
        },
        {
            title: 'Số lượng sinh viên',
            dataIndex: 'numberofstudent',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];
    const data: DataType[] = [
        {
            nameclass: 'CĐ TH 20A',
            subject: 'Công Nghệ Phần Mềm',
            numberofstudent: 36,
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
            nameclass: 'CĐ NL 20A',
            subject: 'Công Nhiệt Lạnh',
            numberofstudent: 50,
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
            nameclass: 'CĐ ÔTÔ 21A',
            subject: 'Công Nghệ Phần Mềm',
            numberofstudent: 20,
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
            nameclass: 'CĐ TH 18A',
            subject: 'Công Nghệ Phần Mềm',
            numberofstudent: 1,
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
            nameclass: 'CĐ TH 18A',
            subject: 'Công Nghệ Phần Mềm',
            numberofstudent: 1,
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
            nameclass: 'CĐ TH 18A',
            subject: 'Công Nghệ Phần Mềm',
            numberofstudent: 1,
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
            nameclass: 'CĐ TH 18A',
            subject: 'Công Nghệ Phần Mềm',
            numberofstudent: 1,
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
            nameclass: 'CĐ TH 18A',
            subject: 'Công Nghệ Phần Mềm',
            numberofstudent: 1,
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
            nameclass: 'CĐ TH 22A',
            subject: 'Công Nghệ Phần Mềm',
            numberofstudent: 25,
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
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [nameClass, setNameClass] = useState('');
    const [editedData, setEditedData] = useState<DataType | null>(null); // Lưu trữ dữ liệu được chỉnh sửa
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedDeleteData, setSelectedDeleteData] = useState<DataType | null>(null);
    const [errorMessage, setErrorMessage] = useState(false);
    const handleEdit = (row: DataType) => {
        setEditedData(row);
        setOpenModalEdit(true);
    };

    const handleDelete = (row: DataType) => {
        setSelectedDeleteData(row);
        setDeleteModalVisible(true);
    };
    // Hàm hiển thị Modal
    const handleShowModal = () => {
        setOpenModal(true);
    };
    const handleCancel = () => {
        setOpenModal(false);
    };

    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    //Hàm xử lí lưu giá trị đã chọn trong Option
    const handleOptionChange = (value: number | null) => {
        setSelectedOption(value);
    };
    //Hàm xử lí khi người dùng ấn vào Lưu để trả dữ liệu
    const handleSubmitCreateSubject = () => {
        if (nameClass === '' || selectedOption === null) {
            setErrorMessage(true);
        } else {
            const FormData = {
                nameClass,
                selectedOption,
            };
            console.log('data', FormData);
            setOpenModal(false);
            setNameClass('');
            setSelectedOption(null);
            setErrorMessage(false);
        }
    };
    //Xử lí cập nhập lại dữ liệu đã sửa
    const handleSubmitEditSubject = () => {
        if (nameClass === '' || selectedOption === null) {
            setErrorMessage(true);
        } else {
            const FormData = {
                nameClass,
                selectedOption,
            };
            console.log('data', FormData);
            setOpenModal(false);
            setNameClass('');
            setSelectedOption(null);
            setErrorMessage(false);
        }
    };
    const handleSubmitOkDeleteSubject = () => {
        // Xử lý logic khi xóa dữ liệu
        setDeleteModalVisible(false); // Đóng Modal sau khi xóa
    };
    return (
        <>
            <div className="container mt-5">
                <div className="flex justify-end mb-5">
                    <Button type="primary" onClick={handleShowModal}>
                        <MdPersonAdd />
                    </Button>
                </div>
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={{
                        defaultPageSize: 6,
                        showSizeChanger: true,
                        pageSizeOptions: ['4', '6', '8', '12'],
                    }}
                />
            </div>
            {/* Modal thêm lớp */}
            <>
                <Modal className="custom-modal-create_class" open={openModal} onCancel={handleCancel} footer={null}>
                    <div className="p-5">
                        <span className="text-base font-medium">Thêm lớp</span>
                        <div className="grid grid-cols-2 gap-2 mt-10 csrespone">
                            <div>
                                <label htmlFor="">Tên lớp</label>
                                <Input
                                    className="bg-slate-200"
                                    onChange={(e) => {
                                        {
                                            setNameClass(e.target.value);
                                        }
                                    }}
                                />
                                {errorMessage && <p className="text-red-500">Vui lòng nhập dữ liệu</p>}
                            </div>

                            <div className="flex flex-col ">
                                <label htmlFor="">Bộ môn</label>
                                <SelectOption value={selectedOption} onChange={handleOptionChange} apiUrl="" />
                                {errorMessage && <p className="text-red-500">Vui lòng chọn dữ liệu</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end custom">
                        <Button onClick={handleSubmitCreateSubject} type="primary" className="mr-10 ">
                            Lưu
                        </Button>
                    </div>
                </Modal>
            </>
            {/* Modal Sửa */}
            <>
                <Modal className="custom-edit" footer={null} open={openModalEdit} onCancel={handleCancelEdit}>
                    <div className="p-5">
                        <span>Thêm lớp</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">Tên lớp</label>
                                <Input
                                    className="bg-slate-200"
                                    onChange={(e) => {
                                        {
                                            setNameClass(e.target.value);
                                        }
                                    }}
                                />{' '}
                                {errorMessage && <p className="text-red-500">Vui lòng nhập dữ liệu</p>}
                            </div>

                            <div className="flex flex-col ">
                                <label htmlFor="">Bộ môn</label>
                                <SelectOption value={selectedOption} onChange={handleOptionChange} apiUrl="" />
                                {errorMessage && <p className="text-red-500">Vui lòng chọn dữ liệu</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSubmitEditSubject} type="primary" className="mr-5 ctmEdit">
                            Lưu
                        </Button>
                    </div>
                </Modal>
            </>
            {/* Modal Xóa */}
            <>
                <div>
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
                            <Button onClick={handleSubmitOkDeleteSubject} type="primary" className="mr-5">
                                Xóa
                            </Button>
                            <Button onClick={() => setDeleteModalVisible(false)} type="default" className="mr-5">
                                Hủy
                            </Button>
                        </div>
                    </Modal>
                </div>
            </>
        </>
    );
};

export default AppClass;
