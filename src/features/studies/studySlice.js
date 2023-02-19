import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getTrending = createAsyncThunk(
    'studies/getTrending',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                return resolve({yeet: "yeet"});
            }, 1000);
        });
    }
)

export const studySlice = createSlice({
    name: 'studies',
    initialState: {
        frontpage: {
            recent: {
                isLoading: true,
                list: []
            },
            trending: {
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
            console.log("yeet!");
        }
    }
})

export const useStudies = (state) => ({
    frontpage: state.studies.frontpage,
    map: state.studies.studies
})

export default studySlice.reducer;