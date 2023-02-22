import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, useUser } from '../../features/account/userSlice';
import { useAuth } from '../../features/authentication/authSlice';
import { addField, editField, getOwn, getStudy, useStudies } from '../../features/studies/studySlice';

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
                        return <TermField key={i} pair={pair} current={current} />
                    })
                }
                <TermNew current={current} />
            </div>
        </div>
    )
}

const TermField = ({pair, current}) => {
    const dispatch = useDispatch();
    const auth = useSelector(useAuth);

    const [value, setValue] = useState(pair.value);
    const [definition, setDefinition] = useState(pair.definition);
    const [status, setStatus] = useState('');
    const [button, setButton] = useState('');
    const [error, setError] = useState('');
    
    const onValueChange = (v) => {
        if(!v || !value) {
            setError('Value cannot be empty');
            return;
        }

        setError('');
        setValue(v);

        if(v != pair.value) {
            setStatus('You have unsaved changes');
            setButton('Save');
        } else {
            setStatus('');
            setButton('');
        }
    }

    const onDefinitionChange = (d) => {
        if(!d || !definition) {
            setError('Definition cannot be empty');
            return;
        }

        setError('');
        setDefinition(d);
        if(d != pair.definition) {
            setStatus('You have unsaved changes');
            setButton('Save');
        } else {
            setStatus('');
            setButton('');
        }
    }

    const onSave = () => {
        dispatch(editField({auth: auth.token, hash: current, pair: {id: pair.id, value: value, definition: definition}}))
    }

    const onRemove = () => {
        console.log('Remove!');
    }

    const onPairChanged = () => {
        setValue(pair.value);
        setDefinition(pair.definition);
        
        if(definition != pair.definition || value != pair.value) {
            setStatus('You have unsaved changes');
            setButton('Save');
        } else {
            setStatus('');
            setButton('');
        }
    }

    useEffect(onPairChanged, [pair]);

    return (
        <Field 
            value={value}
            definition={definition}
            status={status}
            button={button}
            error={error}
            onValueChange={onValueChange}
            onDefinitionChange={onDefinitionChange}
            onSave={onSave}
            onRemove={onRemove}
        />
    )
}

const Field = ({value, definition, status, button, error, onValueChange, onDefinitionChange, onSave, onRemove}) => {
    return (
        <div className={styles['term-field']}>
            <div className={styles['value']}>
                <label>Value</label>
                <input placeholder='Value' type='text' value={value} onChange={e => onValueChange(e.target.value)} />
                <h4>{error}</h4>
            </div>
            <div className={styles['definition']}>
                <label>Definition</label>
                <input placeholder='Definition' type='text' value={definition} onChange={e => onDefinitionChange(e.target.value)} />
                <h4>{status}</h4>
            </div>
            <div className={styles['options']}>
                <button onClick={() => onRemove()} className={styles['remove']}>Remove</button>
                <button onClick={() => onSave()}>{button}</button>
            </div>
        </div>
    )
}

const NewField = ({onCreate}) => {
    return (
        <form
            className={styles['term-new']}
            onClick={onCreate}
        >
            <h2>+</h2>
        </form>
    )
}

const TermNew = ({current}) => {
    const dispatch = useDispatch();
    const auth = useSelector(useAuth);

    const [value, setValue] = useState('');
    const [definition, setDefinition] = useState('');
    const [status, setStatus] = useState('Please input value and definition');
    const [button, setButton] = useState('');
    const [error, setError] = useState('');

    const [creating, setCreating] = useState(false);
    
    const onValueChange = (v) => {
        setValue(v);

        if(v && definition) {
            setStatus('Append new field');
            setButton('Create');
        } else {
            setStatus('');
            setButton('');
        }
    }

    const onDefinitionChange = (d) => {
        setDefinition(d);

        if(d && value) {
            setStatus('Append new field');
            setButton('Create');
        } else {
            setStatus('')
            setButton('');
        }
    }

    const onSave = () => {
        dispatch(addField({auth: auth.token, hash: current, pair: {value: value, definition: definition}}));
        setValue('');
        setDefinition('');
        setStatus('');
        setButton('');
        setError('');
        setCreating(false);
    }

    const onRemove = () => {
        setValue('');
        setDefinition('');
        setStatus('');
        setButton('');
        setError('');
        setCreating(false);
    }

    return (
        <>
            {
                creating ? 
                <Field 
                    value={value}
                    definition={definition}
                    status={status}
                    button={button}
                    error={error}
                    onValueChange={onValueChange}
                    onDefinitionChange={onDefinitionChange}
                    onSave={onSave}
                    onRemove={onRemove}
                />
                :
                <NewField onCreate={() => setCreating(true)} />
            }
        </>
    );
}
