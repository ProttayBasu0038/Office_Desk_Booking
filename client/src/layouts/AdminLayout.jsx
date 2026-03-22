import { Routes , Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import MonthlyUtilization from "../pages/MonthlyUtilization";
import Organization from "../pages/Organization";
import Associate from "../pages/Associate";

function AdminLayout() {
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard/monthly" element={<MonthlyUtilization />} />
        <Route path="/dashboard/organization" element = {<Organization/>}/>
        <Route path="/dashboard/associate" element={<Associate/>} />
      </Routes>
    </div>
  );
}

export default AdminLayout;

