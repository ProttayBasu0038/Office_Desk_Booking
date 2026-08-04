import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiCalendar,
  FiGrid,
  FiUsers,
  FiChevronRight,
  FiLayout,
  FiEdit2,
  FiSave,
  FiAlertCircle,
  FiSearch,
} from "react-icons/fi";
import { fetchAllUsers, updateUserDetails } from "../api/adminapi";

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
  {
    to: "/admin/dashboard/seatsLayout",
    label: "SeatsLayout",
    icon: FiLayout,
  },
];

function AdminDashboard() {

  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [savingUserId, setSavingUserId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      setError("");
      try {
        const res = await fetchAllUsers();
        setUsers(res.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load users. Please try again.",
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  const handleFieldChange = (id, field, value) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, [field]: value } : u)),
    );
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term))
    );
  });
  const totalUsers = users.length;
  const visibleUsers = filteredUsers.length;

  const handleSaveUser = async (userToSave) => {
    const { _id, name, email } = userToSave;
    if (!name && !email) {
      setError("Please provide at least a name or email.");
      return;
    }

    setSavingUserId(_id);
    setError("");
    setSuccess("");
    try {
      const payload = {};
      if (name) payload.name = name;
      if (email) payload.email = email;

      const res = await updateUserDetails(_id, payload);
      const updated = res.data;

      setUsers((prev) =>
        prev.map((u) => (u._id === _id ? { ...u, ...updated } : u)),
      );
      setSuccess("User updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update user. Please try again.",
      );
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900 antialiased">
      {/* ── Sidebar Navigation ── */}
      <aside className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200 flex flex-col sticky top-0 h-screen shadow-xl shadow-slate-200/70">
        <div className="p-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-linear-to-tr from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight text-slate-800">
                Admin Console
              </h1>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                Seat management
              </span>
            </div>
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
        {/* ── Top Header / Breadcrumbs ── */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-[0.25em]">
              Admin dashboard
            </span>
            <span className="text-sm font-semibold text-slate-800">
              Welcome, {user.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Monitoring seat utilization and bookings</span>
            </div>
          </div>
        </header>

        {/* ── User Management Section ── */}
        <section className="p-8 space-y-4 bg-transparent">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <FiUsers className="text-indigo-500" />
                Manage Users
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                <span>View and edit user names and email addresses.</span>
                {totalUsers > 0 && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                    {visibleUsers} of {totalUsers} users
                  </span>
                )}
              </p>
            </div>
            <div className="w-64">
              <div className="relative">
                <FiSearch className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full text-xs border border-slate-200 rounded-md pl-8 pr-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400 shadow-sm"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <FiAlertCircle className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              {success}
            </div>
          )}

          <div className="bg-white/90 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Users
              </span>
              {loadingUsers && (
                <span className="text-xs text-slate-400">Loading…</span>
              )}
            </div>

            <div className="max-h-90 overflow-y-auto">
              {filteredUsers.length === 0 && !loadingUsers ? (
                <div className="px-4 py-6 text-sm text-slate-500">
                  {searchTerm.trim()
                    ? "No users match your search."
                    : "No users found."}
                </div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left font-semibold w-32">
                        Role
                      </th>
                      <th className="px-4 py-2 text-right font-semibold w-32">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-2 align-middle">
                          <input
                            type="text"
                            value={u.name || ""}
                            onChange={(e) =>
                              handleFieldChange(u._id, "name", e.target.value)
                            }
                            className="w-full border border-slate-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                          />
                        </td>
                        <td className="px-4 py-2 align-middle">
                          <input
                            type="email"
                            value={u.email || ""}
                            onChange={(e) =>
                              handleFieldChange(u._id, "email", e.target.value)
                            }
                            className="w-full border border-slate-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                          />
                        </td>
                        <td className="px-4 py-2 align-middle text-xs text-slate-500">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-2 align-middle text-right">
                          <button
                            type="button"
                            onClick={() => handleSaveUser(u)}
                            disabled={savingUserId === u._id}
                            className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {savingUserId === u._id ? (
                              <>
                                <FiEdit2 className="animate-pulse" />
                                Saving…
                              </>
                            ) : (
                              <>
                                <FiSave />
                                Save
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboard;
