import React from 'react';
import { Link } from "react-router-dom"; // Import Link
import tea from "../../../Assets/tea.jpg";
import coffee from "../../../Assets/coffee.jpg";
import livesnacks from "../../../Assets/livesnacks.jpg";
import bunzo from "../../../Assets/bunzo.jpg";
import bakshanam from "../../../Assets/bakshanam.jpg";


import { FaAnglesRight } from "react-icons/fa6";

const audits = [
  { id: 1, image: tea, alt: "tea", label: "Audit Tea", link: "/tea" },
  { id: 2, image: coffee, alt: "coffee", label: "Audit Coffee", link: "/coffee" },
  { id: 3, image: livesnacks, alt: "snacks", label: "Live Snacks", link: "/livesnacks" },
  { id: 4, image: bunzo, alt: "bunzo", label: "bunzo", link: "/Bunzo" },
  // { id: 5, image: bunzo, alt: "bunzo", label: "bunzo", link: "/Bunzo" },
  { id: 5, image: bakshanam, alt: "bakshanm", label: "bakshanam", link: "/bakshanam" },


];

const AddAudit = () => {
  return (
    <div className='p-6 mx-auto flex space-x-4'>
      {audits.map((audit) => (
        <div key={audit.id} className='bg-white shadow-md rounded-md h-auto w-44 flex flex-col items-center p-2 justify-center'>
          <div className="h-44 w-full overflow-hidden rounded-xl">
            <img src={audit.image} alt={audit.alt} className='h-full w-full object-fit' /> {/* Ensure full image is displayed */}
          </div>
          <Link to={audit.link}>
            <button className='bg-red-500 text-white w-full px-3 mb-0.5 py-2 mt-1 flex items-center justify-center space-x-1 rounded-md hover:bg-red-600'>
              <span>{audit.label}</span>
              <FaAnglesRight className="text-lg" />
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default AddAudit;
