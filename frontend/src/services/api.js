const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api/v1';

// Token helpers
export const getToken = () => localStorage.getItem('imperia_token');
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('imperia_token', token);
  } else {
    localStorage.removeItem('imperia_token');
  }
};

let isRefreshingToken = false;

/**
 * Universal request wrapper
 */
async function request(endpoint, options = {}, isRetry = false) {
  const token = getToken();
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Include cookies for refresh tokens
  };

  if (options.body && !(options.body instanceof FormData)) {
    config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (response.status === 401 && !isRetry && endpoint !== '/auth/login' && endpoint !== '/auth/signup' && endpoint !== '/auth/refresh-token') {
    if (!isRefreshingToken) {
      isRefreshingToken = true;
      try {
        const refreshData = await api.refreshToken();
        const newToken = refreshData?.token || refreshData?.accessToken;
        if (newToken) {
          setToken(newToken);
          isRefreshingToken = false;
          return request(endpoint, options, true);
        }
      } catch (refreshErr) {
        setToken(null);
      } finally {
        isRefreshingToken = false;
      }
    }
  }

  if (!response.ok) {
    const errorMsg = data?.error?.message || data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.code = data?.error?.code;
    throw error;
  }

  return data?.data !== undefined ? data.data : data;
}

// Helper to construct query string
function buildQueryString(params = {}) {
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== 'All') {
      if (Array.isArray(params[key])) {
        query.append(key, params[key].join(','));
      } else {
        query.append(key, params[key]);
      }
    }
  });
  const str = query.toString();
  return str ? `?${str}` : '';
}

