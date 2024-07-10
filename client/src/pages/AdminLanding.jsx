import React from 'react'
import { CreateTest, Gallery, Pagination } from '../components'
import { redirect, useLoaderData } from 'react-router-dom'
import { customFetch, getQueryReadyUrl } from '../utils'
import { toast } from 'react-toastify'

export const loader = async ({request}) => {
    // console.log("hi")
    
    const theUrl = getQueryReadyUrl("tests", request)
  
    try {
      const resp = await customFetch(theUrl)
    
      return resp.data
    } catch (error) {
      const errorMsg = error?.response?.data?.msg || 'Error in getting tests'
  
        toast.error(errorMsg)
  
        return null
    }
  }

export const action = (store) => async ({request}) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    const token = store.getState().user.token

    try {
      const resp = await customFetch.post('/createtest', data, {
        headers : {
            "Authorization" : `Bearer ${token}`
        }
      }) 

      toast.success("test created")
      return redirect(`./addquestion/${resp?.data?.test?.id}`)
    } catch (error) {
        const errMsg = error?.response?.data?.msg || "Error in creating test"

      const status = error?.response?.status

      if (status === 401 || status === 403){
        toast.warn("Login To Proceed")
        return redirect("/login")
      }

      toast.error(errMsg)
      return null
    }
}

const AdminLanding = () => {
    const {allTests, numOfPages, page} = useLoaderData()
    // const data = useLoaderData()

  return (
    <div className="bg-gray-100">
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Filter Section */}
      
      <CreateTest />

      <Gallery allTests={allTests} admin={true}/>

      {/* Pagination */}
      <Pagination numOfPages={numOfPages} page={page} />

      

      
      
    </div>
  </div>
  )
}

export default AdminLanding