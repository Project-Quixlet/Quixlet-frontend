import { configureStore } from '@reduxjs/toolkit';
import studySlice from '../features/studies/studySlice';

export default configureStore({
    reducer: {
        studies: studySlice
    }
})
