import React from 'react'
import { customFetch } from '../utils'
import { toast } from 'react-toastify'
import { useLoaderData } from 'react-router-dom'
import { changeQuestion, setQuestions, setTag } from '../feature/test/testSlice'
import { Question, Timer } from '../components'
import { useDispatch, useSelector } from 'react-redux'

export const loader = (store) => async({params}) => {
  const {id} = params
  // console.log(id)

  try {
    const resp = await customFetch(`/testquestions/${id}`)
    store.dispatch(setQuestions(resp?.data))
    return null
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
  const {selectedQuestionIndex, questions, test_name, subject, remaining_time, status} = useSelector((state) => state.test)
  const dispatch = useDispatch()
  // console.log(questions)

  const questionData = questions[selectedQuestionIndex]

  console.log(questions, selectedQuestionIndex)

  const handlePause = async () => {
    console.log("pause")
  }

  const handleSubmit = async () => {
    console.log("submit")
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-between">
      <div className="w-full max-w-3xl mx-auto p-4">
        {/* Pause and Submit button on top left on screen */}
        <div className="flex justify-between mb-4">
          <div>
            <button onClick={() => handlePause()} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-700">
              Pause
            </button>
            <button onClick={() => handleSubmit()} className="bg-green-500 text-white font-bold py-2 px-4 ml-2 rounded hover:bg-green-700">
              Submit
            </button>
          </div>
          {(status === "available" && remaining_time > 0) && <Timer/>}
        </div>

        {/* Question and four options */}
        <Question questionData={questionData}/>

        {/* Next, Previous, and Tag button on down right */}
        <div className="flex justify-end mb-4">
          <button onClick={() => dispatch(setTag({id:questionData.id}))} className={`${questionData.hasTagged ? "bg-red-500": "bg-gray-500"}  text-white font-bold py-2 px-4 rounded hover:bg-gray-700 mr-2`}>
            Tag
          </button>
          <button onClick={() => dispatch(changeQuestion({type:"prev"}))} disabled={selectedQuestionIndex === 0 ? true : false} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mr-2">
          Previous
          </button>
          <button onClick={() => dispatch(changeQuestion({type:"next"}))} disabled={selectedQuestionIndex === questions.length-1 ? true : false} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnGoingTest