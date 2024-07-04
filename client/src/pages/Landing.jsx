import React from 'react'
import { customFetch, getQueryReadyUrl } from '../utils'
import { toast } from 'react-toastify'
import { useLoaderData } from 'react-router-dom'
import {  Gallery, Pagination } from '../components'
import FilterSection from '../components/FilterSection'

export const loader = async ({request}) => {
  console.log(request.url)
  
  const theUrl = getQueryReadyUrl("tests", request)

  try {
    const resp = await customFetch(theUrl)
    // console.log(resp.data)
    return resp.data
  } catch (error) {
    const errorMsg = error?.response?.data?.msg || 'Error in getting tests'

      toast.error(errorMsg)

      return null
  }
}

const Landing = () => {
  const {allTests, numOfPages, page} = useLoaderData()

  if (allTests.length === 0){
    return (
      <div className="bg-gray-100">
        <h1 className='text-xl'>No Test is available now</h1>
      </div>
    )
  }

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filter Section */}
        <FilterSection name="name" subject="subject" />

        <Gallery allTests={allTests}/>

        {/* Pagination */}
        <Pagination numOfPages={numOfPages} page={page} />
        
      </div>
    </div>
  )
}

export default Landing