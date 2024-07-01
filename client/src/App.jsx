import React from 'react'
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom"

// pages
import { About, ErrorPage, HomeLayOut, Landing, Login, Register } from './pages'

// store
import {store} from './store'

// actions
import {action as registerAction} from './pages/Register'
import {action as loginAction} from './pages/Login'

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomeLayOut/>,
        errorElement: <ErrorPage/>,
        children : [
            {
                index: true,
                element: <Landing/>,
            },
            {
                path: 'about',
                element: <About/>,
            },
        ]
    },
    {
        path: '/login',
        element: <Login/>,
        action: loginAction(store),
    },
    {
        path: '/register',
        element: <Register/>,
        action: registerAction,
    }
])

const App = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default App