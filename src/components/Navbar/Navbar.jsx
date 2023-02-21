import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUser, useUser } from '../../features/account/userSlice';
import { useAuth } from '../../features/authentication/authSlice';

import styles from './Navbar.module.css'

export default function Navbar() {
    const dispatch = useDispatch();
    const auth = useSelector(useAuth);
    const user = useSelector(useUser);

    const inititalize = () => {
        if(auth.status) {
            dispatch(getUser({auth: auth.token}))
        }
    }

    useEffect(inititalize, [auth.status]);

    return (
        <>
            <nav className={styles['side-bar']}>
                <div className={styles['content']}>
                    {user.status ? <Link>Logout</Link> : null}
                    {user.status ? <Link to={'/'}>My studies</Link> : <Link to={'/login'}>Login</Link>}
                    <div className={styles['logo']} />
                    <Link to={'/'}>Home</Link>
                </div>
            </nav>
            <nav className={styles['search']}>
                <form>
                    <input type='text' placeholder='Search studies' />
                    <button>Search</button>
                </form>
            </nav>
        </>
    )
}