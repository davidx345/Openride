/**
 * Booking Zustand store
 */
import { create } from "zustand"
import type { Booking } from "@/src/types"
import { bookingService } from "@/src/services/booking.service"

interface BookingState {
  currentBooking: Booking | null
  bookings: Booking[]
  isLoading: boolean
  error: string | null

  // Actions
  setCurrentBooking: (booking: Booking | null) => void
  fetchMyBookings: () => Promise<void>
  createBooking: (data: {
    routeId: string
    seats: number
    pickupLocation: string
    dropoffLocation: string
  }) => Promise<Booking>
  cancelBooking: (id: string) => Promise<void>
  clearError: () => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
  currentBooking: null,
  bookings: [],
  isLoading: false,
  error: null,

  setCurrentBooking: (booking) => {
    set({ currentBooking: booking })
  },

  fetchMyBookings: async () => {
    set({ isLoading: true, error: null })
    try {
      const bookings = await bookingService.getMyBookings()
      set({ bookings, isLoading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch bookings",
        isLoading: false,
      })
    }
  },

  createBooking: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const booking = await bookingService.createBooking(data)
      set({
        currentBooking: booking,
        bookings: [booking, ...get().bookings],
        isLoading: false,
      })
      return booking
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create booking",
        isLoading: false,
      })
      throw error
    }
  },

  cancelBooking: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await bookingService.cancelBooking(id)
      set({
        bookings: get().bookings.map((b) => (b.id === id ? { ...b, status: "CANCELLED" as const } : b)),
        isLoading: false,
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to cancel booking",
        isLoading: false,
      })
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
