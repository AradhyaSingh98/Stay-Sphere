import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Properties from './pages/Properties'
import PropertyDetails from './pages/PropertyDetails'
import AddProperty from './pages/AddProperty'
import MyBookings from './pages/MyBookings'
import EditProperty from './pages/EditProperty'
import HostDashboard from './pages/HostDashboard'




function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/edit-property/:id" element={<EditProperty/>} />
        <Route path="/host-dashboard" element={<HostDashboard />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App