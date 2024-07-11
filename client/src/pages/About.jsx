import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">About Test App</h1>
        <p className="text-gray-700 mb-4">
          Welcome to the Test App! Our platform is designed to provide a comprehensive and user-friendly environment for anyone to take a variety of exams. Whether you're preparing for academic tests, professional certifications, or just looking to challenge yourself, Test App is here to help.
        </p>
        <h2 className="text-2xl font-semibold mb-2">Features</h2>
        <ul className="list-disc list-inside mb-4">
          <li className="text-gray-700 mb-2">Wide range of subjects and topics</li>
          <li className="text-gray-700 mb-2">Real-time scoring and feedback</li>
          <li className="text-gray-700 mb-2">User-friendly interface</li>
          <li className="text-gray-700 mb-2">Detailed performance analysis</li>
          <li className="text-gray-700 mb-2">Secure and confidential</li>
        </ul>
        <p className="text-gray-700 mb-4">
          Our goal is to make learning and testing as accessible and effective as possible. With our app, you can track your progress, identify areas for improvement, and achieve your goals.
        </p>
        <div className="text-center">
          <Link to="/" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Take an Exam
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About