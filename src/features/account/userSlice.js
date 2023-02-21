import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUserInfo, login as loginRequest } from '../../requests/study-api';
import { getCookie } from '../../requests/utility';

export const getUser = createAsyncThunk(
    'user/getUser',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const auth = options['auth'];
            console.log('fetching..');

            fetchUserInfo(auth)
                .then(user => {
                    return resolve({changed: true, user: user});
                })
                .catch(err => {
                    console.error(err);
                    return reject(err);
                })
        });
    }
)


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: null,
        isLoading: false
    },
    reducers: {},
    extraReducers: {
        [getUser.fulfilled]: (state, action) => {
            if(!action.payload.changed) {
                return;
            }

            const { username } = action.payload['user'];

            state.username = username;
            state.isLoading = false;
        },
        [getUser.pending]: (state, action) => {
            state.isLoading = true;
        },
        [getUser.pending]: (state, action) => {
            state.isLoading = false;
        },
    }
})

export const useUser = (state) => ({
    username: state.user.username,
    status: !(!state.user.username),
    isLoading: state.user.isLoading,
})

export default userSlice.reducer;