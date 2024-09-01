import React from 'react';
import logo from "../Assets/logo01.png";

const Profile = () => {
  return (
    <div className="profile-container max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-8">
        <img
          src={logo}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-md"
        />
        <div className="ml-8">
          <h1 className="text-3xl font-semibold text-gray-800">Azero Tech</h1>
          <p className="text-lg text-gray-600">Manager</p>
        </div>
      </div>
      <form className="space-y-6">
        <div>
          <label htmlFor="phone" className="block text-gray-700 text-sm font-medium">Phone</label>
          <input
            id="phone"
            type="text"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123-456-7890"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-medium">Email ID</label>
          <input
            id="email"
            type="email"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john.doe@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 "
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
