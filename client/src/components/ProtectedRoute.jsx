import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {

  const { user,token, loading } = useContext(AuthContext);

  // While loading, show a loading screen

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  
  // If authenticated, render the component
  return children;
};

export default ProtectedRoute;
