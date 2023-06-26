import { Button, Divider, Input, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { MdPersonAdd } from 'react-icons/md';
import { parse, format } from 'date-fns';
import SelectOption from '../../components/SelectOption';

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
    const [isValueTeacherCode, setIsValueTeacherCode] = useState('');
    const [isValueSurname, setIsValueSurname] = useState('');
    const [isValueName, setIsValueName] = useState('');
    const [isValueDateOfBirth, setIsValueDateOfBirth] = useState<Date | null>(null);
    const [isValuePhone, setIsValuePhone] = useState('');
    const [isValueCCCD, setIsValueCCCD] = useState('');
    const [isValueAddress, setIsValueAddress] = useState('');
    const [selectedOptionClass, setSelectedOptionClass] = useState<number | null>(null);
    const [selectedOptionSubject, setSelectedOptionSubject] = useState<number | null>(null);
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

    const handleOptionChangeClass = (value: number | null) => {
        setSelectedOptionClass(value);
    };
    const handleOptionChangeSubject = (value: number | null) => {
        setSelectedOptionSubject(value);
    };
    //Hàm xử lý Change Input chỉ được nhập tối đa 10 số và có thể nhập số 0 ở đầu
    const handleChangeCodeStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const formattedValue = inputValue
            .replace(/^0+(?=\d{1,10})/, '')
            .replace(/\D/g, '')
            .slice(0, 10);
        setIsValueTeacherCode(formattedValue);
    };
    //Hàm xử lý Change Input nhập Họ sinh viên
    const handleChangeSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setIsValueSurname(inputValue);
    };
    // //Hàm xử lý Change Input nhập Tên sinh viên
    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setIsValueName(inputValue);
    };
    // Hàm xử lý Change Input nhập ngày sinh
    const handleChangeDateOfBirth = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        //Kiểm tra định dạng nhập vào (dd/mm/yyyy)
        const dateFormat = 'dd/MM/yyyy';
        //Parse chuỗi nhập vào thành đối tượng ngày tháng
        const pasredDate = parse(inputValue, dateFormat, new Date());
        //Kiểm tra xem pasredDate có hợp lệ không
        if (!isNaN(pasredDate.getTime())) {
            setIsValueDateOfBirth(pasredDate);
        }
    };
    //Hàm xử lý Change Input chỉ được nhập tối đa 11 số và có thể số 0 ở đầu
    const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const formattedValue = inputValue.replace(/[^\d]/g, '').slice(0, 11);
        setIsValuePhone(formattedValue);
    };
    const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setIsValueAddress(inputValue);
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
            {/* <>
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
            </> */}
            <Modal className="custom-modal-teacher_create-edit " open={openModal} onCancel={handleCancel} footer={null}>
                <div className="p-5">
                    <span className="text-base font-medium">Thêm giảng viên</span>
                    <div className="grid grid-cols-2 gap-2 mt-5">
                        <div>
                            <label htmlFor="">MSSV</label>
                            <Input
                                onChange={handleChangeCodeStudent}
                                value={isValueTeacherCode}
                                className="bg-slate-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="">Họ sinh viên</label>
                            <Input onChange={handleChangeSurname} value={isValueSurname} className="bg-slate-200" />
                        </div>
                        <div>
                            <label htmlFor="">Tên sinh viên</label>
                            <Input onChange={handleChangeName} value={isValueName} className="bg-slate-200" />
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
                            <Input
                                onChange={handleChangeDateOfBirth}
                                value={isValueDateOfBirth ? format(isValueDateOfBirth, 'dd/MM/YYYY') : ''}
                                className="bg-slate-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="">Số điện thoại</label>
                            <Input onChange={handleChangePhone} value={isValuePhone} className="bg-slate-200" />
                        </div>
                        <div>
                            <label htmlFor="">CCCD</label>
                            <Input value={isValueCCCD} className="bg-slate-200" />
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
                        <Input onChange={handleChangeAddress} value={isValueAddress} className="bg-slate-200" />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSubmitCreateTeacher} type="primary" className="mt-5">
                            Lưu
                        </Button>
                    </div>
                </div>
            </Modal>
            {/* Modal sửa giảng viên  */}
            <>
                <Modal
                    className="custom-modal-teacher_create-edit "
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-base font-medium">Sửa giảng viên</span>
                        <div className="grid grid-cols-2 gap-2 mt-5">
                            <div>
                                <label htmlFor="">MSSV</label>
                                <Input
                                    onChange={handleChangeCodeStudent}
                                    value={isValueTeacherCode}
                                    className="bg-slate-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Họ sinh viên</label>
                                <Input onChange={handleChangeSurname} value={isValueSurname} className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Tên sinh viên</label>
                                <Input onChange={handleChangeName} value={isValueName} className="bg-slate-200" />
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
                                <Input
                                    onChange={handleChangeDateOfBirth}
                                    value={isValueDateOfBirth ? format(isValueDateOfBirth, 'dd/MM/YYYY') : ''}
                                    className="bg-slate-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Số điện thoại</label>
                                <Input onChange={handleChangePhone} value={isValuePhone} className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">CCCD</label>
                                <Input value={isValueCCCD} className="bg-slate-200" />
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
                            <Input onChange={handleChangeAddress} value={isValueAddress} className="bg-slate-200" />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSubmitEditTeacher} type="primary" className="mt-5">
                                Lưu
                            </Button>
                        </div>
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
