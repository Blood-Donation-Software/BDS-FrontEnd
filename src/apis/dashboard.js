import { BASE_URL } from '@/global-config';
import axiosInstance , { endpoint } from '@/utils/axios';

// Get complete dashboard data for staff
export const getStaffDashboardData = () => {
   return axiosInstance.get(endpoint.dashboard.getStaffDashboard)
     .then(res => res.data);
};

// Get blood request statistics
export const getBloodRequestStats = async () => {
  try {
    const response = await axiosInstance.get(endpoint.dashboard.getBloodRequestStats);
    return response.data;
  } catch (error) {
    console.error('Error fetching blood request stats:', error);
    throw error;
  }
};

// Get blog statistics
export const getBlogStats = async () => {
  try {
    const response = await axiosInstance.get(endpoint.dashboard.getBlogStats);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    throw error;
  }
};

// Get donation event statistics
export const getDonationEventStats = async () => {
  try {
    const response = await axiosInstance.get(endpoint.dashboard.getDonationEventStats);
    return response.data;
  } catch (error) {
    console.error('Error fetching donation event stats:', error);
    throw error;
  }
};

// Get blood stock information
export const getBloodStock = async () => {
  try {
    const response = await axiosInstance.get(endpoint.dashboard.getBloodStock);
    return response.data;
  } catch (error) {
    console.error('Error fetching blood stock:', error);
    throw error;
  }
};

// Get donation event chart data
export const getDonationEventChartData = async (timeframe = 'week') => {
  try {
    const response = await axiosInstance.get(endpoint.dashboard.getDonationEventChart(timeframe));
    return response.data;
  } catch (error) {
    console.error('Error fetching donation event chart data:', error);
    throw error;
  }
};

// Admin Dashboard APIs
// Get complete admin dashboard data
export const getAdminDashboardData = async () => {
  try {
    const response = await axiosInstance.get(endpoint.dashboard.getAdminDashboard);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    throw error;
  }
};

// Get total stats for admin dashboard
export const getAdminTotalStats = async () => {
  try {
    const response = await axiosInstance.get(endpoint.dashboard.getAdminTotalStats);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin total stats:', error);
    throw error;
  }
};

// Get recent activities for admin dashboard
export const getAdminRecentActivities = async () => {
  try {
    const response = await axiosInstance.get(endpoint.dashboard.getAdminRecentActivities);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin recent activities:', error);
    throw error;
  }
};
