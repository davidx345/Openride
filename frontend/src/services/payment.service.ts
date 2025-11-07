/**
 * Payment API service
 */
import { apiClient } from "./api"
import type { PaymentParams, ApiResponse } from "@/src/types"

export const paymentService = {
  /**
   * Initiate payment
   */
  async initiatePayment(bookingId: string): Promise<{
    payment_id: string
    payment_params: PaymentParams
    booking_id: string
  }> {
    const response = await apiClient.post<
      ApiResponse<{
        payment_id: string
        payment_params: PaymentParams
        booking_id: string
      }>
    >("/payments/initiate", {
      booking_id: bookingId,
      payment_method: "INTERSWITCH",
    })
    return response.data.data
  },

  /**
   * Verify payment
   */
  async verifyPayment(transactionRef: string): Promise<{
    status: string
    verified: boolean
    booking: any
    blockchainToken: any
  }> {
    const response = await apiClient.post<
      ApiResponse<{
        status: string
        verified: boolean
        booking: any
        blockchainToken: any
      }>
    >("/payments/verify", {
      transaction_ref: transactionRef,
    })
    return response.data.data
  },
}
