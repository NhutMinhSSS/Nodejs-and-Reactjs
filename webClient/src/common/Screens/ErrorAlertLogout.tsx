import { Modal } from 'antd';

const showUnauthorizedPopup = (title: any, content: any) => {
    Modal.error({
        title: title,
        className: 'custom-modal-alert',
        content: content,
        okText: 'OK',
        onOk: () => {
            // Xử lý đăng xuất và chuyển về trang login
            localStorage.removeItem('token');
            window.location.replace('/'); // Chuyển hướng về trang login
        },
    });
};
export default showUnauthorizedPopup;
