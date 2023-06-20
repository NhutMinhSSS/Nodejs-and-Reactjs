import React, { useState } from 'react';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './style.scss';
import { MdAccountCircle, MdOutlineAdd, MdOutlineAssignment } from 'react-icons/md';
import PopupCreateExercise from '../Popup/PopupCreateExercise';
import PopupCreateTest from '../Popup/PopupCreateTest';
import CardExercise from '../../components/CardExercise';

const dataExersise = [
    {
        id: 1,
        icon: <MdOutlineAssignment />,
        title: 'Bài 1',
        datetime: 'Đã đăng lúc 14:20',
    },
    {
        id: 2,
        icon: <MdOutlineAssignment />,
        title: 'Bài 2',
        datetime: 'Đã đăng lúc 14:20',
    },
    {
        id: 3,
        icon: <MdOutlineAssignment />,
        title: 'Bài 3',
        datetime: 'Đã đăng lúc 14:20',
    },
    {
        id: 4,
        icon: <MdOutlineAssignment />,
        title: 'Bài 4',
        datetime: 'Đã đăng lúc 14:20',
    },
    {
        id: 5,
        icon: <MdOutlineAssignment />,
        title: 'Bài 5',
        datetime: 'Đã đăng lúc 14:20',
    },
];

const ClassroomExercisesTeacher: React.FC = () => {
    const navigate = useNavigate();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isPopupVisibleCreateTest, setIsPopupVisibleCreateTest] = useState(false);
    const onCheckboxChange = (selection: string[]) => {
        console.log(selection);
    };
    const items = [
        {
            key: '1',
            label: <span className="text-lg">Bài tập</span>,
            onClick: () => setIsPopupVisible(true),
        },
        {
            key: '2',
            label: <span className="text-lg">Bài Kiểm Tra</span>,
            onClick: () => setIsPopupVisibleCreateTest(true),
        },
        {
            key: '3',
            label: <span className="text-lg">Tài Liệu</span>,
            onClick: () => navigate('/createExcersice'),
        },
        {
            key: '4',
            label: <span className="text-lg">Câu Hỏi</span>,
            onClick: () => navigate('/createExcersice'),
        },
    ];
    const handlePopupCancel = () => {
        setIsPopupVisible(false);
    };
    const handlePopupCancelPopupCreateTest = () => {
        setIsPopupVisibleCreateTest(false);
    };

    return (
        <>
            <div className="w-[45rem]">
                <div className="flex  gap-x-[25rem]">
                    <div>
                        <Dropdown
                            overlay={
                                <Menu>
                                    {items.map((item) => (
                                        <Menu.Item key={item.key} onClick={item.onClick}>
                                            {item.label}
                                        </Menu.Item>
                                    ))}
                                </Menu>
                            }
                            placement="bottom"
                            trigger={['click']}
                            overlayClassName="custom-dropdown-menu"
                            overlayStyle={{
                                width: '180px',
                                height: '250px',
                                padding: '10px',
                                gap: '10px',
                            }}
                        >
                            <button className="px-5 py-2 rounded-3xl flex items-center text-lg gap-x-1 bg-blue-400 hover:text-white hover:bg-blue-700 shadow-xl">
                                <span>
                                    <MdOutlineAdd></MdOutlineAdd>
                                </span>
                                <span>Tạo</span>
                            </button>
                        </Dropdown>
                    </div>
                    <div></div>
                </div>
                <div>
                    <Modal visible={isPopupVisible} onCancel={handlePopupCancel} width="100%" footer={null}>
                        <PopupCreateExercise />
                    </Modal>
                </div>
                <div>
                    <Modal
                        visible={isPopupVisibleCreateTest}
                        onCancel={handlePopupCancelPopupCreateTest}
                        width="100%"
                        footer={null}
                    >
                        <PopupCreateTest />
                    </Modal>
                </div>
            </div>
            <div className="mt-6 ">
                <div className="grid gap-y-4">
                    {dataExersise.map((item) => (
                        <CardExercise item={item} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default ClassroomExercisesTeacher;
