import React, { useState, useEffect } from 'react';
import { FaTachometerAlt, FaStore, FaClipboardCheck, FaUser, FaSignOutAlt, FaTools, FaAngleDown, FaRoute, FaPhoneAlt, FaFile, FaFingerprint, FaCalendarMinus, FaMobileAlt, FaSlidersH, FaTimes, FaCalendarAlt, FaCommentDots } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../Assets/logo01.png";
import { AiOutlineAudit } from "react-icons/ai";
import { useAuth } from '../context/AuthProvider';
import { logout } from "../API/auth"
import toast from 'react-hot-toast';
import azero from "../Assets/azero.png"

const SideMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setLogin } = useAuth()
  const [activeButton, setActiveButton] = useState(localStorage.getItem('activeButton') || 'Dashboard');
  const [openDropdown, setOpenDropdown] = useState(null);

  let menuItems = [];
  if (user) {
    const ALL_MENU_ITEMS = [
      { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
      { name: 'My Shops', icon: FaStore, path: '/myshop' },
      { name: 'Audits', icon: FaClipboardCheck, path: '/audit' },
      { name: 'Schedule Audit', icon: FaCalendarAlt, path: '/schedule-audit' },
      { name: 'Employee', icon: AiOutlineAudit, path: '/employees' },
      { name: 'My Attendance', icon: FaFingerprint, path: '/attendance' },
      { name: 'Manage Attendance', icon: FaFingerprint, path: '/attendance-management' },
      { name: 'My Leaves', icon: FaCalendarMinus, path: '/leave-request' },
      { name: 'Manage Leaves', icon: FaCalendarMinus, path: '/leave-management' },
      { name: 'My Complaints', icon: FaCommentDots, path: '/complaint-request' },
      { name: 'Manage Complaints', icon: FaCommentDots, path: '/complaint-management' },
      { name: 'Report', icon: FaFile, path: '/reports' },
      { name: 'Devices', icon: FaMobileAlt, path: '/devices' },
      { name: 'Settings', icon: FaTools, path: '/setting' },
      { name: 'Audit Config', icon: FaSlidersH, path: '/audit-config' },
      {
        name: 'Routes',
        icon: FaRoute,
        subRoutes: [
          { name: 'Create Routes', path: '/routes' },
          { name: 'Set Routes', path: '/set-routes' },
        ]
      }
    ];

    if (user.role === "super-admin") {
      menuItems = [...ALL_MENU_ITEMS];
      menuItems.splice(4, 0, { name: 'Profile', icon: FaUser, path: '/profile' });
    } else {
      const userPerms = user.permissions || [];

      menuItems = ALL_MENU_ITEMS.map(item => {
        if (item.subRoutes) {
          const filteredSub = item.subRoutes.filter(sub => userPerms.includes(sub.path));
          return filteredSub.length > 0 ? { ...item, subRoutes: filteredSub } : null;
        }
        return userPerms.includes(item.path) ? item : null;
      }).filter(Boolean);

      // Always give access to profile
      menuItems.push({ name: 'Profile', icon: FaUser, path: '/profile' });
    }
  }

  const handleLogout = () => {
    logout().then(res => {
      localStorage.removeItem('token');
      navigate("/");
      setLogin(false)
      toast.success(res.message)
    }).catch(err => {
      console.log(err)
    })
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
      localStorage.setItem('activeRoute', location.pathname);
    }
  }, [location.pathname]);

  return (
    <div>
      <div
        className={`fixed z-50 overflow-y-auto h-screen bg-white shadow-lg w-64 transition-transform duration-300 ease-in-out 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="">
          <div className="p-2 relative">
            <Link to="/dashboard" className="flex items-center space-x-4 border rounded-lg shadow-xs bg-white text-center hover:bg-gray-100 p-1 transition">
              <img
                src={logo}
                alt="User Profile"
                className="h-12 w-12 rounded-full object-cover border border-gray-300"
              />
              <div>
                <p className="text-lg poppins-semibold text-gray-800">{user?.name || "User Name"}</p>
                <p className="text-sm poppins-medium capitalize text-gray-600">{user?.role} </p>
              </div>
            </Link>
            <button
              className="absolute top-4 right-2 text-gray-500 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

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
                          setIsMobileMenuOpen(false);
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
                                onClick={() => setIsMobileMenuOpen(false)}
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
          <div className="p-4 mt-auto mb-4">
            <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-5 shadow-lg shadow-red-500/30 group">
              {/* Decorative background circle */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-white shadow-md p-2 mb-3 transform group-hover:-translate-y-1 transition-transform duration-300">
                  <img src="https://azerotech.com/assets/AZERO%20LOGO.svg" alt="azero" className="h-full w-full object-contain" />
                </div>
                
                <h2 className="text-lg poppins-semibold text-white mb-1">Need Help?</h2>
                <p className="text-xs poppins-light text-red-100 mb-5 leading-relaxed">
                  Our team is here to assist you. Feel free to reach out!
                </p>
                
                <a href="tel:+91 9363 95 9787" className="w-full">
                  <button className="w-full bg-white/20 hover:bg-white text-white hover:text-red-600 border border-white/30 backdrop-blur-sm poppins-semibold text-sm py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm">
                    <FaPhoneAlt className="group-hover/btn:animate-bounce" size="14" />
                    <span>+91 9363 95 9787</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
        ></div>
      )}
    </div>
  );
};

export default SideMenu;
