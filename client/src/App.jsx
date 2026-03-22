import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Mainlayout from "./layouts/Mainlayout";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoutes";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <Routes>
      {/* Auth Pages (NO Sidebar) */}
      
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLogin />} />

      {/* Admin Dashboard with admin check */}

      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      />

      {/* Protected Dashboard Layout with authentication check */}

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Mainlayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
