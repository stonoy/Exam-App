import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTimer } from '../feature/test/testSlice'

const Timer = () => {
    const {remaining_time} = useSelector((state) => state.test)
    const dispatch = useDispatch()

    useEffect(()=>{
        const intId = setInterval(()=> {
            console.log(remaining_time)
            dispatch(setTimer())
        },1000)

        return () => {
            clearInterval(intId)
        }
    },[])

  return (
    <div>
        <span className="text-gray-700 font-bold">{remaining_time} minutes remaining</span>
    </div>
  )
}

export default Timer