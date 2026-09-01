import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const Main = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='flex flex-1 h-screen overflow-hidden bg-gray-50/30'>
      {/* Fixed Menu on the left */}
      <div className='hidden lg:block lg:w-64 lg:flex-shrink-0'>
        <SideMenu isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      </div>
      {/* Main Content Area */}
      <div className='flex-1 flex flex-col w-full relative overflow-hidden'>
        <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className='flex-1 overflow-y-auto overflow-x-hidden pt-16 flex flex-col'>
          <div className='flex-1 mx-auto w-full md:max-w-screen-lg lg:max-w-screen-2xl p-4 md:p-5 flex flex-col'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main