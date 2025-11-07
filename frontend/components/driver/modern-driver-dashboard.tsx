"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Calendar,
  Clock,
  Navigation,
  Settings,
  Wallet,
  Award,
} from "lucide-react"

export default function ModernDriverDashboard() {
  // Demo stats
  const stats = {
    todayEarnings: 12500,
    weekEarnings: 68000,
    monthEarnings: 245000,
    totalTrips: 342,
    rating: 4.8,
    completionRate: 98,
    activeSince: "Jan 2024",
  }

  const recentEarnings = [
    { day: "Mon", amount: 15000 },
    { day: "Tue", amount: 12000 },
    { day: "Wed", amount: 18000 },
    { day: "Thu", amount: 14000 },
    { day: "Fri", amount: 16000 },
    { day: "Sat", amount: 20000 },
    { day: "Sun", amount: 22000 },
  ]

  const maxEarning = Math.max(...recentEarnings.map((e) => e.amount))

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-linear-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient-shift rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Driver! 👋</h1>
            <p className="text-white/90">Here's how you're performing today</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Earnings */}
        <Card className="p-6 border-2 hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <Badge className="bg-green-500/10 text-green-700 border-green-500/30">
              +12%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Today's Earnings</p>
          <p className="text-3xl font-bold text-primary">₦{stats.todayEarnings.toLocaleString()}</p>
        </Card>

        {/* Total Trips */}
        <Card className="p-6 border-2 hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-blue-600" />
            </div>
            <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/30">
              All time
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Trips</p>
          <p className="text-3xl font-bold">{stats.totalTrips}</p>
        </Card>

        {/* Rating */}
        <Card className="p-6 border-2 hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
            <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/30">
              Excellent
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Driver Rating</p>
          <p className="text-3xl font-bold">{stats.rating} ⭐</p>
        </Card>

        {/* Completion Rate */}
        <Card className="p-6 border-2 hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <Badge className="bg-green-500/10 text-green-700 border-green-500/30">
              Top Rated
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
          <p className="text-3xl font-bold">{stats.completionRate}%</p>
        </Card>
      </div>

      {/* Earnings Overview */}
      <Card className="p-6 border-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Earnings Overview</h3>
            <p className="text-sm text-muted-foreground">Last 7 days performance</p>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            This Week
          </Button>
        </div>

        {/* Bar Chart */}
        <div className="space-y-3">
          {recentEarnings.map((earning) => (
            <div key={earning.day} className="flex items-center gap-3">
              <span className="text-sm font-medium w-12">{earning.day}</span>
              <div className="flex-1 bg-muted rounded-full h-10 relative overflow-hidden">
                <div
                  className="bg-linear-to-r from-primary to-accent h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                  style={{ width: `${(earning.amount / maxEarning) * 100}%` }}
                >
                  <span className="text-xs font-bold text-white">
                    ₦{earning.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">This Week</p>
            <p className="text-2xl font-bold text-primary">₦{stats.weekEarnings.toLocaleString()}</p>
          </div>
          <div className="text-center border-x">
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-2xl font-bold">₦{stats.monthEarnings.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Avg/Day</p>
            <p className="text-2xl font-bold text-green-600">
              ₦{Math.round(stats.monthEarnings / 30).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">Bank Details</p>
              <p className="text-sm text-muted-foreground">Manage payouts</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Settings className="w-7 h-7 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">Edit Profile</p>
              <p className="text-sm text-muted-foreground">Update information</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">My Passengers</p>
              <p className="text-sm text-muted-foreground">View booking history</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