export const api = {
  // --- AUTH ---
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  refreshToken: () => request('/auth/refresh', { method: 'POST' }),

  // --- USER PROFILE ---
  getProfile: () => request('/user/profile', { method: 'GET' }),
  updateProfile: (profileData) => request('/user/profile', { method: 'PUT', body: profileData }),
  getWishlist: () => request('/user/wishlist', { method: 'GET' }),
  addToWishlist: (propertyId) => request('/user/wishlist', { method: 'POST', body: { propertyId } }),
  removeFromWishlist: (propertyId) => request(`/user/wishlist/${propertyId}`, { method: 'DELETE' }),
  getRecentlyViewed: () => request('/user/recently-viewed', { method: 'GET' }),
  addRecentlyViewed: (propertyId) => request('/user/recently-viewed', { method: 'POST', body: { propertyId } }),

  // --- PROPERTIES ---
  getProperties: (filters = {}) => request(`/properties${buildQueryString(filters)}`, { method: 'GET' }),
  getPropertyById: (id) => request(`/properties/${id}`, { method: 'GET' }),
  searchProperties: (query) => request(`/search${buildQueryString({ q: query })}`, { method: 'GET' }),
  createProperty: (propertyData) => request('/admin/properties', { method: 'POST', body: propertyData }),
  updateProperty: (id, propertyData) => request(`/admin/properties/${id}`, { method: 'PUT', body: propertyData }),
  deleteProperty: (id) => request(`/admin/properties/${id}`, { method: 'DELETE' }),
  bulkPropertiesAction: (ids, action) => request('/admin/properties/bulk', { method: 'POST', body: { ids, action } }),
  uploadMedia: (formData) => request('/admin/properties/upload', { method: 'POST', body: formData }),

  // --- SITE VISITS ---
  createSiteVisit: (visitData) => request('/site-visits', { method: 'POST', body: visitData }),
  getMyBookings: () => request('/site-visits/my', { method: 'GET' }),
  getUserSiteVisits: () => request('/site-visits/my-visits', { method: 'GET' }),
  getAdminSiteVisits: () => request('/admin/site-visits', { method: 'GET' }),
  getCalendarMonthData: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/site-visits/calendar?${query}`, { method: 'GET' });
  },
  getSiteVisitsByDate: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/site-visits/by-date?${query}`, { method: 'GET' });
  },
  updateSiteVisitStatus: (id, updateData) => request(`/admin/site-visits/${id}`, { method: 'PUT', body: updateData }),
  confirmSiteVisit: (id) => request(`/site-visits/admin/site-visits/${id}/confirm`, { method: 'PATCH' }),
  rescheduleSiteVisit: (id, updateData) => request(`/site-visits/admin/site-visits/${id}/reschedule`, { method: 'PATCH', body: updateData }),
  cancelSiteVisit: (id, updateData) => request(`/site-visits/admin/site-visits/${id}/cancel`, { method: 'PATCH', body: updateData }),
  completeSiteVisit: (id, updateData) => request(`/site-visits/admin/site-visits/${id}/complete`, { method: 'PATCH', body: updateData }),

  // --- INQUIRIES ---
  createInquiry: (inquiryData) => request('/inquiries', { method: 'POST', body: inquiryData }),
  getAdminInquiries: () => request('/admin/inquiries', { method: 'GET' }),
  updateInquiryStatus: (id, updateData) => request(`/admin/inquiries/${id}`, { method: 'PUT', body: updateData }),

  // --- BLOGS ---
  getBlogs: (filters = {}) => request(`/blogs${buildQueryString(filters)}`, { method: 'GET' }),
  getBlogById: (id) => request(`/blogs/${id}`, { method: 'GET' }),
  createBlog: (blogData) => request('/admin/blogs', { method: 'POST', body: blogData }),
  updateBlog: (id, blogData) => request(`/admin/blogs/${id}`, { method: 'PUT', body: blogData }),
  deleteBlog: (id) => request(`/admin/blogs/${id}`, { method: 'DELETE' }),

  // --- CUSTOMERS (ADMIN) ---
  getAdminCustomers: () => request('/admin/customers', { method: 'GET' }),
  createCustomer: (customerData) => request('/admin/customers', { method: 'POST', body: customerData }),
  updateCustomer: (id, customerData) => request(`/admin/customers/${id}`, { method: 'PUT', body: customerData }),
  deleteCustomer: (id) => request(`/admin/customers/${id}`, { method: 'DELETE' }),

  // --- BROADCASTS & NOTIFICATIONS ---
  getBroadcasts: () => request('/admin/broadcasts', { method: 'GET' }),
  sendBroadcast: (broadcastData) => request('/admin/broadcasts', { method: 'POST', body: broadcastData }),
  getUserNotifications: () => request('/user/notifications', { method: 'GET' }),
  markNotificationRead: (id) => request(`/user/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/user/notifications/read-all', { method: 'PATCH' }),
  deleteNotification: (id) => request(`/user/notifications/${id}`, { method: 'DELETE' }),

  // --- CONSULTANTS (ADMIN) ---
  getAdminConsultants: (filters = {}) => request(`/admin/consultants${buildQueryString(filters)}`, { method: 'GET' }),
  getConsultantAllocations: (id) => request(`/admin/consultants/${id}/allocations`, { method: 'GET' }),
  createConsultant: (data) => request('/admin/consultants', { method: 'POST', body: data }),
  updateConsultant: (id, data) => request(`/admin/consultants/${id}`, { method: 'PATCH', body: data }),
  activateConsultant: (id) => request(`/admin/consultants/${id}/activate`, { method: 'PATCH' }),
  deactivateConsultant: (id) => request(`/admin/consultants/${id}/deactivate`, { method: 'PATCH' }),
  deleteConsultant: (id) => request(`/admin/consultants/${id}`, { method: 'DELETE' }),

  // --- ADMIN VISIT CALENDAR ---
  getVisitCalendar: (filters = {}) => request(`/admin/visit-calendar${buildQueryString(filters)}`, { method: 'GET' }),
  reassignVisit: (assignmentId, newConsultantId) => request(`/admin/site-visits/${assignmentId}/reassign`, { method: 'PATCH', body: { newConsultantId } }),

  // --- CONSULTANT DASHBOARD ---
  getConsultantProfile: () => request('/consultant/profile', { method: 'GET' }),
  getConsultantVisitsToday: () => request('/consultant/visits/today', { method: 'GET' }),
  getConsultantVisitsUpcoming: () => request('/consultant/visits/upcoming', { method: 'GET' }),
  getConsultantVisitsCompleted: () => request('/consultant/visits/completed', { method: 'GET' }),
  updateConsultantVisitStatus: (id, status) => request(`/consultant/visits/${id}/status`, { method: 'PATCH', body: { status } }),

  // --- PUBLIC CONSULTANTS ---
  getPublicConsultants: (filters = {}) => request(`/consultants${buildQueryString(filters)}`, { method: 'GET' }),

  // --- BANKS / HOME LOAN ---
  getBanks: () => request('/banks', { method: 'GET' }),
};

export default api;
