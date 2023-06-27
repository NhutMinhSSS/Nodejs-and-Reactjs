import { Button, Input, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { MdAddBox, MdPersonAdd } from 'react-icons/md';
import SelectOption from '../../components/SelectOption';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import HeaderToken from '../../common/utils/headerToken';
interface DataType {
    subjecttitle: string;
    subject: string;
    credits: number;
    action: React.ReactNode;
}

const AppSubject = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên môn học',
            dataIndex: 'subjecttitle',
        },
        {
            title: 'Tín chỉ',
            dataIndex: 'credits',
        },
        {
            title: 'Bộ môn',
            dataIndex: 'subject',
        },
        { title: 'Hành động', dataIndex: 'action' },
    ];
    // useEffect(() => {
    //     const config = HeaderToken.getTokenConfig();
    //     axios.get(`${SystemConst.DOMAIN}/admin/subjects`, config).then((response) => {
    //         console.log('data: ', response);
    //     });
    // });
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
    ];
    const [editedData, setEditedData] = useState<DataType | null>(null); // Lưu trữ dữ liệu được chỉnh sửa
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedDeleteData, setSelectedDeleteData] = useState<DataType | null>(null);
    const [selectOptionSubject, setSelectOptionSubject] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [nameSubject, setNameSubject] = useState('');
    const [credits, setCredits] = useState('');

    const handleChangeNameSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setNameSubject(inputValue);
    };
    const handleChangeCredits = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setCredits(inputValue);
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
                                <label htmlFor="">Tên môn học</label>
                                <Input
                                    onChange={handleChangeNameSubject}
                                    value={nameSubject}
                                    className="bg-slate-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Tín chỉ</label>
                                <Input onChange={handleChangeCredits} value={credits} className="bg-slate-200" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="">Bộ môn</label>
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
                <Modal className="custom-modal " open={openModal} onCancel={handleCancel} footer={null}>
                    <div className="p-5">
                        <span>Thêm sinh viên</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">Tên môn học</label>
                                <Input
                                    onChange={handleChangeNameSubject}
                                    value={nameSubject}
                                    className="bg-slate-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Tín chỉ</label>
                                <Input onChange={handleChangeCredits} value={credits} className="bg-slate-200" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="">Bộ môn</label>
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
