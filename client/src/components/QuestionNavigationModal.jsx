import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { navigateQuestion } from '../feature/test/testSlice';

const QuestionNavigationModal = ({ questions, toggleModal }) => {
  const dispatch = useDispatch()

  const setQuestion = (index) => {
    dispatch(navigateQuestion(index))
    toggleModal()
  }

  const tagColor = (question) => {
    return question.hasTagged ? "bg-orange-500" : question.attempted ? "bg-green-500" : "bg-grey-500"
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Question Navigation</h2>
          <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question) => (
            <button
              key={question.id}
              className={`${tagColor(question)} w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300`}
              onClick={() => setQuestion(question.index)}
            >
              {question.index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigationModal;
