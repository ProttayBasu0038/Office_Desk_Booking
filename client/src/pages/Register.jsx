import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import {
  FiMail,
  FiLock,
  FiUser,
  FiCheckCircle,
  FiZap,
  FiBarChart2,
  FiUsers,
  FiLoader,
} from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();
  const { saveUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (!form.agree) {
      setError("Please agree to Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      const { token, user } = response.data;

      // Save user and token to context and localStorage
      saveUser(user, token);

      setSuccess("Registration successful! Redirecting...");
      console.log("Registration successful:", response.data);

      setForm({
        name: "",
        email: "",
        password: "",
        agree: false,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT SIDE - Enhanced Hero Section */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-900 text-white flex-col justify-between px-16 py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>

        {/* Logo Section */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <FiZap className="text-2xl text-yellow-300" />
            </div>
            <span className="text-2xl font-black tracking-tight">SeatBook</span>
          </div>

          <h1 className="text-5xl font-black mb-6 leading-tight">
            Book your perfect desk.
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-cyan-200">
              Work your way.
            </span>
          </h1>

          <p className="text-blue-100 text-lg mb-8 max-w-md">
            Join thousands of professionals optimizing their workspace
            productivity with smart seat booking.
          </p>
        </div>

        {/* Features List */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center shrink-0 mt-1">
              <FiCheckCircle className="text-emerald-300 text-lg" />
            </div>
            <div>
              <p className="font-semibold">Real-time availability</p>
              <p className="text-blue-100 text-sm">
                See desk availability instantly
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-400/20 flex items-center justify-center shrink-0 mt-1">
              <FiBarChart2 className="text-purple-300 text-lg" />
            </div>
            <div>
              <p className="font-semibold">Smart calendar sync</p>
              <p className="text-blue-100 text-sm">
                Coordinate with your schedule
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-pink-400/20 flex items-center justify-center shrink-0 mt-1">
              <FiUsers className="text-pink-300 text-lg" />
            </div>
            <div>
              <p className="font-semibold">Team collaboration</p>
              <p className="text-blue-100 text-sm">
                Book together, work together
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Enhanced Form Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              Get started
            </h2>
            <p className="text-gray-500 text-lg">
              Create your account in seconds
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

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-lg flex gap-3 animate-slideIn">
              <div className="text-emerald-600 text-xl shrink-0">✓</div>
              <div>
                <p className="font-medium text-emerald-900">{success}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="John Doe"
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-all shadow-sm hover:border-gray-300"
                />
              </div>
            </div>

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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  placeholder="Choose a strong password"
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-all shadow-sm hover:border-gray-300"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 py-2">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                disabled={loading}
                className="w-5 h-5 mt-0.5 accent-blue-500 rounded cursor-pointer disabled:opacity-50"
              />
              <label className="text-sm text-gray-600 cursor-pointer">
                I agree to the{" "}
                <span className="text-blue-600 font-semibold hover:underline">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-blue-600 font-semibold hover:underline">
                  Privacy Policy
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create my account
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign in instead
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
