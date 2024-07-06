import { createSlice } from "@reduxjs/toolkit";

const initailState = {
    test_name: "",
    selectedQuestionIndex: 0,
    subject: "",
    remaining_time: 0,
    status: "",
    questions: [],
    result: null,
}

const testSlice = createSlice({
    name: "test",
    initialState: JSON.parse(localStorage.getItem("test")) || initailState,
    reducers : {
        setTestDetails: (state, {payload : {test_taken_info : {name, subject, remaining_time, status}}}) => {
            console.log(name)
            state.name = name
            state.subject = subject
            state.remaining_time = remaining_time
            state.status = status
            state.selectedQuestionIndex = 0

            localStorage.setItem("test", JSON.stringify(state))
        },
        setQuestions: (state, {payload: {allQuestions}}) => {
            // console.log(payload)
            const questionSet = []

            allQuestions.forEach((question,i) => {
                questionSet.push({...question, answer: "", hasTagged: false, attempted:false, index:i})
            })

            state.questions = questionSet
            localStorage.setItem("test", JSON.stringify(state))
        },
        changeQuestion: (state, {payload: {type}}) => {
            if (type === "next"){
                state.selectedQuestionIndex++
            } else {
                state.selectedQuestionIndex--

            }
        },
        setTag: (state, {payload: {id}}) => {
            state.questions = state.questions.map((question) => {
                if (question.id === id){
                    return {...question, hasTagged: !question.hasTagged}
                }else {
                    return question
                }
            })

            localStorage.setItem("test", JSON.stringify(state))
        },
        setTimer: (state, {payload}) => {
            state.remaining_time--
            // console.log(payload)
        },
        toggleStatus: (state, {payload : {status}}) => {
            state.status = status
        },
        resetTest: () => {
            return initailState
        },
        setAnswer: (state, {payload:{questionId, givenAnswer}}) => {
            state.questions = state.questions.map((question) => {
                if (question.id === questionId){
                    return {...question, answer: givenAnswer}
                } else {
                    return question
                }
            })
        },
        deSelectAnswer: (state, {payload:{questionId}}) => {
            state.questions = state.questions.map((question) => {
                if (question.id === questionId){
                    return {...question, answer: ""}
                } else {
                    return question
                }
            })
        },
        showResult: (state, {payload}) => {
            state.result = payload
            state.status = "completed"
        }
    }
})

export const {setTestDetails, setQuestions,changeQuestion,setTag, setTimer, toggleStatus, resetTest, setAnswer, deSelectAnswer, showResult} = testSlice.actions

export default testSlice.reducer