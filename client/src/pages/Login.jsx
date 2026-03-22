import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiZap, FiLoader } from "react-icons/fi";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
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
      
      if(user.role === "admin"){
        setError("Admin users must log in through the admin portal");
        setLoading(false);
        return;
      }

      // Save user and token to context and localStorage
      saveUser(user, token);

      setForm({ email: "", password: "" });

      setTimeout(() => {
        navigate("/");
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
      {/* LEFT SECTION - Enhanced */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <FiZap className="text-2xl text-yellow-300" />
            </div>
            <span className="text-2xl font-black tracking-tight">SeatBook</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <h1 className="text-5xl font-black mb-6 leading-tight">
            Welcome back to
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-cyan-200">
              seamless booking
            </span>
          </h1>

          <p className="text-blue-100 text-lg mb-12 max-w-md">
            Sign in to your account and continue booking your ideal workspace
            with ease.
          </p>

          {/* Stats */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/15 transition-all">
              <div className="text-3xl font-black text-blue-200">500+</div>
              <div>
                <p className="font-semibold">Active Workspaces</p>
                <p className="text-sm text-blue-100">Ready to book</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/15 transition-all">
              <div className="text-3xl font-black text-emerald-200">98%</div>
              <div>
                <p className="font-semibold">User Satisfaction</p>
                <p className="text-sm text-blue-100">Highly rated</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/15 transition-all">
              <div className="text-3xl font-black text-pink-200">24/7</div>
              <div>
                <p className="font-semibold">Round-the-clock Access</p>
                <p className="text-sm text-blue-100">Always available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-blue-200 border-t border-white/10 pt-6">
          © 2026 SeatBook. Building better workspaces.
        </div>
      </div>

      {/* RIGHT LOGIN FORM - Enhanced */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Sign in</h2>
            <p className="text-gray-500 text-lg">
              Access your workspace account
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="name@company.com"
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-all shadow-sm hover:border-gray-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-all shadow-sm hover:border-gray-300"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Keep me signed in
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Create Account Link */}
          <p className="text-center text-gray-600 mt-6 border-t border-gray-200 pt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              Create one now
            </button>
          </p>

          {/* Admin Login Link */}
          <p className="text-center text-gray-500 mt-4">
            Admin?{" "}
            <button
              onClick={() => navigate("/admin")}
              className="text-red-600 font-semibold hover:text-red-700 transition"
            >
              Go to admin panel
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
