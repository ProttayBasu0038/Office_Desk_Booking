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
  if (year)  params.year  = year;
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
}