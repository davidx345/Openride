"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Car, Shield, Zap, Users, ArrowRight, CheckCircle, MapPin, Clock, Star, TrendingUp } from "lucide-react"

// Animated Counter Component
function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count.toLocaleString()}{suffix}</span>
}

export default function LandingPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <img src="/openride.png" alt="OpenRide" className="w-12 h-12 rounded-lg" />
            <span className="font-bold text-2xl">OpenRide</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/auth/login")}>
              Login
            </Button>
            <Button onClick={() => router.push("/auth/register")}>
              Sign Up
            </Button>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            🚀 Live Demo - No Signup Required
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your Daily Commute,
            <br />
            Reimagined
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Community-powered ridesharing for Lagos. Book seats on daily work routes, earn from empty seats.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2" onClick={() => router.push("/auth/register")}>
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => router.push("/auth/login")}>
              Login <Car className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Animated Stats Section */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          {[
            { icon: Users, label: "Active Users", value: 15000, suffix: "+" },
            { icon: MapPin, label: "Cities Covered", value: 25, suffix: "" },
            { icon: TrendingUp, label: "Rides Completed", value: 50000, suffix: "+" },
            { icon: Star, label: "Average Rating", value: 4.8, suffix: "/5" },
          ].map((stat, index) => (
            <Card
              key={stat.label}
              className="p-6 text-center transition-all duration-700 hover:scale-105 hover:shadow-lg"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-primary mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">AI-Powered Matching</h3>
            <p className="text-muted-foreground">
              Smart route matching finds the perfect ride for your commute with 95%+ accuracy
            </p>
          </Card>

          <Card className="p-6 border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Blockchain Verified</h3>
            <p className="text-muted-foreground">
              Every booking is secured with blockchain tokens to prevent fraud and double-booking
            </p>
          </Card>

          <Card className="p-6 border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Community First</h3>
            <p className="text-muted-foreground">
              Built for daily commuters in Lagos. Safe, reliable, and affordable rides every day
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6 text-primary">For Riders</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Search Routes</p>
                    <p className="text-sm text-muted-foreground">Find rides going your way, any time</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Book Instantly</p>
                    <p className="text-sm text-muted-foreground">Reserve your seat with one click</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Pay Securely</p>
                    <p className="text-sm text-muted-foreground">Interswitch payment, blockchain verified</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-secondary">For Drivers</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Create Routes</p>
                    <p className="text-sm text-muted-foreground">List your daily commute route</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Get Bookings</p>
                    <p className="text-sm text-muted-foreground">Riders find and book your seats</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Earn Money</p>
                    <p className="text-sm text-muted-foreground">Cover fuel costs, make extra income</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="max-w-3xl mx-auto p-8 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Commute?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of Lagosians sharing rides and saving money every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/auth/register")}>
              Try Demo
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/auth/login")}>
              Login with Demo Account
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">OpenRide - Community-Powered Ridesharing for Lagos</p>
          <p className="text-sm">Built for Hackathon Demo • All features functional • No backend required for demo</p>
        </div>
      </footer>
    </div>
  )
}
