import { Divider, Layout, Menu } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import HeaderToken from '../../common/utils/headerToken';
import SystemConst from '../../common/consts/system_const';
import logoTruong from '../../img/Logotruong.png';
const BASE_URL = `${SystemConst.DOMAIN}`;
const { Header, Sider, Content } = Layout;

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
const DetailAll = () => {
    const [isData, setIsData] = useState<Data>();
    const location = useLocation();
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
        navigate(`/giang-vien/class/${classroom_id}/${post_id}/detail-all`);
    };
    return (
        <div>
            {' '}
            <Layout style={{ height: '100vh' }}>
                <Header className="bg-blue-400 flex items-center">
                    <div className=" w-48">
                        <img src={logoTruong} alt="" />
                    </div>
                </Header>
                <Layout style={{ height: 'calc(100% - 64px)' }}>
                    <Sider style={{ height: '100%', background: '#F8F8FF' }}>
                        <button onClick={handleHome} className=" font-semibold text-base text -center m-5">
                            Danh sách sinh viên
                        </button>
                        <Menu mode="vertical" selectedKeys={[location.pathname]} style={{ background: '#F8F8FF' }}>
                            {isData?.student_exams.map((item) => (
                                <Menu.Item key={`giang-vien/class/${classroom_id}/${post_id}/detail-test/${item.id}`}>
                                    <Link
                                        to={`/giang-vien/class/${classroom_id}/${post_id}/detail-test/${item.id}/`}
                                    >
                                        {item.last_name} {item.first_name}
                                    </Link>
                                </Menu.Item>
                            ))}
                        </Menu>
                    </Sider>
                    <Content style={{ height: '100%' }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default DetailAll;
