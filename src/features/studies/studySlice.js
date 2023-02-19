import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchRecent, fetchStarred, fetchTrending } from '../../requests/study-api';

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
        studies: {}
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
        }
    }
})

export const useStudies = (state) => ({
    frontpage: state.studies.frontpage,
    map: state.studies.studies
})

export default studySlice.reducer;