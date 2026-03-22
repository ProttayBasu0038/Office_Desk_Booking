import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiCalendar,
  FiGrid,
  FiUsers,
  FiChevronRight,
} from "react-icons/fi";

const NAV_TABS = [
  {
    to: "/admin/dashboard/monthly",
    label: "Monthly Utilization",
    icon: FiCalendar,
  },
  {
    to: "/admin/dashboard/organization",
    label: "Organization Utilization",
    icon: FiGrid,
  },
  {
    to: "/admin/dashboard/associate",
    label: "Associate Utilization",
    icon: FiUsers,
  },
];

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-slate-900 antialiased">
      {/* ── Sidebar Navigation ── */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Console
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_TABS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="text-lg opacity-80" />
                {label}
              </div>
              <FiChevronRight className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* ── User Profile & Logout ── */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 mb-4">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Admin"}`}
              alt="avatar"
              className="w-10 h-10 rounded-full border border-slate-100 bg-slate-50"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-slate-800">
                {user?.name}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <FiLogOut className="group-hover:text-red-600" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col">
        {/* Top Header / Breadcrumbs */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-700 capitalize">
              Admin Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Actions or Notifications could go here */}
            <div className="h-4 w-px bg-slate-200 mx-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              v1.2.0
            </span>
          </div>
        </header>

        {/* Dynamic Content */}
        <section className="p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
