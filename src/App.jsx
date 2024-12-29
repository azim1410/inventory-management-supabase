import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePAge'
import AddProduct from './pages/AddProduct'
import ManageInventory from './pages/ManageInventory'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<HomePage />}/>
        <Route path="/add" element={<AddProduct />}/>
        <Route path="/manage-inventory" element={<ManageInventory />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
