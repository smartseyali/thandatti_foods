// Admin API service utility for backend communication
import { authStorage } from './authStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Get auth token from sessionStorage (secure storage)
const getAuthToken = (): string | null => {
  return authStorage.getToken();
};

// Generic API request function for admin endpoints (requires auth)
const adminApiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please login.');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let error: any;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText || 'Request failed' };
      }
      
      // Log detailed error for debugging
      console.error(`Admin API Error [${response.status}] for ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        error: error.message || errorText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      
      if (response.status === 401) {
        // Clear auth data if token is invalid
        authStorage.clear();
        throw new Error('Authentication required. Please login again.');
      }
      
      if (response.status === 403) {
        // Check if user data exists and log role for debugging
        const userData = authStorage.getUserData();
        console.error('403 Forbidden - User role check:', {
          userRole: userData?.role,
          userId: userData?.id,
          endpoint,
        });
        throw new Error(error.message || 'Access denied. Admin privileges required. Please ensure your account has admin role.');
      }
      
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    console.error(`Admin API request failed for ${endpoint}:`, error);
    throw new Error(error.message || 'Request failed');
  }
};

// Admin API
export const adminApi = {
  // Dashboard Statistics
  getStats: async () => {
    try {
      const response = await adminApiRequest('/api/admin/stats');
      return response.stats;
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  },

  // Orders Management
  getAllOrders: async (params?: { page?: number; limit?: number; status?: string }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);

      const query = queryParams.toString();
      const response = await adminApiRequest(`/api/orders/all${query ? `?${query}` : ''}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      const response = await adminApiRequest(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return response.order;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Products Management
  createProduct: async (productData: any) => {
    try {
      const response = await adminApiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      return response.product;
    } catch (error: any) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (productId: string, productData: any) => {
    try {
      const response = await adminApiRequest(`/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      return response.product;
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (productId: string) => {
    try {
      await adminApiRequest(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Categories Management
  createCategory: async (categoryData: any) => {
    try {
      const response = await adminApiRequest('/api/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
      return response.category;
    } catch (error: any) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (categoryId: string, categoryData: any) => {
    try {
      const response = await adminApiRequest(`/api/categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
      return response.category;
    } catch (error: any) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (categoryId: string) => {
    try {
      await adminApiRequest(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Image Upload
  uploadImage: async (formData: FormData) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let error: any;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText || 'Upload failed' };
        }
        
        if (response.status === 401) {
          authStorage.clear();
          throw new Error('Authentication required. Please login again.');
        }
        
        if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        if (response.status === 404) {
          throw new Error('Upload endpoint not found. Please ensure the backend server is running and has been restarted after adding the upload route.');
        }
        
        throw new Error(error.message || `Upload failed (${response.status})`);
      }

      return response.json();
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      console.error('Image upload failed:', error);
      throw new Error(error.message || 'Upload failed');
    }
  },

  // Upload Multiple Images
  uploadMultipleImages: async (formData: FormData) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      const response = await fetch(`${API_BASE_URL}/api/upload/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let error: any;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText || 'Upload failed' };
        }
        
        if (response.status === 401) {
          authStorage.clear();
          throw new Error('Authentication required. Please login again.');
        }
        
        if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        throw new Error(error.message || `Upload failed (${response.status})`);
      }

      return response.json();
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      console.error('Multiple image upload failed:', error);
      throw new Error(error.message || 'Upload failed');
    }
  },
};

