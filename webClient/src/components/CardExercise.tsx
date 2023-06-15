import React from 'react';
import { Link } from 'react-router-dom';

interface CardExerciseProps {
    item: {
        icon: React.ReactElement;
        title: string;
        datetime: string;
    };
}

const CardExercise: React.FC<CardExerciseProps> = ({ item }) => {
    const { icon, title, datetime } = item;
    return (
        <>
            <div className="">
                <div className="flex justify-between bg-slate-200 hover:shadow-lg px-10 py-5 box-decoration-slice rounded-lg max-w-3xl cursor-pointer">
                    <div className="flex gap-x-3 items-center">
                        <div className="bg-blue-400 text-white text-xl p-2 rounded-full">
                            {icon}
                        </div>
                        <div>{title}</div>
                    </div>
                    <div>{datetime}</div>
                </div>
                <hr />
            </div>
        </>
    );
};

export default CardExercise;
