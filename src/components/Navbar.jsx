import React from 'react';
import { FaBars } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from "../Assets/logo01.png";
import { useAuth } from '../context/AuthProvider';
import { logout } from "../API/auth";
import toast from 'react-hot-toast';

const Navbar = ({ setIsMobileMenuOpen }) => {
  const { user } = useAuth();

  return (
    <div className="relative w-full">
      <div className="flex fixed z-40 items-center justify-between bg-white shadow p-4 h-16 w-full lg:w-[calc(100%-16rem)]">
        <div>
          <div className="flex items-center">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-700 lg:hidden"
                aria-label="Open menu"
              >
                <FaBars className="h-6 w-6 text-xl" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-3 ml-auto pr-4 lg:pr-8">
          <img
            src={logo}
            alt="User Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-gray-700 font-semibold">{user?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;