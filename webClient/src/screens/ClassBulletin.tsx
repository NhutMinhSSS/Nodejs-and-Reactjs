import React from 'react';
import imgBook from '../img/imgBook.png';
import { Col, Row } from 'antd';
import background from '../img/bg.png';
import AddCard from '../components/AddCard';
import { Link } from 'react-router-dom';
const ClassBulletin = () => {
    return (
        <div>
            <div className="">
                <div className="w-full relative">
                    <div>
                        <img
                            className="w-full h-auto rounded-lg"
                            src={background}
                            alt="Ảnh Background"
                        />
                    </div>
                    <div className="absolute bottom-1 left-4">
                        <h1 className="text-2xl font-semibold text-white">
                            CDTH20 - DATN
                        </h1>
                        <span className="text-base text-white font-medium">
                            2022 - 2023 HK2
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-4 mt-8 gap-4">
                    <div className="col-span-1  bg-slate-200 rounded-2xl h-44 m-15 p-3 grid">
                        <div className="font-bold text-lg ">Sắp đến hạn</div>
                        <Link
                            className="flex justify-end mt-24"
                            to="/AllExercises"
                        >
                            {' '}
                            Xem bài tập
                        </Link>
                    </div>
                    <div className=" col-span-3 ">
                        <AddCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassBulletin;
{
    /* <Row className='h-auto '>
                        <Col span={12}>
                            <span className='p-1'>
                                hello
                            </span>
                        </Col>
                        <Col span={12} >
                            <img className='h-[16rem] float-right' src={imgBook} alt="" />
                        </Col>
                    </Row> */
}
