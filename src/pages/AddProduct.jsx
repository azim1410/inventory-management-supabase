import  { useState } from "react";
import { supabase } from "../database/supabaseClient";
import {  TextField, Button, Typography, Box } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
const AddProduct = () => {
  const [product_name, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [product_type, setProductType] = useState("");
  const [short_name, setShortName] = useState("");

  const navigate = useNavigate();

  const handleAddItem = async () => {
    const { error } = await supabase.from('kcs').insert([{ product_name,product_type,short_name, quantity: Number(quantity) }]);
    if (error) console.error(error);
    else navigate('/');
  };
  return (
   <Box sx={{
    margin: '2rem'
   }}>
        <ArrowBackIcon onClick={() => navigate(-1)}/>
      <Typography sx={{fontSize: '2rem', fontFamily: 'sans-serif', fontWeight: 800, color:'#424242',}}>Add Inventory Item</Typography>
      <TextField label="Name" value={product_name} onChange={(e) => setProductName(e.target.value)} fullWidth margin="normal" />
      <TextField label="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} fullWidth margin="normal" />
      <TextField label="Type" value={product_type} onChange={(e) => setProductType(e.target.value)} fullWidth margin="normal" />
      <TextField label="shortName" value={short_name} onChange={(e) => setShortName(e.target.value)} fullWidth margin="normal" />

      <Button variant="contained" color="primary" onClick={handleAddItem}
      sx={{
        backgroundColor: '#ffdd93',
        width: '100%',
        color: '#2d2d2d',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        borderRadius: '8px',
        
    }}>
        Add Item
      </Button>
      </Box>
  );
};

export default AddProduct;
