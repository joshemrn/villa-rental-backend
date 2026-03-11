import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

// Auth Services
export const authService = {
  register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),
  login: (data) => axios.post(`${API_BASE_URL}/auth/login`, data),
  getMe: () => axios.get(`${API_BASE_URL}/auth/me`, getAuthHeader()),
  updateProfile: (data) => axios.put(`${API_BASE_URL}/auth/profile`, data, getAuthHeader()),
};

// Property Services
export const propertyService = {
  getAll: (params) => axios.get(`${API_BASE_URL}/properties`, { params }),
  getById: (id) => axios.get(`${API_BASE_URL}/properties/${id}`),
  create: (data) => axios.post(`${API_BASE_URL}/properties`, data, getAuthHeader()),
  update: (id, data) => axios.put(`${API_BASE_URL}/properties/${id}`, data, getAuthHeader()),
  delete: (id) => axios.delete(`${API_BASE_URL}/properties/${id}`, getAuthHeader()),
  getMyProperties: () => axios.get(`${API_BASE_URL}/properties/owner/my-properties`, getAuthHeader()),
};

// Booking Services
export const bookingService = {
  create: (data) => axios.post(`${API_BASE_URL}/bookings`, data, getAuthHeader()),
  getById: (id) => axios.get(`${API_BASE_URL}/bookings/${id}`, getAuthHeader()),
  getMyBookings: () => axios.get(`${API_BASE_URL}/bookings/guest/my-bookings`, getAuthHeader()),
  getOwnerBookings: () => axios.get(`${API_BASE_URL}/bookings/owner/my-bookings`, getAuthHeader()),
  updateStatus: (id, status) => axios.put(`${API_BASE_URL}/bookings/${id}/status`, { status }, getAuthHeader()),
  cancel: (id) => axios.put(`${API_BASE_URL}/bookings/${id}/cancel`, {}, getAuthHeader()),
};

// Payment Services
export const paymentService = {
  createPaymentIntent: (bookingId) => 
    axios.post(`${API_BASE_URL}/payments/create-intent`, { bookingId }, getAuthHeader()),
  confirmPayment: (bookingId, paymentIntentId) =>
    axios.post(`${API_BASE_URL}/payments/confirm-payment`, { bookingId, paymentIntentId }, getAuthHeader()),
};

// Invoice Services
export const invoiceService = {
  create: (bookingId) => axios.post(`${API_BASE_URL}/invoices`, { bookingId }, getAuthHeader()),
  getAll: () => axios.get(`${API_BASE_URL}/invoices`, getAuthHeader()),
  getById: (id) => axios.get(`${API_BASE_URL}/invoices/${id}`, getAuthHeader()),
};

// Contract Services
export const contractService = {
  create: (bookingId, customTerms) =>
    axios.post(`${API_BASE_URL}/contracts`, { bookingId, customTerms }, getAuthHeader()),
  getAll: () => axios.get(`${API_BASE_URL}/contracts`, getAuthHeader()),
  getById: (id) => axios.get(`${API_BASE_URL}/contracts/${id}`),
  sign: (id, signature, signedBy) =>
    axios.post(`${API_BASE_URL}/contracts/${id}/sign`, { signature, signedBy }),
};

// Review Services
export const reviewService = {
  create: (data) => axios.post(`${API_BASE_URL}/reviews`, data, getAuthHeader()),
  getByProperty: (propertyId) => axios.get(`${API_BASE_URL}/reviews/property/${propertyId}`),
};

// Admin Services
export const adminService = {
  getStats: () => axios.get(`${API_BASE_URL}/admin/dashboard/stats`, getAuthHeader()),
  verifyProperty: (id) => axios.put(`${API_BASE_URL}/admin/properties/${id}/verify`, {}, getAuthHeader()),
  getProperties: () => axios.get(`${API_BASE_URL}/admin/properties`, getAuthHeader()),
  getBookings: () => axios.get(`${API_BASE_URL}/admin/bookings`, getAuthHeader()),
  getUsers: () => axios.get(`${API_BASE_URL}/admin/users`, getAuthHeader()),
};
