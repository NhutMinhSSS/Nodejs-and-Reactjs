import { Layout, Menu } from 'antd';
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logoTruong from '../../img/Logotruong.png';

import { MdAccountCircle } from 'react-icons/md';
const { Sider, Content, Header } = Layout;
const Dashboard: React.FC = () => {
    const location = useLocation();
    return (
        <>
            <Layout className="min-h-screen">
                <Header className="bg-blue-400 py-2 ">
                    <div className="flex justify-between items-center">
                        <div className="min-w-full">
                            <img src={logoTruong} className="w-48" alt="Error" />
                        </div>
                        <div>
                            <MdAccountCircle size={32} />
                        </div>
                    </div>
                </Header>
                <Layout>
                    <Sider width={200} theme="dark" className="bg-blue-400">
                        <Menu mode="inline" selectedKeys={[location.pathname]} className="h-full bg-slate-200">
                            <Menu.Item key="admin/app-faculty">
                                <Link to="/admin/app-faculty">Khoa</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-teacher">
                                <Link to="/admin/app-teacher">Giảng Viên</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-genre">
                                <Link to="/admin/app-genre">Bộ môn</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-subject">
                                <Link to="/admin/app-subject">Môn học</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-class-section">
                                <Link to="/admin/app-class-section">Lớp Học Phần</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-student">
                                <Link to="/admin/app-student">Sinh viên</Link>
                            </Menu.Item>
                            <Menu.Item key="/app-class">
                                <Link to="/admin/app-class">Lớp</Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content className="p-4">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default Dashboard;
