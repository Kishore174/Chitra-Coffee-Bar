import React from 'react';
import { Link } from "react-router-dom"; // Import Link
import tea from "../../../Assets/tea.jpg";
import coffee from "../../../Assets/coffee.jpg";
import livesnacks from "../../../Assets/livesnacks.jpg";

import { FaAnglesRight } from "react-icons/fa6";

const audits = [
  { id: 1, image: tea, alt: "tea", label: "Audit Tea", link: "/tea" },
  { id: 2, image: coffee, alt: "coffee", label: "Audit Coffee", link: "/coffee" },
  { id: 3, image: livesnacks, alt: "snacks", label: "Live Snacks", link: "/livesnacks" }

];

const AddAudit = () => {
  return (
    <div className='p-6 mx-auto flex space-x-4'>
      {audits.map((audit) => (
        <div key={audit.id} className='bg-white shadow-md rounded-md h-auto w-44 flex flex-col items-center p-2 justify-center'>
          <img src={audit.image} alt={audit.alt} className='max-h-full max-w-full h-60 object-cover rounded-xl' />
          <Link to={audit.link}> {/* Wrap button in Link */}
            <button className='bg-red-500 text-white w-full px-4 mb-0.5 py-1 mt-1 flex items-center justify-center space-x-2 rounded-md hover:bg-red-600'>
              <span>{audit.label}</span>
              <FaAnglesRight />
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default AddAudit;
