import React from 'react'
import { useSelector } from 'react-redux'

const ShowResult = () => {
    const {result} = useSelector((state) => state.test)
    console.log(result)
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Test Result</h1>
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">{result.name}</h2>
          <p className="text-gray-700"><strong>Subject:</strong> {result.subject}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700"><strong>Your Score:</strong> {result.my_score}</p>
          <p className="text-gray-700"><strong>Total Participants:</strong> {result.total_participents}</p>
          <p className="text-gray-700"><strong>Max Score:</strong> {result.max_score}</p>
          <p className="text-gray-700"><strong>Average Score:</strong> {result.avg_score}</p>
        </div>
        <div className="text-center">
          <p className={`text-xl font-bold ${result.my_score >= result.avg_score ? 'text-green-600' : 'text-red-600'}`}>
            Status: {result.status}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ShowResult