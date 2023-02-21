import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, useUser } from '../../features/account/userSlice';
import { useAuth } from '../../features/authentication/authSlice';
import { getOwn, getStudy, useStudies } from '../../features/studies/studySlice';

import styles from './Editor.module.css'

export default function Editor() {
    const dispatch = useDispatch();
    const auth = useSelector(useAuth);

    const [current, setCurrent] = useState(null);

    const inititalize = () => {
        dispatch(getOwn({auth: auth.token}))
    }

    const onLoad = (hash) => {
        dispatch(getStudy({auth: auth.token, hash}))
        setCurrent(hash);
    }

    useEffect(inititalize, []);

    return (
        <div className={styles['content']}>
            <div className={styles['side-bar']}>
                <StudyList onLoad={e => onLoad(e)} />   
            </div>
            <EditorArea current={current} />
        </div>
    )
}

const StudyList = ({onLoad}) => {
    const studies = useSelector(useStudies);

    if(studies.editor.own.isLoading) return <>Loading...</>

    return (
        <div className={styles['study-list']}>
            {studies.editor.own['list'].map((study, i) => {
                return <StudyObject key={i} study={study} onLoad={onLoad} />
            })}
        </div>
    )
}

const StudyObject = ({study, onLoad}) => {

    return (
        <div className={styles['study-object']} onClick={() => onLoad(study.hash)}>
            <div className={styles['study-info']}>
                <h1>{study.name}</h1>
                <h3>{`${study.size} ${study.size == 1 ? 'term' : 'terms'}`}</h3>
            </div>
        </div>
    )
}

const EditorArea = ({current}) => {
    const studies = useSelector(useStudies);

    if(!current) return <></>
    const study = studies.map[current];

    if(!study) return <>loading...</>

    return (
        <div className={styles['editor']}>
            <h1>{study.name}</h1>
            <div className={styles['terms']}>
                {
                    study.set.map((pair, i) => {
                        return <TermField key={i} pair={pair} />
                    })
                }
            </div>
        </div>
    )
}

const TermField = ({pair}) => {
    //console.log(pair);
    return (
        <form className={styles['term-field']}>
            <div className={styles['value']}>
                <label>Value</label>
                <input type='text' value={pair.value} />
                <h4></h4>
            </div>
            <div className={styles['definition']}>
                <label>Definition</label>
                <input type='text' value={pair.definition} />
                <h4></h4>
            </div>
            <div className={styles['options']}>
                <button className={styles['remove']}>Remove</button>
                <button ></button>
            </div>
        </form>
    )
}
