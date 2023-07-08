import React, { useEffect, useState } from 'react';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import { Button, Checkbox, Input, Layout, Radio } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useParams } from 'react-router-dom';

interface Question {
    examId: number;
    questionIndex: number;
    answerIds: number[];
    id: number;
    content: string;
    answers: Answer[];
    question_category_id: number;
    exam_id: number;
}

interface Answer {
    id: number;
    content: string;
    isCorrect: boolean;
}

const { Header } = Layout;
const BASE_URL = `${SystemConst.DOMAIN}`;

const JoinTest = () => {
    const [question, setQuestion] = useState<Question[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Question[]>([]);

    useEffect(() => {
        handleFetchData();
    }, []);
    const { post_id } = useParams();
    const handleFetchData = () => {
        const config = HeaderToken.getTokenConfig();
        axios.get(`${BASE_URL}/posts/${post_id}/post-detail`, config).then((response) => {
            console.log('data: ', response);
        });
    };

    const handleAnswerChange = (examId: number, questionIndex: number, answerId: any) => {
        setSelectedAnswers((prevSelectedAnswers) => {
            const updatedAnswers = [...prevSelectedAnswers];
            const question = updatedAnswers.find((q) => q.examId === examId && q.questionIndex === questionIndex);

            if (question) {
                // Cập nhật đáp án cho câu hỏi đã tồn tại trong danh sách selectedAnswers
                question.answerIds = [answerId];
            } else {
                // Thêm mới câu hỏi vào danh sách selectedAnswers
                const newQuestion: Question = {
                    examId,
                    questionIndex,
                    answerIds: [answerId],
                    id: 0,
                    content: '',
                    answers: [],
                    question_category_id: 0,
                    exam_id: 0,
                };
                updatedAnswers.push(newQuestion);
            }
            console.log(updatedAnswers);
            return updatedAnswers;
        });
    };

    const handleAnswerCheckBox = (examId: number, questionIndex: number, answerId: any, checked: boolean) => {
        setSelectedAnswers((prevSelectedAnswers) => {
            const updatedAnswers = [...prevSelectedAnswers];
            const question = updatedAnswers.find((q) => q.examId === examId && q.questionIndex === questionIndex);

            if (question) {
                // Cập nhật danh sách đáp án cho câu hỏi đã tồn tại trong danh sách selectedAnswers
                if (checked) {
                    question.answerIds.push(answerId);
                } else {
                    question.answerIds = question.answerIds.filter((id) => id !== answerId);
                }
            } else {
                // Thêm mới câu hỏi vào danh sách selectedAnswers
                const newQuestion: Question = {
                    examId,
                    questionIndex,
                    answerIds: [answerId],
                    id: 0,
                    content: '',
                    answers: [],
                    question_category_id: 0,
                    exam_id: 0,
                };
                updatedAnswers.push(newQuestion);
            }

            console.log(updatedAnswers);
            return updatedAnswers;
        });
    };

    const handleSubmit = () => {
        // Gửi dữ liệu đã được lưu trong selectedAnswers về server
        // Sử dụng axios hoặc phương thức gửi dữ liệu tương tự
        // // axios.post(`${BASE_URL}/submit`, { answers: selectedAnswers }).then((response) => {
        // //     // Xử lý phản hồi từ server (nếu cần)
        // // });
        handleFetchData();
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
                                                    <label className="flex items-center space-x-2" key={answer.id}>
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
                                                            <Checkbox
                                                                value={answer.id}
                                                                onChange={(e) =>
                                                                    handleAnswerCheckBox(
                                                                        asw.exam_id,
                                                                        index,
                                                                        answer.id,
                                                                        e.target.checked,
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                        <span className="text-lg font-medium">{answer.content}</span>
                                                    </label>
                                                ))}
                                                {asw.question_category_id === 3 && (
                                                    <Input.TextArea
                                                        style={{ resize: 'none', height: 120 }}
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
                                <Button onClick={handleSubmit} className="" type="primary">
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
