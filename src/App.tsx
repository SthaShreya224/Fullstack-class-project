
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import Home from './pages/Home'
import Login from "./pages/Login"
import Productdetails from "./pages/Productdetails"
import Products from "./pages/Products"
import Register from "./pages/Register"

function App() {

  return (
    
       <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/productdetails" element={<Productdetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
    
  )
}

export default App
