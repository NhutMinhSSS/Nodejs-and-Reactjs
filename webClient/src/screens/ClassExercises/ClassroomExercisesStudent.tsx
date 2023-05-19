import React from 'react';
import CreatePost from '../CreatePost';
import { Link } from 'react-router-dom';

const ClassroomExercisesStudent = () => {
  const ExerciseList = [
    {
      Exercise: 'Bài 1',
      PostDate: 'Đã đăng vào 19 tháng 9 năm 2022',
    },
    {
      Exercise: 'Bài 2',
      PostDate: 'Đã đăng vào 20 tháng 9 năm 2022',
    },
    {
      Exercise: 'Bài 3',
      PostDate: 'Đã đăng vào 21 tháng 9 năm 2022',
    },

    {
      Exercise: 'Đề cương',
      PostDate: 'Đã đăng vào 19 tháng 9 năm 2022',
    },
    {
      Exercise: 'Bài 1',
      PostDate: 'Đã đăng vào 19 tháng 9 năm 2022',
    },
  ];
  return (
    <section className='h-screen'>
      {ExerciseList.map((item) => (
        <div className=''>
          <Link to='/detailExercise'>
            <div className='grid grid-cols-2 gap-x-72 mt-7 text-lg hover:bg-slate-200 delay-100 duration-300  p-4 rounded-xl text-black'>
              <p>{item.Exercise}</p>
              <p className='text-xs'>{item.PostDate}</p>
            </div>
          </Link>
        </div>
      ))}
    </section>
  );
};

export default ClassroomExercisesStudent;
