import React from 'react'

const SelectInput = ({name, label, state, options, change}) => {
  return (
    <div className='mb-2 w-full'>
        <label htmlFor={name} className="block text-gray-700 font-semibold mb-2">
            {label}
        </label>
        <select id={name} name={name} value={state} onChange={change} className="border border-gray-300 rounded-lg px-3 py-2 w-full">
            {
                options.map((option,i) => {
                    return <option key={i}>{option}</option>
                })
            }
        </select>
    </div>
  )
}

export default SelectInput