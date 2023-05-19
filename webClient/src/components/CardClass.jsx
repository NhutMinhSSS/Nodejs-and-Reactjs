// import React from 'react';
// import { FolderOutlined, IdcardOutlined } from '@ant-design/icons';
// import iconUserSquare from '../img/user.png';
// import iconFolder from '../img/folder.png';
// import { Link, useNavigate } from 'react-router-dom';
// const CardClass = ({ item }) => {

//     const navigate = useNavigate();
//     function ClickPage() {
//         navigate('/class')
//     }

//     const { title, teacher, school_year, img } = item;
//     return (
//         <div className='border bg-slate-50 drop-shadow-2xl rounded-xl cursor-pointer ease-in duration-300 w-auto '>
//             <div className='p-5'>
//                 <p className='text-xl font-semibold hover:underline underline-offset-8'>
//                     {title}
//                 </p>
//                 <p> Niên khóa - {school_year} </p>
//                 <p className='mt-3'>{teacher}</p>

//                 <div className='w-14 h-14 float-right'>
//                     <img className='rounded-full' src={img} alt='Image' />
//                 </div>
//             </div>
//             <hr className='ml-3 w-[80%] ' />
//             <div className='mt-8 p-5 flex justify-between items-center'>
//                 <button
//                     className='bg-blue-400 rounded-3xl p-2 hover:bg-sky-700 font-semibold'
//                     onClick={ClickPage}
//                 >
//                     <Link to="/class" >Vào Lớp học</Link>
//                 </button>
//                 <span className='flex w-20 justify-around items-center'>
//                     <span className='w-12 h-12'><img className=' hover:bg-gray-200 p-2  rounded-xl flex items-center justify-center transition duration-150 ease-in-out cursor-pointer ' src={iconUserSquare} alt='Imge' /></span>
//                     <span className='w-12 h-12'><img className=' hover:bg-gray-200 p-2  rounded-xl flex items-center justify-center transition duration-150 ease-in-out cursor-pointer  ' src={iconFolder} alt='Imge' /></span>
//                 </span>
//             </div>
//         </div>
//     );
// };

// export default CardClass;
