import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiZap,
  FiLoader,
  FiShield,
} from "react-icons/fi";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { saveUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { token, user } = response.data;

      // Check if user is admin
      if (user.role !== "admin") {
        setError("Access denied: Admin privileges required");
        setLoading(false);
        return;
      }

      // Save user and token to context and localStorage
      saveUser(user, token);

      console.log("Admin login successful:", response.data);
      setForm({ email: "", password: "" });

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT SECTION - Admin Theme */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-red-600 via-red-700 to-purple-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <FiShield className="text-2xl text-yellow-300" />
            </div>
            <span className="text-2xl font-black tracking-tight">
              SeatBook Admin
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <h1 className="text-5xl font-black mb-6 leading-tight">
            Admin Portal
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-200 to-pink-200">
              Management Dashboard
            </span>
          </h1>

          <p className="text-red-100 text-lg mb-12 max-w-md">
            Manage office seat bookings, view analytics, and oversee all
            workspace reservations.
          </p>

          {/* Stats */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/15 transition-all">
              <div className="text-3xl font-black text-red-200">500+</div>
              <div>
                <p className="font-semibold">Total Bookings</p>
                <p className="text-sm text-red-100">Managed seats</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/15 transition-all">
              <div className="text-3xl font-black text-pink-200">100+</div>
              <div>
                <p className="font-semibold">Active Users</p>
                <p className="text-sm text-red-100">Registered employees</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/15 transition-all">
              <div className="text-3xl font-black text-orange-200">95%</div>
              <div>
                <p className="font-semibold">Utilization Rate</p>
                <p className="text-sm text-red-100">Optimization metrics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-red-200 border-t border-white/10 pt-6">
          © 2026 SeatBook. Admin Control Center.
        </div>
      </div>

      {/* RIGHT LOGIN FORM - Admin Theme */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FiShield className="text-red-600 text-2xl" />
              <h2 className="text-4xl font-black text-gray-900">Admin Login</h2>
            </div>
            <p className="text-gray-500 text-lg">
              Access the administration panel
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg flex gap-3 animate-slideIn">
              <div className="text-red-600 text-xl shrink-0">⚠</div>
              <div>
                <p className="font-medium text-red-900">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="group">
              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Admin Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  id="admin-email"
                  value={form.email}
                  placeholder="admin@company.com"
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-all shadow-sm hover:border-gray-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="admin-password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  id="admin-password"
                  value={form.password}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-all shadow-sm hover:border-gray-300"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-red-500 rounded cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
              >
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Not an admin?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-red-600 hover:text-red-700 transition-colors hover:underline"
              >
                Go to user login
              </button>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 font-semibold flex items-center gap-2">
              <FiShield size={14} />
              This is a restricted admin area. Unauthorized access is monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
