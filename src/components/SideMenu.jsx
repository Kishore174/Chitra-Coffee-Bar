import React, { useState, useEffect } from 'react';
import { FaTachometerAlt, FaStore, FaClipboardCheck, FaUser, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom'; 
import logo from "../Assets/logo01.png";
import { useNavigate } from 'react-router-dom';

const SideMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize activeButton from localStorage or default to 'Dashboard'
  const [activeButton, setActiveButton] = useState(localStorage.getItem('activeButton') || 'Dashboard');
  
  const menuItems = [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
    { name: 'My Shops', icon: FaStore, path: '/myshop' },
    { name: 'Audits', icon: FaClipboardCheck, path: '/aduit' },
    { name: 'Profile', icon: FaUser, path: '/profile' },
  ];

  const handleLogout = () => {
    navigate("/");
    console.log('Logging out...');
  };

  // Update activeButton based on the current location
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    if (currentItem) {
      setActiveButton(currentItem.name);
      localStorage.setItem('activeButton', currentItem.name); // Save to localStorage
    }
  }, [location.pathname]); // Runs whenever the path changes

  return (
    <div className="fixed z-20 h-screen bg-white shadow-lg w-64"> {/* Sidebar is always visible */}
      <div className="h-full overflow-y-auto">
        <Link to="/dashboard">
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
                    className={`flex items-center space-x-4 p-2 font-semibold rounded w-full ${isActive ? 'bg-red-500 poppins-semibold text-white' : 'poppins-regular text-black'}`}
                    onClick={() => {
                      setActiveButton(item.name);
                      localStorage.setItem('activeButton', item.name); // Save active button to localStorage
                    }}
                  >
                    <Icon className="h-6 w-6" />
                    <span>{item.name}</span>
                  </button>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-4 p-2 font-semibold rounded w-full text-black hover:bg-gray-200"
            >
              <FaSignOutAlt className="h-6 w-6" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;
