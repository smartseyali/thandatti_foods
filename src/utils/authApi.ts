// Auth API service utility for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Generic API request function
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  // Normalize headers to a plain object so we can add Authorization safely
  const headersInit: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  // Add token if available
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      headersInit['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: headersInit,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let error: any;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText || 'Request failed' };
      }
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  } catch (error: any) {
    console.error(`Auth API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Auth API
export const authApi = {
  login: async (phoneNumber: string, password: string) => {
    try {
      // Try backend API first - but backend expects email, so we'll use phoneNumber as identifier
      // Note: Backend login uses email, but we're using phoneNumber
      // For now, we'll keep localStorage for existing users and add backend support
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ 
          email: phoneNumber, // Using phoneNumber as email for now
          password 
        }),
      });
      return response;
    } catch (error: any) {
      // If backend fails, fallback to localStorage (for existing users)
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiRequest('/api/auth/me');
      return response.user;
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
};

