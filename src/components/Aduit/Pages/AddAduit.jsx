import React from 'react';
import { Link } from "react-router-dom";
import tea from "../../../Assets/tea.jpg";
import coffee from "../../../Assets/coffee.jpg";
import livesnacks from "../../../Assets/livesnacks.jpg";
import bunzo from "../../../Assets/bunzo.jpg";
import bakshanam from "../../../Assets/bakshanam.jpg";
import bakery from '../../../Assets/bakery.jpg'
import insideshop from '../../../Assets/insideshop.jpg'
import WallBranding from '../../../Assets/wall-branding.jpg'
import outsideshop from '../../../Assets/outside.jpg'
import profileImage from '../../../Assets/logo01.png'
const audits = [
  { id: 1, image: tea, alt: "tea", label: "Tea", link: "/tea" },
  { id: 2, image: coffee, alt: "coffee", label: "Coffee", link: "/coffee" },
  { id: 3, image: livesnacks, alt: "snacks", label: "Live Snacks", link: "/livesnacks" },
  { id: 4, image: bakery, alt: "bunzo", label: "Bakery Products", link: "/bunzo" },
  { id: 5, image: insideshop, alt: "insideshop", label: "Inside Shop", link: "/nextProcess" },
  { id: 6, image: insideshop, alt: "insidektchen", label: "Inside Kitchen", link: "/Kitchenarea" },
  { id: 7, image: outsideshop, alt: "outsidektchen", label: "Outside Kitchen", link: "/Outsideshop" },
  { id: 8, image: WallBranding, alt: "wallBranding", label: "Wall Branding", link: "/Branding" },
];

const AddAudit = () => {
  return (
    <>
  <div className="flex items-center justify-start p-6 bg-gradient-to-r  ml-24   max-w-2xl   my-4 border  transition-transform duration-300 transform hover:scale-105">
 
  <div className="flex-shrink-0 mr-6">
    <img
      src={profileImage}
      alt="Profile"
      className="h-32 w-32 rounded-full border-4 border-red-500 object-cover transition-transform duration-300 transform hover:scale-110"
    />
  </div>

  <div>
    <h2 className="text-2xl poppins-bold text-gray-800 mb-1 hover:text-red-600 cursor-pointer transition-colors duration-300">Kumar</h2>

    <div className="text-sm text-gray-700">
      <p className="mb-1">
        <span className="font-semibold">Email:</span> <span className="text-gray-600">example@example.com</span>
      </p>
      <p className="mb-1">
        <span className="font-semibold">Location:</span> <span className="text-gray-600">Vellore</span>
      </p>
      <p>
        <span className="font-semibold">Occupation:</span> <span className="text-gray-600">Manager</span>
      </p>
    </div>
  </div>
</div>


    <div className='p-6 mx-auto flex flex-col items-center'>

        <div className='flex flex-wrap gap-5 justify-center'>
          {audits.map((audit) => (
            <div key={audit.id} className='bg-white shadow-lg rounded-lg w-52 flex flex-col items-center p-3 transition-transform transform hover:scale-105 hover:shadow-xl'>
              <div className="relative h-44 w-full rounded-lg overflow-hidden mb-2">
                <img src={audit.image} alt={audit.alt} className='h-full w-full object-cover transition-transform transform hover:scale-110' />
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity"></div>
              </div>
              <Link to={audit.link} className='w-full'>
                <button className='bg-red-500 text-white w-full py-2 mt-1 poppins-semibold rounded-md hover:bg-red-600 transition-colors'>
                  {audit.label}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div></>
  );
}

export default AddAudit;
