const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mentorconnect-backend-9wve.onrender.com/';


// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => apiCall('/auth/me'),
};

// Mentors API
export const mentorsAPI = {
  getAll: () => apiCall('/mentors'),

  getById: (id) => apiCall(`/mentors/${id}`),

  search: (params) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v)
    ).toString();
    return apiCall(`/mentors/search?${queryString}`);
  },

  updateProfile: (profileData) =>
    apiCall('/mentors/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  getMyProfile: () => apiCall('/mentors/profile/me'),

  setAvailability: (availabilities) =>
    apiCall('/mentors/availability', {
      method: 'POST',
      body: JSON.stringify({ availabilities }),
    }),

  getAvailability: (mentorId) => apiCall(`/mentors/${mentorId}/availability`),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) =>
    apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  getById: (id) => apiCall(`/bookings/${id}`),

  getMentorBookings: () => apiCall('/bookings/mentor'),

  getMenteeBookings: () => apiCall('/bookings/mentee'),

  cancel: (id) =>
    apiCall(`/bookings/${id}/cancel`, {
      method: 'PUT',
    }),
};

// Payments API
export const paymentsAPI = {
  process: (paymentData) =>
    apiCall('/payments/process', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  getByBooking: (bookingId) => apiCall(`/payments/booking/${bookingId}`),
};

export default {
  auth: authAPI,
  mentors: mentorsAPI,
  bookings: bookingsAPI,
  payments: paymentsAPI,
};
