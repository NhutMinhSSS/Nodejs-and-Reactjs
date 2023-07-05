import React, { useState, useRef, useEffect } from 'react';
import iconUser from '../img/iconUser.svg';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import {
    MdAccountCircle,
    MdMoreVert,
    MdOutlineAssignment,
    MdOutlineFilePresent,
    MdOutlineFileUpload,
    MdOutlineImage,
} from 'react-icons/md';
import { Button, Modal, Spin, Upload } from 'antd';
import axios from 'axios';
import HeaderToken from '../common/utils/headerToken';
import SystemConst from '../common/consts/system_const';
import { useParams } from 'react-router-dom';
import Notification from '../components/Notification';
import UnauthorizedError from '../common/exception/unauthorized_error';
import ErrorAlert from '../common/Screens/ErrorAlert';
import './scss/style.scss';
import TextArea from 'antd/es/input/TextArea';
import { saveAs } from 'file-saver';

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
interface ListPost {
    last_name: string;
    first_name: string;
    content: string;
    files: File[];
    id: number;
}
interface File {
    file_name: string;
    file_type: string;
    file_id: number;
}
const BASE_URL = `${SystemConst.DOMAIN}`;
const AddCard = () => {
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [value, setValue] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>(ListStudent.map((student) => student.label));
    const [selectedFile, setSelectedFile] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { classroom_id } = useParams();
    const [isData, setIsData] = useState<ListPost[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        handleGetPost();
    }, []);
    const handleGetPost = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            const config = HeaderToken.getTokenConfig();
            setLoading(true);
            axios
                .get(`${SystemConst.DOMAIN}/classrooms/get-posts/${classroom_id}`, config)
                .then((response) => {
                    const data = response.data.response_data.list_post;
                    setIsData(data);
                })
                .catch((error) => {
                    if (error) {
                        const isError = UnauthorizedError.checkError(error);

                        if (!isError) {
                            let content = '';
                            const {
                                status,
                                data: { error_message: errorMessage },
                            } = error.response;
                            if (status === 404 && errorMessage === 'Classroom no exist') {
                                content = 'Lớp không tồn tại';
                            } else if (status === 403 && errorMessage === 'No permission') {
                                content = 'Bạn không có quyền truy cập vào lớp này';
                            } else {
                                content = 'Lỗi máy chủ';
                            }
                            const title = 'Lỗi';
                            const path = '/giang-vien';

                            ErrorAlert(title, content, path);
                        }
                    } else {
                        const title = 'Lỗi';
                        const content = 'Máy chủ không hoạt động';
                        localStorage.clear();
                        const path = '/';
                        ErrorAlert(title, content, path);
                    }
                    // Xử lý lỗi nếu có
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    // Hàm để lấy tên tệp tin từ tiêu đề "Content-Disposition"
    const getFilenameFromContentDisposition = (contentDisposition: any) => {
        if (contentDisposition) {
            const match = contentDisposition.match(/filename=(.+)/);
            if (match && match[1]) {
                return match[1];
            }
        }
        return 'untitled';
    };
    const handleDownPost = async (id: number, fileId: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            setLoading(true);
            const post_id = id;
            const file_id = fileId;
            const config = {
                headers: {
                    authorization: `Bearer ${token}`,
                    responseType: 'blob',
                },
            };
            // try {
            //     const response = await axios.get(`${SystemConst.DOMAIN}/files/${post_id}/${file_id}/download`, {
            //         responseType: 'blob', // Important! This tells Axios to expect a binary response.
            //     });

            //     // Get the filename from the response headers or generate a default one.
            //     const contentDisposition = response.headers['content-disposition'];

            //     // Create a URL pointing to the Blob data, and create a temporary anchor element to initiate download.
            //     const url = window.URL.createObjectURL(new Blob([response.data]));
            //     const link = document.createElement('a');
            //     const disposition = response.headers['content-disposition'];
            //     const decord = disposition.split('filename=')[1].replace(/"/g, '');
            //     const filename = decodeURIComponent(decord);
            //     link.href = url;
            //     link.setAttribute('download', filename);
            //     document.body.appendChild(link);
            //     link.click();

            //     // Clean up the temporary URL and anchor element after the download is initiated.
            //     window.URL.revokeObjectURL(url);
            //     link.remove();
            // } catch (error) {
            //     console.error('Error downloading file:', error);
            // } finally {
            //     setLoading(false);
            // }
            const axiosInstance = axios.create({});
            axiosInstance.interceptors.request.use((config) => {
                // Thay YOUR_AUTH_TOKEN bằng giá trị token thực tế của bạn
                config.headers.authorization = `Bearer ${token}`;

                return config;
            });
            axiosInstance
                .get(`${SystemConst.DOMAIN}/files/${post_id}/${file_id}/download`, { responseType: 'blob' })
                .then((response) => {
                    const disposition = response.headers['content-disposition'];
                    const decord = disposition.split('filename=')[1].replace(/"/g, '');

                    const filename = decodeURIComponent(decord);

                    console.log(response.headers);

                    const file = new Blob([response.data]);
                    const url = URL.createObjectURL(file);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', filename); // Đặt tên và đuôi file tại đây
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    Notification('success', 'Thông báo', 'Bạn đã tải 1 file thành công');
                })
                .catch((error) => {
                    if (error) {
                        const isError = UnauthorizedError.checkError(error);

                        if (!isError) {
                            let content = '';
                            const {
                                status,
                                data: { error_message: errorMessage },
                            } = error.response;
                            if (status === 404 && errorMessage === 'Classroom no exist') {
                                content = 'Lớp không tồn tại';
                            } else if (status === 403 && errorMessage === 'No permission') {
                                content = 'Bạn không có quyền truy cập vào lớp này';
                            } else {
                                content = 'Lỗi máy chủ';
                            }
                            const title = 'Lỗi';
                            const path = '/giang-vien';

                            ErrorAlert(title, content, path);
                        }
                    } else {
                        const title = 'Lỗi';
                        const content = 'Máy chủ không hoạt động';
                        localStorage.clear();
                        const path = '/';
                        ErrorAlert(title, content, path);
                    }
                    // Xử lý lỗi nếu có
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };
    const handleFetchUploadFile = () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };
        if (classroom_id) {
            const parser = new DOMParser();
            const parsedContent = parser.parseFromString(value, 'text/html');
            const plainTextContent = parsedContent.body.textContent || '';
            const parsedClassroomId = parseInt(classroom_id, 10); // Chuyển đổi thành số nguyên (integer)
            const parsedPostCategoryId = parseInt('1', 10);
            const formData = new FormData();
            formData.append('classroom_id', parsedClassroomId.toString());
            formData.append('content', plainTextContent);
            formData.append('post_category_id', parsedPostCategoryId.toString());
            selectedFile.forEach((files) => {
                formData.append(`files`, files);
            });
            axios
                .post(`${BASE_URL}/posts/create-post`, formData, config)
                .then((response) => {
                    console.log(response);
                    Notification('success', 'Thông báo', 'Tạo thành công bảng tin');
                    handleGetPost();
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };
    const handleCancel = () => {
        setMessage('');
        setShowForm(false);
    };

    const handleOpenForm = () => {
        setShowForm(true);
    };

    const handleSubmitNotification = (e: { preventDefault: () => void }) => {
        // Xử lý dữ liệu đã nhập từ ReactQuill
        e.preventDefault();
        setShowForm(false);
        handleFetchUploadFile();
        setValue('');
        setSelectedFile([]);
        // Gửi dữ liệu lên server hoặc thực hiện các hành động khác
    };
    const handleFileUpload = (file: any) => {
        setSelectedFile((prevSelectedFiles) => [...prevSelectedFiles, file]);
        console.log(file);
    };
    const handleRemoveFile = (file: any) => {
        setSelectedFile((prevSelectedFile) => prevSelectedFile.filter((f) => f !== file));
    };
    const [modalDownloadFile, setModalDownloadFile] = useState(false);
    const handlePopupDownloadFile = (file_id: number, id: number) => {
        setModalDownloadFile(true);
        console.log(file_id, id);
        handleDownPost(id, file_id);
    };
    const handleVisibleDownloadFile = () => {
        setModalDownloadFile(false);
    };
    const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };
    return (
        <>
            <Spin spinning={loading}>
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
                                onSubmit={handleSubmitNotification}
                                className="bg-slate-200 h-auto w-full m-15 shadow-lg  rounded-lg max-w-3xl p-2"
                            >
                                <div className="flex items-center justify-around py-4">
                                    <div className={`w-14 ${showForm ? 'hidden' : ''}`}>
                                        <img className="w-9 h-9" src={iconUser} alt="" />
                                    </div>
                                    <div className="w-full max-w-3xl overflow-auto px-4">
                                        <label htmlFor="Thông báo">Thông báo</label>
                                        <TextArea
                                            style={{ resize: 'none', height: '150px', padding: '10px' }}
                                            value={value}
                                            onChange={handleChangeTextArea}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="ml-4">
                                        <Upload
                                            multiple
                                            showUploadList={{ showRemoveIcon: true }}
                                            accept=".png,.jpeg,.jpg,.pdf,.docx,.doc,.pptx,.xlsx,.rar,.zip "
                                            action={'http://localhost:3000/'}
                                            beforeUpload={(file) => {
                                                handleFileUpload(file);
                                                return false;
                                            }}
                                            onRemove={handleRemoveFile}
                                        >
                                            <Button className="flex items-center gap-x-2">
                                                <MdOutlineFileUpload /> Upload
                                            </Button>
                                        </Upload>
                                    </div>
                                    <div className=" mr-4">
                                        <button
                                            onClick={handleSubmitNotification}
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

                    {isData.map((item) => (
                        <div className="flex justify-between bg-slate-200 hover:shadow-lg px-10 py-5 box-decoration-slice rounded-lg max-w-3xl cursor-pointer whitespace-pre-line">
                            <div className="flex gap-y-4 flex-col justify-start">
                                <div className="flex flex-row items-center gap-x-2">
                                    <div className="bg-blue-400 text-white text-xl p-2 rounded-full">
                                        <MdOutlineAssignment />
                                    </div>
                                    <div className="text-base font-medium">
                                        {item.last_name} {item.first_name}
                                    </div>
                                </div>
                                <div className="">
                                    <p className="break-words w-[35rem]">{item.content}</p>
                                </div>
                                {item.files.length > 0 ? (
                                    <div className="grid grid-cols-2 ">
                                        {item.files.map((file) => (
                                            <button onClick={() => handlePopupDownloadFile(file.file_id, item.id)}>
                                                <div className="p-1   ">
                                                    <div className="border-[1px]   rounded-sm border-gray-400 p-2 flex items-center gap-x-5">
                                                        {['image/jpg', 'image/jpeg', 'image/png'].includes(
                                                            file.file_type,
                                                        ) ? (
                                                            <MdOutlineImage size={32} />
                                                        ) : (
                                                            <MdOutlineFilePresent size={32} />
                                                        )}
                                                        <div>{file.file_name}</div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div>
                                <button className="m-auto p-1 hover:bg-slate-300 focus:bg-slate-400  rounded-full duration-300">
                                    <MdMoreVert size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Spin>
            {/* <Modal
                visible={modalDownloadFile}
                open={modalDownloadFile}
                title="Thông báo"
                onCancel={handleVisibleDownloadFile}
                className="custom-modal-download-file"
                footer={null}
            >
                <div>
                    <p>Bạn có muốn tải file này ?</p>
                </div>
                <div className="flex justify-end h-full mt-20">
                    <Button type="primary" onClick={() => handlePopupDownloadFile} className="mr-5">
                        Tải File
                    </Button>
                    <Button onClick={handleVisibleDownloadFile} type="default" className="mr-5">
                        Hủy
                    </Button>
                </div>
            </Modal> */}
        </>
    );
};

export default AddCard;
var toolbarOption = [['bold', 'italic']];
const modules = {
    toolbar: toolbarOption,
};
// {/* <div className="grid gap-y-4">
// {isData.map((item) => (
//     <div>
//         <CardExerciseNews item={item}></CardExerciseNews>
//         {/* {item.files.map((list)=>(

//     ))} */}
//     </div>
// ))}
// </div> */}
