import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../features/authentication/authSlice';
import { getRecent, getStarred, getTrending, useStudies } from '../../features/studies/studySlice';


import styles from './Frontpage.module.css'

export default function Frontpage() {
    const dispatch = useDispatch();
    const auth = useSelector(useAuth);

    const initialize = () => {
        dispatch(getTrending())
        if (auth.status) {
            dispatch(getRecent({auth: auth.token}))
            dispatch(getStarred({auth: auth.token}))
        }
    }

    useEffect(initialize, []);

    return (
        <div className={styles['content']}>
            <h1>Trending sets</h1>
            <TrendingList />
            <h1>Recent sets</h1>
            <RecentList />
            <h1>Starred sets</h1>
            <StarredList />
        </div>
    )
}

const TrendingList = () => {
    const studies = useSelector(useStudies);
    const trending = studies.frontpage.trending;

    if(trending.isLoading) return <>Loading...</>

    return (
        <div className={styles['study-list']}>
            {trending.list.map(study => {
                return <StudyObject key={study.hash} study={study} />
            })}
        </div>
    )
}

const RecentList = () => {
    const auth = useSelector(useAuth);
    const studies = useSelector(useStudies);
    const recent = studies.frontpage.recent;

    if(!auth.status) return <h1>You must login to see your recent studies</h1>
    if(recent.isLoading) return <>Loading...</>

    return (
        <div className={styles['study-list']}>
            {recent.list.map(study => {
                return <StudyObject key={study.hash} study={study} />
            })}
            {recent.list.length === 0 ? <h2>Previously studied sets will appear here</h2> : null} 
        </div>
    )
}

const StarredList = () => {
    const auth = useSelector(useAuth);
    const studies = useSelector(useStudies);
    const starred = studies.frontpage.recent;

    if(!auth.status) return <h1>You must login to see your starred studies</h1>
    if(starred.isLoading) return <>Loading...</>

    return (
        <div className={styles['study-list']}>
            <h1>Starred sets</h1>
            {starred.list.map(study => {
                return <StudyObject key={study.hash} study={study} />
            })}
            {starred.list.length === 0 ? <h2>You haven't starred any study</h2> : null} 
        </div>
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