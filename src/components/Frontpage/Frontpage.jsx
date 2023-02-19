import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTrending, useStudies } from '../../features/studies/studySlice';


import styles from './Frontpage.module.css'

export default function Frontpage() {
    const dispatch = useDispatch();
    const studies = useSelector(useStudies)

    const initialize = () => {
        dispatch(getTrending())
    }

    useEffect(initialize, []);

    return (
        <div className={styles['content']}>
            Frontpage
        </div>
    )
}