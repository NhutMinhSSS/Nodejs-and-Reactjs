import { Divider, Layout, Menu, Space, Tabs } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import HeaderToken from '../../common/utils/headerToken';
import SystemConst from '../../common/consts/system_const';
import logoTruong from '../../img/Logotruong.png';
import DetailTestStudent from './DetailTestStudent';
import DetailExcerciseTeacher from './DetailExercise/DetailExcerciseTeacher';
import DetailHome from './DetailHome';
const BASE_URL = `${SystemConst.DOMAIN}`;
const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
interface Student {
    id: number;
    submission: number;
    total_score: number;
    first_name: string;
    last_name: string;
}
interface Data {
    id: number;
    delivered: number;
    student_exams: Student[];
    submitted: number;
    title: string;
}

const DetailTest = () => {
    const [isData, setIsData] = useState<Data>();
    const location = useLocation();
    const [isDataStudent, setIsDataStudent] = useState<number>();
    const [isHome, setIsHome] = useState(true);
    useEffect(() => {
        handleFetchData();
        console.log('data nè: ', isData?.delivered);
    }, []);
    const { post_id } = useParams();

    const handleFetchData = () => {
        const config = HeaderToken.getTokenConfig();
        axios.get(`${BASE_URL}/posts/${post_id}/post-detail`, config).then((response) => {
            const data_detail = response.data.response_data;
            console.log('data: ', data_detail);
            setIsData(data_detail);
        });
    };
    const { classroom_id } = useParams();
    const navigate = useNavigate();
    const handleHome = () => {
        setIsHome(true);
    };
    // function encodeData(item: Student) {
    //     const encodedData = encodeURIComponent(JSON.stringify(item));
    //     return encodedData;
    // }
    const handleGetStudent = async (id: number) => {
        // const temp = isData?.student_exams.find(x=>x.id === id)
        // setIsDataStudent(temp);
        // console.log(isDataStudent);
        setIsDataStudent(id);
        setIsHome(false);
    };
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
                <Layout style={{ height: 'auto', width: '100vw' }}>
                    <Sider
                        style={{
                            height: '100%',
                            width: '100%',
                            background: '#F8F8FF',
                        }}
                        className="custom-sider"
                    >
                        <div className="flex flex-col">
                            <div>
                                <button onClick={handleHome} className="font-semibold text-base text-center m-5">
                                    Danh sách sinh viên
                                </button>
                                {isData?.student_exams.map((student) => (
                                    <button
                                        className="flex p-4 hover:bg-slate-300 rounded-sm w-full"
                                        onClick={() => handleGetStudent(student.id)}
                                    >
                                        {student.last_name} {student.first_name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button className=" p-4 hover:bg-slate-300 rounded-sm w-full" onClick={handleFetchData}>
                            Refresh
                        </button>
                    </Sider>
                    <Layout>
                        <Content style={{ height: '100%' }}>
                            {isHome ? (
                                <DetailHome pagrams={isData} />
                            ) : (
                                <DetailTestStudent pagrams={isData} id={isDataStudent} />
                            )}
                        </Content>
                    </Layout>
                </Layout>
            </Space>
        </>
    );
};

export default DetailTest;
