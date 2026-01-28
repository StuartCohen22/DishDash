import api, { setAuthToken } from './api';
import { AuthToken, LoginCredentials, RegisterData, User } from '@/types';

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<User> {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  /**
   * Login with email and password
   * OAuth2 form requires x-www-form-urlencoded format
   */
  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email); // OAuth2 uses 'username' field
    formData.append('password', credentials.password);

    const response = await api.post<AuthToken>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Store token
    setAuthToken(response.data.access_token);
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Logout - clear stored token
   */
  logout(): void {
    setAuthToken(null);
  },
};
