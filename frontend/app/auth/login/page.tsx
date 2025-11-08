"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/src/hooks/useAuth"
import toast from "react-hot-toast"
import { Eye, EyeOff, LogIn, User } from "lucide-react"
import type { LoginCredentials } from "@/src/types"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>()

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true)
    try {
      // DEMO MODE: Accept any email/password and redirect instantly
      const role = data.email.toLowerCase().includes("driver") ? "driver" : "rider"
      
      // Create mock user
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        name: data.email.split("@")[0],
        role: role.toUpperCase(),
        phone: "+234 800 000 0000",
        createdAt: new Date().toISOString(),
      }
      
      // Save to localStorage
      localStorage.setItem("openride-auth", JSON.stringify({
        state: {
          user: mockUser,
          token: "demo-token-" + Math.random().toString(36).substr(2, 9),
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
        version: 0,
      }))
      
      toast.success("Welcome back! Logging you in...")
      
      setTimeout(() => {
        router.push(`/${role}`)
      }, 500)
    } catch (error: any) {
      toast.error("An error occurred")
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: "rider" | "driver") => {
    const credentials = {
      email: `${role}@demo.com`,
      password: "demo123",
    }
    
    onSubmit(credentials)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <img src="/openride.png" alt="OpenRide" className="w-16 h-16 rounded-lg mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Login to continue to OpenRide</p>
        </div>

        {/* Demo Credentials Card */}
        <Card className="p-4 border-primary/20 bg-primary/5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Demo Accounts - Quick Login
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin("rider")}
              disabled={isLoading}
              className="gap-2"
            >
              Login as Rider
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin("driver")}
              disabled={isLoading}
              className="gap-2"
            >
              Login as Driver
            </Button>
          </div>
          <div className="mt-3 text-xs text-muted-foreground space-y-1">
            <p>📧 rider@demo.com / driver@demo.com</p>
            <p>🔑 Password: demo123</p>
          </div>
        </Card>

        {/* Login Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              <LogIn className="w-4 h-4" />
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button onClick={() => router.push("/auth/register")} className="text-primary hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </Card>

        <div className="text-center">
          <button onClick={() => router.push("/landing")} className="text-sm text-muted-foreground hover:underline">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
