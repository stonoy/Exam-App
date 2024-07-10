import { toast } from "react-toastify"
import { customFetch } from "../utils"
import { redirect } from "react-router-dom"


export const action = (store) => async ({params}) => {
    const {id} = params
    const token = store.getState().user.token

    try {
        const resp = await customFetch.delete(`/deletetest/${id}`, {
          headers : {
              "Authorization" : `Bearer ${token}`
          }
        }) 
  
        toast.success(resp?.data?.msg)
      } catch (error) {
          const errMsg = error?.response?.data?.msg || "Error in deleting test"
  
        const status = error?.response?.status
  
        if (status === 401 || status === 403){
          toast.warn("Login To Proceed")
          return redirect("/login")
        }
  
        toast.error(errMsg)
      }
      return redirect('/admin')
  }
