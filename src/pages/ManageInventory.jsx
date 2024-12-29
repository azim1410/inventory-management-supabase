import { useState, useEffect } from "react";
import {
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
} from "@mui/material";
import { supabase } from "../database/supabaseClient";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const ManageInventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch Products
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

  // Search Products
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

  // Open Edit Dialog
  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setEditDialogOpen(true);
  };

  // Handle Field Change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Save Edited Product
  const handleSave = async () => {
    const { error } = await supabase
      .from("kcs")
      .update(currentProduct)
      .eq("id", currentProduct.id);

    if (error) {
      console.error("Error updating product:", error);
    } else {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === currentProduct.id ? currentProduct : product
        )
      );
      setFilteredProducts((prev) =>
        prev.map((product) =>
          product.id === currentProduct.id ? currentProduct : product
        )
      );
      setEditDialogOpen(false);
    }
  };

  // Open Delete Confirmation Dialog
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    const { error } = await supabase
      .from("kcs")
      .delete()
      .eq("id", productToDelete);

    if (error) {
      console.error("Error deleting product:", error);
    } else {
      setProducts((prev) =>
        prev.filter((product) => product.id !== productToDelete)
      );
      setFilteredProducts((prev) =>
        prev.filter((product) => product.id !== productToDelete)
      );
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <Box sx={{ margin: "1rem" }}>
      <ArrowBackIcon onClick={() => navigate(-1)} />
      <Typography
        sx={{
          fontSize: "2rem",
          fontFamily: "sans-serif",
          fontWeight: 800,
          color: "#424242",
        }}
      >
        Manage Inventory
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Product Table */}
      <TableContainer component={Paper} sx={{height: '90vh'}}>
        <Table >
          <TableHead sx={{ backgroundColor: '#ffeec8', position: 'sticky', top: 0, zIndex: 2 }}>
            <TableRow>
              <TableCell
                sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#3c3c3c" }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#3c3c3c" }}
              >
                Type
              </TableCell>
              <TableCell
                sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#3c3c3c" }}
              >
                Short
              </TableCell>
              <TableCell
                sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#3c3c3c" }}
              >
                Quantity
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#3c3c3c" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell sx={{fontWeight: 'bold'}}>{product.product_name}</TableCell>
                <TableCell>{product.product_type}</TableCell>
                <TableCell>{product.short_name}</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>{product.quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditClick(product)}
                    sx={{ marginRight: "1rem" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteClick(product.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
         <DialogTitle>Edit Product</DialogTitle>
         <DialogContent>
           <Grid container spacing={2} mt={1}>
             <Grid item xs={6}>
             <TextField
                label="Product Name"
                name="product_name"
                value={currentProduct.product_name || ""}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Product Type"
                name="product_type"
                value={currentProduct.product_type || ""}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Short Name"
                name="short_name"
                value={currentProduct.short_name || ""}
                onChange={handleEditChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Quantity"
                name="quantity"
                value={currentProduct.quantity || ""}
                onChange={handleEditChange}
                type="number"
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageInventory;
