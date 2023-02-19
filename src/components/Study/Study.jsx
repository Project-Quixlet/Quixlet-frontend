import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../features/authentication/authSlice';
import { getStudy, useStudies } from '../../features/studies/studySlice';

import styles from './Study.module.css'

export default function Study() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const auth = useSelector(useAuth);

    const studies = useSelector(useStudies);


    const [current, setCurrent] = useState(0);

    const initialize = () => {
        dispatch(getStudy({auth: auth.token, hash: id}))
    }

    useEffect(initialize, []);

    return (
        <div className={styles['content']}>
            <StudySet id={id} current={current} setCurrent={e => setCurrent(e)}/>
        </div>
    )
}

const StudySet = ({id, terms, current, setCurrent}) => {
    const studies = useSelector(useStudies);
    const study = studies.map[id];

    if(!study) return <>Loading...</>;

    return (
        <>
            <StudyInfo study={study} />
            <StudyCard study={study} current={current} setCurrent={setCurrent} />
        </>
    )
}

const StudyInfo = ({study}) => {
    return (<div className={styles['study-title']}>
        <h1>{study.name}</h1>
        <h3>{`By ${study.creator}`}</h3>
        <div className={styles['study-info']}>
            <h4>{`${study.size} ${study.size == 1 ? 'term' : 'terms'}`}</h4>
            <h4>{`${study.stars} ${study.stars == 1 ? 'star' : 'stars'}`}</h4>
        </div>
    </div>)
}

const StudyCard = ({study, current, setCurrent}) => {
    
    const pair = study.set[current];

    const next = () => {
        if(current < study.set.length - 1) setCurrent(current + 1);
    }

    const previous = () => {
        if(current > 0) setCurrent(current - 1);
    }


    return (
        <div className={styles['study-card']}>
            <MultipleMode study={study} pair={pair} next={next} previous={previous}/>
        </div>
    )
}

const CardMode = ({pair, next, previous}) => {
    const [visible, setVisible] = useState(false);
    if(!pair) return <></>
    return (
        <div className={styles['card-mode']}>   
            <h1 onClick={() => setVisible(!visible)}>{visible ? pair.definition : pair.value}</h1>
            <div className={styles['card-navigation']}>
                <button onClick={previous}>Previous</button>
                <br />
                <button onClick={next}>Next</button>
            </div>
        </div>  
    )
}

const MultipleMode = ({study, pair, next, previous}) => {
    const [status, setStatus] = useState('');
    if(!pair) return <></>

    const randomized = shuffle([pair.definition, ...shuffle(study.set.filter(p => p.value != pair.value)).slice(0, 3).map(p => p.definition)]);

    const validate = (query) => {
        if(pair.definition == query) {
            console.log('correct!');
            next();
            return;
        }

        console.log('nope')
    }

    return (
        <div className={styles['multiple-mode']}>
            <h1>{pair.value}</h1>
            {
                randomized.map((term, i) => <div key={i}><button onClick={() => validate(term)}>{term}</button><br /></div> )
            }
            <h4></h4>
        </div>  
    )
}

const shuffle = unshuffled => unshuffled
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);