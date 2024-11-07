import React from 'react';
import ShopCard from './ShopCard';

const SelectedRoutesDisplay = () => {
  return (
    <div className="grid p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <ShopCard key={index} />
      ))}
    </div>
  );
};

export default SelectedRoutesDisplay;
