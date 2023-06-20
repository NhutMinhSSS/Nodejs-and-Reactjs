import { Modal } from 'antd';
import ErrorModal from '../Screens/ErrorModal';
import { useNavigate } from 'react-router-dom';
import '../exception/style.scss';
interface UnauthorizedErrorProps {
    response: {
        data: any;
        status: number;
    };
    navigate: (path: string) => void;
}

const UnauthorizedError: React.FC<UnauthorizedErrorProps> = ({ response, navigate }) => {
    // const handleLogout = () => {
    //     // Thực hiện đăng xuất token tại đây
    //     // Xóa token từ lưu trữ hoặc thực hiện các bước đăng xuất khác
    //     localStorage.removeItem('token');
    //     navigate('/');

    //     // Chuyển hướng đến trang login
    // };

    if (response && response.status === 401) {
        const tokenError = ['Token is not provided', 'Token is invalid', 'Token is expired'];
        if (tokenError.includes(response.data.error_message)) {
            // Hiển thị thông báo lỗi
            const errorMessage = response.data.error_message;
            Modal.error({
                title: 'Error',
                content: errorMessage,
                okText: 'OK',
                className: 'custom-modal-alert',
                // onOk: handleLogout, // Gọi hàm handleLogout khi người dùng nhấp vào nút "OK"
            });
            return <ErrorModal errorMessage={errorMessage} />;
        }
    }

    return null;
};

export default UnauthorizedError;
