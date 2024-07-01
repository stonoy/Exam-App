import React from 'react'
import { Form, Link, redirect, useNavigation } from 'react-router-dom';
import { FormInput, SubmitBtn } from '../components';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';

export const action = async ({request}) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  // console.log(data)

  try {
    const resp = await customFetch.post('/register', data)
    // console.log(resp)
    toast.success("account created successfully")
    return redirect('/login')
  } catch (error) {
    
    const errorMsg = error?.response?.data?.msg || 'Error in Registering user'

    toast.error(errorMsg)

    return null
  }
  
}

const Register = () => {
  const navigation = useNavigation()
  const isLoading = navigation.state == "submitting"

  return (
    <div className="min-h-screen align-element bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register here</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form method='post' className="space-y-6" >
          <FormInput 
            type="text"
            label="User Name"
            name="name"
            defaultValue=""
          />
          <FormInput 
            type="text"
            label="Email"
            name="email"
            defaultValue=""
          />

<FormInput 
            type="password"
            label="Password"
            name="password"
            defaultValue=""
          />

          <SubmitBtn
            type="submit"
            text="Register"
            isLoading={isLoading}
          />
          </Form>
          <p className="mt-2 text-sm text-center text-gray-600">Already a member? <Link to="/login">Login</Link></p>
          <p className="mt-2 hidden text-sm text-center text-red-600">the error</p>

           {/* Link to Products Page */}
           <p className="mt-2 text-sm text-center text-gray-600">
              <Link to="/" className="text-blue-500">Check Tests</Link>
            </p>
        </div>
      </div>
    </div>
  )
}

export default Register