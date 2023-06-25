import { Modal, Input, Button } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { MdAddBox } from 'react-icons/md';
import SelectOption from '../../components/SelectOption';
interface DataType {
    namesubject: string;
    faculty: string;
    numberofclasses: number;
    action: React.ReactNode;
}

const AppGenre = () => {
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
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];
    const data: DataType[] = [
        {
            namesubject: 'Kinh Tế',
            faculty: 'Khoa Kinh Tế',
            numberofclasses: 1,
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
            namesubject: 'Công nghệ Phần mềm',
            faculty: 'Khoa Công Nghệ Thông Tin',
            numberofclasses: 2,
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
            namesubject: 'Lý Luận Chính Trị - Pháp Luật',
            faculty: 'Khoa Giáo Dục Đại Cương',
            numberofclasses: 1,
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

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedDeleteData, setSelectedDeleteData] = useState<DataType | null>(null);
    const [editedData, setEditedData] = useState<DataType | null>(null); // Lưu trữ dữ liệu được chỉnh sửa
    const [errorGenre, setErrorGenre] = useState(false);
    const [isValueGenre, setIsValueGenre] = useState('');
    const [nameGenre, setNameGenre] = useState('');
    const [selectedOptionGenre, setSelectedOptionGenre] = useState<number | null>(null);
    const handleEdit = (row: DataType) => {
        setEditedData(row);
        setEditModalVisible(true);
    };

    const handleShowModal = () => {
        setOpenModal(true);
    };
    const handleCancel = () => {
        setOpenModal(false);
    };
    const handleCancelEdit = () => {
        setEditModalVisible(false);
    };
    const handleDelete = (row: DataType) => {
        setSelectedDeleteData(row);
        setDeleteModalVisible(true);
    };
    const handleSubmitCreateGenre = () => {
        if (nameGenre.length === 0) {
            setErrorGenre(true);
        }
        if (!selectedOptionGenre) {
            setErrorGenre(true);
        }
        setIsValueGenre('');
        const roomData = {
            nameGenre,
            selectedOptionGenre,
        };
        console.log('Data: ', roomData);
            
    };
    const handleSubmitEditGenre = () => {
        setEditModalVisible(false);
    };
    const handleSubmitDeleteGenre = () => {
        setDeleteModalVisible(false);
    };
    const handleOptionChangeGenre = (value: number | null) => {
        setSelectedOptionGenre(value);
        const selectValue = value;
        if (selectValue !== null) {
            setErrorGenre(false);
        }
    };
    const handleChangeNameGenre = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameGenre(e.target.value);
        const selectValue = e.target.value;
        if (selectValue !== '') {
            setErrorGenre(false);
        }
    };
    return (
        <>
            <div className="container mt-5">
                {' '}
                <div className="flex justify-end mb-5">
                    <Button type="primary" onClick={handleShowModal}>
                        <MdAddBox />
                    </Button>
                </div>
                <Table dataSource={data} columns={columns} />
            </div>
            <div className="">
                {/* Modal thêm bộ môn */}
                <>
                    <Modal className="custom-modal " open={openModal} onCancel={handleCancel} footer={null}>
                        <div className="p-5">
                            <span>Thêm bộ môn</span>
                            <div className="grid grid-cols-2 gap-2 mt-10">
                                <div>
                                    <label htmlFor="">Tên bộ môn</label>
                                    <Input onChange={handleChangeNameGenre} className="bg-slate-200" />
                                    {errorGenre && <p className="text-red-500">Vui lòng điền bộ môn</p>}
                                </div>
                                <div>
                                    <label htmlFor="">Khoa</label>
                                    <div className="flex flex-col">
                                        <SelectOption
                                            onChange={handleOptionChangeGenre}
                                            value={selectedOptionGenre}
                                            apiUrl=""
                                        />
                                    </div>
                                    {errorGenre && <p className="text-red-500">Vui lòng chọn khoa</p>}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end px-5 items-end">
                            <Button
                                onClick={handleSubmitCreateGenre}
                                value={isValueGenre}
                                type="primary"
                                className="mt-5"
                            >
                                Lưu
                            </Button>
                        </div>
                    </Modal>
                    {/* Modal sửa bộ môn */}
                </>
                <>
                    <Modal className="custom-modal" open={editModalVisible} onCancel={handleCancelEdit} footer={null}>
                        <div className="p-5">
                            <span>Sửa bộ môn</span>
                            <div className="grid grid-cols-2 gap-2 mt-10">
                                <div>
                                    <label htmlFor="">Tên bộ môn</label>
                                    <Input className="bg-slate-200" />
                                </div>
                                <div>
                                    <label htmlFor="">Khoa</label>
                                    <div className="flex flex-col">
                                        <SelectOption
                                            onChange={handleOptionChangeGenre}
                                            value={selectedOptionGenre}
                                            apiUrl=""
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="">Mã sinh viên</label>
                                    <Input className="bg-slate-200" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end px-5 items-end">
                            <Button onClick={handleSubmitEditGenre} type="primary" className="mt-5">
                                Lưu
                            </Button>
                        </div>
                    </Modal>
                </>
                <></>
                {/* Modal xóa bộ môn */}
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
                            <Button onClick={handleSubmitDeleteGenre} type="primary" className="mr-5">
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

export default AppGenre;
