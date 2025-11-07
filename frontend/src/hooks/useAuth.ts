/**
 * Authentication hook
 */
import { useAuthStore } from "@/src/store/authStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth() {
  const {user, isAuthenticated, isLoading, error, login, register, logout, clearError } = useAuthStore()
  const router = useRouter()

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  }
}

/**
 * Hook to protect routes - redirect to login if not authenticated
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}
