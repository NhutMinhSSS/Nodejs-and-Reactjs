import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ErrorModal = ({ errorMessage }: { errorMessage: string }) => {
    const navigate = useNavigate();

    useEffect(() => {
        Modal.error({
            title: 'Error',
            content: errorMessage,
            okText: 'OK',
            onOk: () => {
                navigate('/login');
            },
        });
    }, [errorMessage, navigate]);

    return null;
};

export default ErrorModal;
