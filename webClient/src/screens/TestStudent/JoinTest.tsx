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
    answer: string;
    isCorrect: boolean;
}

const { Header } = Layout;
const BASE_URL = `${SystemConst.DOMAIN}`;

const JoinTest = () => {
    const [question, setQuestion] = useState<Question[]>([]);
    //const [selectedAnswers, setSelectedAnswers] = useState<Question[]>([]);
    const [studentExamId, setStudentExamId] = useState(Number);

    useEffect(() => {
        handleFetchData();
    }, []);
    const { post_id } = useParams();
    const handleFetchData = () => {
        const config = HeaderToken.getTokenConfig();
        axios.get(`${BASE_URL}/questions-and-answers/${49}/get-questions-and-answers`, config).then((response) => {
            const dataFetch = response.data.response_data;
            setQuestion(dataFetch.list_questions_answers);
            if (dataFetch.student_exam_id) {
                setStudentExamId(dataFetch.student_exam_id);
            }
            console.log('data: ', response.data.response_data);
        });
    };
    let questionRadio: Number[];
    const handleAnswerChange = (examId: number, answerId: any) => {
        questionRadio = []
        if (questionRadio) {   
            // Cập nhật danh sách đáp án cho câu hỏi đã tồn tại trong danh sách selectedAnswers
            questionRadio = [answerId]
        } else {
            const newQuestion = [answerId]
            questionRadio = newQuestion;
        }
        return {
            answerIds: questionRadio,
            question_id: examId
        };
    };
    const selectAnswers: Record<number, number[]> = {};

    const handleAnswerCheckBox = (examId: number, answerId: any, checked: boolean) => {
        if (!selectAnswers[examId]) {
            // Nếu chưa có mục cho câu hỏi này, tạo một mục mới và thêm câu trả lời đã chọn
            selectAnswers[examId] = [answerId];
            return {
                question_id: examId, 
                answer_ids:selectAnswers[examId]
            };
          } else {
            if (checked) {
              // Nếu được chọn, thêm câu trả lời vào danh sách
              selectAnswers[examId].push(answerId);
              return {
                question_id: examId, 
                answer_ids:selectAnswers[examId]
            };
            } else {
              // Nếu không được chọn, loại bỏ câu trả lời khỏi danh sách
              selectAnswers[examId] = selectAnswers[examId].filter((id) => id !== answerId);
              return {
                question_id: examId, 
                answer_ids:selectAnswers[examId]
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
        handleFetchData();
    };
    const [textValue, setTextValue] = useState('');
    const [shouldCallAPI, setShouldCallAPI] = useState(false);
    const [questionId, setQuestionId] = useState(Number);
  useEffect(() => {
    let timer: any;
    if (shouldCallAPI && studentExamId) {
      timer = setTimeout(() => {
        //Gọi API
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [textValue, shouldCallAPI]);

  const handleTextAreaChange = (e: any, questionId: number) => {
    setTextValue(e.target.value);
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
                                                                onChange={() =>{
                                                                    if (studentExamId) {
                                                                        handleAnswerChange(asw.id, answer.id);
                                                                    }
                                                                    //Gọi API
                                                                }}
                                                            />
                                                        )}
                                                        {asw.question_category_id === 2 && (
                                                            <Checkbox
                                                                value={answer.id}
                                                                onChange={(e) =>
                                                                    {
                                                                       if (studentExamId) {
                                                                        const data = handleAnswerCheckBox(
                                                                            asw.id,
                                                                            answer.id,
                                                                            e.target.checked,
                                                                        );
                                                                       }
                                                                   //gọi API
                                                                }
                                                                }
                                                            />
                                                        )}
                                                        <span className="text-lg font-medium">{answer.answer}</span>
                                                    </label>
                                                ))}
                                                {asw.question_category_id === 3 && (
                                                    <Input.TextArea
                                                        style={{ resize: 'none', height: 120 }}
                                                        placeholder="Nhập câu trả lời"
                                                        onChange={(e) =>{
                                                            // const a = handleEssayAnswerChange(asw.id, e.target.value);
                                                            // setTimeout(() => {
                                                            //     console.log(a);
                                                            //   }, 2000);
                                                            handleTextAreaChange(e, asw.id);
                                                        }
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
