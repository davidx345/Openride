"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Phone, AlertCircle, CheckCircle, Compass, QrCode } from "lucide-react"
import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"

// Countdown Timer Component
function CountdownTimer({ targetTime }: { targetTime: string }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Parse target time (e.g., "7:00 AM")
      const now = new Date()
      const [time, period] = targetTime.split(" ")
      const [hours, minutes] = time.split(":").map(Number)
      
      const target = new Date()
      let targetHours = hours
      if (period === "PM" && hours !== 12) targetHours += 12
      if (period === "AM" && hours === 12) targetHours = 0
      
      target.setHours(targetHours, minutes, 0, 0)
      
      // If target time has passed today, set it for tomorrow
      if (target < now) {
        target.setDate(target.getDate() + 1)
      }
      
      const diff = target.getTime() - now.getTime()
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60))
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      setTimeLeft(`${hoursLeft}h ${minutesLeft}m`)
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [targetTime])

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary">
      <Clock className="w-3 h-3" />
      <span className="text-xs font-semibold">{timeLeft} until departure</span>
    </div>
  )
}

export default function MyBookings({ bookings }: any) {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null)
  const [showQR, setShowQR] = useState<string | null>(null)

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-6">No bookings yet. Search and book a ride to get started!</p>
        <Button className="bg-primary hover:bg-primary/90">Find a Ride</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-xl font-bold mb-4">Upcoming Trips</h2>
        <div className="space-y-4">
          {bookings
            .filter((b: any) => b.status === "Confirmed")
            .map((booking: any) => (
              <Card key={booking.id} className="p-6 border border-border relative overflow-hidden">
                {/* QR Code Modal */}
                {showQR === booking.id && (
                  <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-center p-6">
                    <div className="text-center">
                      <h3 className="font-bold text-lg mb-4">Your Ticket QR Code</h3>
                      <div className="bg-white p-6 rounded-lg inline-block mb-4">
                        <QRCodeSVG
                          value={JSON.stringify({
                            bookingId: booking.id,
                            from: booking.from,
                            to: booking.to,
                            timestamp: Date.now(),
                          })}
                          size={220}
                          level="H"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Show this code to your driver at pickup
                      </p>
                      <Button onClick={() => setShowQR(null)} variant="outline">
                        Close
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold">
                        {booking.from} → {booking.to}
                      </h3>
                      <Badge className="bg-green-500/20 text-green-700 border-green-500/30 gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Confirmed
                      </Badge>
                      <CountdownTimer targetTime={booking.departureTime} />
                    </div>
                    <p className="text-sm text-muted-foreground">with {booking.driverName}</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">₦{booking.totalPrice.toLocaleString()}</p>
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Departure</p>
                      <p className="font-semibold">{booking.departureTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Seats</p>
                      <p className="font-semibold">{booking.seats}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Booking ID</p>
                    <p className="font-semibold text-primary">{booking.id}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 bg-primary text-white hover:bg-primary/90 border-primary"
                    onClick={() => setShowQR(booking.id)}
                  >
                    <QrCode className="w-4 h-4" />
                    Show QR Code
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                  >
                    <Compass className="w-4 h-4" />
                    Details
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>

                {/* Expanded Details */}
                {expandedBooking === booking.id && (
                  <div className="mt-4 p-4 border-t border-border space-y-3">
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Pickup Location</p>
                      <p className="font-semibold">{booking.from} Bus Stop</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Dropoff Location</p>
                      <p className="font-semibold">{booking.to} Bus Stop</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Driver Phone</p>
                      <p className="font-semibold">+234 810 123 4567</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
        </div>
      </div>

      {/* Past Trips */}
      {bookings.filter((b: any) => b.status !== "Confirmed").length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 mt-8">Past Trips</h2>
          <div className="space-y-2">
            {bookings
              .filter((b: any) => b.status !== "Confirmed")
              .map((booking: any) => (
                <Card key={booking.id} className="p-4 border border-border opacity-75">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {booking.from} → {booking.to}
                      </p>
                      <p className="text-xs text-muted-foreground">{booking.date}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Rate Trip
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
