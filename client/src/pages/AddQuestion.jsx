import React from 'react'
import { AdminInput } from '../components'
import { Form, redirect, useNavigation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { customFetch } from '../utils'
import { FaSpinner } from 'react-icons/fa'

export const action = (store) => async ({request}) => {
  const formData = await request.formData()
    const data = Object.fromEntries(formData)
    const token = store.getState().user.token

    try {
      const resp = await customFetch.post('/createquestions', data, {
        headers : {
            "Authorization" : `Bearer ${token}`
        }
      }) 

      toast.success("question created")
      return redirect(`/admin/addquestion/${resp?.data?.question?.test_id}`)
    } catch (error) {
        const errMsg = error?.response?.data?.msg || "Error in creating question"

      const status = error?.response?.status

      if (status === 401 || status === 403){
        toast.warn("Login To Proceed")
        return redirect("/login")
      }

      toast.error(errMsg)
      return null
    }
}

const AddQuestion = () => {
  const {id} = useParams()
  const navigation = useNavigation()
    const isSubmitting = navigation.state == "submitting"
  return (
    <div className="max-w-3xl mt-8 mx-auto bg-slate-300 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Creat Test</h2>

        <Form method="post">
         {/* First Row: Product Name and Email */}
         <div className="flex flex-col md:flex-row md:space-x-4">
            <AdminInput name="test_id" label="Test Id" type="text" defaultValue={id}/>
        </div>

        {/* First Row: Product Name and Email */}
        <div className="flex flex-col md:flex-row md:space-x-4">
            <AdminInput name="question" label="Question" type="text" />
            <AdminInput name="correct" label="Correct" type="text" />
        </div>

         {/* First Row: Product specialty and license number */}
         <div className="flex flex-col md:flex-row md:space-x-4">
         <AdminInput name="option1" label="Option1" type="text" />
         <AdminInput name="option2" label="Option2" type="text" />
        </div>

        {/* First Row: Product specialty and license number */}
        <div className="flex flex-col md:flex-row md:space-x-4">
         <AdminInput name="option3" label="Option3" type="text" />
         <AdminInput name="option4" label="Option4" type="text" />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
             {/* Loading spinner */}
        {isSubmitting && (
          <FaSpinner className="animate-spin mr-2" /> // Add animate-spin class for animation
        )}
            Create
          </button>
        </div>
        </Form>
    </div>
  )
}

export default AddQuestion