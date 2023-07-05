import React, { useEffect, useState } from 'react';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import { Button, Checkbox, Input, Layout, Radio } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

interface Question {
    examId: number;
    questionIndex: number;
    answerId: undefined;
    id: number;
    content: string;
    answers: Answer[];
    question_category_id: number;
    exam_id: number;
    student_exam: [];
}
interface Answer {
    id: number;
    content: string;
    isCorrect: boolean;
}
const { Header, Footer, Content } = Layout;
const BASE_URL = `${SystemConst.DOMAIN}`;
const JoinTest = () => {
    const [question, setQuestion] = useState<Question[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Question[]>([]);
    const [isValueText, setIsValueText] = useState('');
    useEffect(() => {
        handleFetchData();
    }, []);
    const handleFetchData = () => {
        const config = HeaderToken.getTokenConfig();
        axios.get(`${BASE_URL}/test`, config).then((response) => {
            const data_test = response.data.ans;
            console.log('student_exam', data_test);
            const data_answers = response.data;
            setQuestion(data_answers);
            console.log('data: ', data_answers);
        });
    };
    const onChange = (checkedValues: CheckboxValueType[]) => {
        console.log('checked = ', checkedValues);
    };
    const handleAnswerChange = (examId: number, questionIndex: number, answerId: any) => {
        setSelectedAnswers((prevSelectedAnswers) => {
            const updatedAnswers = [...prevSelectedAnswers];
            // Kiểm tra xem câu hỏi đã có trong danh sách selectedAnswers chưa
            const question = updatedAnswers.find((q) => q.examId === examId && q.questionIndex === questionIndex);

            if (question) {
                // Câu hỏi đã có trong danh sách, cập nhật đáp án
                question.answerId = answerId;
            } else {
                // Câu hỏi chưa có trong danh sách, thêm mới
                updatedAnswers.push({
                    examId,
                    questionIndex,
                    answerId,
                    id: 0,
                    content: '',
                    answers: [],
                    question_category_id: 0,
                    exam_id: 0,
                    student_exam: [],
                });
            }

            console.log(updatedAnswers);
            return updatedAnswers;
        });
    };
    return (
        <>
            <div>
                <div>
                    <div className="h-screen grid grid-cols-1 grid-rows-[auto,1fr,auto] ">
                        <Header className="bg-blue-400 text-xl grid items-center">Bài Kiểm Tra</Header>
                        <div className="p-5 grid justify-center ">
                            <div className="justify-center flex">
                                <div className="w-full max-w-xl ">
                                    {question.map((asw, index) => (
                                        <div key={asw.id} className="mb-4 bg-gray-300 rounded-md px-4 py-4 ">
                                            <div className="text-xl font-bold mb-2">{asw.content}</div>
                                            <div className="space-y-2">
                                                {asw.answers.map((answer) => (
                                                    <label className="flex items-center space-x-2">
                                                        {asw.question_category_id === 1 && (
                                                            <input
                                                                type="radio"
                                                                name={`asw${index}`}
                                                                value={answer.id}
                                                                onChange={() =>
                                                                    handleAnswerChange(asw.exam_id, index, answer.id)
                                                                }
                                                            />
                                                        )}
                                                        {asw.question_category_id === 2 && (
                                                            <Checkbox value={answer['id']} />
                                                        )}

                                                        <span className="text-lg font-medium">{answer.content}</span>
                                                    </label>
                                                ))}
                                                {asw.question_category_id === 3 && (
                                                    <Input.TextArea
                                                        maxLength={500}
                                                        placeholder="Nhập câu trả lời"
                                                        onChange={(e) =>
                                                            handleAnswerChange(asw.exam_id, index, e.target.value)
                                                        }
                                                    ></Input.TextArea>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className=" gap-x-3 flex flex-row justify-end">
                                <Button className="" type="primary">
                                    Gửi
                                </Button>
                                <Button type="primary" danger>
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JoinTest;
