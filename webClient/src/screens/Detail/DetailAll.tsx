import { Tabs } from 'antd';
import React from 'react';
import DetailExcerciseTeacher from './DetailExercise/DetailExcerciseTeacher';
import DetailTest from './DetailTest';
import { MenuOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

const DetailAll = () => {
    return (
        <div className=" h-16 py-5  shadow-md flex flex-grow sm:grid-cols-2 max-w-full ">
            <div>
                <div className="w-screen">
                    <Tabs className=" items-center " defaultActiveKey="1">
                        <TabPane tab="Bài tập của học viên" key="1">
                            <DetailTest />
                        </TabPane>
                        <TabPane tab="Hướng Dẫn" key="2">
                            <DetailExcerciseTeacher />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default DetailAll;
