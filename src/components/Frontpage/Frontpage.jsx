import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';


import styles from './Frontpage.module.css'

export default function Frontpage() {
    return (
        <div className={styles['content']}>
            Frontpage
        </div>
    )
}