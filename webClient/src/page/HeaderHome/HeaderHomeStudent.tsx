import React, { useEffect, useState } from 'react';
import logoTruong from '../../img/Logotruong.png';
import { MenuOutlined } from '@ant-design/icons';
import iconUser from '../../img/iconUser.svg';
import { Col, Dropdown, Input, MenuProps, Modal, Row, Space, Spin, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import './style.scss';
import { Content, Header } from 'antd/es/layout/layout';
import axios from 'axios';
import data from '../../data';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import showUnauthorizedPopup from '../../common/Screens/ErrorAlertLogout';

const HeaderHomeStudent: React.FC = () => {
    const navigate = useNavigate();

    const [nameClass, setNameClass] = useState('');
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [error, setError] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleNameClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameClass(e.target.value);
    };
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };
    const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote(e.target.value);
    };
    const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClass(e.target.value);
    };
    const handleSelectSubject = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubject(e.target.value);
    };
    const handleCreateRoom = () => {
        const roomData = {
            nameClass,
            title,
            note,
            selectedClass,
            selectedSubject,
        };
        console.log('Data', roomData);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        axios
            .post('http://20.39.197.125:3000/api/classrooms/create-classroom', roomData, config)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        //Đặt lại giá trị của các ô đầu vào sau khi tạo lớp học thành công
        setNameClass('');
        setTitle('');
        setNote('');
        setSelectedClass('');
        setSelectedSubject('');
    };
    const handleSubmitCreateRoom = () => {
        if (nameClass.length === 0) {
            setError(true);
        }
        if (!selectedClass) {
            setError(true);
            return;
        }
        if (!!selectedSubject) {
            setError(true);
        }
        if (selectedClass && selectedSubject && nameClass) {
            handleCreateRoom();
        }
    };
    // const handleOnchangFlusCreateRoom = () => {
    //     const token = localStorage.getItem('token');
    //     const config = {
    //         headers: {
    //             authorization: `Bearer ${token}`,
    //         },
    //     };
    //     setLoading(true);

    //     axios
    //         .get('http://20.39.197.125:3000/api/classrooms/init', config)
    //         .then((response) => {
    //             setClasses(response.data.response_data.regular_class);
    //             setSubjects(response.data.response_data.subjects);
    //         })
    //         .catch((error) => {
    //             if (new UnauthorizedError(error)) {
    //                 // notification.error({
    //                 //     message: 'Unauthorized',
    //                 //     description: 'You are not authorized to access this resource.',
    //                 // });
    //                 // Xử lý UnauthorizedError ở đây
    //             } else {
    //                 console.log(error.response.data.error_message);
    //             }
    //             console.log(error.response.data.error_message);
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload(); // Tải lại trang web
        window.location.replace('/');
    };
    //State Class Code
    const [isInputValueClassCode, setIsInputValueClassCode] = useState('');
    const handleChangeClassCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsInputValueClassCode(e.target.value);
    };

    const handleJoinButtonClick = () => {};
    //State show Popup
    const [isPopupVisibleJoin, setIsPopupVisibleJoin] = useState(false);

    const handlePopupCancel = () => {
        setIsPopupVisibleJoin(false);
    };
    const [isPopupVisibleCreateClass, setIsPopupVisibleCreateClass] = useState(false);

    const handlePopupCancelCreateClass = () => {
        setIsPopupVisibleCreateClass(false);
    };

    const items = [
        {
            label: <button onClick={handleLogout}>Logout</button>,
            key: 1,
        },
    ];
    const optionClassItems: MenuProps['items'] = [
        {
            label: (
                <button
                    className="hover:bg-slate-100 px-7 py-2 duration-150  rounded-lg cursor-pointer text-base"
                    onClick={() => setIsPopupVisibleJoin(true)}
                >
                    Tham gia
                </button>
            ),
            key: 1,
        },
    ];
    return (
        <>
            <div className="bg-blue-300 shadow-md h-16 p-5 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="hover:bg-gray-200 rounded-full h-9 w-9 flex items-center justify-center transition duration-150 ease-in-out cursor-pointer">
                        <MenuOutlined>{/* <BtnDrawer /> */}</MenuOutlined>
                    </span>
                    <div>
                        <img className="h-12 cursor-pointer" src={logoTruong} alt="" />
                    </div>
                </div>

                <div className="flex items-center gap-x-5">
                    <div>
                        <Dropdown menu={{ items: optionClassItems }} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault}>
                                <Space className="">
                                    <MdAdd className="text-3xl hover:bg-blue-200 rounded-full duration-200" />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                    <div>
                        <Dropdown
                            className="w-24"
                            menu={{
                                items,
                            }}
                            trigger={['click']}
                            overlayClassName="w-[10rem] z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-md text-center cursor-pointer"
                        >
                            <a
                                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                onClick={(e) => e.preventDefault()}
                            >
                                <Space>
                                    <img className="w-9 h-9" src={iconUser} alt="" />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div>
                <Modal
                    visible={isPopupVisibleJoin}
                    onCancel={handlePopupCancel}
                    footer={null}
                    width={1000}
                    className="custom-modal-join-class"
                >
                    <Row>
                        <Col span={24}>
                            <Header className="bg-blue-300 flex items-center">
                                <div className="text-xl text-gray-200 font-sans">Tham Gia lớp học</div>
                            </Header>
                        </Col>
                    </Row>
                    <div className="">
                        <Row>
                            <Col span={24}>
                                <div className="flex justify-center items-center mt-6 ">
                                    <div className="border px-4 py-2 rounded-lg">
                                        <div className="text-lg">Mã Lớp</div>
                                        <div>Đề nghị giáo viên của bạn cung cấp mã lớp rồi nhập mã đó vào đây.</div>
                                        <div className="mt-5 flex justify-between">
                                            <Input
                                                className="w-full h-10 rounded-sm"
                                                placeholder="Mã lớp học"
                                                value={isInputValueClassCode}
                                                onChange={handleChangeClassCode}
                                            />
                                            <button
                                                className={`border-none bg-blue-400 rounded-md w-32 ml-1 ${
                                                    isInputValueClassCode
                                                        ? 'hover:bg-blue-500 hover:text-white duration-200'
                                                        : 'opacity-80  border-opacity-75'
                                                }`}
                                                onClick={handleJoinButtonClick}
                                                disabled={!isInputValueClassCode}
                                            >
                                                Tham gia
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col span={24} className="flex justify-center ">
                                <div className="flex flex-col gap-y-2">
                                    <div className="font-semibold text-lg">Cách đăng nhập bằng mã lớp</div>
                                    <ul className="list-disc">
                                        <li>Sử dụng tài khoản được cấp phép</li>
                                        <li>
                                            Sử dụng mã lớp học gồm 5-7 chữ cái hoặc số, không có dấu cách hoặc ký hiệu
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default HeaderHomeStudent;
