import React from 'react'
import { customFetch } from '../utils'
import { toast } from 'react-toastify'
import { useLoaderData } from 'react-router-dom'
import { setQuestions } from '../feature/test/testSlice'
import { Question } from '../components'

export const loader = (store) => async({params}) => {
  const {id} = params
  // console.log(id)

  try {
    const resp = await customFetch(`/testquestions/${id}`)
    store.dispatch(setQuestions(resp?.data))
    return resp?.data
  } catch (error) {
    const errMsg = error?.response?.data?.msg || "Error in getting questions"
    toast.error(errMsg)
    return null
  }

  
}


export const action = (store) => async({request, params}) => {
  

  return null
}

const OnGoingTest = () => {
  const {allQuestions} = useLoaderData()
  console.log(allQuestions)
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-between">
      <div className="w-full max-w-3xl mx-auto p-4">
        {/* Pause and Submit button on top left on screen */}
        <div className="flex justify-between mb-4">
          <div>
            <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-700">
              Pause
            </button>
            <button className="bg-green-500 text-white font-bold py-2 px-4 ml-2 rounded hover:bg-green-700">
              Submit
            </button>
          </div>
        </div>

        {/* Question and four options */}
        <Question/>

        {/* Next, Previous, and Tag button on down right */}
        <div className="flex justify-end mb-4">
          <button className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 mr-2">
            Previous
          </button>
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mr-2">
            Tag
          </button>
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnGoingTest