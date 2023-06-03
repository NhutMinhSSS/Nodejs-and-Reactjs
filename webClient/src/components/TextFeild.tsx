import React, { useState } from 'react';

interface TextFeildProps {
  placeholder: string;
  value: string;
  className: string;
  onChange: (value: string) => void;
}
const TextFeild: React.FC<TextFeildProps> = ({
  placeholder,
  value,
  className,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);
  const handleFocus = () => {
    setFocused(true);
  };
  const handleBlur = () => {
    setFocused(false);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  return (
    <div className={`text-field ${focused ? 'focused' : ''}`}>
      <input
        type='text'
        className={`${className} focus:outline-none `}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextFeild;
