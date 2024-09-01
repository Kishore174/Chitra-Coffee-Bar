import React, { useState, useRef, useEffect } from 'react';
import { FaTachometerAlt, FaStore, FaClipboardCheck, FaUser, FaChevronDown, FaBars, FaTimes,FaSignOutAlt  } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from "../Assets/logo01.png";

const Navbar = () => {
  const [activeButton, setActiveButton] = useState('Dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const menuRef = useRef(null);

  const menuItems = [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
    { name: 'My Shops', icon: FaStore, path: '/myshop' },
    { name: 'Audits', icon: FaClipboardCheck, path: '/aduit' },
    { name: 'Profile', icon: FaUser, path: '/profile' },
    { name: 'Logout', icon: FaSignOutAlt, path: '/' },

  ];

  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between bg-white shadow p-4 h-16 w-full relative">
      {/* Mobile view: Menu icon and Logo */}
      <div className="flex items-center">
        <div className="md:hidden flex items-center">
          {!isMenuOpen && (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-gray-700"
            >
              <FaBars className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile view: Full-height menu with close icon */}
      {isMenuOpen && (
        <div ref={menuRef} className=" top-0 left-0  fixed  min-h-screen bg-white shadow-lg z-50 md:hidden">
          <div className="flex flex-col h-full">
            {/* Close icon */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            
            {/* Menu items as icons */}
            <ul className="flex flex-col justify-start  space-y-8  p-2 h-full">
              <div className='flex justify-center mx-auto p-2'>
              <img
          src={logo}
          alt="User Profile"
          className="h-8 w-8 rounded-full object-cover"
        />
              </div>
         
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeButton === item.name;

                return (
                  <li key={item.name} className="mb-4">
                    
                    <Link to={item.path}>
                      <button
                        className={`flex flex-col items-center justify-center p-2 w-16   transition-colors duration-300 ${
                          isActive ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
                        }`}
                        onClick={() => setActiveButton(item.name)}
                      >
                        <Icon className="h-6 w-6" />
                      </button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Desktop view: User info */}
      <div className="flex items-center space-x-3 ml-auto">
        <img
          src={logo}
          alt="User Profile"
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="text-gray-700 font-medium">Azero Tech</span>
        <FaChevronDown className="text-gray-500" />
      </div>
    </div>
  );
};

export default Navbar;
