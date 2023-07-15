import React, { useState } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { MdMoreVert } from 'react-icons/md';

interface Item {
    id: number;
    name: string;
}

interface Props {
    item: Item;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

const CustomButton: React.FC<Props> = ({ item, onDelete, onEdit }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const handleMenuClick = (e: any) => {
        if (e.key === 'delete') {
            onDelete(item.id);
        } else if (e.key === 'edit') {
            onEdit(item.id);
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="delete">Xóa</Menu.Item>
            <Menu.Item key="edit">Sửa</Menu.Item>
        </Menu>
    );
    return (
        <div
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            <Dropdown
                overlay={menu}
                trigger={['click']}
                visible={dropdownVisible}
                onVisibleChange={(visible) => setDropdownVisible(visible)}
            >
                <button className="m-auto p-1 w-8 h-8 flex items-center justify-center hover:bg-slate-300 focus:bg-slate-300  rounded-full duration-300">
                    <MdMoreVert size={20} />
                </button>
            </Dropdown>
        </div>
    );
};

export default CustomButton;
