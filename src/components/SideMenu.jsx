import React, { useState, useEffect } from 'react';
import { FaTachometerAlt, FaStore, FaClipboardCheck, FaUser, FaSignOutAlt, FaTools, FaAngleDown, FaRoute } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../Assets/logo01.png";
import { AiOutlineAudit } from "react-icons/ai";

const SideMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeButton, setActiveButton] = useState(localStorage.getItem('activeButton') || 'Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
    { name: 'My Shops', icon: FaStore, path: '/myshop' },
    { name: 'Audits', icon:FaClipboardCheck, path: '/aduit' },
    { name: 'Auditer', icon:AiOutlineAudit , path: '/Auditers' },

    { name: 'Profile', icon: FaUser, path: '/profile' },
    { name: 'Settings', icon: FaTools, path: '/setting' },
    {
      name: 'Routes',
      icon: FaRoute,
      subRoutes: [
        { name: 'Create Routes', path: 'rotes' },
        { name: 'Set Routes', path: '/SetRoutes' },
      ]
    }
  ];

  const handleLogout = () => {
    navigate("/");
    console.log('Logging out...');
  };

  const handleDropdownToggle = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(
      item => item.path === currentPath || item.subRoutes?.some(sub => sub.path === currentPath)
    );
    if (currentItem) {
      setActiveButton(currentItem.name);
      localStorage.setItem('activeButton', currentItem.name);
    }
  }, [location.pathname]);

  return (
    <div>
      <div
        className={`fixed z-20 h-screen bg-white shadow-lg w-64 transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
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
                  <div className="flex flex-col">
                    <button
                      className={`flex items-center justify-between space-x-4 p-2 font-semibold rounded w-full ${isActive ? 'bg-red-500 text-white' : 'text-black'}`}
                      onClick={() => {
                        if (item.subRoutes) {
                          handleDropdownToggle(item.name);
                        } else {
                          setActiveButton(item.name);
                          localStorage.setItem('activeButton', item.name);
                          setIsSidebarOpen(false);
                          navigate(item.path);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <Icon className="h-6 w-6" />
                        <span>{item.name}</span>
                      </div>
                      {item.subRoutes && <FaAngleDown className={`transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />}
                    </button>

                    {/* Sub-routes dropdown */}
                    {item.subRoutes && openDropdown === item.name && (
                      <ul className="ml-8 mt-2 space-y-2">
                        {item.subRoutes.map((sub) => (
                          <li key={sub.name}>
                            <Link to={sub.path}>
                              <button
                                className={`flex items-center space-x-4 p-2 font-medium rounded w-full ${location.pathname === sub.path ? 'bg-gray-300 text-black' : 'text-gray-600'}`}
                                onClick={() => setIsSidebarOpen(false)}
                              >
                                <span>{sub.name}</span>
                              </button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
        ></div>
      )}
    </div>
  );
};

export default SideMenu;
