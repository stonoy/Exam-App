import {createSlice } from '@reduxjs/toolkit'

const initailState = {
    token : "",
    user : {
        role: "student",
        name: "Guest User",
    }
}

const userSlice = createSlice({
    name : "user",
    initialState: JSON.parse(localStorage.getItem("user")) || initailState,
    reducers: {
        setUser : (state, {payload : {token, user : {name,role}}}) => {
            
            state.token = token
            state.user.role = role
            state.user.name = name
            localStorage.setItem("user", JSON.stringify(state))
        },
        logout : () => {
            localStorage.removeItem("user")
            return initailState
        }
    }
})

export const {setUser, logout} = userSlice.actions

export default userSlice.reducer