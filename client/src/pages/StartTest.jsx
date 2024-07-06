import React from 'react'
import { redirect } from 'react-router-dom'
import { customFetch } from '../utils'
import { resetTest, setTestDetails } from '../feature/test/testSlice'

export const action = (store) => async ({request,params}) => {
    const token = store.getState().user.token
    const {id} = params
    const formData = await request.formData()
    const intent = formData.get("intent")


    // intent is not_present -> create a new test_user api endpoint 'taketests' and update the redux state test and redirect to live test
    if (intent === "not_present"){
        const resp = await customFetch.post("/taketests",{test_id: id}, {
            headers : {
                "Authorization" : `Bearer ${token}`
            }
        })

        store.dispatch(setTestDetails(resp?.data))
    }

    // intent is available -> redux state test already present redirect to live test
    if (intent === "available"){
        return redirect(`/livetest/${id}`)
    }

    // intent is paused -> restart test and update the redux state test and redirect to live test
    if (intent === "paused"){
        const resp = await customFetch.put(`/restartexam/${id}`,{}, {
            headers : {
                "Authorization" : `Bearer ${token}`
            }
        })

        store.dispatch(setTestDetails(resp?.data))
    }

    // intent is completed -> redirect to my tests
    if (intent === "completed"){
        return redirect(`/mytests`)
    }

    // console.log(token, id, intent)

    return redirect(`/livetest/${id}`)
}

