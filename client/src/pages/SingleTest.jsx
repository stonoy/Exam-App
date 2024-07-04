import React from 'react'
import { customFetch, provideStartExamBtn } from '../utils'
import { toast } from 'react-toastify'
import { Form, redirect, useLoaderData, useParams } from 'react-router-dom'
import { setTestDetails } from '../feature/test/testSlice'

export const loader = (store) => async({params}) => {
    const {id} = params
    const token = store.getState().user.token
    
    try {
      // call check test present api
      const resp = await customFetch(`/checktestpresent/${id}`, {
        headers : {
          "Authorization" : `Bearer ${token}`
        }
      })

      // console.log(resp?.data)

      const {is_present, test_taken_info : {status}} = resp?.data

      if (is_present && ( status === "available")){
        // update the test details in redux state test
        store.dispatch(setTestDetails(resp?.data))
      }

      return resp?.data
    } catch (error) {
      const errMsg = error?.response?.data?.msg || "Error in getting test user details"

      const status = error?.response?.status

      if (status === 401 || status === 403){
        toast.warn("Login To Proceed")
        return redirect("/login")
      }

      toast.error(errMsg)
      return null
    }
    
    
}

const SingleTest = () => {
  const {is_present, test_taken_info : {status}} = useLoaderData()
  const {id} = useParams()
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Exam Instructions</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>Read all the instructions carefully before starting the exam.</li>
        <li>Ensure you have a stable internet connection.</li>
        <li>Make sure you are in a quiet environment to avoid distractions.</li>
        <li>Do not refresh the page during the exam.</li>
        <li>All questions are mandatory and must be answered.</li>
        <li>The exam will automatically submit when the time is up.</li>
        <li>If you face any issues, contact support immediately.</li>
      </ul>
      <Form method='post' action={`/starttest/${id}`}>
        {provideStartExamBtn(is_present, status)}
      </Form>
    </div>
  )
}

export default SingleTest