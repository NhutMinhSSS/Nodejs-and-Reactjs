import React, { useState, useRef, useEffect } from 'react';
import iconUser from '../img/iconUser.svg';
const AddCard = () => {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const handleSubmit = (event) => {
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
  const handleChange = (event) => {
    setMessage(event.target.value);
  };
  return (
    <div>
      {!showForm ? (
        <div
          onClick={handleOpenForm}
          className='bg-neutral-200 h-20 m-15 shadow-2xl rounded-xl flex items-center'
        >
          <div className=' w-14 flex justify-center'>
            <img className='w-9 h-9' src={iconUser} alt='' />
          </div>
          <div className='font-medium hover:text-blue-400 cursor-pointer'>
            Đây là thông báo nội dung nào đó cho lớp học của bạn
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className='bg-neutral-200 h-40 m-15 shadow-2xl  rounded-2xl  '
        >
          <div className='flex items-center py-4'>
            <div className='w-14 flex justify-center'>
              <img className='w-9 h-9' src={iconUser} alt='' />
            </div>
            <input
              type='text'
              value={message}
              onChange={handleChange}
              className='w-full mr-2 p-2 h-10 rounded-2xl '
              placeholder='Nhập thông báo của bạn...'
            />
          </div>
          <div className=' flex justify-end items-end'>
            <button
              type='submit'
              className='bg-blue-500 text-white py-2 px-4 rounded'
            >
              Xác nhận
            </button>
            <button
              type='button'
              onClick={handleCancel}
              className=' bg-gray-300 ml-2 px-4 py-2 rounded'
            >
              Hủy
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default AddCard;
