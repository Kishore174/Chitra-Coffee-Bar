import React, { useState, useEffect } from 'react';
import { FaTachometerAlt, FaStore, FaClipboardCheck, FaUser, FaSignOutAlt, FaTools, FaAngleDown, FaRoute, FaPhoneAlt } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../Assets/logo01.png";
import { AiOutlineAudit } from "react-icons/ai";
import { useAuth } from '../context/AuthProvider';
import {logout} from "../API/auth"
import toast from 'react-hot-toast';
import azero from "../Assets/azero.png"
const SideMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {user,setLogin} = useAuth()
  const [activeButton, setActiveButton] = useState(localStorage.getItem('activeButton') || 'Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  let menuItems;
  if(user){
    if(user.role==="super-admin"){
      menuItems= [
        { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
        { name: 'My Shops', icon: FaStore, path: '/myshop' },
        { name: 'Audits', icon:FaClipboardCheck, path: '/audit' },
        { name: 'Auditor', icon:AiOutlineAudit , path: '/auditors' },
    
        { name: 'Profile', icon: FaUser, path: '/profile' },
        { name: 'Settings', icon: FaTools, path: '/setting' },
        {
          name: 'Routes',
          icon: FaRoute,
          subRoutes: [
            { name: 'Create Routes', path: '/routes' },
            { name: 'Set Routes', path: '/set-routes' },
          ]
        }
      ];
    }else{
      menuItems= [
        { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
        { name: 'My Shops', icon: FaStore, path: '/myshop' },

        { name: 'Audits', icon:FaClipboardCheck, path: '/audit' },
        {
          name: 'Routes',
          icon: FaRoute,
          subRoutes: [
            // { name: 'Create Routes', path: '/routes' },
            { name: 'Set Routes', path: '/set-routes' },
          ]
        },
        { name: 'Profile', icon: FaUser, path: '/profile' },
       
      ];
    }
  }
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1025) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleLogout = () => {
    logout().then(res=>{
      navigate("/"); 
      setLogin(false)
      toast.success(res.message)
    }).catch(err=>{
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
        className={`fixed z-50 overflow-y-auto scrollbar-custom h-screen bg-white shadow-lg w-64 transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} max:translate-x-0 lg:translate-x-0`}
      >
        <div className="">
        <div className="p-2 ">
          <Link to="/dashboard" className="flex items-center space-x-4  border  rounded-lg  shadow-xs bg-white text-center hover:bg-gray-100 p-1  transition">
            <img
              src={logo}
              alt="User  Profile"
              className="h-12 w-12 rounded-full object-cover border border-gray-300"
            />
            <div>
              <p className="text-lg poppins-semibold text-gray-800">{user?.name || "User  Name"}</p>
              <p className="text-sm  poppins-medium capitalize text-gray-600">{user?.role} </p>
            </div>
          </Link>
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
  
                  {item.subRoutes && openDropdown === item.name && (
                    <ul className="ml-8 mt-2 space-y-2">
                      {item.subRoutes.map((sub) => (
                        <li key={sub.name}>
                          <Link to={sub.path}>
                            <button
                              className={`flex items-center space-x-4 p-2 text-md poppins-medium rounded w-full ${location.pathname === sub.path ? 'bg-gray-300 text-black' : 'text-gray-600'}`}
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
             
                  <button className="bg-white poppins-semibold text-black text-sm py-2 px-4 rounded-full transition duration-200 flex items-center gap-2">
                    <a href="tel:+91 9363 95 9787"  className="flex items-center">
 <FaPhoneAlt size="19"  />
 <span className="ml-2  whitespace-nowrap">+91 9363959787</span>
</a>
                  </button>
               
              </div>
            </div>
          </div>
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
