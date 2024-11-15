import React, { useState, useRef, useEffect } from 'react';
import { FaTachometerAlt, FaStore, FaClipboardCheck, FaUser, FaTools, FaRoute, FaBars, FaTimes } from 'react-icons/fa';
import { AiOutlineAudit } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import logo from "../Assets/logo01.png";
import { useAuth } from '../context/AuthProvider';

const Navbar = ( ) => {
  const [activeButton, setActiveButton] = useState('Dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = useAuth();

  let menuItems;
  if (user) {
    if (user.role === 'super-admin') {
      menuItems = [
        { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
        { name: 'My Shops', icon: FaStore, path: '/myshop' },
        { name: 'Audits', icon: FaClipboardCheck, path: '/aduit' },
        { name: 'Auditer', icon: AiOutlineAudit, path: '/Auditers' },
        { name: 'Profile', icon: FaUser, path: '/profile' },
        { name: 'Settings', icon: FaTools, path: '/setting' },
        {
          name: 'Routes',
          icon: FaRoute,
          subRoutes: [
            { name: 'Create Routes', path: '/routes' },
            { name: 'Set Routes', path: '/SetRoutes' },
          ],
        },
      ];
    } else {
      menuItems = [
        { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
        { name: 'Audits', icon: FaClipboardCheck, path: '/audit' },
        { name: 'Profile', icon: FaUser, path: '/profile' },
      ];
    }
  }

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
    <div className="relative w-full">
      <div className="flex items-center justify-between bg-white shadow p-4 h-16 w-full">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="md:hidden flex items-center">
              {!isMenuOpen && (
                <button onClick={() => setIsMenuOpen(true)} className="text-gray-700">
                  <FaBars className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>

          {isMenuOpen && (
            <div ref={menuRef} className="top-0 left-0 fixed min-h-screen bg-white shadow-lg z-50 md:hidden">
              <div className="flex flex-col h-full">
                <div className="flex justify-end p-4">
                  <button onClick={() => setIsMenuOpen(false)} className="text-gray-700">
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>

                <ul className="flex flex-col justify-start space-y-4 p-4">
                  <div className="flex justify-center mx-auto p-2">
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
                        {item.subRoutes ? (
                          <div>
                            <button
                              className={`flex items-center p-2 space-x-3 w-full text-left transition-colors duration-300 ${
                                isActive ? 'bg-red-100 text-red-500' : 'text-gray-700 hover:text-red-500 hover:bg-gray-100'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{item.name}</span>
                            </button>
                            <ul className="pl-8 mt-2 space-y-2">
                              {item.subRoutes.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link to={subItem.path}>
                                    <button
                                      className="text-gray-600 hover:text-red-500 transition-colors duration-300"
                                      onClick={() => setActiveButton(subItem.name)}
                                    >
                                      {subItem.name}
                                    </button>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <Link to={item.path}>
                            <button
                              className={`flex items-center p-2 space-x-3 w-full text-left transition-colors duration-300 ${
                                isActive ? 'bg-red-100 text-red-500' : 'text-gray-700 hover:text-red-500 hover:bg-gray-100'
                              }`}
                              onClick={() => setActiveButton(item.name)}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{item.name}</span>
                            </button>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end space-x-3 ml-auto">
          <img
            src={logo}
            alt="User Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-gray-700 poppins-semibold">Azero Tech</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
