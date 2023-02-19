import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTrending, useStudies } from '../../features/studies/studySlice';


import styles from './Frontpage.module.css'

export default function Frontpage() {
    const dispatch = useDispatch();

    const initialize = () => {
        dispatch(getTrending())
    }

    useEffect(initialize, []);

    return (
        <div className={styles['content']}>
            <div className={styles['trending-list']}>
                <TrendingList />
            </div>
        </div>
    )
}

const TrendingList = () => {
    const studies = useSelector(useStudies);
    const trending = studies.frontpage.trending;

    if(trending.isLoading) return <>Loading...</>

    return (
        <>
            {trending.list.map(study => {
                return <StudyObject key={study.hash} study={study} />
            })}
        </>
    )
}

const StudyObject = ({study}) => {
    return (
        <div className={styles['study-object']}>
            <h1>{study.name}</h1>
            <h3>{study.creator}</h3>
            <div className={styles['study-info']}>
                <h4>{`${study.size} ${study.size == 1 ? 'term' : 'terms'}`}</h4>
                <h4>{`${study.stars} ${study.stars == 1 ? 'star' : 'stars'}`}</h4>
            </div>
        </div>
    )
}