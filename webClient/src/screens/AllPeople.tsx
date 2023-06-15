import React from 'react';
import { MdAccountCircle } from 'react-icons/md';
import PeopleList from '../components/PeopleList';
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
];
const AllPeople = () => {
    return (
        <div className="w-[40rem]">
            <div className="p-5">
                <table className="text-3xl">Giáo Viên</table>
                <div>
                    <PeopleList people={dataPeople} role="teacher" />
                </div>
            </div>
            <div className="p-5 ">
                <div className="text-3xl">Học Sinh</div>
                <PeopleList people={dataPeople} role="student" />
            </div>
        </div>
    );
};

export default AllPeople;
