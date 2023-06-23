import React, { useState } from 'react';
import imgBook from '../img/imgBook.png';
import { Col, Row } from 'antd';
import background from '../img/bg.png';
import AddCard from './AddCard';
import { Link } from 'react-router-dom';
import { MdContentCopy } from 'react-icons/md';

const ClassBulletin: React.FC<{ data: any }> = ({ data }) => {
    const [visible, setVisble] = useState(false);
    const handleCopyClick = () => {
        // Logic để sao chép nội dung
        const textToCopy = data.class_code;
        navigator.clipboard.writeText(textToCopy);
    };

    return (
        <div className="py-5">
            <div className="">
                <div className="w-full relative">
                    <div>
                        <img className="w-full h-auto rounded-lg" src={background} alt="Ảnh Background" />
                    </div>
                    <div className="absolute bottom-3 left-4">
                        <h1 className="text-2xl font-semibold text-white overflow-hidden truncate ... max-w-[25rem] w-full">
                            {data.class_name}
                        </h1>
                        <span className="text-base text-white font-medium overflow-hidden truncate ...">
                            {data.title}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-4 mt-8 gap-4">
                    <div className="col-span-1 ">
                        {data.class_code && (
                            <div className="bg-slate-200 rounded-md h-24 w-52 m-15  px-6 py-2 mb-4">
                                <div className="text-lg font-semibold">Mã lớp</div>
                                <div className="mt-3 text-2xl font-semibold hover:text-blue-300">
                                    <p style={{ position: 'relative' }}>
                                        {data.class_code}
                                        <button
                                            onClick={handleCopyClick}
                                            style={{
                                                position: 'absolute',
                                                right: '0',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <MdContentCopy size={16} />
                                        </button>
                                    </p>
                                </div>{' '}
                            </div>
                        )}
                        <div className="  bg-slate-200 rounded-lg h-auto w-52 m-15 p-3 mt-0">
                            <div className="font-bold text-lg ">Sắp đến hạn</div>
                            <div className="text-sm">
                                <p>Bài tập 1</p>
                                <p>Bài tập 2</p>
                                <p>Bài tập 3</p>
                                <p>Bài tập 4</p>
                                <p>Bài tập 5</p>
                                <p>Bài tập 6</p>
                            </div>
                            <Link className="flex justify-end" to="/AllExercises">
                                Xem bài tập
                            </Link>
                        </div>
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
