import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import HeaderToken from '../../common/utils/headerToken';
import SystemConst from '../../common/consts/system_const';
interface Student {
    id: number;
    submission: number;
    total_score: number;
    first_name: string;
    last_name: string;
}

const DetailTestStudent = ({ params, id }: { params: any; id: number | undefined }) => {
    const [isStudent, setIsStudent] = useState<Student>();
    useEffect(() => {
        const temp = params?.student_exams.find((x: any) => x.id === id);
        setIsStudent(temp);
    }, [id]);
    return (
        <div className=" flex justify-between">
            <div className="text-lg font-medium">{isStudent?.first_name} </div>
            <div className="text-xl font-medium">
                {isStudent?.submission === 1
                    ? 'Chưa chấm tự luận'
                    : isStudent?.submission === 2
                    ? 'Đã nộp hoàn thành'
                    : 'Chưa nộp'}
            </div>
        </div>
    );
};

export default DetailTestStudent;
