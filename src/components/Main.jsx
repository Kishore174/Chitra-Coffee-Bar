import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const Main = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='flex flex-1 h-screen'>
      {/* Fixed Menu on the left */}
      <div className='hidden lg:block lg:w-64 lg:flex-shrink-0'>
        <SideMenu isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      </div>
      {/* Main Content Area */}
      <div className=' flex-1 flex w-full flex-col'>
        <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className='flex-1 mx-auto mt-16 md:max-w-screen-lg lg:max-w-screen-2xl p-5 w-full flex flex-col'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Main