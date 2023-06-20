import React, { useState, useRef, useEffect } from 'react';
import iconUser from '../img/iconUser.svg';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import {
    MdAccountCircle,
    MdKeyboard,
    MdKeyboardArrowDown,
    MdOutlineAssignment,
    MdOutlineFileUpload,
    MdOutlineInsertDriveFile,
    MdOutlineUpload,
} from 'react-icons/md';
import { Button, Dropdown, Menu, Space, Typography, Upload } from 'antd';
import CheckBoxMenu from '../components/CheckBoxMenu';
import CheckBoxAll from '../components/CheckBoxAll';
import CardExercise from '../components/CardExercise';
import FileUpload from '../components/FileUpload';
import axios, { AxiosError, AxiosResponse } from 'axios';
const listExercise = [
    {
        id: 1,
        title: 'Bài 1',
        icon: <MdOutlineAssignment />,
        datetime: '5 thg 6',
    },
    {
        id: 2,
        title: 'Bài 2',
        icon: <MdOutlineAssignment />,
        datetime: '5 thg 6',
    },
    {
        id: 3,
        title: 'Bài 3',
        icon: <MdOutlineAssignment />,
        datetime: '5 thg 6',
    },
    {
        id: 4,
        title: 'Bài 4',
        icon: <MdOutlineAssignment />,
        datetime: '5 thg 6',
    },
    {
        id: 5,
        title: 'Bài 5',
        icon: <MdOutlineAssignment />,
        datetime: '5 thg 6',
    },
];
const ListStudent = [
    { label: 'Nguyễn Văn A', icon: <MdAccountCircle size={28} /> },
    { label: 'Nguyễn Văn B', icon: <MdAccountCircle size={28} /> },
    { label: 'Nguyễn Văn C', icon: <MdAccountCircle size={28} /> },
    { label: 'Nguyễn Văn D', icon: <MdAccountCircle size={28} /> },
    { label: 'Nguyễn Văn E', icon: <MdAccountCircle size={28} /> },
    { label: 'Nguyễn Văn F', icon: <MdAccountCircle size={28} /> },
    { label: 'Nguyễn Văn G', icon: <MdAccountCircle size={28} /> },
    { label: 'Nguyễn Văn H', icon: <MdAccountCircle size={28} /> },
    { label: 'Nguyễn Văn L', icon: <MdAccountCircle size={28} /> },
];

