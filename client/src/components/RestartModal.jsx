import React from 'react'

const RestartModal = ({handleRestart}) => {

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Test Paused</h2>
        <p className="text-gray-700 mb-4">Test Name: Math</p>
        <button onClick={() => handleRestart()} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 w-full">
          Restart Test
        </button>
      </div>
    </div>
  )
}

export default RestartModal