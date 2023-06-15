import { Col, Row, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import '../../style/Tabs.scss';
import ScreenPageTest from './PageTest/ScreenPageTest';
import AllPeople from '../AllPeople';
import ClassBulletin from '../ClassBulletin';
import ClassroomExercisesTeacher from '../ClassExercises/ClassroomExercisesTeacher';
import FormCreateTest from '../../page/FormCreateTest/FormCreateTest';
const PopupCreateTest = () => {
    return (
        // <div className="bg-blue-100 w-screen h-screen">
        //     <div className="bg-neutral-50 shadow-inner w-screen ">
        //         <div>
        //             <Row>
        //                 <Col span={24} className=" flex ">
        //                     <Row>
        //                         <Col span={18}>
        //                             <div>Tạo bài kiểm tra</div>
        //                         </Col>
        //                         <Col span={6}>
        //                             <button className="w-16 h-12 bg-blue-500 rounded-xl">
        //                                 Gửi
        //                             </button>
        //                         </Col>
        //                     </Row>
        //                 </Col>
        //             </Row>
        //         </div>
        //         <div>
        //             <Row>
        //                 <Col span={24} className="flex justify-center">
        //                     <div className="">
        //                         <Tabs
        //                             className="text-black"
        //                             defaultActiveKey="1"
        //                         >
        //                             <TabPane
        //                                 className=""
        //                                 tab="Câu hỏi"
        //                                 key="1"
        //                             ></TabPane>
        //                             <TabPane
        //                                 className=""
        //                                 tab="Đáp án"
        //                                 key="2"
        //                             ></TabPane>
        //                             <TabPane
        //                                 className=""
        //                                 tab="Cài Đặt"
        //                                 key="3"
        //                             ></TabPane>
        //                         </Tabs>
        //                     </div>
        //                 </Col>
        //             </Row>
        //         </div>
        //     </div>
        // </div>
        <div className=" shadow-xl h-28 p-5 fixed w-full">
            <div className="  flex justify-between sm:grid-cols-2 max-w-full px-10 ">
                <div className="flex items-center">
                    <span className=" rounded-full  h-9 w-full flex items-center justify-center transition duration-150 ease-in-out cursor-pointer">
                        Tạo bài kiểm tra
                    </span>
                </div>

                <span>
                    <button className="w-16 h-12 bg-blue-500 rounded-xl">Gửi</button>
                </span>
            </div>
            <span className="  grid iphone 12:grid-flow-col">
                <Tabs className=" items-center " defaultActiveKey="1">
                    <TabPane className="" tab="Câu hỏi" key="1">
                        {/* <ScreenPageTest /> */}
                        <div className="mb-2">
                            <FormCreateTest />
                        </div>
                        
                    </TabPane>
                    <TabPane className="" tab="Đáp Án" key="2">
                        <ClassroomExercisesTeacher />
                    </TabPane>
                    <TabPane className="" tab="Cài đặt" key="3">
                        <AllPeople />
                    </TabPane>
                </Tabs>
            </span>
        </div>
    );
};

export default PopupCreateTest;
