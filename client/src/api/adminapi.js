import API from "./api";

export const fetchMonthlyUtilization = async (year, month) => {
  const params = {};
  if (year) params.year = year;
  if (month) params.month = month;

  const response = await API.get("/admin/monthly", { params });
  return response.data;
};

export const fetchAssociateUtilization = async (year, month, name) => {
  const params = {};
  if (year) params.year = year;
  if (month) params.month = month;
  if (name && name.trim()) params.name = name.trim();
  const response = await API.get("/admin/associate", { params });
  return response.data;
};

export const fetchOrganizationUtilization = async (year, month) => {
  const params = {};
  if (year) params.year = year;
  if (month) params.month = month;
  const response = await API.get("/admin/organization", { params });
  return response.data;
};

// Fetch all non-admin users for management
export const fetchAllUsers = async () => {
  const response = await API.get("/admin/users");
  return response.data;
};

// Update a user's name/email
export const updateUserDetails = async (id, payload) => {
  const response = await API.put(`/admin/users/${id}`, payload);
  return response.data;
};
