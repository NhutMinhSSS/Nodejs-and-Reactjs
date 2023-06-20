import React from 'react';
import { Modal } from 'antd';

interface ErrorModalProps {
    errorMessage: string;
    onOk: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ errorMessage, onOk }) => {
    return (
        <Modal title="Error" visible={true} onCancel={onOk} onOk={onOk} okText="OK">
            {errorMessage}
        </Modal>
    );
};

export default ErrorModal;
