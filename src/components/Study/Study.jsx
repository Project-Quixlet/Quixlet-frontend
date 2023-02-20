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
            <StudyArea study={study} current={current} setCurrent={setCurrent} />
        </>
    )
}

const StudyInfo = ({study}) => {
    return (
        <div className={styles['study-title']}>
            <h1>{study.name}</h1>
            <h3>{`By ${study.creator}`}</h3>
            <div className={styles['study-info']}>
                <h4>{`${study.size} ${study.size == 1 ? 'term' : 'terms'}`}</h4>
                <h4>{`${study.stars} ${study.stars == 1 ? 'star' : 'stars'}`}</h4>
            </div>
        </div>
    )
}

const StudyArea = ({study, current, setCurrent}) => {
    
    const pair = study.set[current];

    const next = () => {
        if(current < study.set.length - 1) setCurrent(current + 1);
    }

    const previous = () => {
        if(current > 0) setCurrent(current - 1);
    }


    return (
        <div className={styles['study-area']}>
            <WriteMode study={study} current={current} pair={pair} next={next} previous={previous}/>
        </div>
    )
}

const CardMode = ({study, pair, current, next, previous}) => {
    const [visible, setVisible] = useState(false);
    if(!pair) return <></>

    const percentage = 100 * ((current + 1) / study.set.length);

    return (
        <div className={styles['card-mode']}>   
            <h1 onClick={() => setVisible(!visible)}>{visible ? pair.definition : pair.value}</h1>
            <h2>Click the term to reveal the definition</h2>
            <div className={styles['card-navigation']}>
                <button disabled={current == 0} onClick={previous}>Previous</button>
                <br />
                <button disabled={current == study.set.length - 1} onClick={next}>Next</button>
            </div>
            <div className={styles['progress']} style={{transform: `scale(${percentage}%, 100%)`}} />
        </div>  
    )
}

const MultipleMode = ({study, pair, next}) => {
    const [status, setStatus] = useState('');
    if(!pair) return <></>

    const randomized = shuffle([pair.definition, ...shuffle(study.set.filter(p => p.value != pair.value)).slice(0, 3).map(p => p.definition)]);

    const validate = (query) => {
        if(pair.definition == query) {
            setStatus('');
            next();
            return;
        }

        setStatus('Incorrect');
    }

    return (
        <div className={styles['multiple-mode']}>
            <h1>{pair.value}</h1>
            <div className={styles['choices']}>
                {
                    randomized.map((term, i) => {
                        return (
                            <button className={styles['choice']} key={i} onClick={() => validate(term)}>{term}</button>
                        )
                    })
                }
            </div>
            <h4>{status}</h4>
        </div>  
    )
}

const WriteMode = ({study, pair, next}) => {
    const [status, setStatus] = useState('');
    const [answer, setAnswer] = useState('');
    const [hint, setHint] = useState([]);
    const [failed, setFailed] = useState(false);
    const [retyping, setRetyping] = useState(false);

    if(!pair) return <></>

    const onUpdate = (value) => {
        setAnswer(value)
            
        if(retyping && value == pair.definition) {
            setAnswer('');
            setRetyping(false);
            next();
            return;
        }
    }

    const validate = () => {
        if(answer.length == 0 || retyping) return;
        
        if(pair.definition == answer || failed) {
            setStatus('');
            setAnswer('');
            setHint([]);
            setFailed(false);
            next();
            return;
        }

        setFailed(true);
        setStatus('Incorrect - the right one was:');
        setHint(Array.from(pair.definition))
    }

    const requestHint = () => {
        const word = Array.from(pair.definition);

        if(hint.length == 0) {
            let h = [word.at(0), ...Array(word.length - 1).fill('_', 0)];
            const idxs = indexesOf(word, ' ');
            idxs.forEach(i => {h[i] = ' '})
            setHint(h);
            return;
        } else {
            const p = word.filter(c => !hint.includes(c));
            if(p.length == 0) return;

            const rnd = p[Math.floor(Math.random() * p.length)]
            const idxs = indexesOf(word, rnd);

            // Create shallow copy
            let h = [...hint];
            idxs.forEach(i => {h[i] = word[i]})

            console.log(h);
            setHint(h);
        }
    }

    const retype = () => {
        setAnswer('');
        setStatus('');
        setHint([]);
        setRetyping(true);
    }

    return (
        <div className={styles['write-mode']}>
            <h1>{retyping ? pair.definition : pair.value}</h1>
            <h4>{status}</h4>
            <ul>{hint.map((c, i) => <a key={i}>{c}</a>)}</ul>

            <form onSubmit={e => {e.preventDefault(); validate()}}>
                <input placeholder={retyping ? 'Noituus' : 'Your answer'} type='text' value={answer} onChange={e => onUpdate(e.target.value)} />
                <button disabled={answer.length == 0}>Submit</button>
            </form>
            <div className={styles['options']}>
                <button onClick={retype}>Don't know?</button>
                <button onClick={requestHint} >Request hint</button>
            </div>  
        </div>
    )
}

const shuffle = unshuffled => unshuffled
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

 const indexesOf = (l, n) => 
    l.reduce(
      (acc, v, i) => (v === n && acc.push(i), acc),
    []);