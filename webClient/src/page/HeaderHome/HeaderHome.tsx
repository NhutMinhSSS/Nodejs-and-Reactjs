import React, { useState } from 'react';
import logoTruong from '../../img/Logotruong.png';
import { MenuOutlined } from '@ant-design/icons';
import iconUser from '../../img/iconUser.svg';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import axios from 'axios';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
import HeaderToken from '../../common/utils/headerToken';

const HeaderHome: React.FC = () => {
    const navigate = useNavigate();
    const [isPopupVisibleCreateClass, setIsPopupVisibleCreateClass] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOnchangFlusCreateRoom = () => {
        const config = HeaderToken.getTokenConfig();
        setLoading(true);
        axios
            .get('http://20.39.197.125:3000/api/classrooms/init', config)
            .then((response) => {
                setClasses(response.data.response_data.regular_class);
                setSubjects(response.data.response_data.subjects);
            })
            .catch((error) => {
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    const content = 'Lỗi máy chủ';
                    const title = 'Lỗi';
                    ErrorCommon(title, content);
                }
                // Xử lý UnauthorizedError ở đây
            })

            .finally(() => {
                setLoading(false);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.reload(); // Tải lại trang web
        window.location.replace('/');
        //navigate('/');
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
    const items = [
        {
            label: <button onClick={handleLogout}>Đăng xuất</button>,
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
        </>
    );
};

export default HeaderHome;
