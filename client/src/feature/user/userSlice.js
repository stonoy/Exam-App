import {createSlice } from '@reduxjs/toolkit'

const initailState = {
    name : "",
    role: "student",
    token: ""
}

const userSlice = createSlice({
    name : "user",
    initialState: localStorage.getItem("user") || initailState,
    reducers: {
        setUser : (state, action) => {
            console.log(action)
        }
    }
})

export const {setUser} = userSlice.actions

export default userSlice.reducer