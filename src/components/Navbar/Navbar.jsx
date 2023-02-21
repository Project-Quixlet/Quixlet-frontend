import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import styles from './Navbar.module.css'

export default function Navbar() {
    return (
        <>
            <nav className={styles['navbar']}>
                <div className={styles['side-bar']}>
                    <Link to={'/'}>Home</Link>
                    <Link to={'/login'}>Login</Link>
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