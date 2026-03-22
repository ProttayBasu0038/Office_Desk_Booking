import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiGrid,
  FiMap,
  FiCalendar,
  FiBookmark,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = ({ isActive }) => `
  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
  ${
    isActive
      ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50"
      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
  }
`;

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 flex flex-col">
      {/* Logo Section - Cleaner with a gradient touch */}
      <div className="flex items-center gap-3 px-8 py-10">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <FiGrid size={20} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-gray-900 leading-none tracking-tight">
            SeatBook
          </h1>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-1">
            Workspace
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-8">
        <div>
          <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            Main Menu
          </p>
          <nav className="flex flex-col gap-1">
            <NavLink to="/" className={linkStyle}>
              <FiGrid className="text-xl group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-sm">Dashboard</span>
            </NavLink>

            <NavLink to="/floor-map" className={linkStyle}>
              <FiMap className="text-xl group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-sm">Floor Map</span>
            </NavLink>

            <NavLink to="/calendar" className={linkStyle}>
              <FiCalendar className="text-xl group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-sm">Calendar</span>
            </NavLink>

            <NavLink to="/my-bookings" className={linkStyle}>
              <FiBookmark className="text-xl group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-sm">My Bookings</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Bottom Section: Profile/Logout */}
      <div className="p-4 border-t border-gray-50">
        <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`}
              alt="avatar"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 leading-none truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {user?.email || "user@example.com"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 group-hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors shrink-0"
            title="Logout"
          >
            <FiLogOut />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
