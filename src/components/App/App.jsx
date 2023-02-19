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

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path='/' element={<Frontpage />} />
                <Route path='/login' element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}