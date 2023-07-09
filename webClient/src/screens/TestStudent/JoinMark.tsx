import React, { useEffect, useState } from 'react';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import { Button, Checkbox, Input, Layout, Radio } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import './style.scss';
import { useParams } from 'react-router-dom';
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
    student_answer_options: StudentExam[];
}
interface StudentExam {
    id: number;
    answer_id: number;
    essay_answer: string;
    student_exam_id: number;
}
interface Answer {
    id: number;
    answer: string;
    correct_answer: boolean;
}
interface Data {
    list_questions_answers: Question[];
    student_exam_id: number;
    submisson: number;
}
const { Header, Footer, Content } = Layout;
const BASE_URL = `${SystemConst.DOMAIN}`;
const JoinMark = () => {
    const [question, setQuestion] = useState<Question[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Question[]>([]);
    const [isData, setIsData] = useState<Data>();
    const [isValueText, setIsValueText] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [studentExamId, setStudentExamId] = useState(0);
    const [submission, setSubmission] = useState(0);
    useEffect(() => {
        handleFetchData();
    }, []);
    const { post_id } = useParams();
    const handleFetchData = () => {
        const config = HeaderToken.getTokenConfig();
        axios.get(`${BASE_URL}/questions-and-answers/${post_id}/get-questions-and-answers`, config).then((response) => {
            const dataFetch = response.data.response_data;
            setQuestion(dataFetch.list_questions_answers);
            //sửa lại json
            setIsData(dataFetch);
            // setStudentExamId(dataFetch.student_exam_id);
            // setSubmission(dataFetch.submission);
        });
        console.log(post_id);
    };

    const onChange = (checkedValues: CheckboxValueType[]) => {
        console.log('checked = ', checkedValues);
    };

    //const handleAnswerChange = (examId: number, questionIndex: number, answerId: any) => {};
    let questionRadio: Number[];
    const handleAnswerChange = (questionId: number, answerIds: any) => {
        questionRadio = [];
        if (questionRadio) {
            // Cập nhật danh sách đáp án cho câu hỏi đã tồn tại trong danh sách selectedAnswers
            questionRadio = [answerIds];
        } else {
            const newQuestion = [answerIds];
            questionRadio = newQuestion;
        }
        return {
            answer_ids: questionRadio,
            question_id: questionId,
        };
    };
    const selectAnswers: Record<number, number[]> = {};
    const checkStudentExam: Record<number, boolean> = {};
    const handleAnswerCheckBox = (questionId: number, answerIds: any, checked: boolean) => {
        if (!checkStudentExam[questionId]) {
            checkStudentExam[questionId] = true;
            const questionItem = question.find(
                (item) => item.id === questionId && item.student_answer_options.length > 0,
            );
            if (questionItem) {
                selectAnswers[questionId] = questionItem.student_answer_options
                    .filter((student_exam) => student_exam.student_exam_id === studentExamId)
                    .map((student_exam) => student_exam.answer_id);
            }
        }
        if (!selectAnswers[questionId]) {
            // Nếu chưa có mục cho câu hỏi này, tạo một mục mới và thêm câu trả lời đã chọn
            selectAnswers[questionId] = [answerIds];
            return {
                question_id: questionId,
                answer_ids: selectAnswers[questionId],
            };
        } else {
            if (checked) {
                // Nếu được chọn, thêm câu trả lời vào danh sách
                selectAnswers[questionId].push(answerIds);

                return {
                    question_id: questionId,
                    answer_ids: selectAnswers[questionId],
                };
            } else {
                // Nếu không được chọn, loại bỏ câu trả lời khỏi danh sách
                selectAnswers[questionId] = selectAnswers[questionId].filter((id) => id !== answerIds);
                return {
                    question_id: questionId,
                    answer_ids: selectAnswers[questionId],
                };
            }
        }
    };

    const handleSubmit = () => {
        // Gửi dữ liệu đã được lưu trong selectedAnswers về server
        // Sử dụng axios hoặc phương thức gửi dữ liệu tương tự
        // // axios.post(`${BASE_URL}/submit`, { answers: selectedAnswers }).then((response) => {
        // //     // Xử lý phản hồi từ server (nếu cần)
        // // });
        if (studentExamId && submission === 1) {
            setTimeout(() => {
                //Gọi API
                console.log('Đã gửi');
            }, 1500);
        }
        //handleFetchData();
    };
    const handleExitHome = () => {
        window.location.replace('/');
    };
    const [textValue, setTextValue] = useState('');
    const [shouldCallAPI, setShouldCallAPI] = useState(false);
    const [questionId, setQuestionId] = useState(Number);
    const [checkChangeTextArea, setCheckChangeArea] = useState(false);
    useEffect(() => {
        let timer: any;
        if (shouldCallAPI) {
            timer = setTimeout(() => {
                if (studentExamId) {
                    //questionId
                    //Gọi API
                    console.log(textValue);
                }
            }, 800);
        }

        return () => clearTimeout(timer);
    }, [textValue, shouldCallAPI]);

    const handleTextAreaChange = (e: any, questionId: number) => {
        setTextValue(e);
        setQuestionId(questionId);
        setShouldCallAPI(true);
    };
    return (
        <>
            <div>
                <div>
                    <div className="h-screen grid grid-cols-1 grid-rows-[auto,1fr,auto] ">
                        <Header className="bg-blue-400 text-xl grid items-center">Bài Kiểm Tra</Header>
                        <div className="p-5 grid justify-center ">
                            <div className="justify-center flex">
                                <div className="w-[50rem]">
                                    {isData?.list_questions_answers.map((asw, index) => (
                                        <div key={asw.id} className="mb-4 bg-gray-300 rounded-md px-4 py-4 ">
                                            <div className="text-xl font-bold mb-2">
                                                Câu {index + 1}. {asw.content}
                                            </div>
                                            <div className="space-y-2">
                                                {asw.answers.map((answer) => (
                                                    <label
                                                        className={`flex items-center space-x-2 ${
                                                            asw.question_category_id === 1
                                                                ? 'radio-answer'
                                                                : 'checkbox-answer'
                                                        } ${answer.correct_answer && 'bg-green-300 rounded-md'}`}
                                                        key={answer.id}
                                                    >
                                                        {asw.question_category_id === 1 && (
                                                            <input
                                                                disabled
                                                                defaultChecked={asw.student_answer_options
                                                                    .map((e) => parseInt(e.answer_id.toString()))
                                                                    .includes(answer.id)}
                                                                type="radio"
                                                                name={`asw${index}`}
                                                                onChange={() => {
                                                                    if (studentExamId && submission) {
                                                                        const a = handleAnswerChange(asw.id, answer.id);
                                                                        //gọi API
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        {asw.question_category_id === 2 && (
                                                            <input
                                                                type="checkbox"
                                                                className="focus:border-blue-300"
                                                                defaultChecked={asw.student_answer_options
                                                                    .map((e) => parseInt(e.answer_id.toString()))
                                                                    .includes(answer.id)}
                                                                value={answer.id}
                                                                onChange={(e) => {
                                                                    if (studentExamId && submission) {
                                                                        const a = handleAnswerCheckBox(
                                                                            asw.id,
                                                                            answer.id,
                                                                            e.target.checked,
                                                                        );
                                                                        console.log(a);
                                                                    }
                                                                }}
                                                            />
                                                        )}

                                                        <span className="text-lg font-medium">{answer.answer}</span>
                                                    </label>
                                                ))}

                                                {asw.question_category_id === 3 && (
                                                    <TextArea
                                                        className="text-lg"
                                                        style={{ height: '20rem', overflow: 'hidden', resize: 'none' }}
                                                        maxLength={2000}
                                                        showCount
                                                        value={
                                                            !checkChangeTextArea
                                                                ? asw.student_answer_options.map((e) =>
                                                                      e.essay_answer.toString(),
                                                                  )
                                                                : textValue
                                                        }
                                                        placeholder="Nhập câu trả lời"
                                                        onChange={(e) => {
                                                            setCheckChangeArea(true);
                                                            handleTextAreaChange(e.target.value, asw.id);
                                                        }}
                                                    ></TextArea>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className=" gap-x-3 flex flex-row justify-end">
                                <Button onSubmit={handleSubmit} className="" type="primary">
                                    Gửi
                                </Button>
                                <Button onClick={handleExitHome} type="primary" danger>
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
