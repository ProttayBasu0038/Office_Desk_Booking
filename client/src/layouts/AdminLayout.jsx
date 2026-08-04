import { Routes , Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import MonthlyUtilization from "../pages/MonthlyUtilization";
import Organization from "../pages/Organization";
import Associate from "../pages/Associate";
import SeatLayout from "../pages/SeatLayout";
function AdminLayout() {
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard/monthly" element={<MonthlyUtilization />} />
        <Route path="/dashboard/organization" element = {<Organization/>}/>
        <Route path="/dashboard/associate" element={<Associate/>} />
        <Route path="/dashboard/seatsLayout" element={<SeatLayout/>} />
      </Routes>
    </div>
  );
}

export default AdminLayout;

