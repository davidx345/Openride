/**
 * Booking API service
 */
import { apiClient } from "./api"
import type { Booking, ApiResponse } from "@/src/types"

export const bookingService = {
  /**
   * Create new booking
   */
  async createBooking(data: {
    routeId: string
    seats: number
    pickupLocation: string
    dropoffLocation: string
  }): Promise<Booking> {
    const response = await apiClient.post<ApiResponse<Booking>>("/bookings", data)
    return response.data.data
  },

  /**
   * Get booking by ID
   */
  async getBooking(id: string): Promise<Booking> {
    const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`)
    return response.data.data
  },

  /**
   * Get user's bookings
   */
  async getMyBookings(): Promise<Booking[]> {
    const response = await apiClient.get<ApiResponse<Booking[]>>("/bookings/user/me")
    return response.data.data
  },

  /**
   * Cancel booking
   */
  async cancelBooking(id: string): Promise<Booking> {
    const response = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}`, {
      status: "CANCELLED",
    })
    return response.data.data
  },

  /**
   * Rate booking
   */
  async rateBooking(bookingId: string, rating: number, comment?: string): Promise<void> {
    await apiClient.post("/ratings", {
      bookingId,
      rating,
      comment,
    })
  },
}
