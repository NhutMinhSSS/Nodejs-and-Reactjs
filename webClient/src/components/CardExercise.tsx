import dayjs from 'dayjs';
import React from 'react';
import { MdOutlineAssignment } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface CardExerciseProps {
    item: {
        icon: React.ReactElement;
        title: string;
        create_date: string;
    };
    onClick?: () => void;
}

const CardExercise: React.FC<CardExerciseProps> = ({ item, onClick }) => {
    const { icon, title, create_date } = item;
    const formatDate = dayjs(create_date).format('DD/MM/YYYY HH:mm');
    return (
        <>
            <div className="">
                <div
                    className="flex justify-between bg-slate-200 hover:shadow-lg px-10 py-5 box-decoration-slice rounded-lg max-w-3xl cursor-pointer"
                    onClick={onClick}
                >
                    <div className="flex gap-x-3 items-center">
                        <div className="bg-blue-400 text-white text-xl p-2 rounded-full">
                            <MdOutlineAssignment size={24} />
                        </div>
                        <div>{title}</div>
                    </div>
                    <div>{formatDate}</div>
                </div>
                <hr />
            </div>
        </>
    );
};

export default CardExercise;
