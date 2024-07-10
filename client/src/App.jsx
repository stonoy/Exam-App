import React from 'react'
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom"

// pages
import { About, AddQuestion, AdminInsights, AdminLanding, AdminLayout, EditTest, ErrorPage, HomeLayOut, Landing, Login, MyTests, OnGoingTest, Register, ShowResult, SingleTest } from './pages'

// store
import {store} from './store'

// loader
import {loader as landingLoader} from './pages/Landing'
import {loader as singleTestLoader} from './pages/SingleTest'
import {loader as liveTestLoader} from './pages/OnGoingTest'
import {loader as myTestsLoader} from './pages/MyTests'
import {loader as adminLandingLoader} from './pages/AdminLanding'
import {loader as adminlayoutLoader} from './pages/AdminLayout'

// actions
import {action as registerAction} from './pages/Register'
import {action as loginAction} from './pages/Login'
import {action as liveTestAction} from './pages/OnGoingTest'
import { action as starttestAction} from './pages/StartTest'
import {action as addTestAction} from './pages/AdminLanding'
import {action as addQuestionAction} from './pages/AddQuestion'
import {action as deleteTestAction} from './pages/DeleteTest'


const router = createBrowserRouter([
    {
        path: '/',
        element: <HomeLayOut/>,
        errorElement: <ErrorPage/>,
        children : [
            {
                index: true,
                element: <Landing/>,
                loader: landingLoader,
            },
            {
                path: 'tests/:id',
                element: <SingleTest/>,
                loader: singleTestLoader(store),
            },
            {
                path: 'starttest/:id',
                action: starttestAction(store),
            },
            {
                path: 'livetest/:id',
                element: <OnGoingTest/>,
                action: liveTestAction(store),
                loader: liveTestLoader(store),
            },
            {
                path: 'about',
                element: <About/>,
            },
            {
                path: 'result',
                element: <ShowResult/>,
            },
            {
                path: 'mytests',
                element: <MyTests/>,
                loader: myTestsLoader(store),
            },
            {
                path: 'admin',
                element: <AdminLayout/>,
                loader: adminlayoutLoader(store),
                children: [
                    {
                        index: true,
                        element: <AdminLanding/>,
                        loader: adminLandingLoader,
                        action: addTestAction(store),
                    },
                    {
                        path: "deletetest/:id",
                        action: deleteTestAction(store),
                    },
                    {
                        path: "insights",
                        element: <AdminInsights/>,
                    },
                    {
                        path: "edittest/:id",
                        element: <EditTest/>,
                    },
                    {
                        path: "addquestion/:id",
                        element: <AddQuestion/>,
                        action: addQuestionAction(store),
                    },
                ]
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