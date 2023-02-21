import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    BrowserRouter,
    Routes,
    Route,
    Router,
} from "react-router-dom";

import Navbar from '../Navbar/Navbar';
import Frontpage from '../Frontpage/Frontpage';
import Login from '../Login/Login';
import Study from '../Study/Study';
import Editor from '../Editor/Editor';
import { useAuth } from '../../features/authentication/authSlice';

export default function App() {
    const auth = useSelector(useAuth);

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path='/' element={<Frontpage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/editor' element={auth.status ? <Editor /> : <Login />} />
                <Route path='/study/:id' element={<Study />} />
            </Routes>
        </BrowserRouter>
    )
}