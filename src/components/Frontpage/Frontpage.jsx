import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../features/authentication/authSlice';
import { getRecent, getStarred, getTrending, useStudies } from '../../features/studies/studySlice';
import { useNavigate } from 'react-router-dom';


import styles from './Frontpage.module.css'
import { useUser } from '../../features/account/userSlice';

export default function Frontpage() {
    const dispatch = useDispatch();
    const auth = useSelector(useAuth);
    const user = useSelector(useUser);

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
            <h1>{user.status ? `Welcome, ${user.username}` : null}</h1>
            <div className={styles['category']}>
                <h1>Trending sets</h1>
                <TrendingList />
            </div>
            <div className={styles['category']}>
                <h1>Recent sets</h1>
                <RecentList />
            </div>
            <div className={styles['category']}>
                <h1>Starred sets</h1>
                <StarredList />
            </div>
        </div>
    )
}

const TrendingList = () => {
    const studies = useSelector(useStudies);
    const trending = studies.frontpage.trending;

    if(trending.isLoading) return <>Loading...</>

    return (
        <div className={styles['study-list']}>
            {trending.list.map((study, i) => {
                return (
                    <StudyObject study={study} />  
                )
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
    const starred = studies.frontpage.starred;

    if(!auth.status) return <h1>You must login to see your starred studies</h1>
    if(starred.isLoading) return <>Loading...</>

    return (
        <div className={styles['study-list']}>
            {starred.list.map(study => {
                return <StudyObject key={study.hash} study={study} />
            })}
            {starred.list.length === 0 ? <h2>You haven't starred any study</h2> : null} 
        </div>
    )
}

const StudyObject = ({study}) => {
    const navigate = useNavigate();
    return (
        <div className={styles['study-object']} onClick={() => navigate(`/study/${study.hash}`)}>
            <div className={styles['study-info']}>
                <h1>{study.name}</h1>
                <h3>{`${study.size} ${study.size == 1 ? 'term' : 'terms'}`}</h3>
                <h4>{`By ${study.creator}`}</h4>
                <h4>{`${study.stars} ${study.stars == 1 ? 'star' : 'stars'}`}</h4>
            </div>
        </div>
    )
}