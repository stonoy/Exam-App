import React from 'react'
import { useSelector } from 'react-redux'

const Question = () => {
    const {selectedQuestionIndex, questions} = useSelector((state) => state.test)

    const questionData = questions[selectedQuestionIndex]
    console.log(selectedQuestionIndex)
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