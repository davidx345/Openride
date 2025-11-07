/**
 * Core TypeScript type definitions for OpenRide platform
 */

export type UserRole = "RIDER" | "DRIVER"

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"

export type PaymentMethod = "CARD" | "WALLET" | "INTERSWITCH"

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  profilePhoto?: string
  verified: boolean
  rating?: number
  totalRides: number
  createdAt: string
}

export interface Vehicle {
  id: string
  driverId: string
  make: string
  model: string
  year: number
  color: string
  plateNumber: string
  seats: number
  verified: boolean
  photos: string[]
}

export interface Route {
  id: string
  driverId: string
  driver: User
  vehicle: Vehicle
  from: string
  to: string
  passingStops: string[]
  departureTime: string
  availableSeats: number
  pricePerSeat: number
  status: "ACTIVE" | "INACTIVE" | "COMPLETED"
  recurring: boolean
  daysOfWeek?: number[]
  aiScore?: number
  createdAt: string
}

export interface Booking {
  id: string
  routeId: string
  route: Route
  riderId: string
  rider: User
  seats: number
  totalAmount: number
  status: BookingStatus
  paymentStatus: PaymentStatus
  pickupLocation: string
  dropoffLocation: string
  bookingDate: string
  departureTime: string
  qrCode?: string
  blockchainToken?: BlockchainToken
  createdAt: string
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionRef: string
  interswitchRef?: string
  paidAt?: string
  createdAt: string
}

export interface BlockchainToken {
  tokenId: string
  bookingHash: string
  transactionHash: string
  timestamp: number
  blockchainNetwork: string
  verified: boolean
  expiresAt: number
  qrData: string
  explorerUrl?: string
}

export interface Rating {
  id: string
  bookingId: string
  fromUserId: string
  toUserId: string
  rating: number
  comment?: string
  createdAt: string
}

export interface SearchParams {
  from: string
  to: string
  date: string
  timeRange: string
  seats?: number
}

export interface PaymentParams {
  merchant_code: string
  pay_item_id: string
  txn_ref: string
  amount: number
  currency: number
  site_redirect_url?: string
  cust_name?: string
  cust_email?: string
  mode: "TEST" | "LIVE"
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
  role: UserRole
}

export interface AuthResponse {
  user: User
  token: string
  expiresIn: number
}

// Nigerian cities for location autocomplete
export const NIGERIAN_CITIES = [
  "Ikeja",
  "Victoria Island (VI)",
  "Lekki",
  "Ikoyi",
  "Yaba",
  "Surulere",
  "Festac",
  "Ajah",
  "Ogba",
  "Magodo",
  "Gbagada",
  "Maryland",
  "Apapa",
  "Marina",
  "CMS",
  "Obalende",
  "Oshodi",
  "Isolo",
  "Ikotun",
  "Egbeda",
  "Ikorodu",
  "Epe",
  "Badagry",
  "Berger",
  "Ketu",
] as const

export type NigerianCity = (typeof NIGERIAN_CITIES)[number]

// Time ranges for search
export const TIME_RANGES = [
  { label: "Early Morning (5:00 - 7:00 AM)", value: "5:00-7:00" },
  { label: "Morning Rush (7:00 - 9:00 AM)", value: "7:00-9:00" },
  { label: "Mid Morning (9:00 - 11:00 AM)", value: "9:00-11:00" },
  { label: "Afternoon (12:00 - 3:00 PM)", value: "12:00-15:00" },
  { label: "Evening Rush (5:00 - 8:00 PM)", value: "17:00-20:00" },
] as const
