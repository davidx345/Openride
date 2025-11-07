"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MapPin,
  Clock,
  User,
  Phone,
  Star,
  Navigation,
  QrCode,
  ChevronRight,
  Calendar,
  Circle,
} from "lucide-react"

interface Booking {
  id: string
  from: string
  to: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled" | "in-progress"
  driver: {
    name: string
    rating: number
    photo?: string
    phone: string
  }
  vehicle: {
    model: string
    color: string
    plate: string
  }
  price: number
  seats: number
  blockchain?: {
    tokenId: string
  }
}

export default function ModernBookings() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")

  // Demo bookings
  const bookings: Booking[] = [
    {
      id: "BK001",
      from: "Ikeja",
      to: "Victoria Island",
      date: "2025-11-08",
      time: "7:00 AM",
      status: "upcoming",
      driver: {
        name: "Amara K.",
        rating: 4.8,
        phone: "+234 801 234 5678",
      },
      vehicle: {
        model: "Black Toyota Camry",
        color: "Black",
        plate: "ABC 123 XY",
      },
      price: 566,
      seats: 1,
      blockchain: {
        tokenId: "0x1a2b3c...",
      },
    },
    {
      id: "BK002",
      from: "Lekki",
      to: "Ikeja",
      date: "2025-11-07",
      time: "6:30 AM",
      status: "completed",
      driver: {
        name: "Chidi O.",
        rating: 4.9,
        phone: "+234 802 345 6789",
      },
      vehicle: {
        model: "Gray Honda Accord",
        color: "Gray",
        plate: "XYZ 456 AB",
      },
      price: 2500,
      seats: 2,
      blockchain: {
        tokenId: "0x4d5e6f...",
      },
    },
  ]

  const filteredBookings = bookings.filter((booking) =>
    activeTab === "upcoming"
      ? booking.status === "upcoming" || booking.status === "in-progress"
      : booking.status === "completed" || booking.status === "cancelled"
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-700 border-blue-500/30"
      case "in-progress":
        return "bg-primary/10 text-primary border-primary/30"
      case "completed":
        return "bg-green-500/10 text-green-700 border-green-500/30"
      case "cancelled":
        return "bg-red-500/10 text-red-700 border-red-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Confirmed"
      case "in-progress":
        return "In Progress"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with Tabs */}
      <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 px-4 py-2.5 rounded-md font-semibold transition-all ${
            activeTab === "upcoming"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`flex-1 px-4 py-2.5 rounded-md font-semibold transition-all ${
            activeTab === "past"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Past Rides
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No {activeTab} rides</h3>
          <p className="text-muted-foreground">
            {activeTab === "upcoming"
              ? "You don't have any upcoming bookings"
              : "You don't have any past rides"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden border-2 hover:border-primary/50 transition-all">
              {/* Status Bar */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-3 flex items-center justify-between">
                <Badge className={getStatusColor(booking.status)}>
                  <Circle className="w-2 h-2 mr-1 fill-current" />
                  {getStatusText(booking.status)}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">#{booking.id}</span>
              </div>

              <div className="p-4 space-y-4">
                {/* Route Info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{booking.from}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • {booking.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-1.5">
                    <div className="w-px h-6 bg-border" />
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <MapPin className="w-5 h-5 text-accent fill-accent/20" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{booking.to}</p>
                    </div>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="w-12 h-12 border-2 border-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {booking.driver.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{booking.driver.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{booking.driver.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{booking.vehicle.model}</span>
                    </div>
                  </div>
                  {booking.status === "upcoming" && (
                    <Button size="sm" variant="ghost" className="rounded-full">
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Vehicle & Price */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Vehicle</p>
                    <p className="font-semibold">{booking.vehicle.plate}</p>
                    <p className="text-sm text-muted-foreground">{booking.seats} seat(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total Fare</p>
                    <p className="text-2xl font-bold text-primary">₦{booking.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Actions */}
                {booking.status === "upcoming" && (
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1">
                      <QrCode className="w-4 h-4 mr-2" />
                      View Ticket
                    </Button>
                    <Button className="flex-1 bg-primary">
                      <Navigation className="w-4 h-4 mr-2" />
                      Track Ride
                    </Button>
                  </div>
                )}

                {booking.status === "completed" && booking.blockchain && (
                  <Button variant="outline" className="w-full">
                    <span className="mr-2">🔗</span>
                    View Blockchain Token
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
