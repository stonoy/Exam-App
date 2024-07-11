import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAnswer } from '../feature/test/testSlice'

const Question = ({questionData}) => {
  const dispatch = useDispatch()
    
const handleAnswer = (e) => {
  // console.log(e.target.value, questionData.id)
  dispatch(setAnswer({questionId : questionData.id, givenAnswer : e.target.value}))
}
    
    // console.log(questionData)
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Question {questionData.index + 1}</h2>
          <p className="text-gray-700 mb-4">{questionData.question}</p>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">
                <input
                  type="radio"
                  name="option"
                  value={questionData.option1}
                  checked={questionData.answer === questionData.option1}
                  onChange={(e) => handleAnswer(e)}
                  className="mr-2"
                />
                {questionData.option1}
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                <input
                  type="radio"
                  name="option"
                  value={questionData.option2}
                  checked={questionData.answer === questionData.option2}
                  onChange={(e) => handleAnswer(e)}
                  className="mr-2"
                />
                {questionData.option2}
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                <input
                  type="radio"
                  name="option"
                  value={questionData.option3}
                  checked={questionData.answer === questionData.option3}
                  onChange={(e) => handleAnswer(e)}
                  className="mr-2"
                />
                {questionData.option3}
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                <input
                  type="radio"
                  name="option"
                  value={questionData.option4}
                  checked={questionData.answer === questionData.option4}
                  onChange={(e) => handleAnswer(e)}
                  className="mr-2"
                />
                {questionData.option4}
              </label>
            </div>
          </form>
        </div>
  )
}

export default Question