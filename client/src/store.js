import {configureStore } from '@reduxjs/toolkit'
import userSlice from './feature/user/userSlice'
import testSlice from './feature/test/testSlice'

export const store = configureStore({
    reducer : {
        user : userSlice,
        test : testSlice,
    }
})