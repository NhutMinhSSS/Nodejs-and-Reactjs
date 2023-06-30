import React from 'react';
import { MdAccountCircle, MdOutlinePersonAdd } from 'react-icons/md';
import PeopleList from '../../../../components/PeopleList';
const dataPeople = [
    {
        id: 1,
        icon: <MdAccountCircle size={40} />,
        name: 'Giáo Viên 1',
        role: 'teacher',
    },
    {
        id: 2,
        icon: <MdAccountCircle size={40} />,
        name: 'Giáo Viên 2',
        role: 'teacher',
    },
    {
        id: 3,
        icon: <MdAccountCircle size={40} />,
        name: 'Nguyễn Văn A',
        role: 'student',
    },
    {
        id: 4,
        icon: <MdAccountCircle size={40} />,
        name: 'Nguyễn Văn B',
        role: 'student',
    },

    {
        id: 5,
        icon: <MdAccountCircle size={40} />,
        name: 'Nguyễn Văn C',
        role: 'student',
    },
    {
        id: 6,
        icon: <MdAccountCircle size={40} />,
        name: 'Nguyễn Văn D',
        role: 'student',
    },
    {
        id: 6,
        icon: <MdAccountCircle size={40} />,
        name: 'Nguyễn Văn D',
        role: 'student',
    },
    {
        id: 6,
        icon: <MdAccountCircle size={40} />,
        name: 'Nguyễn Văn D',
        role: 'student',
    },
    {
        id: 6,
        icon: <MdAccountCircle size={40} />,
        name: 'Nguyễn Văn D',
        role: 'student',
    },
];
const Detail = () => {
    return (
        <div className="w-full h-[85vh] bg-slate-300 overflow-auto px-20 ">
            <div className="p-5">
                <div>
                    <div className="flex justify-between px-4 items-center">
                        <table className="text-3xl">Giáo Viên</table>
                        <button className="hover:text-blue-500 duration-150 transition-all">
                            <MdOutlinePersonAdd size={24} />
                        </button>
                    </div>
                </div>
                <div>
                    <PeopleList people={dataPeople} role="teacher" />
                </div>
            </div>
            <div className="p-5 ">
                <div className="flex justify-between px-4 items-center">
                    <div className="text-3xl">Sinh Viên</div>
                    <button className="hover:text-blue-500 duration-150 transition-all">
                        <MdOutlinePersonAdd size={24} />
                    </button>
                </div>
                <PeopleList people={dataPeople} role="student" />
            </div>
        </div>
    );
};

export default Detail;
