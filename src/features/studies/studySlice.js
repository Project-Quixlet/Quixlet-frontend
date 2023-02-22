import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addStudyField, editStudyField, fetchOwn, fetchRecent, fetchStarred, fetchStudy, fetchTrending } from '../../requests/study-api';

export const getTrending = createAsyncThunk(
    'studies/getTrending',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const trending = thunkAPI.getState().studies.frontpage.trending;

            if(!trending.isLoading) return resolve({changed: false})

            fetchTrending()
                .then(list => {
                    return resolve({changed: true, list})
                })
                .catch(err => {
                    console.log(err);
                    return reject(err);
                })
        });
    }
)

export const getRecent = createAsyncThunk(
    'studies/getRecent',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const recent = thunkAPI.getState().studies.frontpage.recent;
            const auth = options['auth'];

            if(!recent.isLoading) return resolve({changed: false})

            fetchRecent(auth)
                .then(list => {
                    console.log(list);
                    return resolve({changed: true, list})
                })
                .catch(err => {
                    console.log(err);
                    return reject(err);
                })
        });
    }
)

export const getStarred = createAsyncThunk(
    'studies/getStarred',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const starred = thunkAPI.getState().studies.frontpage.starred;
            const auth = options['auth'];

            if(!starred.isLoading) return resolve({changed: false})

            fetchStarred(auth)
                .then(list => {
                    console.log(list);
                    return resolve({changed: true, list})
                })
                .catch(err => {
                    console.log(err);
                    return reject(err);
                })
        });
    }
)

export const getOwn = createAsyncThunk(
    'studies/getOwn',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const own = thunkAPI.getState().studies.editor.own;
            const auth = options['auth'];

            if(!own.isLoading) return resolve({changed: false})

            fetchOwn(auth)
                .then(list => {
                    console.log(list);
                    return resolve({changed: true, list})
                })
                .catch(err => {
                    console.log(err);
                    return reject(err);
                })
        });
    }
)

export const getStudy = createAsyncThunk(
    'studies/getStudy',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const map = thunkAPI.getState().studies.map;

            const auth = options['auth'] ?? null;
            const hash = options['hash'];

            fetchStudy(auth, hash)
                .then(study => {
                    return resolve({changed: true, study: study})
                })
                .catch(err => {
                    console.log(err);
                    return reject(err);
                })
        });
    }
)

export const editField = createAsyncThunk(
    'studies/editField',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const map = thunkAPI.getState().studies.map;

            const auth = options['auth'] ?? null;
            const hash = options['hash'];
            const pair = options['pair'];

            editStudyField(auth, hash, pair)
                .then(() => {
                    return resolve({changed: true, hash: hash, pair: pair})
                })
                .catch(err => {
                    console.log(err);
                    return reject(err);
                })
        });
    }
)

export const addField = createAsyncThunk(
    'studies/addField',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const map = thunkAPI.getState().studies.map;

            const auth = options['auth'] ?? null;
            const hash = options['hash'];
            const pair = options['pair'];

            addStudyField(auth, hash, pair)
                .then((res) => {
                    return resolve({changed: true, hash: hash, pair: {id: res.id, ...pair}})
                })
                .catch(err => {
                    console.log(err);
                    return reject(err);
                })
        });
    }
)

export const studySlice = createSlice({
    name: 'studies',
    initialState: {
        frontpage: {
            trending: {
                isLoading: true,
                list: []
            },
            recent: {
                isLoading: true,
                list: []
            },
            starred: {
                isLoading: true,
                list: []
            }
        },
        editor: {
            own: {
                isLoading: true,
                list: []
            },
            isLoading: false
        },
        studies: {},
        isLoading: false
    },
    reducers: {},
    extraReducers: {
        [getTrending.fulfilled]: (state, action) => {
            if(!action.payload.changed) {
                return;
            }

            const {list} = action.payload;
            state.frontpage.trending.isLoading = false;
            state.frontpage.trending.list = [...state.frontpage.trending.list, ...list];
        },
        [getRecent.fulfilled]: (state, action) => {
            if(!action.payload.changed) {
                return;
            }

            const {list} = action.payload;
            state.frontpage.recent.isLoading = false;
            state.frontpage.recent.list = [...state.frontpage.recent.list, ...list];
        },
        [getStarred.fulfilled]: (state, action) => {
            if(!action.payload.changed) {
                return;
            }

            const {list} = action.payload;
            state.frontpage.starred.isLoading = false;
            state.frontpage.starred.list = [...state.frontpage.starred.list, ...list];
        },
        [getOwn.fulfilled]: (state, action) => {
            if(!action.payload.changed) {
                return;
            }

            const {list} = action.payload;
            state.editor.own.isLoading = false;
            state.editor.own.list = [...state.editor.own.list, ...list];
        },
        [getStudy.fulfilled]: (state, action) => {
            if(!action.payload.changed) {
                return;
            }

            const { study } = action.payload;
            const { hash } = study;

            state.studies[hash] = {...state.studies[hash], ...study}
            state.isLoading = false;
        },
        [getStudy.pending]: (state, action) => {
            state.isLoading = true;
        },
        [editField.fulfilled]: (state, action) => {
            if(!action.payload.changed) {
                return;
            }

            const { hash, pair } = action.payload;

            const study = state.studies[hash];
            const idx = study.set.indexOf(study.set.find(p => p.id === pair.id));
            state.studies[hash].set[idx] = pair;
        },
        [addField.fulfilled]: (state, action) => {
            if(!action.payload.changed) {
                return;
            }
            
            const { hash, pair } = action.payload;
            state.studies[hash].set.push(pair);
            state.studies[hash].size += 1;
        },
    }
})

export const useStudies = (state) => ({
    frontpage: state.studies.frontpage,
    map: state.studies.studies,
    isLoading: state.studies.isLoading,
    editor: state.studies.editor
})

export default studySlice.reducer;