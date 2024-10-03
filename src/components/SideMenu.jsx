import React, { useState } from 'react';
import { FaTachometerAlt, FaStore, FaClipboardCheck, FaUser, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 
import logo from "../Assets/logo01.png";
import { useNavigate } from 'react-router-dom';

const SideMenu = () => {
  const [activeButton, setActiveButton] = useState('Dashboard');
  const [isOpen, setIsOpen] = useState(false); // Sidebar is initially closed in mobile view
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
    { name: 'My Shops', icon: FaStore, path: '/myshop' },
    { name: 'Audits', icon: FaClipboardCheck, path: '/aduit' },
    { name: 'Profile', icon: FaUser, path: '/profile' },
  ];

  // Function to handle logout
  const handleLogout = () => {
    navigate("/");
     
    console.log('Logging out...');
  };

  return (
    <div className={` ${isOpen ? 'w-64  ' : 'w-0'} fixed z-20  h-screen bg-white shadow-lg  w-64  transition-width duration-300 ease-in-out hidden md:block`}>
      {/* Sidebar is hidden on mobile screens and only shown on medium screens and larger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg md:hidden z-50"
      >
        {isOpen ? 'Close' : <FaBars />}
      </button>

      {/* Sidebar content */}
      < div className={`h-full  overflow-y-auto ${isOpen ? 'block' : 'hidden'} md:block`}>
        <Link to="dashboard">
          <div className="flex justify-center mx-auto p-5">
            <img src={logo} alt="Logo" className="h-16 w-16" />
          </div>
        </Link>
        <ul className="space-y-6 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeButton === item.name;

            return (
              <li key={item.name}>
                <Link to={item.path}>
                  <button
                    className={`flex items-center space-x-4 p-2 font-semibold rounded w-full ${
                      isActive ? 'bg-red-500 poppins-semibold text-white' : ' poppins-regular text-black'
                    }`}
                    onClick={() => setActiveButton(item.name)}
                  >
                    <Icon className="h-6 w-6" />
                    <span>{item.name}</span>
                  </button>
                </Link>
              </li>
            );
          })}
          {/* Logout Button */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-4 p-2 font-semibold rounded w-full text-black hover:bg-gray-200"
            >
              <FaSignOutAlt className="h-6 w-6" />
              <span>Logout</span>
            </button>
          </li>
          <li>
            
          </li>
        </ul>
      </ div>
    </div>
  );
};

export default SideMenu;
