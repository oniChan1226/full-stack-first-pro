import React from 'react'
import { Outlet } from 'react-router-dom'
import { Home } from '../pages'

const Layout = () => {
  return (
    <>
    <Home />
    <Outlet />
    </>
  )
}

export default Layout