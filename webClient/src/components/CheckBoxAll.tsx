import React, { useState, useEffect } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

type CheckBoxAllProps = {
    options: { id: number, firstName: string; lastName: string; icon: React.ReactNode }[];
    onChange: (selectedOptions: number[], selectAll: boolean) => void;
};

const CheckBoxAll: React.FC<CheckBoxAllProps> = ({ options, onChange }) => {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
  
    useEffect(() => {
      const initialOptions = options.map((option) => option.id);
      setSelectedOptions(initialOptions);
      setSelectAll(false);
    }, [options]);
  
    useEffect(() => {
      const allSelected = options.every((option) => selectedOptions.includes(option.id));
      setSelectAll(allSelected);
    }, [selectedOptions, options]);
  
    const handleOptionChange = (option: number) => {
        const updatedOptions = selectedOptions.includes(option)
          ? selectedOptions.filter((item) => item !== option)
          : [...selectedOptions, option];
      
        setSelectedOptions(updatedOptions);
        const allSelected = options.every((option) => updatedOptions.includes(option.id));
        setSelectAll(allSelected);
        onChange(updatedOptions, allSelected);
      };
  
    const handleSelectAll = () => {
      const updatedOptions = selectAll ? [] : options.map((option) => option.id);
      setSelectedOptions(updatedOptions);
      onChange(updatedOptions, !selectAll);
    };
  
    return (
      <div className="p-2">
        <label className="flex items-center flex-row gap-x-2 text-base">
          <input className="mt-1" type="checkbox" checked={selectAll} onChange={handleSelectAll} />
          Chọn tất cả
        </label>
        <br />
        {options.map((option) => (
          <label key={option.id} className="flex items-center flex-row p-2 gap-x-2">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option.id)}
              onChange={() => handleOptionChange(option.id)}
            />
            {option.lastName + option.lastName}
          </label>
        ))}
      </div>
    );
  };

export default CheckBoxAll;
