import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const Main = () => {
  return (
    <div className="flex    min-h-screen">
    <SideMenu />
    <div className="flex-1 flex flex-col">
      <div className="">
        <Navbar />
      </div>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  </div>
  )
}

export default Main