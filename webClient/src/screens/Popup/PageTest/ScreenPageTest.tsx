import { Row, Col, Input, RadioChangeEvent, Space, Radio, Select } from 'antd';
import { useState } from 'react';

// import './style.css';
const { Option } = Select;

const ScreenPageTest: React.FC = () => {
    // const [value, setValue] = useState(1);
    // const onChange = (e: RadioChangeEvent) => {
    //     console.log('radio checked', e.target.value);
    //     setValue(e.target.value);
    // };
    const [questionType, setQuestionType] = useState<string | null>(null);

    const handleChangeQuestionType = (value: string) => {
        setQuestionType(value);
    };
    return (
        <div className="h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100  scrollbar-rounded">
            <div className="mt-3">
                <Row className="flex justify-center ">
                    <Col>
                        <div className="border shadow-lg w-[60rem] rounded-xl h-32">
                            <div className="px-10 py-4 focus:border-none">
                                <Input className="w-full text-2xl" defaultValue="Blank Quiz" />
                            </div>
                            <div className="px-10 py-2 focus:border-none">
                                <Input
                                    className="w-full"
                                    defaultValue=""
                                    placeholder="Mô tả biểu mẫu"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col className="mt-4">
                        <div className="border shadow-lg w-[60rem] rounded-xl h-auto px-10 py-5">
                            {/* <Radio.Group onChange={onChange} value={value}>
                                <Space direction="vertical">
                                    <Radio value={1}>
                                        Tùy chọn 1{' '}
                                        {value === 1 ? (
                                            <Input style={{ width: 100, marginLeft: 10 }} />
                                        ) : null}
                                    </Radio>
                                </Space>
                            </Radio.Group> */}
                            <Select
                                defaultValue="Select question type"
                                style={{ width: 200 }}
                                onChange={handleChangeQuestionType}
                            >
                                <Option value="multichoice">Create Multichoice</Option>
                                <Option value="essay">Create Essay</Option>
                            </Select>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ScreenPageTest;
