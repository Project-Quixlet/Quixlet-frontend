import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login as loginRequest } from '../../requests/study-api';
import { getCookie } from '../../requests/utility';

export const login = createAsyncThunk(
    'auth/login',
    async (options, thunkAPI) => {
        return new Promise((resolve, reject) => {
            const credentials = {
                username: options['username'],
                password: options['password']
            }

            loginRequest(credentials)
                .then(token => {
                    return resolve({token})
                })
                .catch(err => {
                    console.error(err);
                    return reject(err);
                })
        });
    }
)

const setToken = (token) => {
    document.cookie = `token=${token}; SameSite=Lax; Secure;`;
}

const getToken = () => {
    return getCookie('token') ? (getCookie('token') === 'null' ? null : getCookie('token')) : null;
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: getToken(),
        isLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: {
        [login.fulfilled]: (state, action) => {
            const { token } = action.payload;
            setToken(token);
            state.token = token;
            state.isLoading = false;
        },
        [login.pending]: (state, action) => {
            state.isLoading = true;
        },
        [login.pending]: (state, action) => {
            state.isLoading = false;
        },
    }
})

export const useAuth = (state) => ({
    token: state.auth.token,
    status: !(!state.auth.token),
    isLoading: state.auth.isLoading,
    error: state.auth.error
})

export default authSlice.reducer;