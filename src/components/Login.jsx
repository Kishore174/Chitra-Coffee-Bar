import React, { useEffect, useState } from 'react';
import logo from "../../src/Assets/logo01.png";
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { login, resetPassword } from '../API/auth';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthProvider';
import Loader from './Loader';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', otp: '', newPassword: '', confirmPassword: '' });
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0); // 0: login, 1: email, 2: otp, 3: new password
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false); // Loading state

  const {setUser,user,isLogin,setIsLogin} = useAuth()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordStep(1); // Move to email input step
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (forgotPasswordStep === 1) {
      setForgotPasswordStep(2);
    } else if (forgotPasswordStep === 2) {
      setForgotPasswordStep(3);
    } else if (forgotPasswordStep === 3) {
      const resetPasswordData = {
        newPassword:formData.newPassword,
        confirmPassword : formData.confirmPassword
      }
      resetPassword(resetPasswordData).then((res)=>{
        navigate('/dashboard')
        toast.success(res?.message)
      }).catch((err)=>{
        console.log(err)
        toast.success(err.response?.data?.message)
      })
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = {
      email: formData.email,
      password: formData.password,
    };
    setLoading(true)
    login(loginData)
      .then((res) => {
        const data = res.data;
        if (data.isFirstLogin) {
          setForgotPasswordStep(3);
        } else {
          navigate('/dashboard');
        }
        setUser(data);
        setLoading(false)
        toast.success(res.message);
      })
      .catch((err) => {
        console.error("Error:", err); // Check for errors
        toast.error(err.response?.data?.message);
      }).finally(()=>{
        setLoading(false)
      });
  };
  
  useEffect(() => {
    if (isLogin) {
      navigate('/dashboard');
    }
  }, [isLogin, navigate]);
  return (
    <>
    {
      loading?<Loader/>:(

        <div className="flex justify-center items-center min-h-screen poppins-regular">
      <div className="flex flex-col lg:flex-row w-[90%] md:w-[80%] lg:w-[900px] lg:h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-gradient-to-br from-red-800 to-red-500 text-white p-10">
          <img src={logo} alt="logo" className="h-24 w-24 md:h-36 md:w-36 mb-4" />
          <h1 className="text-xl md:text-2xl font-bold">Welcome Back to</h1>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Chitra Coffee Bar</h2>
          <p className="text-xs md:text-sm mt-4 text-center">
            Enter your credentials to access your account and explore more features.
          </p>
        </div>

        <div className="flex flex-col justify-center w-full lg:w-1/2 p-6 md:p-10">
          {forgotPasswordStep === 0 && (
            <>
              <h2 className="text-xl md:text-2xl font-bold mb-5">Sign In to Your Account</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">E-mail Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 cursor-pointer text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded mt-2 hover:bg-red-600"
          >
            Sign In
          </button>
                <div className="mt-4 text-center">
                  <button type="button" onClick={handleForgotPasswordClick} className="text-sm text-red-500 hover:underline">
                    Forgot Password?
                  </button>
                </div>
              </form>
            </>
          )}

          {forgotPasswordStep === 1 && (
            <form onSubmit={handleForgotPasswordSubmit}>
              <h2 className="text-xl md:text-2xl font-bold mb-5">Enter Your Email</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">E-mail Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button type="submit" className="w-full bg-red-500 text-white py-2 rounded mt-2 hover:bg-red-500">
                Send OTP
              </button>
            </form>
          )}

          {forgotPasswordStep === 2 && (
            <form onSubmit={handleForgotPasswordSubmit}>
              <h2 className="text-xl md:text-2xl font-bold mb-5">Enter OTP</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">OTP</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button type="submit" className="w-full bg-red-500 text-white py-2 rounded mt-2 hover:bg-red-500">
                Verify OTP
              </button>
            </form>
          )}

          {forgotPasswordStep === 3 && (
            <form onSubmit={handleForgotPasswordSubmit}>
              <h2 className="text-xl md:text-2xl font-bold mb-5">Reset Password</h2>
              <div className="mb-4 relative">
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="mb-4 relative">
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button type="submit" className="w-full bg-red-500 text-white py-2 rounded mt-2 hover:bg-red-500">
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
      )
    }
    </>
  );
};

export default Login;
