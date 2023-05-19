// import React from 'react';
// import list from '../../data';
// import HeaderHome from '../HeaderHome/HeaderHome';
// import iconUserSquare from '../../img/user.png';
// import iconFolder from '../../img/folder.png';
// import { Link } from 'react-router-dom';

// const HomeScreen = (item) => {
//   return (
//     <>
//       <HeaderHome />
//       <section className=' grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 container mx-auto  gap-x-8 gap-y-12 m-auto mt-8 p-4 '>
//         {list.map(() => (
//           <div className='border bg-slate-50 drop-shadow-2xl rounded-xl cursor-pointer ease-in duration-300 w-auto '>
//             <div className='p-5'>
//               <Link
//                 className='text-xl font-semibold hover:underline underline-offset-8'
//                 to={`class/${item.title.replace(/\s+/g, '-')}`}
//               >
//                 {item.title}
//               </Link>
//               <p> Niên khóa - {item.school_year} </p>
//               <p className='mt-3'>{item.teacher}</p>

//               <div className='w-14 h-14 float-right'>
//                 <img className='rounded-full' src={item.img} alt='Image' />
//               </div>
//             </div>
//             <hr className='ml-3 w-[80%] ' />
//             <div className='mt-8 p-5 flex justify-between items-center'>
//               <span className='flex w-20 justify-around items-center'>
//                 <span className='w-12 h-12'>
//                   <img
//                     className=' hover:bg-gray-200 p-2  rounded-xl flex items-center justify-center transition duration-150 ease-in-out cursor-pointer '
//                     src={iconUserSquare}
//                     alt='Imge'
//                   />
//                 </span>
//                 <span className='w-12 h-12'>
//                   <img
//                     className=' hover:bg-gray-200 p-2  rounded-xl flex items-center justify-center transition duration-150 ease-in-out cursor-pointer  '
//                     src={iconFolder}
//                     alt='Imge'
//                   />
//                 </span>
//               </span>
//             </div>
//           </div>
//         ))}
//       </section>
//     </>
//   );
// };

// export default HomeScreen;

import React from 'react';
import list from '../../data';
import HeaderHome from '../HeaderHome/HeaderHome';
import iconUserSquare from '../../img/user.png';
import iconFolder from '../../img/folder.png';
import { Link } from 'react-router-dom';

interface Item {
  id: number;
  title: string;
  school_year: string;
  teacher: string;
  img: string;
}

const HomeScreen: React.FC = () => {
  return (
    <>
      <HeaderHome />

      {/* grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 container mx-auto gap-x-8 gap-y-12 m-auto mt-8 p-4 */}
      <section className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4  gap-x-8 gap-y-12  m-auto mt-12 px-12 '>
        {list.map((item: Item) => (
          <div
            className='border bg-slate-50 drop-shadow-2xl rounded-lg cursor-pointer ease-in duration-300 w-auto'
            key={item.id}
          >
            <div className='p-5'>
              <Link
                className='text-xl font-semibold hover:underline underline-offset-[5px]'
                to={`class/${item.title.replace(/\s+/g, '-')}`}
              >
                {item.title}
              </Link>
              <p> Niên khóa - {item.school_year} </p>
              <p className='mt-3'>{item.teacher}</p>

              <div className='w-14 h-14 float-right'>
                <img className='rounded-full' src={item.img} alt='Image' />
              </div>
            </div>
            <hr className='ml-3 w-[80%]' />
            <div className='mt-8 p-5 flex justify-between items-center'>
              <span className='flex w-20 justify-around items-center'>
                <span className='w-12 h-12'>
                  <img
                    className='hover:bg-gray-200 p-2 rounded-xl flex items-center justify-center transition duration-150 ease-in-out cursor-pointer'
                    src={iconUserSquare}
                    alt='Image'
                  />
                </span>
                <span className='w-12 h-12'>
                  <img
                    className='hover:bg-gray-200 p-2 rounded-xl flex items-center justify-center transition duration-150 ease-in-out cursor-pointer'
                    src={iconFolder}
                    alt='Image'
                  />
                </span>
              </span>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default HomeScreen;
