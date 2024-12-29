import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../database/supabaseClient";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");

  const navigate = useNavigate();

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("kcs").select("*");
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setProducts(data || []);
        setFilteredProducts(data || []);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.product_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.short_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Handle Quantity Edit Start
  const handleEditStart = (id, currentQuantity) => {
    setEditingId(id);
    setEditQuantity(currentQuantity);
  };

  // Handle Quantity Change
  const handleQuantityChange = (e) => {
    setEditQuantity(e.target.value);
  };

  // Handle Quantity Update
  const handleQuantityUpdate = async (id) => {
    const newQuantity = Number(editQuantity);

    if (isNaN(newQuantity)) {
      console.error("Invalid quantity entered!");
      return;
    }

    const { error } = await supabase
      .from("kcs")
      .update({ quantity: newQuantity })
      .eq("id", id);

    if (error) {
      console.error("Error updating quantity:", error);
    } else {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, quantity: newQuantity } : product
        )
      );
      setFilteredProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, quantity: newQuantity } : product
        )
      );
      setEditingId(null);
      setEditQuantity("");
    }
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{padding:'1rem'}}>
      <TextField
        label="🔍 Search by Name or Short Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}
      />

      {/* Add Product Button */}
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '1rem'}}>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: "20px" }}
        onClick={() => navigate("/add")}
        sx={{
            backgroundColor: '#ffdd93',
            color: '#2d2d2d',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            borderRadius: '8px',
            width:'40%'
        }}
      >
        Add New Product
      </Button>

      <Button
        variant="contained"
        color="secondary"
        style={{ marginBottom: "20px" }}
        onClick={() => navigate("/manage-inventory")}
        sx={{
            backgroundColor: '#ffdd93',
            color: '#2d2d2d',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            borderRadius: '8px',
            width:'40%'
        }}
      >
        Manage Inventory
      </Button>
      </Box>

      {/* Product Table */}
      <TableContainer component={Paper} 
      sx={{
        height: '90vh',
      }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: '#ffeec8', position: 'sticky', top: 0, zIndex: 2 }}>
            <TableRow>
              <TableCell sx={{fontSize: '1.2rem', fontWeight: 600, color: '#3c3c3c'}} >Name</TableCell>
              <TableCell sx={{fontSize: '1.2rem', fontWeight: 600, color: '#3c3c3c'}} >Type</TableCell>
              <TableCell sx={{fontSize: '1.2rem', fontWeight: 600, color: '#3c3c3c'}} >Short</TableCell>
              <TableCell sx={{fontSize: '1.2rem', fontWeight: 600, color: '#3c3c3c'}} >Quantity</TableCell>
              <TableCell sx={{fontSize: '1.2rem', fontWeight: 600, color: '#3c3c3c'}} >Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell sx={{color: '#3e3e3e', fontWeight: 'bold'}}>{product.product_name}</TableCell>
                  <TableCell sx={{color: '#3e3e3e'}}>{product.product_type}</TableCell>
                  <TableCell sx={{color: '#3e3e3e'}}>{product.short_name}</TableCell>
                  <TableCell sx={{color: '#3e3e3e', fontWeight: 'bold'}}>
                    {editingId === product.id ? (
                      <TextField
                        value={editQuantity}
                        onChange={handleQuantityChange}
                        onBlur={() => handleQuantityUpdate(product.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleQuantityUpdate(product.id);
                        }}
                        type="number"
                        autoFocus
                        size="small"
                      />
                    ) : (
                      product.quantity
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleQuantityUpdate(product.id)}
                        size="small"
                        sx={{
                            color: 'black',
                            borderColor: '#ffdd93',
                            backgroundColor: '#8dfd9b'
                        }}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          handleEditStart(product.id, product.quantity)
                        }
                        size="small"
                        sx={{
                            color: 'black',
                            borderColor: '#ffdd93',
                            backgroundColor: '#ffecba '
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products match your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
      </Box>
  );
};

export default HomePage;
