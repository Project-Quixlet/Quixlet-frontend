import { configureStore } from '@reduxjs/toolkit';
import studySlice from '../features/studies/studySlice';
import authSlice from '../features/authentication/authSlice';
import userSlice from '../features/account/userSlice';

export default configureStore({
    reducer: {
        studies: studySlice,
        auth: authSlice,
        user: userSlice
    }
})
