import React, { useState } from 'react';
import logoTruong from '../../img/Logotruong.png';
import { MenuOutlined } from '@ant-design/icons';
import iconUser from '../../img/iconUser.svg';
import { Col, Dropdown, Input, MenuProps, Modal, Row, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import '../../style/HeaderHome.scss';
import { Content, Header } from 'antd/es/layout/layout';
import axios from 'axios';

const HeaderHome: React.FC = () => {
    const navigate = useNavigate();

    const [nameClass, setNameClass] = useState('');
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

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
            .post('http://192.168.1.7:3000/api/create-class', roomData, config)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
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
        {
            label: (
                <button
                    className="hover:bg-slate-100 px-7 py-2 duration-150 rounded-lg cursor-pointer  text-base"
                    onClick={() => setIsPopupVisibleCreateClass(true)}
                >
                    Tạo Phòng
                </button>
            ),
            key: 2,
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
                >
                    <Row>
                        <Col span={24}>
                            <Header className="bg-blue-300 flex items-center">
                                <div className="text-xl text-gray-200 font-sans">
                                    Tham Gia lớp học
                                </div>
                            </Header>
                        </Col>
                    </Row>
                    <div className="">
                        <Row>
                            <Col span={24}>
                                <div className="flex justify-center items-center mt-6 ">
                                    <div className="border px-4 py-2 rounded-lg">
                                        <div className="text-lg">Mã Lớp</div>
                                        <div>
                                            Đề nghị giáo viên của bạn cung cấp mã lớp rồi nhập mã đó
                                            vào đây.
                                        </div>
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
                                    <div className="font-semibold text-lg">
                                        Cách đăng nhập bằng mã lớp
                                    </div>
                                    <ul className="list-disc">
                                        <li>Sử dụng tài khoản được cấp phép</li>
                                        <li>
                                            Sử dụng mã lớp học gồm 5-7 chữ cái hoặc số, không có dấu
                                            cách hoặc ký hiệu
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal>
                {/* Popup Create Class */}
                <Modal
                    visible={isPopupVisibleCreateClass}
                    onCancel={handlePopupCancelCreateClass}
                    className="w-[1000px]"
                    footer={null}
                >
                    <Row>
                        <Col span={24}>
                            <Header className="bg-blue-300 flex items-center">
                                <div className="text-xl text-gray-200 font-sans">Tạo lớp học</div>
                            </Header>
                        </Col>
                    </Row>
                    <div className="px-5 py-10 grid justify-center mt-2">
                        <Row className="w-[800px] gap-y-4">
                            <Col span={24}>
                                <div
                                    className="relative mb-3 mt-2 px-2"
                                    data-te-textarea-wrapper-init
                                >
                                    <input
                                        className="bg-slate-100 h-16 peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px]  px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                        id="exampleFormControlTextarea1"
                                        placeholder="Your message"
                                        style={{ resize: 'none' }}
                                        value={nameClass}
                                        onChange={handleNameClassChange}
                                    ></input>
                                    <label
                                        htmlFor="exampleFormControlTextarea1"
                                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                                    >
                                        Tên lớp học
                                    </label>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className="relative mb-3 mt-2 px-2" data-te-input-wrapper-init>
                                    <input
                                        className="bg-slate-100 h-16 peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px]  px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                        id="exampleFormControlTextarea1"
                                        placeholder="Your message"
                                        style={{ resize: 'none' }}
                                        value={title}
                                        onChange={handleTitleChange}
                                    ></input>
                                    <label
                                        htmlFor="exampleFormControlTextarea1"
                                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                                    >
                                        Tiêu đề
                                    </label>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className="relative mb-3 mt-2 px-2" data-te-input-wrapper-init>
                                    <input
                                        className="bg-slate-100 h-16 peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px]  px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                        id="exampleFormControlTextarea1"
                                        placeholder="Your message"
                                        style={{ resize: 'none' }}
                                        value={note}
                                        onChange={handleNoteChange}
                                    ></input>
                                    <label
                                        htmlFor="exampleFormControlTextarea1"
                                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                                    >
                                        Ghi chú
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
                                        value={selectedClass}
                                        onChange={handleClassSelect}
                                    >
                                        <option value="" disabled selected hidden>
                                            Chọn Lớp
                                        </option>
                                        <option value="Lớp 1">Lớp 1</option>
                                        <option value="Lớp 2">Lớp 2</option>
                                        <option value="Lớp 3">Lớp 3</option>
                                    </select>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className="relative mb-3 mt-2 px-2" data-te-input-wrapper-init>
                                    <select
                                        className="bg-slate-100 h-16 peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px]  px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                        id="exampleFormControlTextarea1"
                                        placeholder="Your message"
                                        style={{ resize: 'none' }}
                                        value={selectedSubject}
                                        onChange={handleSelectSubject}
                                    >
                                        <option value="" disabled selected hidden>
                                            Chọn Môn
                                        </option>
                                        <option value="Nhập Môn Lập Trình">
                                            Nhập Môn Lập Trình
                                        </option>
                                        <option value="Mạng Máy Tính">Mạng Máy Tính</option>
                                        <option value="Anh văn Chuyên Ngành">
                                            Anh văn Chuyên Ngành
                                        </option>
                                    </select>
                                </div>
                            </Col>
                            <Col className="flex justify-center mt-10" span={24}>
                                <div className="flex gap-x-4 ">
                                    <div>
                                        <button
                                            className="text-lg bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600"
                                            onClick={handleCreateRoom}
                                        >
                                            Tạo
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={handlePopupCancelCreateClass}
                                            className="text-lg bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default HeaderHome;
