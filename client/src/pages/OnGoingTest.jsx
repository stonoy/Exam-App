import React from 'react'
import { customFetch } from '../utils'

export const loader = (store) => async({params}) => {
  const {id} = params
  // console.log(id)

  try {
    const resp = await customFetch(`/testquestions/${id}`)
    
  } catch (error) {
    
  }

  return null
}


export const action = (store) => async({request, params}) => {
  

  return null
}

const OnGoingTest = () => {
  return (
    <div>OnGoingTest</div>
  )
}

export default OnGoingTest