import React from 'react';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { MenuOutlined } from '@ant-design/icons';
import ClassBulletin from '../../screens/ClassBulletin';
import ClassroomExercisesTeacher from '../../screens/ClassExercises/ClassroomExercisesTeacher';
import '../../style/JoinClass.css';
import iconUser from '../../img/iconUser.svg';
import AllPeople from '../../screens/AllPeople';

const JoinClassedTeacher = () => {
  return (
    <div className=' h-16 p-5  shadow-xl flex justify-between sm:grid-cols-2 max-w-full '>
      <div className='flex items-center'>
        <span className='hover:bg-gray-200 rounded-full h-9 w-9 flex items-center justify-center transition duration-150 ease-in-out cursor-pointer'>
          {' '}
          <MenuOutlined></MenuOutlined>
        </span>
        <div className='block w-max max-w-full'>CĐ TH 20A</div>
      </div>
      <span className=' h-screen grid iphone 12:grid-flow-col'>
        <Tabs className=' items-center ' defaultActiveKey='1'>
          <TabPane className='' tab='Bảng Tin' key='1'>
            <ClassBulletin />
          </TabPane>
          <TabPane className='' tab='Bài Tập Trên Lớp' key='2'>
            <ClassroomExercisesTeacher />
          </TabPane>
          <TabPane className='' tab='Mọi Người' key='3'>
            <AllPeople />
          </TabPane>
        </Tabs>
      </span>
      <span>
        <img className='w-9 h-9' src={iconUser} alt='' />
      </span>
    </div>

    // <>
    //     <Layout>
    //         <Header className='bg-blue-300'>Header</Header>
    //         <Content className="bg-blue-200">Content</Content>
    //         <Footer className="bg-blue-300">Footer</Footer>
    //     </Layout>
    // </>
  );
};

export default JoinClassedTeacher;
