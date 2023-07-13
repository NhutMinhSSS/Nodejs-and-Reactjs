import React, { useState } from 'react';
import logoTruong from '../../img/Logotruong.png';
import { MenuOutlined } from '@ant-design/icons';
import iconUser from '../../img/iconUser.svg';
import { Drawer, Dropdown, Space } from 'antd';
import './style.scss';
import HeaderToken from '../../common/utils/headerToken';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
import { MdAccountCircle, MdNotificationsNone } from 'react-icons/md';

const HeaderHomeStudent: React.FC = () => {
    const [visbleDrawer, setVisibleDrawer] = useState(false);
    const [visbleNotification, setVisibleNotification] = useState(false);
    const [isData, setIsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleDrawer = () => {
        setVisibleDrawer(true);
        handleFetchData();
    };
    const handleNavHome = () => {
        navigate('/sinh-vien');
    };
    const handleFetchData = () => {
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
                    setIsData(data);
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
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.reload(); // Tải lại trang web
        window.location.replace('/');
    };
    //State Class Code
    const items = [
        {
            label: <button onClick={handleLogout}>Đăng xuất</button>,
            key: 1,
        },
    ];
    return (
        <>
            <div className="bg-blue-400 shadow-md h-16 p-5 flex items-center justify-between">
                <div className="flex items-center">
                    <button className="hover:bg-gray-200 rounded-full h-9 w-9 flex items-center justify-center transition duration-150 ease-in-out ">
                        <MenuOutlined className="flex items-center" onClick={handleDrawer} size={40} />{' '}
                    </button>
                    <div>
                        <img className="h-12 cursor-pointer" src={logoTruong} alt="" />
                    </div>
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
            <Drawer
                visible={visbleDrawer}
                maskClosable={true}
                onClose={() => setVisibleDrawer(false)}
                title={
                    <Space>
                        <button onClick={handleNavHome}>Danh sách lớp học phầm</button>
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
                            {isData.map((item: any) => (
                                <Link
                                    to={`class/${item['id']}`}
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
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default HeaderHomeStudent;
