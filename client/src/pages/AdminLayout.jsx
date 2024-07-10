import React from 'react'
import { NavLink, Outlet, redirect } from 'react-router-dom';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';

export const loader = (store) => async() => {
  const token = store.getState().user.token

  try {
    const resp = await customFetch("/checkadmin", {
      headers : {
        "Authorization": `Bearer ${token}`
      }
    })

    toast.success(resp?.data?.msg)
  } catch (error) {
    const errMsg = error?.response?.data?.msg || "Error in verifying user"

      const status = error?.response?.status

      if (status === 401 || status === 403){
        toast.warn("Login To Proceed")
        return redirect("/login")
      }

      toast.error(errMsg)
  }
  return null
  }

const AdminLayout = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex pb-4 justify-between items-center">
        <h1 className="text-xl font-semibold">Admin</h1>
        <div className="flex space-x-4">
          <NavLink to="/admin/insights" className="text-blue-500 hover:text-blue-700">
            Insights
          </NavLink>
        </div>
      </div>
      <Outlet /> {/* The Outlet renders child components */}
    </div>
  );
}

export default AdminLayout