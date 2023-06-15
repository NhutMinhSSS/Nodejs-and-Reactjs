import React, { useState } from 'react';
import { MdAccountCircle, MdBook, MdMoreVert, MdOutlineGroup, MdSend } from 'react-icons/md';
import TextFeild from '../../components/TextFeild';
import { log } from 'console';
interface Comment {
    id: number;
    content: string;
}
const DetailExcercise = () => {
    const [textValue, setTextValue] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
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
                    <div>Đây là content</div>
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
                                <MdAccountCircle size={32} />
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
                </div>
            </div>
        </>
    );
};

export default DetailExcercise;
