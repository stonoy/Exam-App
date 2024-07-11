import { createSlice } from "@reduxjs/toolkit";

const initailState = {
    test_name: "",
    selectedQuestionIndex: 0,
    subject: "",
    secondCounter: 0,
    remaining_time: 0,
    status: "",
    questions: [],
    result: null,
}

const testSlice = createSlice({
    name: "test",
    initialState: JSON.parse(localStorage.getItem("test")) || initailState,
    reducers : {
        setTestDetails: (state, {payload : {test_taken_info : {name, subject, remaining_time,second_counter, status}}}) => {
            // console.log(name)
            state.test_name = name
            state.subject = subject
            state.remaining_time = remaining_time
            state.secondCounter = second_counter
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
            // console.log(type)
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
            if (state.secondCounter === 0){
                state.secondCounter = 59
                state.remaining_time--
            } else {
                state.secondCounter--
            }
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
                    return {...question, answer: givenAnswer, attempted: true}
                } else {
                    return question
                }
            })
        },
        deSelectAnswer: (state, {payload:{questionId}}) => {
            state.questions = state.questions.map((question) => {
                if (question.id === questionId){
                    return {...question, answer: "", attempted: false}
                } else {
                    return question
                }
            })
        },
        showResult: (state, {payload}) => {
            state.result = payload
            state.status = "completed"
        },
        navigateQuestion: (state, {payload}) => {
            state.selectedQuestionIndex = payload
        }
    }
})

export const {setTestDetails, setQuestions,changeQuestion,setTag, setTimer, toggleStatus, resetTest, setAnswer, deSelectAnswer, showResult, navigateQuestion} = testSlice.actions

export default testSlice.reducer