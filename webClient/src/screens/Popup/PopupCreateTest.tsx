import { Button, Col, DatePicker, Input, Row, Select, Switch, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import '../../style/Tabs.scss';
import ScreenPageTest from './PageTest/ScreenPageTest';
import AllPeople from '../AllPeople';
import ClassBulletin from '../ClassBulletin';
import ClassroomExercisesTeacher from '../ClassExercises/ClassroomExercisesTeacher';
import FormCreateTest from '../../page/FormCreateTest/FormCreateTest';
import { Content, Header } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en';
const { TextArea } = Input;
dayjs.locale('en');
interface Option {
    id: number;
    content: string;
    isCorrect: boolean;
    answer: string;
}

interface Question {
    id: number;
    title: string;
    options: Option[];
    inputType: 'checkbox' | 'radio' | 'text'; // Added 'text' as an option
}
const PopupCreateTest = () => {
    const [title, setTitle] = useState<string>('');
    const [instruction, setInstruction] = useState<string>('');
    const [point, setPoint] = useState<number | string>(100);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [isReverseQuestion, setIsReverseQuestion] = useState<boolean>(true);
    const [isReverseAnswer, setIsReverseAnswer] = useState<boolean>(true);

    const [questions, setQuestions] = useState<Question[]>([{ id: 1, title: '', options: [], inputType: 'checkbox' }]);
    const [questionPoints, setQuestionPoints] = useState<{ [key: number]: number }>({});
    const [isPoint, setIsPoint] = useState<number>(0);
    const handleAddQuestion = () => {
        setQuestions((prevQuestions) => [
            ...prevQuestions,
            {
                id: questions.length + 1,
                title: '',
                options: [],
                inputType: 'checkbox',
            },
        ]);
    };

    const handleQuestionChange = (questionId: number, title: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) => (question.id === questionId ? { ...question, title } : question)),
        );
    };

    const handleOptionChange = (questionId: number, optionId: number, content: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                          ...question,
                          options: question.options.map((option) =>
                              option.id === optionId ? { ...option, content } : option,
                          ),
                      }
                    : question,
            ),
        );
    };

    const handleCheckboxChange = (questionId: number, optionId: number, checked: boolean) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                          ...question,
                          options: question.options.map((option) =>
                              option.id === optionId ? { ...option, isCorrect: checked } : option,
                          ),
                      }
                    : question,
            ),
        );
    };
    const handleRadioChange = (questionId: number, optionId: number, checked: boolean) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                          ...question,
                          options: question.options.map((option) =>
                              option.id === optionId
                                  ? { ...option, isCorrect: checked }
                                  : { ...option, isCorrect: false },
                          ),
                      }
                    : question,
            ),
        );
    };
    const handleRemoveOption = (questionId: number, optionId: number) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                          ...question,
                          options: question.options.filter((option) => option.id !== optionId),
                      }
                    : question,
            ),
        );
    };

    // const handleFormSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     const questionsWithoutId = questions.map((question) => {
    //         return {
    //             id: question.id,
    //             title: question.title,
    //             options: question.options,
    //             inputType: question.inputType,
    //             point: questionPoints[question.id],
    //         };
    //     });
    //     console.log(questionsWithoutId);
    // };

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>, questionId: number) => {
        const { value } = e.target;
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) => {
                if (question.id === questionId) {
                    let updatedQuestion: Question = {
                        ...question,
                        inputType: value as 'checkbox' | 'radio' | 'text',
                        options: [],
                    };

                    if (value === 'radio' && question.inputType === 'checkbox') {
                        updatedQuestion.options = question.options.map((option) => {
                            return option.isCorrect ? { ...option, isCorrect: false } : option;
                        });
                    }
                    if (value === 'checkbox' && question.inputType === 'radio') {
                        updatedQuestion.options = question.options.map((option) => {
                            return option.isCorrect ? { ...option, isCorrect: false } : option;
                        });
                    }
                    return updatedQuestion;
                }
                return question;
            }),
        );
    };

    const handleAddOption = (questionId: number) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId && question.inputType !== 'text'
                    ? {
                          ...question,
                          options: [
                              ...question.options,
                              {
                                  id: question.options.length + 1,
                                  content: '',
                                  isCorrect: false,
                                  answer: '', // New property for the answer value
                              },
                          ],
                      }
                    : question,
            ),
        );
    };

    const handleRemoveQuestion = (questionId: number) => {
        setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== questionId));
    };
    const handleValuePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPoint(Number(e.target.value));
    };
    const handleQuestionPointChange = (questionId: number, score: number) => {
        setQuestionPoints((prevQuestionPoints) => ({
            ...prevQuestionPoints,
            [questionId]: score,
        }));
    };
    // xử lý nhập select
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleInstructionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInstruction(e.target.value);
    };
    const handlePointChange = (value: number | string) => {
        setPoint(value);
    };

    const handleStartDateChange = (date: Dayjs | null, dateString: string) => {
        const formattedDate = date ? date.format('DD-MM-YYYY HH:mm') : '';
        console.log('Giờ bắt đầu:', formattedDate);
        setStartDate(date);
    };

    const handleEndDateChange = (date: Dayjs | null, dateString: string) => {
        const formattedDate = date ? date.format('DD-MM-YYYY HH:mm') : '';
        console.log('Hạn Nộp:', formattedDate);
        setEndDate(date);
    };

    const handleReverseQuestionChange = (checked: boolean) => {
        setIsReverseQuestion(checked);
    };

    const handleReverseAnswerChange = (checked: boolean) => {
        setIsReverseAnswer(checked);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // Ngăn chặn hành vi mặc định của form

        e.preventDefault();
        const questionsWithoutId = questions.map((question) => {
            let inputTypeNumber: number;

            switch (question.inputType) {
                case 'radio':
                    inputTypeNumber = 1;
                    break;
                case 'checkbox':
                    inputTypeNumber = 2;
                    break;
                case 'text':
                    inputTypeNumber = 3;
                    break;
                default:
                    // Không phải là checkbox, radio hoặc text
                    inputTypeNumber = 0;
                    break;
            }

            return {
                title: question.title,
                options: question.options,
                inputType: inputTypeNumber,
                score: questionPoints[question.id],
            };
        });

        console.log(questionsWithoutId);
        if (endDate && startDate) {
            const formattedEndDate = endDate.format('DD-MM-YYYY HH:mm');
            const formattedStartDate = startDate.format('DD-MM-YYYY HH:mm');
            const formData = {
                content: title,
                instruction,
                point,
                formattedStartDate,
                formattedEndDate,
                isReverseQuestion,
                isReverseAnswer,
                questionsWithoutId,
            };
            console.log('Submit: ', formData);
            // Tiếp tục xử lý dữ liệu đã format ở đây, ví dụ: gửi lên server
        }
    };
    return (
        <div className=" shadow-xl h-16 fixed w-full ">
            <form onSubmit={handleSubmit}>
                <Header className="flex justify-between items-center bg-blue-400 ">
                    <div className="text-lg font-bold">Tạo bài kiểm tra</div>
                    <div className="  grid iphone 12:grid-flow-col ">
                        <Button htmlType="submit" className="bg-blue-500" type="primary">
                            Gửi
                        </Button>
                    </div>
                </Header>
                <Content className="">
                    <div className="grid grid-rows-3 grid-flow-col gap-4 container justify-evenly">
                        <div className="mb-2 row-span-3 ">
                            <div className="container mx-auto flex justify-center overflow-y-auto">
                                <div className=" px-4 py-2 w-[60rem] h-[40rem] max-h-full rounded-md overflow-y-auto ">
                                    {questions.map((question) => (
                                        <div key={question.id} className="mb-5 bg-white p-4 rounded-lg shadow-lg">
                                            <div className="mb-2 flex gap-x-2 items-center">
                                                <span className="font-semibold">Điểm câu hỏi</span>
                                                <span className="w-20">
                                                    <Input
                                                        required
                                                        type="number"
                                                        placeholder="Điểm"
                                                        min={0}
                                                        max={100}
                                                        value={questionPoints[question.id]?.toString() || ''}
                                                        onChange={(e) =>
                                                            handleQuestionPointChange(
                                                                question.id,
                                                                Number(e.target.value),
                                                            )
                                                        }
                                                    />
                                                </span>
                                            </div>
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    value={question.title}
                                                    onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                                                    placeholder="Nhập câu hỏi"
                                                    className="border border-gray-300 rounded px-4 py-2 w-full mb-2 "
                                                    required
                                                />
                                                <div>
                                                    <select
                                                        id={`inputType_${question.id}`}
                                                        value={question.inputType}
                                                        onChange={(e) => handleInputChange(e, question.id)}
                                                        className="ml-2 px-2 py-2 w-32 rounded-md border-2 focus:border-blue-300"
                                                    >
                                                        <option value="checkbox">Hộp kiểm</option>
                                                        <option value="radio">Trắc Nghiệm</option>
                                                        <option value="text">Tự Luận</option>{' '}
                                                        {/* Added 'text' option */}
                                                    </select>
                                                </div>
                                            </div>
                                            {question.options.map((option) => (
                                                <div key={option.id} className="flex items-center mb-2 justify-between">
                                                    <div>
                                                        {question.inputType === 'checkbox' ||
                                                        question.inputType === 'radio' ? (
                                                            <input
                                                                type={question.inputType}
                                                                id={`option_${option.id}`}
                                                                name={`question_${question.id}`}
                                                                value={option.id}
                                                                checked={option.isCorrect}
                                                                onChange={(e) =>
                                                                    question.inputType === 'checkbox'
                                                                        ? handleCheckboxChange(
                                                                              question.id,
                                                                              option.id,
                                                                              e.target.checked,
                                                                          )
                                                                        : handleRadioChange(
                                                                              question.id,
                                                                              option.id,
                                                                              e.target.checked,
                                                                          )
                                                                }
                                                                className="mr-2 focus:border-blue-300"
                                                            />
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={option.answer}
                                                                onChange={(e) =>
                                                                    handleOptionChange(
                                                                        question.id,
                                                                        option.id,
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                placeholder="Nhập đáp án"
                                                                className="border border-gray-300 rounded px-4 py-2 w-72 focus:border-blue-300"
                                                                required
                                                            />
                                                        )}

                                                        <input
                                                            type="text"
                                                            value={option.content}
                                                            onChange={(e) =>
                                                                handleOptionChange(
                                                                    question.id,
                                                                    option.id,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            placeholder="Nhập đáp án"
                                                            className="border border-gray-300 rounded px-4 py-2 w-72 focus:border-blue-300"
                                                            required
                                                        />
                                                    </div>
                                                    {option.isCorrect ? (
                                                        <span className="ml-2 text-green-500">✔</span>
                                                    ) : null}
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-red-600 "
                                                        onClick={() => handleRemoveOption(question.id, option.id)}
                                                    >
                                                        ✖
                                                    </button>
                                                </div>
                                            ))}

                                            <div className="flex justify-between">
                                                {question.inputType !== 'text' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddOption(question.id)}
                                                        className="bg-blue-500 text-white py-2 px-2 rounded mb-2 mt-2"
                                                    >
                                                        Thêm đáp án
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveQuestion(question.id)}
                                                    className="bg-red-500 text-white py-2 px-4 rounded mb-2 mt-2"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex justify-between">
                                        <button
                                            type="button"
                                            onClick={handleAddQuestion}
                                            className="bg-green-500 text-white py-2 px-4 rounded mb-4"
                                        >
                                            Thêm câu hỏi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 grid gap-y-4 h-full">
                            <div className="col-span-1 bg-white shadow-lg p-5 rounded-lg  mx-5">
                                <div>
                                    <div>Tiêu đề</div>
                                    <Input
                                        value={title}
                                        onChange={handleTitleChange}
                                        placeholder="Nhập tiêu đề"
                                    ></Input>
                                </div>
                                <div>
                                    <div>Hướng dẫn</div>
                                    <TextArea
                                        value={instruction}
                                        onChange={handleInstructionChange}
                                        showCount
                                        maxLength={500}
                                        style={{ resize: 'none' }}
                                        placeholder="Hướng dẫn (không bắt buộc)"
                                    ></TextArea>
                                </div>
                            </div>
                            <div className="col-span-1 bg-white shadow-lg p-5 rounded-lg mx-5 max-h-[28rem] h-[38rem]">
                                <div className="px-2 mb-2">
                                    <p>Điểm</p>
                                    <Select defaultValue={point} className="w-40" onChange={handlePointChange}>
                                        <option value={100}>100</option>
                                        <option value="chua-cham-diem">Chưa chấm điểm</option>
                                        {/* Các option khác */}
                                    </Select>
                                </div>
                                <div className="flex gap-x-2 justify-around items-center px-2 mt-5">
                                    <div className="flex flex-col">
                                        <label htmlFor="">Giờ bắt đầu</label>
                                        <DatePicker
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            showTime
                                            format="DD-MM-YYYY HH:mm"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="">Hạn Nộp</label>
                                        <DatePicker
                                            value={endDate}
                                            onChange={handleEndDateChange}
                                            showTime
                                            format="DD-MM-YYYY HH:mm"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-x-2 mt-5 px-2">
                                    <p className="text-sm ">Chọn đảo câu hỏi</p>
                                    <div className="p-1 w-[3.2rem] items-center flex rounded-2xl bg-slate-200">
                                        <Switch
                                            defaultChecked={isReverseQuestion}
                                            onChange={handleReverseQuestionChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-x-2 mt-5 px-2">
                                    <p className="text-sm ">Chọn đảo câu trả lời</p>
                                    <div className="p-1 w-[3.2rem] items-center flex rounded-2xlbg-slate-200">
                                        <Switch defaultChecked={isReverseAnswer} onChange={handleReverseAnswerChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Content>
            </form>
        </div>
    );
};

export default PopupCreateTest;
