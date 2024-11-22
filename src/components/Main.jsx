import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const Main = () => {
  return (
    <div className='flex flex-1 h-screen'>
      {/* Fixed Menu on the left */}
      <div className='lg:w-[16rem]'>
        <SideMenu />
      </div>
      {/* Main Content Area */}
      <div className=' flex-1 flex w-full flex-col'>
        <Navbar className='' />
        <div className='flex-1  mx-auto mt-12  md:max-w-screen-lg lg:max-w-screen-2xl p-5  min-w-full'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Main