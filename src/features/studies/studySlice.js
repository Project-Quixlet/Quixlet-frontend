import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchTrending } from '../../requests/study-api';

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
            favorite: {
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
            console.log(list);
        }
    }
})

export const useStudies = (state) => ({
    frontpage: state.studies.frontpage,
    map: state.studies.studies
})

export default studySlice.reducer;