import React from 'react'
import { Form } from 'react-router-dom'
import AdminInput from './AdminInput'

const CreateTest = () => {
  return (
    <div className="max-w-3xl mt-8 mx-auto bg-slate-300 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Creat Test</h2>

        <Form method="post">
        {/* First Row: Product Name and Email */}
        <div className="flex flex-col md:flex-row md:space-x-4">
            <AdminInput name="name" label="Name" type="text" />
            <AdminInput name="description" label="Description" type="text" />
        </div>

         {/* First Row: Product specialty and license number */}
         <div className="flex flex-col md:flex-row md:space-x-4">
         <AdminInput name="subject" label="Subject" type="text" />
         <AdminInput name="duration" label="Duration" type="text" />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Create
          </button>
        </div>
        </Form>
    </div>
  )
}

export default CreateTest