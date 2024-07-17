import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { customFetch } from "../../utils";
import { toast } from "react-toastify";

const initailState = {
    test_name: "",
    selectedQuestionIndex: 0,
    subject: "",
    secondCounter: 0,
    remaining_time: 0,
    status: "",
    questions: [],
    result: null,
    success: false,
    anyError: false,
    authError: false,
    btnBusy: false,
}

export const pauseTest = createAsyncThunk("test/pauseTest", 
    async (test_id, thunkAPI) => {
        const {remaining_time, secondCounter} = thunkAPI.getState().test
        const {token} = thunkAPI.getState().user

        try {
            const resp = await customFetch.put(`/pauseexam/${test_id}`, {remaining_time: `${remaining_time}`, second_counter: `${secondCounter}`}, {
                headers : {
                  "Authorization":`Bearer ${token}`
                }
              })

              return resp?.data
        } catch (error) {
            console.log("error")
            return thunkAPI.rejectWithValue(error?.response)
        }
})

export const restartTest = createAsyncThunk("test/restartTest", 
    async (test_id, thunkAPI) => {
        const {token} = thunkAPI.getState().user

        try {
            const resp = await customFetch.put(`/restartexam/${test_id}`, {}, {
                headers : {
                  "Authorization":`Bearer ${token}`
                }
              })
              thunkAPI.dispatch(setTestDetails(resp?.data))
              return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response)
        }
})

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
            state.success = false
            state.anyError = false
            state.authError = false

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
    },
    extraReducers: (builder) => {
        builder.addCase(pauseTest.pending, (state, action) => {
            state.btnBusy = true
            state.success = false
            state.anyError = false
            state.authError = false
        }).addCase(pauseTest.fulfilled, (state, {payload}) => {
            state.success = true
            state.btnBusy = false
            state.status = "paused"
            toast.success(payload)
        }).addCase(pauseTest.rejected, (state, {payload}) => {
            state.btnBusy = false
            state.anyError = true
            const errMsg = payload.data?.msg || "Error in pausing test"
            const status = payload.status

            if (status === 401 || status === 403){
                toast.warn("Login To Proceed")
                state.authError = true
              }else {
                toast.error(errMsg)
              }
        }).addCase(restartTest.pending, (state, action) => {
            state.btnBusy = true
            state.success = false
            state.anyError = false
            state.authError = false
        }).addCase(restartTest.fulfilled, (state, {payload}) => {
            state.success = true
            state.btnBusy = false
            toast.success("Test Restarted!")
        }).addCase(restartTest.rejected, (state, {payload}) => {
            state.btnBusy = false
            state.anyError = true
            const errMsg = payload.data?.msg || "Error in restarting test"
            const status = payload.status

            if (status === 401 || status === 403){
                toast.warn("Login To Proceed")
                state.authError = true
              }else {
                toast.error(errMsg)
              }
        })
    }
})

export const {setTestDetails, setQuestions,changeQuestion,setTag, setTimer, toggleStatus, resetTest, setAnswer, deSelectAnswer, showResult, navigateQuestion} = testSlice.actions

export default testSlice.reducer