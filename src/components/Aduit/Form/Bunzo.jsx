import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

const Bunzo = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Product Entries */}
        <ProductEntry name="Bunzo Butter Cookies" />
        <ProductEntry name="Salt Cookies" />
        <ProductEntry name="Peanut Cookies" />
        <ProductEntry name="Butterscotch Cookies" />
        <ProductEntry name="Ragi Biscuits" />
        <ProductEntry name="Orange Biscuits" />
        <ProductEntry name="Coconut Buns" />
        <ProductEntry name="Crem Buns" />
        <ProductEntry name="Jam Buns" />
        <ProductEntry name="Bread Packs" />
        <ProductEntry name="Carrot Cake" />
        <ProductEntry name="Banana Cake" />
        <ProductEntry name="Marble Cake" />
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

export default Bunzo;
