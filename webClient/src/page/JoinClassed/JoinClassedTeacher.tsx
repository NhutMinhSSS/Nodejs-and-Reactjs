import React, { useEffect, useState } from 'react';
import { Spin, Tabs, Tooltip } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import ClassroomExercisesTeacher from '../../screens/ClassExercises/ClassroomExercisesTeacher';
import '../../style/JoinClass.css';
import iconUser from '../../img/iconUser.svg';
import AllPeople from '../../screens/AllPeople';
import PointClass from '../../screens/PointClass';
import { useLocation, useParams } from 'react-router-dom';
import ErrorAlert from '../../common/Screens/ErrorAlert';
import axios from 'axios';
import ClassBulletin from '../../screens/ClassBulletin';
import SystemConst from '../../common/consts/system_const';
import headerToken from '../../common/utils/headerToken';
import { error } from 'console';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
const { TabPane } = Tabs;
const ReturnRoute = () => {
    const title = 'Lỗi';
    const content = 'Lỗi chuyển trang';
    const path = '/giang-vien';
    ErrorAlert(title, content, path);
    return null;
};
const JoinClassedTeacher: React.FC = () => {
    const location = useLocation();
    const { classroom_id } = useParams();
    const [isData, setIsData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    let data = location.state === null ? null : location.state.data;
    const handleTabChange = (key: string) => {
        console.log('Select Change Tabs: ', key);
    };

    useEffect(() => {
        const config = headerToken.getTokenConfig();
        if (!data) {
            setIsLoading(true);
            axios
                .get(`${SystemConst.DOMAIN}/classrooms/${classroom_id}`, config)
                .then((response) => {
                    const data = response.data.response_data;
                    console.log(data);
                    setIsData(data);
                })
                .catch((error) => {
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
                        const path = '/giang-vien';

                        ErrorAlert(title, content, path);
                    }

                    // Xử lý lỗi nếu có
                    console.error(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsData(data);
        }
    }, []);

    return (
        <>
            {!isData ? (
                <Spin size="small" spinning={isLoading} />
            ) : (
                <div className=" h-16 p-5  shadow-md flex flex-grow sm:grid-cols-2 max-w-full ">
                    <div className=" basis-1/6 flex items-center full">
                        <span className="hover:bg-gray-200 rounded-full h-9 w-9 flex items-center justify-center transition duration-150 ease-in-out cursor-pointer">
                            <MenuOutlined></MenuOutlined>
                        </span>

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
                        <Tabs className=" items-center " defaultActiveKey="1" onChange={handleTabChange}>
                            <TabPane tab="Bảng Tin" key="1">
                                <ClassBulletin data={isData} />
                            </TabPane>
                            <TabPane tab="Bài tập trên lớp" key="2">
                                <ClassroomExercisesTeacher />
                            </TabPane>
                            <TabPane tab="Mọi người" key="3">
                                <AllPeople />
                            </TabPane>
                            <TabPane tab="Điểm" key="4">
                                <PointClass />
                            </TabPane>
                        </Tabs>
                    </div>
                    <div className="basis-1/6 flex justify-end">
                        <img className="w-9 h-9" src={iconUser} alt="" />
                    </div>
                </div>
            )}
        </>
    );
    return null;
};

//  (<>{/* <ReturnRoute /> */}</>);

export default JoinClassedTeacher;
