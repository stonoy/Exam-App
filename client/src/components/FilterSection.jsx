import React, { useState } from 'react'
import SearchInput from './SearchInput'
import { useLocation, useNavigate } from 'react-router-dom'
import {  statusOptions } from '../utils'
import SelectInput from './SelectInput'

const FilterSection = (props) => {
  const locationUrl = useLocation()
  const navigate = useNavigate()
  

    // get the current search values
    const {status: statusValue, name: nameValue, subject: subjectValue} = Object.fromEntries([...new URL(window.location.href).searchParams.entries()])
    // console.log([...new URL(window.location.href).searchParams.entries()])
    

    // initiate search state
    const [filterState, setFilterState] = useState({status: statusValue || "completed", name: nameValue || "", subject: subjectValue || ""})

    const handleChange = (e) => {
      const {name, value} = e.target
      setFilterState((prevState) => {
        return {
          ...prevState,
          [name]: value
        }
      })
    }

    const handleSearch = () => {
      let serachParams = new URLSearchParams(locationUrl.search)
      serachParams.set("page", 1)
      

      for (let state in filterState) {
        if (props[state]){
            serachParams.set(state, filterState[state].toLowerCase())
        }
       
      }


      navigate(`${locationUrl.pathname}?${serachParams}`)
    }

  return (
    <div className='mb-4 p-2 border-2 border-slate-500'>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {props.status && <SelectInput name={props.status} state={filterState.status} options={statusOptions} change={handleChange} label="Status"/>}
            {props.name && <SearchInput name={props.name} state={filterState.name} change={handleChange} label="Name" type="text"/>}
            {props.subject && <SearchInput name={props.subject} state={filterState.subject} change={handleChange} label="Subject" type="text"/>}
            
            {/* Now the date time */}
            
          </div>
          {/* reset button */}
          <div className="text-right mb-4 mr-4">
        <button
          onClick={() => navigate(locationUrl.pathname)}
          className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>
        {/* search button */}
          <div className="text-right mb-4 mr-4">
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </div>
    </div>
    
  )
}

export default FilterSection