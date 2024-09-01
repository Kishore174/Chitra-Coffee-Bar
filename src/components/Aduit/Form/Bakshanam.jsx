import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

const Bakshanam = () => {
  return (
    <div className="p-6 bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Product Entries */}
        <ProductEntry name="Athirasam" />
        <ProductEntry name="Rava Ladu" />
        <ProductEntry name="Simili" />
        <ProductEntry name="Peruvilanga Urundai" />
        <ProductEntry name="Somas" />
        <ProductEntry name="Elladai" />
        <ProductEntry name="Murruku" />
      </div>
    </div>
  );
};

const ProductEntry = ({ name }) => (
  <Paper elevation={3} className="p-4 rounded-lg bg-white shadow-md">
    <Typography variant="h6" className="mb-4 font-semibold text-gray-800">
      {name}
    </Typography>
    <TextField label="Quantity" type="number" variant="outlined" fullWidth />
  </Paper>
);

export default Bakshanam;
