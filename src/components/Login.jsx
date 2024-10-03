import React from 'react';
import logo from "../../src/Assets/logo01.png";
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen poppins-regular  ">
      <div className="flex flex-col lg:flex-row w-[90%] md:w-[80%] lg:w-[900px] lg:h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Panel */}
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-gradient-to-br from-red-800 to-red-500 text-white p-10">
          <img src={logo} alt="logo" className="h-24 w-24 md:h-36 md:w-36 mb-4" />
          <h1 className="text-xl md:text-2xl font-bold">Welcome Back to</h1>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Chitra Coffee Bar</h2>
          <p className="text-xs md:text-sm mt-4 text-center">
            Enter your credentials to access your account and explore more features.
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 p-6 md:p-10">
          <h2 className="text-xl md:text-2xl font-bold mb-5">Sign In to Your Account</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">E-mail Address</label>
              <input
                type="email"
                placeholder="Enter your mail"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="remember"
                className="mr-2"
              />
              <label htmlFor="remember" className="text-sm">
                Remember Me
              </label>
            </div>
            <Link to ="dashboard">
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded mt-2 hover:bg-red-600"
            >
              Sign In
            </button>
            </Link>
            <div className="mt-4 text-center">
              <a href="/" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </div>
            {/* Sign Up Button */}
            <button
              type="button"
              className="w-full bg-gray-100 text-gray-700 py-2 rounded mt-4 hover:bg-gray-200"
              onClick={() => window.location.href = '/signup'} // Example of redirecting to the Sign Up page
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
