import React, { useState } from 'react';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import { MdAccountCircle, MdOutlineAdd } from 'react-icons/md';
import PopupCreateExercise from '../Popup/PopupCreateExercise';
import PopupCreateTest from '../Popup/PopupCreateTest';

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
            <div className="flex items-center justify-center gap-x-[25rem]">
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
                        <Button className="px-3 py-6 rounded-3xl flex items-center text-lg gap-x-1 shadow-2xl">
                            <span>
                                <MdOutlineAdd></MdOutlineAdd>
                            </span>
                            <span>Tạo</span>
                        </Button>
                    </Dropdown>
                </div>
                <div className="w-full">
                    <Link className="text-lg" to="/googleDirve">
                        Thư Mục Google Drive
                    </Link>
                </div>
            </div>
            <hr className="w-full mt-3" />

            <div>
                <Modal
                    visible={isPopupVisible}
                    onCancel={handlePopupCancel}
                    width="100%"
                    footer={null}
                >
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
        </>
    );
};

export default ClassroomExercisesTeacher;
