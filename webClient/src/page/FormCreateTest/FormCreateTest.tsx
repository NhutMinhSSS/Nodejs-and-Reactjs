import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Option {
    id: number;
    value: string;
    isCorrect: boolean;
}

interface Question {
    id: number;
    title: string;
    options: Option[];
    inputType: 'checkbox' | 'radio';
}

const FormCreateTest: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([
        { id: 1, title: '', options: [], inputType: 'checkbox' },
    ]);

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
            prevQuestions.map((question) =>
                question.id === questionId ? { ...question, title } : question,
            ),
        );
    };

    const handleOptionChange = (questionId: number, optionId: number, value: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                          ...question,
                          options: question.options.map((option) =>
                              option.id === optionId ? { ...option, value } : option,
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

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(questions);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>, questionId: number) => {
        const { value } = e.target;
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? { ...question, inputType: value as 'checkbox' | 'radio' }
                    : question,
            ),
        );
    };

    const handleAddOption = (questionId: number) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                          ...question,
                          options: [
                              ...question.options,
                              {
                                  id: question.options.length + 1,
                                  value: '',
                                  isCorrect: false,
                              },
                          ],
                      }
                    : question,
            ),
        );
    };
    const handleRemoveQuestion = (questionId: number) => {
        setQuestions((prevQuestions) =>
            prevQuestions.filter((question) => question.id !== questionId),
        );
    };

    return (
        <>
            <div className="container mx-auto flex justify-center overflow-y-auto">
                <form
                    onSubmit={handleFormSubmit}
                    className="bg-slate-200 px-4 py-2 w-[50rem]  h-[40rem] max-h-full rounded-md overflow-y-auto "
                >
                    {questions.map((question) => (
                        <div key={question.id} className="mb-5 bg-white p-4 rounded-lg shadow-lg">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={question.title}
                                    onChange={(e) =>
                                        handleQuestionChange(question.id, e.target.value)
                                    }
                                    placeholder="Enter question"
                                    className="border border-gray-300 rounded px-4 py-2 w-full mb-2"
                                    required
                                />
                                <div>
                                    <select
                                        id={`inputType_${question.id}`}
                                        value={question.inputType}
                                        onChange={(e) => handleInputChange(e, question.id)}
                                        className="ml-2 px-2 py-2 w-32 rounded-md border-2"
                                    >
                                        <option value="checkbox">Hộp kiểm</option>
                                        <option value="radio">Trắc Nghiệm</option>
                                    </select>
                                </div>
                            </div>
                            {question.options.map((option) => (
                                <div
                                    key={option.id}
                                    className="flex items-center mb-2 justify-between"
                                >
                                    <div>
                                        {question.inputType === 'checkbox' ? (
                                            <input
                                                type="checkbox"
                                                id={`option_${option.id}`}
                                                name={`question_${question.id}`}
                                                value={option.id}
                                                checked={option.isCorrect}
                                                onChange={(e) =>
                                                    handleCheckboxChange(
                                                        question.id,
                                                        option.id,
                                                        e.target.checked,
                                                    )
                                                }
                                                className="mr-2 "
                                            />
                                        ) : (
                                            <input
                                                type="radio"
                                                id={`option_${option.id}`}
                                                name={`question_${question.id}`}
                                                value={option.id}
                                                checked={option.isCorrect}
                                                onChange={(e) =>
                                                    handleRadioChange(
                                                        question.id,
                                                        option.id,
                                                        e.target.checked,
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                        )}
                                        <input
                                            type="text"
                                            value={option.value}
                                            onChange={(e) =>
                                                handleOptionChange(
                                                    question.id,
                                                    option.id,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter answer"
                                            className="border border-gray-300 rounded px-4 py-2 w-72"
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
                                <button
                                    type="button"
                                    onClick={() => handleAddOption(question.id)}
                                    className="bg-blue-500 text-white py-2 px-2 rounded mb-2 mt-2"
                                >
                                    Thêm đáp án
                                </button>
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

                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded h-10"
                        >
                            Gửi
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default FormCreateTest;
