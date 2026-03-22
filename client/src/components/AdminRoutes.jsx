import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


export default function AdminRoute({ children }) {
  
  const { user, token, loading } = useContext(AuthContext);

  // same loading check as ProtectedRoute
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // no token → go to login
  if (!token) return <Navigate to="/login" replace />;

  // has token but not admin → go to home
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
}