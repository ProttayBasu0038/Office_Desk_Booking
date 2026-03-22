import React from 'react'
import FloorMap from '../pages/FloorMap'
import Calender from '../pages/Calender'
import MyBookings from '../pages/MyBookings'
import Dashboard from '../pages/Dashboard'
import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function Mainlayout() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="ml-64 w-full p-8 bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/floor-map" element={<FloorMap />} />
          <Route path="/calendar" element={<Calender />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>

    </div>
  )
}

export default Mainlayout