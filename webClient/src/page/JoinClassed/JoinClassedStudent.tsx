import React, { useEffect, useState } from 'react';
import { Drawer, Dropdown, Space, Spin, Tabs, Tooltip } from 'antd';
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
import ErrorCommon from '../../common/Screens/ErrorCommon';
import HeaderToken from '../../common/utils/headerToken';
import { MdNotificationsNone, MdAccountCircle } from 'react-icons/md';

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
            handleFetchData();
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };
    const handleFetchData = () => {
        const config = headerToken.getTokenConfig();
        setIsLoading(true);
        axios
            .get(`${SystemConst.DOMAIN}/classrooms/get-posts/${classroom_id}`, config)
            .then((response) => {
                const data = response.data.response_data;
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
    };
    const items = [
        {
            label: <button onClick={handleLogout}>Logout</button>,
            key: 1,
        },
    ];
    const [visbleDrawer, setVisibleDrawer] = useState(false);
    const [visbleNotification, setVisibleNotification] = useState(false);
    const [isDataDrawer, setIsDataDawer] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleFetchDataDrawer = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            const config = HeaderToken.getTokenConfig();
            setLoading(true);
            axios
                .get('https://20.39.197.125:3443/api/classrooms', config)
                .then((response) => {
                    // Xử lý dữ liệu từ response
                    const data = response.data.response_data;
                    console.log('data nè', data);
                    setIsDataDawer(data);
                    //Chuyển dữ liệu khi tạo mới phòng
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
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };
    const handleDrawer = () => {
        setVisibleDrawer(true);
        handleFetchDataDrawer();
    };
    const handleNavHome = () => {
        navigate('/giang-vien');
    };
    const handlePassPage = (item: any) => {
        navigate(`/giang-vien/class/${item['id']}`);
        handleFetchData();
    };
    return (
        <>
            {!isData ? (
                <Spin size="small" spinning={isLoading} />
            ) : (
                <div className="h-16 p-5  shadow-md flex flex-grow sm:grid-cols-2 max-w-full ">
                    <div className=" basis-1/6 flex items-center full">
                        <button className="hover:bg-gray-200 rounded-full h-9 w-9 flex items-center justify-center transition duration-150 ease-in-out ">
                            <MenuOutlined className="flex items-center" onClick={handleDrawer} size={40} />{' '}
                        </button>
                        <div className="h-auto w-auto ml-2">
                            <div className="block max-w-full overflow-hidden truncate ... w-44">
                                <Tooltip title={isData['class_name']}>
                                    <span className="truncate">{isData['class_name']}</span>
                                </Tooltip>
                            </div>
                            <span className="text-sm">{isData['title']}</span>
                        </div>
                    </div>
                    <div className="grid iphone 12:grid-flow-col basis-2/3 justify-center">
                        <Tabs className=" items-center " defaultActiveKey="1">
                            <TabPane className="" tab="Bảng Tin" key="1">
                                <ClassBulletinStudent onFetchData={handleFetchData} data={isData} />
                            </TabPane>
                            <TabPane className="" tab="Bài Tập Trên Lớp" key="2">
                                <ClassroomExercisesStudent data={isData} />
                            </TabPane>
                            <TabPane className="" tab="Mọi Người" key="3">
                                <AllPeople />
                            </TabPane>
                        </Tabs>
                    </div>
                    <div className="basis-1/6 flex justify-end">
                        <div>
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
                        </div>
                    </div>
                </div>
            )}
            {isDataDrawer ? (
                <Spin size="default" spinning={loading}>
                    <Drawer
                        visible={visbleDrawer}
                        maskClosable={true}
                        onClose={() => setVisibleDrawer(false)}
                        title={
                            <Space>
                                <button onClick={handleNavHome}>Danh sách lớp học phần</button>
                            </Space>
                        }
                        closable={true}
                        placement="left"
                        extra={
                            <Space>
                                <button className="hover:bg-slate-200 duration-200 transition-all p-2 rounded-full">
                                    <MdNotificationsNone size={20} />
                                </button>
                            </Space>
                        }
                        footer={
                            <Space>
                                <button>Lưu lớp học phần</button>
                            </Space>
                        }
                    >
                        <div>
                            <div>Giảng dạy</div>
                            <div className="mt-2">
                                <div className="flex flex-col gap-y-5 h-auto overflow-auto ">
                                    {isDataDrawer.map((item: any) => (
                                        <button
                                            onClick={() => handlePassPage(item)}
                                            className="hover:text-black hover:bg-slate-200 transition duration-500   w-full h-auto py-2 px-2 border-2 rounded-md flex items-center gap-x-2"
                                        >
                                            <span>
                                                <MdAccountCircle size={30} />
                                            </span>
                                            <span className="flex flex-col">
                                                <span className="font-medium">{item.class_name}</span>
                                                <span>
                                                    Học kỳ {item.semester} - {item.school_year}
                                                </span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Drawer>
                </Spin>
            ) : (
                ''
            )}
        </>
    );
};

export default JoinClassedStudent;
