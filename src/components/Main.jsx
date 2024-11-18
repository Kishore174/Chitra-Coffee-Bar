import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const Main = () => {
  return (
    <div className='flex h-screen'>
      {/* Fixed Menu on the left */}
      <div className=' lg:w-56'>
        <SideMenu />
      </div>
      {/* Main Content Area */}
      <div className=' flex-1 flex w-full flex-col'>
        <Navbar />
        <div className='flex-1 mx-auto mt-10  md:max-w-screen-lg lg:max-w-screen-2xl p-5  min-w-full'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Main