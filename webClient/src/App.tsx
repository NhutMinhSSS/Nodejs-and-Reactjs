import './App.css';
import React from 'react';
import Content from './page/Main/HomeScreen';
import JoinClassedStudent from './page/JoinClassed/JoinClassedStudent';
import JoinClassedTeacher from './page/JoinClassed/JoinClassedTeacher';

import Login from './page/Login/Login';
import HomeScreen from './page/Main/HomeScreen';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            <div>
              <Login />
            </div>
          }
        />
        <Route
          path='/giang-vien'
          element={
            <div>
              <HomeScreen />
            </div>
          }
        />
        <Route
          path='/giang-vien/class/:id'
          element={
            <div>
              <JoinClassedTeacher />
            </div>
          }
        />
        <Route
          path='/sinh-vien'
          element={
            <div>
              <HomeScreen />
            </div>
          }
        />
        <Route
          path='/sinh-vien/class/:id'
          element={
            <div>
              <JoinClassedStudent />
            </div>
          }
        />

        {/* <Route
          path='quiz'
          element={
            <div>
              <QuizCreator />
            </div>
          }
        ></Route> */}
      </Routes>
    </>
  );
}

export default App;
