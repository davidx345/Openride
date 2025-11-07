/**
 * Authentication API service
 */
import { apiClient } from "./api"
import type { LoginCredentials, RegisterData, AuthResponse, ApiResponse, User } from "@/src/types"

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", credentials)
    return response.data.data
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data)
    return response.data.data
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me")
    return response.data.data
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>("/auth/me", data)
    return response.data.data
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    localStorage.removeItem("openride_token")
    localStorage.removeItem("openride_user")
  },
}
