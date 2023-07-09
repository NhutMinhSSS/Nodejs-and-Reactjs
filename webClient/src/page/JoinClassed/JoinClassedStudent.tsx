import React, { useEffect, useState } from 'react';
import { Dropdown, Space, Spin, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { MenuOutlined } from '@ant-design/icons';
import ClassBulletin from '../../screens/Classbulletin/ClassBulletin';
import ClassroomExercisesStudent from '../../screens/ClassExercises/ClassroomExercisesStudent';
import '../../style/JoinClass.css';
import iconUser from '../../img/iconUser.svg';
import AllPeople from '../../screens/AllPeople';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ErrorAlert from '../../common/Screens/ErrorAlert';
import SystemConst from '../../common/consts/system_const';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import headerToken from '../../common/utils/headerToken';
import ClassBulletinStudent from '../../screens/Classbulletin/ClassBulletinStudent';

const JoinClassedStudent = () => {
    const navigate = useNavigate();
    const { classroom_id } = useParams();
    const [isData, setIsData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            const config = headerToken.getTokenConfig();

            setIsLoading(true);
            axios
                .get(`${SystemConst.DOMAIN}/classrooms/get-posts/${classroom_id}`, config)
                .then((response) => {
                    const data = response.data.response_data;
                    console.log(data);
                    setIsData(data);
                })
                .catch((error) => {
                    if (error) {
                        const isError = UnauthorizedError.checkError(error);

                        if (!isError) {
                            let content = '';
                            const {
                                status,
                                data: { error_message: errorMessage },
                            } = error.response;
                            if (status === 404 && errorMessage === 'Classroom no exist') {
                                content = 'Lớp không tồn tại';
                            } else if (status === 403 && errorMessage === 'No permission') {
                                content = 'Bạn không có quyền truy cập vào lớp này';
                            } else {
                                content = 'Lỗi máy chủ';
                            }
                            const title = 'Lỗi';
                            const path = '/sinh-vien';

                            ErrorAlert(title, content, path);
                        }
                    } else {
                        const title = 'Lỗi';
                        const content = 'Máy chủ không hoạt động';
                        localStorage.clear();
                        const path = '/';
                        ErrorAlert(title, content, path);
                    }
                    // Xử lý lỗi nếu có
                    console.error(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, []);
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
        <>
            {!isData ? (
                <Spin size="small" spinning={isLoading} />
            ) : (
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
                                <ClassBulletinStudent data={isData} />
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
            )}
        </>
    );
};

export default JoinClassedStudent;
