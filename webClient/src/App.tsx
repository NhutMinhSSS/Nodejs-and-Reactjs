import './App.css';
import React from 'react';
import Content from './page/Main/HomeScreen';
import JoinClassedStudent from './page/JoinClassed/JoinClassedStudent';
import JoinClassedTeacher from './page/JoinClassed/JoinClassedTeacher';

import Login from './page/Login/Login';
import HomeScreen from './page/Main/HomeScreen';
import { Navigate, Route, Routes } from 'react-router-dom';
import DetailExcercise from './screens/DetailExercise/DetailExcercise';
import Dashboard from './page/Dashboard/Dashboard';
import AppClass from './page/Dashboard/AppClass';
import AppClassSection from './page/Dashboard/AppClassSection';
import AppFaculty from './page/Dashboard/AppFaculty';
import AppGenre from './page/Dashboard/AppGenre';
import AppStudent from './page/Dashboard/AppStudent';
import AppSubject from './page/Dashboard/AppSubject';
import AppTeacher from './page/Dashboard/AppTeacher';

import HomeScreenStudent from './page/Main/HomeScreenStudent';

function App() {
    return (
        <>
            <Routes>
                <Route
                    path="/admin"
                    element={
                        <div>
                            <Dashboard />
                        </div>
                    }
                >
                    <Route
                        path="/admin/app-class"
                        element={
                            <div>
                                <AppClass />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-class-section"
                        element={
                            <div>
                                <AppClassSection />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-faculty"
                        element={
                            <div>
                                <AppFaculty />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-genre"
                        element={
                            <div>
                                <AppGenre />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-student"
                        element={
                            <div>
                                <AppStudent />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-subject"
                        element={
                            <div>
                                <AppSubject />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-teacher"
                        element={
                            <div>
                                <AppTeacher />
                            </div>
                        }
                    ></Route>
                </Route>
                <Route
                    path="/"
                    element={
                        <div>
                            <Login />
                        </div>
                    }
                />
                {/* <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
                <Route path="/" element={isLoggedIn ? <HomeScreen /> : <Navigate to="/giang-vien" />} />
                <Route path="*" element={<NotFound />} /> */}
                <Route
                    path="/giang-vien"
                    element={
                        <div>
                            <HomeScreen />
                        </div>
                    }
                />
                <Route
                    path="/giang-vien/class/:classroom_id"
                    element={
                        <div>
                            <JoinClassedTeacher />
                        </div>
                    }
                />
                <Route path="/detail" element={<DetailExcercise />} />
                <Route
                    path="/sinh-vien"
                    element={
                        <div>
                            <HomeScreenStudent />
                        </div>
                    }
                />
                <Route
                    path="/sinh-vien/class/:id"
                    element={
                        <div>
                            <JoinClassedStudent />
                        </div>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
