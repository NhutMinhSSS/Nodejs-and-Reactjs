import { Button, Col, Modal, Row, Spin } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import './scss/styleDashboard.scss';
import { MdBookmarkAdd } from 'react-icons/md';
import { Header } from 'antd/es/layout/layout';
import { title } from 'process';
import { useNavigate } from 'react-router-dom';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
import SystemConst from '../../common/consts/system_const';
interface DataType {
    nameclasssection: string;
    class: string;
    semester: number;
    schoolyear: number;
    action: React.ReactNode;
    status: 'Đang mở' | 'Đang đóng';
}

const option = [
    {
        key: '1',
    },
    {
        key: '2',
    },
    {
        key: '3',
    },
    {
        key: '4',
    },
    {
        key: '5',
    },
    {
        key: '6',
    },
    {
        key: 'Học kỳ phụ',
    },
];
const AppClassSection: React.FC = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên lớp học phần',
            dataIndex: 'nameclasssection',
        },
        {
            title: 'Lớp',
            dataIndex: 'class',
        },
        {
            title: 'Học kỳ',
            dataIndex: 'semester',
        },
        {
            title: 'Năm học',
            dataIndex: 'schoolyear',
        },

        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status: DataType['status']) => (
                <span className="text-sm" style={{ color: statusColorMap[status] }}>
                    {status}
                </span>
            ),
        },
        {
            title: 'Hành động ',
            dataIndex: 'action',
        },
    ];
    const data: DataType[] = [
        {
            nameclasssection: 'Công nghệ phần mềm CĐ TH 19A',
            class: 'CĐ TH 19A',
            semester: 4,
            schoolyear: 2021,
            status: 'Đang mở',
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
            nameclasssection: 'Cơ sở dữ liệu CĐ TH 20A',
            class: 'CĐ TH 20A',
            semester: 2,
            schoolyear: 2022,
            status: 'Đang mở',
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
            nameclasssection: 'Nhập môn lập trình CĐ TH 20A',
            class: 'CĐ TH 19A',
            semester: 4,
            schoolyear: 2021,
            status: 'Đang đóng',
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
            nameclasssection: 'Phần cứng máy tính CĐ TH 18B',
            class: 'CĐ TH 18B',
            semester: 6,
            schoolyear: 2019,
            status: 'Đang đóng',
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
            nameclasssection: 'Thiết kế website',
            class: 'CĐ Th 21A',
            semester: 2,
            schoolyear: 2023,
            status: 'Đang mở',
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
    const statusColorMap: { [key in DataType['status']]: string } = {
        'Đang mở': 'green',
        'Đang đóng': 'red',
    };
    //Quản lí trạng thái
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [nameClass, setNameClass] = useState('');
    const [schoolYear, SetSchoolYear] = useState('');
    const [isPopupVisibleCreateClass, setIsPopupVisibleCreateClass] = useState(false);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [errorClass, setErrorClass] = useState(false);
    const [errorSelectedClass, setErrorSelectedClass] = useState(false);
    const [errorSelectedSubject, setErrorSelectedSubject] = useState(false);
    const [errorSelectedSemester, setErrorSelectedSemester] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editedData, setEditedData] = useState<DataType | null>(null); // Lưu trữ dữ liệu được chỉnh sửa
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedDeleteData, setSelectedDeleteData] = useState<DataType | null>(null);
    const handleEdit = (row: DataType) => {
        setEditedData(row);
        setIsModalOpen(true);
    };
    const handleDelete = (row: DataType) => {
        setSelectedDeleteData(row);
        setDeleteModalVisible(true);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleNameClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = e.target.value;
        setNameClass(e.target.value);
        if (selectedValue !== '') {
            setErrorClass(false);
        }
    };
    const handleSchoolYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        SetSchoolYear(e.target.value);
    };

    const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectValue = e.target.value;
        setSelectedClass(e.target.value);
        if (selectValue !== '') {
            setErrorSelectedClass(false);
        }
    };
    const handleSelectSubject = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setSelectedSubject(e.target.value);
        if (selectedValue !== '') {
            setErrorSelectedSubject(false);
        }
    };
    // const handleSelectSemester = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedValue = e.target.value;
    //     setSelectedSubject(e.target.value);
    //     if (selectedValue !== '') {
    //         setErrorSelectedSemester(false);
    //     }
    // };
    const handleSelectSemester = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedSemester(selectedValue);
        if (selectedValue !== '') {
            setErrorSelectedSemester(false);
        }
    };
    const handleCreateRoom = () => {
        const roomData = {
            nameClass,
            selectedSemester,
            selectedClass,
            selectedSubject,
        };
        console.log('Data', roomData);
        const config = HeaderToken.getTokenConfig();
        setLoading(true);
        axios
            .post('http://20.39.197.125:3000/api/classrooms/create-classroom', roomData, config)
            .then((response) => {
                //Đặt lại giá trị của các ô đầu vào sau khi tạo lớp học thành công
                setNameClass('');
                SetSchoolYear('');
                setSelectedSemester('');
                setSelectedClass('');
                setSelectedSubject('');
                setIsPopupVisibleCreateClass(false);
                const data = response.data.response_data;
                //Chuyển dữ liệu khi tạo mới phòng
                navigate(`/giang-vien/class/${data.id}`, { state: { data } });
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
    useEffect(() => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${SystemConst.DOMAIN}/classrooms`, config)
            .then((response) => {
                console.log('Data: ', response.data);
            })
            .catch((error) => {
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    const content = 'Lỗi máy chủ';
                    const title = 'Lỗi';
                    ErrorCommon(title, content);
                }
                // Xử lý lỗi nếu có
                console.error(error);
            });
    }, []);
    const handleSubmitCreateRoom = () => {
        if (nameClass.length === 0) {
            setErrorClass(true);
        }
        if (!selectedClass) {
            setErrorSelectedClass(true);
        }
        if (!selectedSubject) {
            setErrorSelectedSubject(true);
        }
        if (selectedClass && selectedSubject && nameClass) {
            handleCreateRoom();
        }
    };
    const handleSubmitDeleteFaculty = () => {
        setDeleteModalVisible(false);
    };
    return (
        <>
            <div className="container mt-5">
                <div className="flex justify-between mb-5">
                    <div>
                        <input className="outline-none focus:outline-blue-200 h-6 w-52" type="text" />
                    </div>
                    <div>
                        <Button onClick={showModal} type="primary">
                            <MdBookmarkAdd />
                        </Button>
                        <div className="">
                            <Modal
                                visible={isModalOpen}
                                open={isModalOpen}
                                onCancel={handleCancel}
                                footer={null}
                                className="custom-modal-create-class"
                            >
                                <Spin size="large" spinning={loading}>
                                    <Row>
                                        <Col span={24}>
                                            <Header className="bg-blue-300 flex items-center">
                                                <div className="text-xl text-gray-200 font-sans">Tạo lớp học</div>
                                            </Header>
                                        </Col>
                                    </Row>
                                    <div className=" px-5 py-10 grid justify-center mt-2 ">
                                        <Row className="w-[800px] gap-y-2">
                                            <Col span={24} sm={24} md={24} lg={24} xl={24}>
                                                <div className="relative mb-3 mt-2 px-2" data-te-textarea-wrapper-init>
                                                    <input
                                                        className="bg-slate-100 h-16 peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px]  px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                        id="exampleFormControlTextarea1"
                                                        placeholder="Your message"
                                                        style={{ resize: 'none' }}
                                                        value={nameClass}
                                                        onChange={handleNameClassChange}
                                                        required
                                                    ></input>
                                                    <label
                                                        htmlFor="exampleFormControlTextarea1"
                                                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                                                    >
                                                        Tên lớp học phần
                                                    </label>
                                                    {errorClass && nameClass.length <= 0 ? (
                                                        <label className="text-red-500 font-normal">
                                                            Vui lòng nhập tên lớp học phần
                                                        </label>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            </Col>
                                            <Col span={24}>
                                                <div className="relative mb-3 mt-2 px-2" data-te-input-wrapper-init>
                                                    <input
                                                        className="bg-slate-100 h-16 peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px] px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                        id="exampleFormControlTextarea1"
                                                        placeholder="Your message"
                                                        style={{ resize: 'none' }}
                                                        value={schoolYear}
                                                        onChange={handleSchoolYearChange}
                                                    />
                                                    <label
                                                        htmlFor="exampleFormControlTextarea1"
                                                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                                                    >
                                                        Năm học
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col span={24}>
                                                <div className="relative mb-3 mt-2 px-2" data-te-input-wrapper-init>
                                                    <select
                                                        className="bg-slate-100 h-16 peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px]  px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                        id="exampleFormControlTextarea1"
                                                        placeholder="Your message"
                                                        style={{ resize: 'none' }}
                                                        value={selectedSemester}
                                                        onChange={handleSelectSemester}
                                                    >
                                                        <option value="" disabled selected hidden>
                                                            Chọn học kỳ
                                                        </option>
                                                        {option.map((item) => (
                                                            <option key={item.key} value={item.key}>
                                                                {item.key}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errorSelectedClass && (
                                                        <div className="text-red-500 font-normal">
                                                            Vui lòng chọn dữ liệu.
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col span={24}>
                                                <div className="relative mb-3 mt-2 px-2" data-te-input-wrapper-init>
                                                    <select
                                                        className="bg-slate-100 h-16 peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px]  px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                        id="exampleFormControlTextarea1"
                                                        placeholder="Your message"
                                                        style={{ resize: 'none' }}
                                                        value={selectedClass}
                                                        onChange={handleClassSelect}
                                                    >
                                                        <option value="" disabled selected hidden>
                                                            Chọn Lớp
                                                        </option>
                                                        {classes.map((option) => (
                                                            <option
                                                                key={option['regular_class_id']}
                                                                value={option['regular_class_id']}
                                                            >
                                                                {option['class_name']}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errorSelectedClass && (
                                                        <div className="text-red-500 font-normal">
                                                            Vui lòng chọn dữ liệu.
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col span={24}>
                                                <div className="relative mb-3 mt-2 px-2" data-te-input-wrapper-init>
                                                    <select
                                                        className="bg-slate-100 h-16  peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px]  px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                        id="exampleFormControlTextarea1"
                                                        placeholder="Your message"
                                                        style={{ resize: 'none' }}
                                                        value={selectedSubject}
                                                        onChange={handleSelectSubject}
                                                    >
                                                        <option value="" disabled selected hidden>
                                                            Chọn Môn
                                                        </option>
                                                        {subjects.map((classItem) => (
                                                            <option
                                                                key={classItem['subject_id']}
                                                                value={classItem['subject_id']}
                                                            >
                                                                {classItem['subject_name']}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errorSelectedSubject && (
                                                        <div className="text-red-500 font-normal">
                                                            Vui lòng chọn dữ liệu.
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col
                                                className="flex justify-center mt-5"
                                                span={24}
                                                xs={24}
                                                sm={24}
                                                md={24}
                                                lg={24}
                                                xl={24}
                                            >
                                                <div className="flex gap-x-4 ">
                                                    <div>
                                                        <button
                                                            className="text-lg bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600"
                                                            onClick={handleSubmitCreateRoom}
                                                        >
                                                            Tạo
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={handleCancel}
                                                            className="text-lg bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600"
                                                        >
                                                            Hủy
                                                        </button>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Spin>
                            </Modal>
                        </div>
                    </div>
                </div>
                <Table dataSource={data} columns={columns} />
            </div>
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

export default AppClassSection;
