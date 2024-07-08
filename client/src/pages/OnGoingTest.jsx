import React, { useEffect, useState } from 'react'
import { customFetch } from '../utils'
import { toast } from 'react-toastify'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { changeQuestion, deSelectAnswer, setQuestions, setTag, setTestDetails, showResult, toggleStatus } from '../feature/test/testSlice'
import { Question, QuestionNavigationModal, RestartModal, Timer } from '../components'
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
  const [showNavigationModal, setShowNavigationModal] = useState(false)
  const {token} = useSelector((state) => state.user)
  const {selectedQuestionIndex, questions, test_name, subject, remaining_time, status} = useSelector((state) => state.test)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // console.log(questions)

  const questionData = questions[selectedQuestionIndex]

  // console.log(questions, selectedQuestionIndex)

  const toggleModal = () => setShowNavigationModal(prevState => !prevState)

  const handlePause = async () => {
    console.log("pause")
    
    try {
      const resp = await customFetch.put(`/pauseexam/${questionData.test_id}`, {remaining_time: `${remaining_time}`}, {
        headers : {
          "Authorization":`Bearer ${token}`
        }
      })
      dispatch(toggleStatus({status:"paused"}))
      toast.success(resp?.data)
    } catch (error) {
      const errMsg = error?.response?.data?.msg || "Error in pausing test"

      const status = error?.response?.status

      if (status === 401 || status === 403){
        toast.warn("Login To Proceed")
        navigate("/login")
      }else {
        toast.error(errMsg)
      }

      
    }
  }

  const handleRestart = async() => {
    console.log("restart")

    try {
      const resp = await customFetch.put(`/restartexam/${questionData.test_id}`,{}, {
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    })

    dispatch(setTestDetails(resp?.data))
    toast.success("Test Restarted!")
    } catch (error) {
      const errMsg = error?.response?.data?.msg || "Error in restarting test"

      const status = error?.response?.status

      if (status === 401 || status === 403){
        toast.warn("Login To Proceed")
        navigate("/login")
      }else {
        toast.error(errMsg)
      }
    }
  }

  const handleSubmit = async () => {
    console.log("submit")

    // loop through the questions in test redux state and push the question.id and answer when answer !== ""
    const answer_set = []

    questions.forEach((question) =>{
      if (question.answer){
        answer_set.push({
          question_id : question.id,
          answer: question.answer
        })
      }
    })

    // console.log(answer_set)

    try {
      const resp = await customFetch.put(`/submittest/${questionData.test_id}`, {answer_set}, {
        headers : {
          "Authorization": `Bearer ${token}`
        }
      })
      dispatch(showResult(resp?.data?.test_taken_final_info))
      navigate("/result")
    } catch (error) {
      const errMsg = error?.response?.data?.msg || "Error in submitting test"

      const status = error?.response?.status

      if (status === 401 || status === 403){
        toast.warn("Login To Proceed")
        navigate("/login")
      }else {
        toast.error(errMsg)
        navigate("/")
      }
    }
    
  }

  useEffect(() => {
    if (remaining_time === 0){
      handleSubmit()
    }
  }, [remaining_time])

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-between">
      <div className="w-full max-w-3xl mx-auto p-4">
        {/* Pause, Submit buttons, Test Name, Subject Name, and Navigate button on top */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <button onClick={handlePause} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-700">
              Pause
            </button>
            <button onClick={handleSubmit} className="bg-green-500 text-white font-bold py-2 px-4 ml-2 rounded hover:bg-green-700">
              Submit
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">{test_name}</h2>
            <p className="text-gray-700">{subject}</p>
          </div>
          <div className="flex items-center">
            {(status === "available" && remaining_time > 0) && <Timer />}
            <button onClick={toggleModal} className="bg-blue-500 text-white font-bold py-2 px-4 ml-2 rounded hover:bg-blue-700">
              Navigate
            </button>
          </div>
        </div>

        {/* Question and four options */}
        <Question questionData={questionData} />

        {/* Next, Previous, and Tag button on down right */}
        <div className="flex justify-end mb-4">
          <button onClick={() => dispatch(deSelectAnswer({ questionId: questionData.id }))} className="bg-slate-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 mr-2">
            De Select
          </button>
          <button onClick={() => dispatch(setTag({ id: questionData.id }))} className={`${questionData.hasTagged ? "bg-red-500" : "bg-gray-500"} text-white font-bold py-2 px-4 rounded hover:bg-gray-700 mr-2`}>
            Tag
          </button>
          <button onClick={() => dispatch(changeQuestion({ type: "prev" }))} disabled={selectedQuestionIndex === 0} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mr-2">
            Previous
          </button>
          <button onClick={() => dispatch(changeQuestion({ type: "next" }))} disabled={selectedQuestionIndex === questions.length - 1} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Next
          </button>
        </div>

        {/* Pause Modal */}
        {status === "paused" && <RestartModal handleRestart={handleRestart} />}

        {/* QuestionNavigationModal */}
        {showNavigationModal && <QuestionNavigationModal questions={questions} toggleModal={toggleModal} />}
      </div>
    </div>
  )
}

export default OnGoingTest