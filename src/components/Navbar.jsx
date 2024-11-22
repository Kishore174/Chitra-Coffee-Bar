import React, { useState, useRef, useEffect } from 'react';
import { FaTachometerAlt, FaStore, FaClipboardCheck, FaUser , FaTools, FaRoute, FaBars, FaTimes, FaSignOutAlt, FaAngleDown } from 'react-icons/fa';
import { AiOutlineAudit } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../Assets/logo01.png";
import { useAuth } from '../context/AuthProvider';
import { logout } from "../API/auth";
import toast from 'react-hot-toast';
import azero from "../Assets/azero.png"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeButton, setActiveButton] = useState(localStorage.getItem('activeButton') || 'Dashboard');
  const [openDropdown, setOpenDropdown] = useState(null);

  // Handle click outside of the menu to close it
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

  const handleLogout = () => {
    logout().then(res => {
      toast.success(res.message);
      navigate("/");
    }).catch(err => {
      console.log(err);
    });
  };

  const handleDropdownToggle = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const menuItems = user ? (user.role === "super-admin" ? [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
    { name: 'My Shops', icon: FaStore, path: '/myshop' },
    { name: 'Audits', icon: FaClipboardCheck, path: '/audit' },
    { name: 'Auditor', icon: AiOutlineAudit, path: '/auditors' },
    { name: 'Profile', icon: FaUser , path: '/profile' },
    { name: 'Settings', icon: FaTools, path: '/setting' },
    {
      name: 'Routes',
      icon: FaRoute,
      subRoutes: [
        { name: 'Create Routes', path: '/routes' },
        { name: 'Set Routes', path: '/set-routes' },
      ]
    }
  ] : [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
    { name: 'Audits', icon: FaClipboardCheck, path: '/audit' },
    { name: 'Profile', icon: FaUser , path: '/profile' },
  ]) : [];

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath || item.subRoutes?.some(sub => sub.path === currentPath));
    if (currentItem) {
      setActiveButton(currentItem.name);
      localStorage.setItem('activeButton', currentItem.name);
    }
  }, [location.pathname, menuItems]);

  return (
    <div className="relative  w-full">
      <div className="flex fixed z-40  items-center justify-between bg-white shadow p-4 h-16 w-full">
        <div className="">
          <div className="flex items-center">
            <div className=" flex items-center">
              {!isMenuOpen && (
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="text-gray-700 lg:hidden"
                  aria-label="Open menu"
                >
                  <FaBars className="h-6 w-6  text-xl" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-3 ml-auto">
          <img
            src={logo}
            alt="User  Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-gray-700 font-semibold">{user?.name}</span>
        </div>
      </div>

      {/* Conditional Rendering of Side Menu */}
      {isMenuOpen && (
        <div ref={menuRef}>
          <div className={`fixed top-0 z-50 h-screen bg-white shadow-lg w-64 transition-transform duration-300 ease-in-out 
          ${isMenuOpen ? 'translate-x-0  lg:hidden' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="h-full  overflow-y-auto scrollbar-custom">
              <Link to="/dashboard">
                <div className="flex items-center mx-auto justify-center h-16 w-16 mt-3 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300">
                  <img src={logo} alt="Logo" className="h-17 w-17" />
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
                          className={`flex items-center justify-between space-x-4 p-2 poppins-semibold rounded w-full ${isActive ? 'bg-red-500 text-white' : 'text-black'}`}
                          onClick={() => {
                            if (item.subRoutes) {
                              handleDropdownToggle(item.name);
                            } else {
                              setActiveButton(item.name);
                              localStorage.setItem('activeButton', item.name);
                              setIsMenuOpen(false);
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

                        {item.subRoutes && openDropdown === item.name && (
                          <ul className="ml-8 mt-2 space-y-2">
                            {item.subRoutes.map((sub) => (
                              <li key={sub.name}>
                                <Link to={sub.path}>
                                  <button
                                    className={`flex items-center space-x-4 p-2 text-md poppins-medium rounded w-full ${location.pathname === sub.path ? 'bg-gray-300 text-black' : 'text-gray-600'}`}
                                    onClick={() => setIsMenuOpen(false)}
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
              <div className="p-4 mt-auto">
            <div className="border border-gray-300 text-white bg-red-600 rounded-lg p-6">
              <div className="flex items-start space-x-2 ">
                <img src={azero} alt="azero" className="h-12 w-12 my-4 rounded-full border border-white p-1" />
                <div>
                  <h2 className="text-md poppins-semibold font-semibold">Need Help?</h2>
                  <p className="text-xs poppins-light text-white">
                    Our team is here to assist you. Feel free to reach out!
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-center w-full">
                <a href="https://azerotech.com/">
                  <button className="bg-white poppins-semibold text-black text-sm py-2 px-4 rounded-full   transition duration-200">
                    Contact Us
                  </button>
                </a>
              </div>
            </div>
          </div>
            </div>
          </div>
          {isMenuOpen && (
            <div
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
            ></div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;