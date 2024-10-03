import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const Main = () => {
  return (
    <div className='flex h-screen'>
      {/* Fixed Menu on the left */}
      <div className='md:w-64 lg:w-56'>
        <SideMenu />
      </div>
      {/* Main Content Area */}
      <div className='flex-1 flex w-full flex-col'>
        <Navbar />
        <div className='flex-1 mx-auto  md:max-w-screen-lg lg:max-w-screen-2xl   p-6 min-w-full'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Main