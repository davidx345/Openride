/**
 * Routes API service
 */
import { apiClient } from "./api"
import type { Route, SearchParams, ApiResponse, PaginatedResponse } from "@/src/types"

export const routeService = {
  /**
   * Search for routes
   */
  async searchRoutes(params: SearchParams): Promise<Route[]> {
    const response = await apiClient.get<ApiResponse<Route[]>>("/routes/search", { params })
    return response.data.data
  },

  /**
   * Get route by ID
   */
  async getRoute(id: string): Promise<Route> {
    const response = await apiClient.get<ApiResponse<Route>>(`/routes/${id}`)
    return response.data.data
  },

  /**
   * Create new route (drivers only)
   */
  async createRoute(data: Partial<Route>): Promise<Route> {
    const response = await apiClient.post<ApiResponse<Route>>("/routes", data)
    return response.data.data
  },

  /**
   * Update route
   */
  async updateRoute(id: string, data: Partial<Route>): Promise<Route> {
    const response = await apiClient.patch<ApiResponse<Route>>(`/routes/${id}`, data)
    return response.data.data
  },

  /**
   * Delete route
   */
  async deleteRoute(id: string): Promise<void> {
    await apiClient.delete(`/routes/${id}`)
  },

  /**
   * Get driver's routes
   */
  async getMyRoutes(): Promise<Route[]> {
    const response = await apiClient.get<ApiResponse<Route[]>>("/routes/my-routes")
    return response.data.data
  },

  /**
   * Toggle route status
   */
  async toggleRouteStatus(id: string, status: "ACTIVE" | "INACTIVE"): Promise<Route> {
    const response = await apiClient.patch<ApiResponse<Route>>(`/routes/${id}/status`, { status })
    return response.data.data
  },
}
