import { createSlice } from "@reduxjs/toolkit";

const initailState = {
    test_name: "",
    subject: "",
    remaining_time: 0,
    status: "",
    questions: [],
}

const testSlice = createSlice({
    name: "test",
    initialState: JSON.parse(localStorage.getItem("test")) || initailState,
    reducers : {
        setTestDetails: (state, {payload : {test_taken_info : {name, subject, remaining_time, status}}}) => {
            // console.log(payload)
            state.name = name
            state.subject = subject
            state.remaining_time = remaining_time
            state.status = status

            localStorage.setItem("test", JSON.stringify(state))
        }
    }
})

export const {setTestDetails} = testSlice.actions

export default testSlice.reducer