const AddCard = () => {
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [value, setValue] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>(ListStudent.map((student) => student.label));
    // const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [displayedOption, setDisplayedOption] = useState<string | JSX.Element>('0 học viên');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage('');
        setShowForm(false);
    };

    const handleCancel = () => {
        setMessage('');
        setShowForm(false);
    };

    const handleOpenForm = () => {
        setShowForm(true);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const handleMenuListStudentChange = (selectedOptions: string[]) => {
        setSelectedOptions(selectedOptions);
    };

    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     setSelectedFile(file || null);
    // };
    // const handleFileChange = (file: File) => {
    //     setSelectedFile(file);
    // };
    // const handleFileUpload = (options: any) => {
    //     const { file, onSuccess, onError } = options;

    //     // Tạo đối tượng FormData để chứa file
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     console.log(file);
    //     // Gửi yêu cầu tải lên bằng cách sử dụng API fetch hoặc thư viện khác
    //     fetch('URL_Tải_lên', {
    //         method: 'POST',
    //         body: formData,
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             // Xử lý khi tải lên thành công
    //             onSuccess(data);
    //         })
    //         .catch((error) => {
    //             // Xử lý khi có lỗi xảy ra
    //             onError(error);
    //         });
    // };
    const [files, setFiles] = useState({});
    const handleFileUpload = (file: any) => {
        console.log(file);
        setFiles((pre) => {
            return { ...pre, [file.uid]: file };
        });

        axios.post('http://localhost:3000/fileUpload', file, {
            onUploadProgress: (event) => {
                console.log(event);
            },
        });
    };

    useEffect(() => {
        if (selectedOptions.length === 0) {
            setDisplayedOption('0 học viên');
        } else if (selectedOptions.length === ListStudent.length) {
            setDisplayedOption('Chọn tất cả');
        } else if (selectedOptions.length <= 2) {
            setDisplayedOption(`${selectedOptions.length} học viên`);
        } else {
            setDisplayedOption(`${selectedOptions.length} học viên `);
        }
    }, [selectedOptions]);

    const hasSelectedOptions = selectedOptions.length > 0;

    return (
        <>
            <div className="grid gap-y-4">
                <div>
                    {!showForm ? (
                        <div
                            onClick={handleOpenForm}
                            className="bg-slate-200 h-20 m-15 shadow-xl rounded-lg flex items-center"
                        >
                            <div className="w-14 flex justify-center">
                                <img className="w-9 h-9" src={iconUser} alt="" />
                            </div>
                            <div className="font-medium hover:text-blue-400 cursor-pointer">
                                Đây là thông báo nội dung nào đó cho lớp học của bạn
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="bg-slate-200 h-auto w-full m-15 shadow-lg  rounded-lg max-w-3xl p-2"
                        >
                            {/* <div>
                                <div> Dành cho</div>
                                <div>
                                    <Dropdown
                                        overlay={
                                            <Menu
                                                className="w-full fixed"
                                                style={{ maxHeight: '250px', overflowY: 'auto' }}
                                            >
                                                <CheckBoxAll
                                                    options={ListStudent}
                                                    onChange={handleMenuListStudentChange}
                                                />
                                            </Menu>
                                        }
                                        placement="bottom"
                                        trigger={['click']}
                                        overlayClassName="custom-dropdown-menu"
                                        overlayStyle={{
                                            width: '240px',
                                            height: '250px',
                                            gap: '10px',
                                        }}
                                    >
                                        <Button className="w-40 h-auto flex justify-between items-center">
                                            {selectedOptions.length > 0 && (
                                                <span className="">
                                                    {selectedOptions.length > 0 && (
                                                        <span className="">
                                                            {hasSelectedOptions
                                                                ? displayedOption
                                                                : '0 học viên'}
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                            <MdKeyboardArrowDown />
                                        </Button>
                                    </Dropdown>
                                </div>
                            </div> */}
                            <div className="flex items-center justify-around py-4 px-4">
                                <div className={`w-14 ${showForm ? 'hidden' : ''}`}>
                                    <img className="w-9 h-9" src={iconUser} alt="" />
                                </div>
                                <div className="w-full max-w-2xl overflow-auto">
                                    <ReactQuill className=" " value={value} onChange={setValue} />
                                </div>
                            </div>

                            {/* {selectedFile && (
                                <div className="px-4 pb-2">
                                    <div className="flex gap-x-4 border-2 border-slate-300 px-4 py-2">
                                        <h4>Uploaded File:</h4>
                                        <p>{selectedFile.name}</p>
                                    </div>
                                </div>
                            )} */}

                            <div className="flex justify-between">
                                <div>
                                    <Space direction="vertical">
                                        <Upload multiple customRequest={handleFileUpload}>
                                            <Button>Upload</Button>
                                        </Upload>
                                        {Object.values(files).map((file: any, index) => {
                                            return (
                                                <Space>
                                                    <MdOutlineInsertDriveFile />
                                                    <Typography>{file.name}</Typography>
                                                </Space>
                                            );
                                        })}
                                    </Space>
                                </div>

                                {/* <div>
                                    <MdOutlineFileUpload size={28} />
                                </div> */}
                                {/* <div className="bg-slate-300 hover:bg-slate-400 transition-all duration-200 rounded-full p-1 ml-4">
                                    <input
                                        type="file"
                                        name="file"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        id="file-input"
                                    />
                                    <label htmlFor="file-input" className="file-input-label">
                                        <MdOutlineFileUpload size={28} />
                                    </label>
                                </div> */}
                                <div className=" mr-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-800 transition-all duration-200 text-white font-medium py-2 px-4 rounded-md"
                                    >
                                        Đăng
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="bg-gray-300 hover:bg-gray-400 transition-all duration-200 ml-2 px-4 py-2 rounded-md font-medium"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
                <div className="grid gap-y-4">
                    {listExercise.map((item) => (
                        <CardExercise item={item} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default AddCard;
