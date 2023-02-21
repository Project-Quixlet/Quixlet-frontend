import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../features/authentication/authSlice';
import { login as loginRequest } from '../../features/authentication/authSlice';
import { redirect, useNavigate } from 'react-router-dom';

import styles from './Login.module.css'

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector(useAuth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        dispatch(loginRequest({username, password}))
    }

    const onLogin = () => {
        if(auth.status) {
            navigate('/');
        }
    }

    useEffect(onLogin, [auth.isLoading])

    return (
        <div className={styles['content']}>
            <form onSubmit={e => {e.preventDefault(); login()}}>
                <h2>Username</h2>
                <input placeholder='username' type='text' onChange={e => setUsername(e.target.value)} />
                <h2>Password</h2>
                <input placeholder='password' type='password' onChange={e => setPassword(e.target.value)} />
                <button>Login</button>
            </form>
            <h2>{JSON.stringify(auth.status)}</h2>
        </div>
    )
}