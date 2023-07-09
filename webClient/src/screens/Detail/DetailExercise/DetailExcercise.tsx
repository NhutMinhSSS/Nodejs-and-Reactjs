import React, { useState } from 'react';
import { MdAccountCircle, MdBook, MdLink, MdMoreVert, MdOutlineGroup, MdPermIdentity, MdSend } from 'react-icons/md';
import TextFeild from '../../../components/TextFeild';
import { log } from 'console';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate, useParams } from 'react-router-dom';
interface Comment {
    id: number;
    content: string;
}
const DetailExcercise = () => {
    const [textValue, setTextValue] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [showForm, setShowForm] = useState(false);
    const handleTextField = (value: string) => {
        setTextValue(value);
    };
    const handleButtonClick = () => {
        if (textValue) {
            const newComment = {
                id: comments.length + 1,
                content: textValue,
            };

            setComments([...comments, newComment]);
            setTextValue('');
        }
    };
    const handleOpenForm = () => {
        setShowForm(true);
    };
    const handleCancelForm = () => {
        setShowForm(false);
    };
    const navigate = useNavigate();
    const { classroom_id, post_id } = useParams();
    const handleTest = () => {
        navigate(`/sinh-vien/class/${classroom_id}/${post_id}/detail-student/test`);
    };
    return (
        <>
            <div className="flex justify-center mt-20">
                <div className="mr-5">
                    <MdBook className="bg-blue-400 rounded-full p-1.5 w-10 h-10" size={32} />
                </div>
                <div className="w-[45rem] gap-y-3 flex flex-col">
                    <div className="flex justify-between items-center ">
                        <span className="text-3xl text-blue-300">Title</span>
                        <span>
                            <MdMoreVert
                                className="hover:bg-blue-200 rounded-full transition-all duration-300  cursor-pointer"
                                size={24}
                            />
                        </span>
                    </div>
                    <div className="flex gap-x-2 items-center">
                        <p>Lộc Trần</p>
                        <span>•</span>
                        <span className="opacity-50 text-sm">Hôm qua</span>
                    </div>
                    <hr className="my-2 border-blue-500" />
                    <div onClick={handleTest} className="border-2 flex gap-x-2 items-center p-4 rounded-md">
                        <button>
                            <MdLink size={30} />
                        </button>
                        <button>Đây là link làm bài</button>
                    </div>
                    <hr />
                    <div className="w-[40rem]">
                        <div className="flex items-center gap-x-2 mb-2">
                            <span className="text-gray-500">
                                <MdOutlineGroup size={20} />
                            </span>
                            <span>Nhận xét của lớp học</span>
                        </div>
                        <div className="flex items-center gap-x-2 w-[45rem]">
                            <span className="">
                                <MdAccountCircle size={40} />
                            </span>
                            <span className="border-2 rounded-2xl justify-between flex items-center h-10 w-full">
                                <TextFeild
                                    className="rounded-xl  px-4 w-[40rem]"
                                    value={textValue}
                                    onChange={handleTextField}
                                    placeholder="Thêm nhận xét trong lớp học"
                                />
                                <span
                                    className={`mr-2 text-blue-400 ${
                                        textValue ? 'cursor-pointer' : 'cursor-not-allowed '
                                    }`}
                                    onClick={handleButtonClick}
                                >
                                    <MdSend size={20} />
                                </span>
                            </span>
                        </div>
                    </div>
                </div>{' '}
                <div>
                    <div className="shadow-lg bg-zinc-100 rounded-md px-5 py-5 ml-10 grid gap-y-5 w-72">
                        <div className="flex justify-between">
                            <div>Bài tập của bạn</div>
                            <div className="text-red-500 font-medium">Thiếu</div>
                        </div>
                        <div className="flex flex-col gap-y-3">
                            <button className="border-[2px] border-slate-300 py-2 hover:border-blue-400 duration-200 rounded-md text-blue-400">
                                Import
                            </button>
                            <button className="bg-blue-400 py-2  hover:bg-blue-500 rounded-md duration-200 font-medium text-white">
                                Đánh dấu đã hoàn thành
                            </button>
                        </div>
                    </div>
                    <div className="shadow-lg bg-zinc-100 rounded-md px-5 py-5 ml-10 grid gap-y-5 w-72 mt-5">
                        <div className="flex items-center gap-x-5">
                            <span>
                                <MdPermIdentity size={24} />
                            </span>
                            <span>Nhận xét riêng tư</span>
                        </div>

                        {!showForm ? (
                            <div onClick={handleOpenForm} className="border-1 h-8 m-auto flex items-center">
                                <div className="font-medium hover:text-blue-400 cursor-pointer">Thêm nhận xét</div>
                            </div>
                        ) : (
                            <form className="border-1 border-blue-400 h-auto w-full m-15 rounded-xl max-w-3xl p-1">
                                <div className="flex items-center justify-around">
                                    <div className="w-full max-w-3xl overflow-auto px-2">
                                        <label htmlFor="Thông báo">Nhận xét</label>
                                        <TextArea style={{ resize: 'none', height: '100px', padding: '5px' }} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className=" mr-4">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-800 transition-all duration-200 text-white font-medium py-2 px-4 rounded-md"
                                        >
                                            Đăng
                                        </button>
                                        <button
                                            onClick={handleCancelForm}
                                            type="button"
                                            className="bg-gray-300 hover:bg-gray-400 transition-all duration-200 ml-2 px-4 py-2 rounded-md font-medium"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailExcercise;
