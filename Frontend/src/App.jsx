import { useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout/Layout'
import {Login, Signup} from "./components"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path='login' element={<Login />}/>
        <Route path='signup' element={<Signup />}/>
      </Route>
    )
  )

  return (
    <RouterProvider router={router}>

    </RouterProvider>
  )
}

export default App
