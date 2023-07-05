import React, { useEffect, useState } from 'react';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import { Button, Checkbox, Input, Layout, Radio } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import './style.scss';
const { TextArea } = Input;

interface Question {
    examId: number;
    questionIndex: number;
    answerId: undefined;
    id: number;
    content: string;
    answers: Answer[];
    question_category_id: number;
    exam_id: number;
    student_exam: StudentExam[];
}
interface StudentExam {
    id: Number;
    answer_id: [];
}
interface Answer {
    id: number;
    content: string;
    isCorrect: boolean;
}
const { Header, Footer, Content } = Layout;
const BASE_URL = `${SystemConst.DOMAIN}`;
const JoinMark = () => {
    const [question, setQuestion] = useState<Question[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Question[]>([]);
    const [isValueText, setIsValueText] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(false);
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

    const handleAnswerChange = (examId: number, questionIndex: number, answerId: any) => {};
    return (
        <>
            <div>
                <div>
                    <div className="h-screen grid grid-cols-1 grid-rows-[auto,1fr,auto] ">
                        <Header className="bg-blue-400 text-xl grid items-center">Xem Lại Kiểm Tra</Header>
                        <div className="p-5 grid justify-center ">
                            <div className="justify-center flex">
                                <div className="w-[50rem]">
                                    {question.map((asw, index) => (
                                        <div key={asw.id} className="mb-4 bg-gray-300 rounded-md px-4 py-4 ">
                                            <div className="text-xl font-bold mb-2">{asw.content}</div>
                                            <div className="space-y-2">
                                                {asw.answers.map((answer) => (
                                                    <label
                                                        className={`flex items-center space-x-2 ${
                                                            asw.question_category_id === 1
                                                                ? 'radio-answer'
                                                                : 'checkbox-answer'
                                                        } ${answer.isCorrect && 'bg-green-300 rounded-md'}`}
                                                        key={answer.id}
                                                    >
                                                        {asw.question_category_id === 1 && (
                                                            <input
                                                                disabled
                                                                defaultChecked={asw.student_exam
                                                                    .map((e) => parseInt(e.answer_id.toString()))
                                                                    .includes(answer.id)}
                                                                type="radio"
                                                                name={`asw${index}`}
                                                                onChange={() =>
                                                                    handleAnswerChange(asw.exam_id, index, answer.id)
                                                                }
                                                            />
                                                        )}
                                                        {asw.question_category_id === 2 && (
                                                            <input
                                                                type="checkbox"
                                                                className="focus:border-blue-300"
                                                                defaultChecked={asw.student_exam
                                                                    .map((e) => parseInt(e.answer_id.toString()))
                                                                    .includes(answer.id)}
                                                                value={answer.id}
                                                            />
                                                        )}

                                                        <span className="text-lg font-medium">{answer.content}</span>
                                                    </label>
                                                ))}

                                                {asw.question_category_id === 3 && (
                                                    <TextArea
                                                        className="text-lg"
                                                        style={{ height: '20rem', overflow: 'hidden', resize: 'none' }}
                                                        maxLength={500}
                                                        showCount
                                                        value={asw.student_exam.map((e) => e.answer_id.toString())}
                                                        disabled
                                                        placeholder="Nhập câu trả lời"
                                                        onChange={(e) =>
                                                            handleAnswerChange(asw.exam_id, index, e.target.value)
                                                        }
                                                    ></TextArea>
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

export default JoinMark;
