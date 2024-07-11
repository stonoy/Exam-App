import React from 'react'
import { customFetch } from '../utils'
import { useLoaderData } from 'react-router-dom'

export const loader = (store) => async () => {
  const token = store.getState().user.token

  try {
    const resp = await customFetch("/mytests", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    return resp?.data
  } catch (error) {
    const errMsg = error?.response?.data?.msg || "Error in getting completed tests of user"

      const status = error?.response?.status

      if (status === 401 || status === 403){
        toast.warn("Login To Proceed")
        return redirect("/login")
      }

      toast.error(errMsg)
      return null
  }
}

const MyTests = () => {
  const {my_tests} = useLoaderData()

  // console.log(my_tests)

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">My Tests</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {my_tests.map((test) => (
            <div key={test.id} className="bg-white shadow-md rounded-lg overflow-hidden p-4">
              <h3 className="text-xl font-bold mb-2">{test.name}</h3>
              <p className="text-gray-700 mb-1"><strong>Subject:</strong> {test.subject}</p>
              <p className="text-gray-700 mb-1"><strong>My Score:</strong> {test.my_score}</p>
              <p className="text-gray-700 mb-1"><strong>Total Participants:</strong> {test.total_participents}</p>
              <p className="text-gray-700 mb-1"><strong>Max Score:</strong> {test.max_score}</p>
              <p className="text-gray-700 mb-1"><strong>Average Score:</strong> {test.avg_score}</p>
              <p className="text-gray-700 mb-1"><strong>Status:</strong> {test.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyTests