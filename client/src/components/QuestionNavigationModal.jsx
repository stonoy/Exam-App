import React from 'react';
import { FaTimes } from 'react-icons/fa';

const QuestionNavigationModal = ({ questions, toggleModal }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Question Navigation</h2>
          <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {questions.map((question) => (
            <button
              key={question.id}
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300"
              onClick={() => console.log(`Navigating to question ${index + 1}`)}
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

// Usage example:
// const questions = [
//   { id: '1', question: 'Question 1?' },
//   { id: '2', question: 'Question 2?' },
//   { id: '3', question: 'Question 3?' },
//   // Add more questions as needed
// ];

// <QuestionNavigationModal questions={questions} toggleModal={() => setModalOpen(false)} />
