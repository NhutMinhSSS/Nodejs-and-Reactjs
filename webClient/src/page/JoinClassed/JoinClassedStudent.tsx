import React from 'react';
import { Dropdown, Space, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { MenuOutlined } from '@ant-design/icons';
import ClassBulletin from '../../screens/ClassBulletin';
import ClassroomExercisesStudent from '../../screens/ClassExercises/ClassroomExercisesStudent';
import '../../style/JoinClass.css';
import iconUser from '../../img/iconUser.svg';
import AllPeople from '../../screens/AllPeople';
import { useLocation, useNavigate } from 'react-router-dom';

const JoinClassedStudent = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    const items = [
        {
            label: <button onClick={handleLogout}>Logout</button>,
            key: 1,
        },
    ];
    return (
        <div className=" h-16 p-5  shadow-xl flex justify-between  max-w-full ">
            <div className="flex items-center">
                <span className="hover:bg-gray-200 rounded-full h-9 w-9 flex items-center justify-center transition duration-150 ease-in-out cursor-pointer">
                    <MenuOutlined></MenuOutlined>
                </span>
                <div className="block w-max max-w-full">CĐ TH 20A</div>
            </div>
            <span className=" h-screen grid iphone 12:grid-flow-col">
                <Tabs className=" items-center " defaultActiveKey="1">
                    <TabPane className="" tab="Bảng Tin" key="1">
                        {/* <ClassBulletin /> */}
                    </TabPane>
                    <TabPane className="" tab="Bài Tập Trên Lớp" key="2">
                        <ClassroomExercisesStudent />
                    </TabPane>
                    <TabPane className="" tab="Mọi Người" key="3">
                        <AllPeople />
                    </TabPane>
                </Tabs>
            </span>
            <span>
                <Dropdown
                    className="w-24"
                    menu={{
                        items,
                    }}
                    trigger={['click']}
                    overlayClassName="w-[10rem] z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-md text-center"
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
            </span>
        </div>
    );
};

export default JoinClassedStudent;
