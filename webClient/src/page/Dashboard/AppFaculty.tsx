import { Button, Modal, Input } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { MdPersonAdd } from 'react-icons/md';
import Notification from '../../components/Notification';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
interface DataType {
    facultyname: string;
    numberofsubjects: number;
    action: React.ReactNode;
}

const AppFaculty = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên khoa',
            dataIndex: 'facultyname',
        },
        {
            title: 'Số lượng bộ môn',
            dataIndex: 'numberofsubjects',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];

    const data: DataType[] = [
        {
            facultyname: 'Khoa Kinh Tế',
            numberofsubjects: 1,
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

    //Khai báo các State quản lí trạng thái
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedDeleteData, setSelectedDeleteData] = useState<DataType | null>(null);
    const [editedData, setEditedData] = useState<DataType | null>(null); // Lưu trữ dữ liệu được chỉnh sửa
    const [isValueFaculty, setIsValueFaculty] = useState('');
    const [errorFaculty, setErrorFaculty] = useState(false);

    // Get API
    useEffect(() => {
        axios.get(`${SystemConst.DOMAIN}/`);
    }, []);

    const handleChangeValueFaculty = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = e.target.value;
        setIsValueFaculty(e.target.value);
        if (selectedValue !== '') {
            setErrorFaculty(false);
        }
    };

    const handleEdit = (row: DataType) => {
        setEditedData(row);
        setOpenModalEdit(true);
    };
    const handleDelete = (row: DataType) => {
        setSelectedDeleteData(row);
        setDeleteModalVisible(true);
    };

    const handleShowModal = () => {
        setOpenModal(true);
    };
    const handleCancel = () => {
        setOpenModal(false);
    };
    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    const handleClickSuccess = () => {
        Notification('success', 'Thành công', 'Tạo Khoa thành công');
    };
    const handleSubmitCreateFaculty = () => {
        if (isValueFaculty.length === 0) {
            setErrorFaculty(true);
        } else {
            setOpenModal(false);
            console.log('data:', isValueFaculty);
            handleClickSuccess();
            setIsValueFaculty('');
        }
    };

    const handleSubmitEditFaculty = () => {};
    const handleSubmitDeleteFaculty = () => {
        setDeleteModalVisible(false);
    };

    return (
        <>
            <div className="container mt-5 ">
                <div className="flex justify-end mb-5">
                    <Button type="primary" onClick={handleShowModal}>
                        <MdPersonAdd />
                    </Button>
                </div>
                <Table columns={columns} dataSource={data} />
            </div>
            {/* Modal thêm khoa */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_faculty"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm khoa</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên khoa</label>
                            <Input
                                onChange={handleChangeValueFaculty}
                                value={isValueFaculty}
                                className="bg-slate-200"
                            />
                            {errorFaculty && <p className="text-red-500">Vui lòng điền vào chỗ trống</p>}
                        </div>

                        <div className="flex justify-end items-end ">
                            <Button onClick={handleSubmitCreateFaculty} type="primary" className="cstCreateFaculty">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa khoa */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_faculty"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm khoa</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên khoa</label>
                            <Input className="bg-slate-200" />
                        </div>

                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEditFaculty} type="primary" className="cstCreateFaculty">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal xóa khoa */}
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
                            <Button onClick={handleSubmitDeleteFaculty} type="primary" className="mr-5">
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

export default AppFaculty;
// {
//     facultyname: 'Khoa Công Nghệ Thông tin',
//     numberofsubjects: 5,
//     action: (
//         <>
//             <div className="flex gap-x-1">
//                 <button
//                     className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
//                     onClick={() => handleEdit(data[1])}
//                 >
//                     Sửa
//                 </button>
//                 <button
//                     className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
//                     onClick={() => handleDelete(data[1])}
//                 >
//                     Xóa
//                 </button>
//             </div>
//         </>
//     ),
// },
// {
//     facultyname: 'Khoa Cơ Khí',
//     numberofsubjects: 3,
//     action: (
//         <>
//             <div className="flex gap-x-1">
//                 <button
//                     className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
//                     onClick={() => handleEdit(data[2])}
//                 >
//                     Sửa
//                 </button>
//                 <button
//                     className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
//                     onClick={() => handleDelete(data[2])}
//                 >
//                     Xóa
//                 </button>
//             </div>
//         </>
//     ),
// },
// {
//     facultyname: 'Khoa Nhiệt - Lạnh',
//     numberofsubjects: 2,
//     action: (
//         <>
//             <div className="flex gap-x-1">
//                 <button
//                     className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
//                     onClick={() => handleEdit(data[3])}
//                 >
//                     Sửa
//                 </button>
//                 <button
//                     className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
//                     onClick={() => handleDelete(data[3])}
//                 >
//                     Xóa
//                 </button>
//             </div>
//         </>
//     ),
// },
// {
//     facultyname: 'Khoa Cơ Động Lực',
//     numberofsubjects: 4,
//     action: (
//         <>
//             <div className="flex gap-x-1">
//                 <button
//                     className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
//                     onClick={() => handleEdit(data[4])}
//                 >
//                     Sửa
//                 </button>
//                 <button
//                     className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
//                     onClick={() => handleDelete(data[4])}
//                 >
//                     Xóa
//                 </button>
//             </div>
//         </>
//     ),
// },
// {
//     facultyname: 'Khoa Điện Tử',
//     numberofsubjects: 2,
//     action: (
//         <>
//             <div className=" flex gap-x-1">
//                 <button
//                     className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
//                     onClick={() => handleEdit(data[5])}
//                 >
//                     Sửa
//                 </button>
//                 <button
//                     className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
//                     onClick={() => handleDelete(data[5])}
//                 >
//                     Xóa
//                 </button>
//             </div>
//         </>
//     ),
// },
