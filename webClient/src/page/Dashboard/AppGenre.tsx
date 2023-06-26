import { Modal, Input, Button } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { MdAddBox } from 'react-icons/md';
import SelectOption from '../../components/SelectOption';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
const BASE_URL = `${SystemConst.DOMAIN}/admin/departments`;
interface DataType {
    department_name: string;
    facultyname: string;
    numberofsubjects: number;
    action: React.ReactNode;
}
const AppGenre = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên bộ môn',
            dataIndex: 'department_name',
        },
        {
            title: 'Khoa',
            dataIndex: 'facultyname',
        },
        {
            title: 'Số môn học',
            dataIndex: 'numberofsubjects',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];
    const [dataGenre, setDataGenre] = useState<DataType[]>([]);
    const [isOptions, setIsOptions] = useState<any[]>([]);
    const handleFecthData = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(BASE_URL, config)
            .then((response) => {
                const Api_Data_Faculty = response.data.response_data;
                console.log('data: ', Api_Data_Faculty);
                const newData: DataType[] = Api_Data_Faculty.map(
                    (item: { Faculty: any; id: number; department_name: any; subject_quantity: any }) => ({
                        department_name: item.department_name,
                        facultyname: item.Faculty.faculty_name,
                        numberofsubjects: item.subject_quantity,
                        action: (
                            <>
                                <div className="flex gap-x-1">
                                    <button
                                        className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
                                        // onClick={() => handleEdit(item)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
                                        // onClick={() => handleDelete(item)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </>
                        ),
                    }),
                );
                setDataGenre(newData);
            })
            .catch((error) => {
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    const content = 'Lỗi máy chủ';
                    const title = 'Lỗi';
                    ErrorCommon(title, content);
                }
            });
    };

    //Xử lý gọi dữ liệu ở trong Khoa
    const fetchDataSelectOption = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/get-faculty`, config)
            .then((response) => {
                const Api_all_faculty = response.data.response_data;
                setIsOptions(Api_all_faculty);
            })
            .catch((error) => {
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    const content = 'Lỗi máy chủ';
                    const title = 'Lỗi';
                    ErrorCommon(title, content);
                }
            });
    };
    useEffect(() => {
        handleFecthData();
        fetchDataSelectOption();
    }, []);
    const handleCreateSubject = () => {
        const config = HeaderToken.getTokenConfig();
        const data = { nameGenre, selectedOptionGenre };
        axios
            .post(`${BASE_URL}/create`, data, config)
            .then((response) => {
                setNameGenre('');
            })
            .catch((error) => {
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    let content = '';
                    const title = 'Lỗi';
                    const {
                        status,
                        data: { error_message: errorMessage },
                    } = error.response;
                    if (status === 400) {
                        content = 'Cần gửi đầy đủ thông tin';
                    } else if (status === 403 && errorMessage === 'Teacher not assigned to subject') {
                        content = 'Giáo viên không có quyền tạo môn học này';
                    } else if (status === 403 && errorMessage === 'Teacher not assigned to class') {
                        content = 'Giáo viên không được phân công lớp này';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
                console.error(error);
            });
    };
    const [isLoading, setIsLoading] = useState(false);
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
                <Table
                    dataSource={dataGenre}
                    columns={columns}
                    pagination={{
                        defaultPageSize: 6,
                        showSizeChanger: true,
                        pageSizeOptions: ['4', '6', '8', '12', '16'],
                    }}
                />
            </div>
            <div className="">
                {/* Modal thêm bộ môn */}
                <>
                    <Modal className="custom-modal-genre" open={openModal} onCancel={handleCancel} footer={null}>
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
                                        {/* <SelectOption
                                            onChange={handleOptionChangeGenre}
                                            value={selectedOptionGenre}
                                            apiUrl={}
                                        /> */}
                                        <select className="bg-slate-200 h-8 rounded-md focus:outline-none focus:border-blue-600 ">
                                            {isOptions.map((option: any) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.faculty_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errorGenre && <p className="text-red-500">Vui lòng chọn khoa</p>}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end px-5 items-end ctmGenre">
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
                    <Modal
                        className="custom-modal-genre"
                        open={editModalVisible}
                        onCancel={handleCancelEdit}
                        footer={null}
                    >
                        <div className="p-5">
                            <span>Sửa bộ môn</span>
                            <div className="grid grid-cols-2 gap-2 mt-10">
                                <div>
                                    <label htmlFor="">Tên bộ môn</label>
                                    <Input onChange={handleChangeNameGenre} className="bg-slate-200" />
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
                            </div>
                        </div>
                        <div className="flex justify-end px-5 items-end ctmGenre">
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
