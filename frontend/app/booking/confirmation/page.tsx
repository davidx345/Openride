"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { CheckCircle, Download, Share2, Phone, MapPin, Calendar, Clock, User, Car } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import toast from "react-hot-toast"

function BookingConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")
  
  const [booking, setBooking] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch booking details
    setTimeout(() => {
      // Mock booking data
      setBooking({
        id: bookingId || "BK-2024-001",
        route: {
          from: "Ikeja",
          to: "Victoria Island",
          departureTime: "7:00 AM",
        },
        driver: {
          name: "Chidi Okafor",
          phone: "+234 800 123 4567",
          rating: 4.9,
          vehicle: "Silver Honda Civic - LAG 123 XY",
        },
        seats: 2,
        totalAmount: 3000,
        bookingDate: "Nov 8, 2025",
        pickupLocation: "Ikeja Bus Stop",
        status: "CONFIRMED",
        blockchainToken: {
          tokenId: "SEAT-abc12345-def67890",
          transactionHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          verified: true,
          explorerUrl: "https://demo.openride.com/explorer/tx/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        },
      })
      setIsLoading(false)
      setShowSuccess(true)
    }, 1000)
  }, [bookingId])

  const handleDownloadTicket = () => {
    // Create a canvas to draw the ticket
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 1000;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#ff6b35');
    gradient.addColorStop(1, '#f7931e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 150);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('OpenRide Ticket', canvas.width / 2, 60);
    ctx.font = '20px Arial';
    ctx.fillText('Blockchain-Verified', canvas.width / 2, 95);

    // Booking ID
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Booking ID: ${booking.id}`, 50, 220);

    // Route Info
    ctx.font = '20px Arial';
    ctx.fillText(`From: ${booking.route.from}`, 50, 280);
    ctx.fillText(`To: ${booking.route.to}`, 50, 320);
    ctx.fillText(`Date: ${booking.bookingDate}`, 50, 360);
    ctx.fillText(`Time: ${booking.route.departureTime}`, 50, 400);

    // Driver Info
    ctx.font = 'bold 22px Arial';
    ctx.fillText('Driver Information', 50, 460);
    ctx.font = '18px Arial';
    ctx.fillText(`Name: ${booking.driver.name}`, 50, 495);
    ctx.fillText(`Phone: ${booking.driver.phone}`, 50, 525);
    ctx.fillText(`Vehicle: ${booking.driver.vehicle}`, 50, 555);

    // Payment Info
    ctx.font = 'bold 22px Arial';
    ctx.fillText('Payment Details', 50, 615);
    ctx.font = '18px Arial';
    ctx.fillText(`Seats: ${booking.seats}`, 50, 650);
    ctx.fillText(`Total: ₦${booking.totalAmount.toLocaleString()}`, 50, 680);

    // Blockchain Info
    ctx.font = 'bold 22px Arial';
    ctx.fillText('Blockchain Verification', 50, 740);
    ctx.font = '14px Arial';
    ctx.fillText(`Token: ${booking.blockchainToken.tokenId}`, 50, 775);
    ctx.fillText(`Hash: ${booking.blockchainToken.transactionHash.substring(0, 40)}...`, 50, 805);
    
    // Status badge
    ctx.fillStyle = '#10b981';
    ctx.fillRect(50, 850, 200, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✓ CONFIRMED', 150, 877);

    // Footer
    ctx.fillStyle = '#666666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Show this ticket to your driver', canvas.width / 2, 950);

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `OpenRide-Ticket-${booking.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Ticket downloaded successfully!");
      }
    });
  }

  const handleShareBooking = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "OpenRide Booking",
          text: `I just booked a ride from ${booking.route.from} to ${booking.route.to} on OpenRide!`,
          url: window.location.href,
        })
      } catch (error) {
        toast.error("Failed to share")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading booking details..." />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Booking not found</p>
          <Button className="mt-4" onClick={() => router.push("/rider")}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Animation */}
        <div
          className={`text-center mb-8 transition-all duration-700 ${
            showSuccess ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-muted-foreground">
            Your ride has been booked successfully. Check your email for details.
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Booking Details</h2>
              <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
            </div>
            <Badge className="bg-green-500/10 text-green-700 border-green-500/30">
              {booking.status}
            </Badge>
          </div>

          {/* Route Info */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="font-semibold">{booking.route.from}</p>
                <p className="text-sm text-muted-foreground">Pickup: {booking.pickupLocation}</p>
              </div>
            </div>
            <div className="ml-2 border-l-2 border-dashed border-border h-8" />
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-secondary mt-1" />
              <div className="flex-1">
                <p className="font-semibold">{booking.route.to}</p>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold">{booking.bookingDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Departure Time</p>
                <p className="font-semibold">{booking.route.departureTime}</p>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          <div className="border-t border-border pt-4 mb-6">
            <h3 className="font-semibold mb-3">Driver Information</h3>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                {booking.driver.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{booking.driver.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Car className="w-4 h-4" />
                  {booking.driver.vehicle}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => (window.location.href = `tel:${booking.driver.phone}`)}
              >
                <Phone className="w-4 h-4" />
                Call
              </Button>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Seats</span>
              <span>{booking.seats}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Price per seat</span>
              <span>₦{(booking.totalAmount / booking.seats).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">₦{booking.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* QR Code & Blockchain Token */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Blockchain-Verified Ticket
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* QR Code */}
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block mb-3">
                <QRCodeSVG
                  value={JSON.stringify({
                    bookingId: booking.id,
                    tokenId: booking.blockchainToken.tokenId,
                    timestamp: Date.now(),
                  })}
                  size={180}
                  level="H"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Show this QR code to your driver
              </p>
            </div>

            {/* Blockchain Info */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Token ID</p>
                <code className="text-xs bg-muted p-2 rounded block break-all">
                  {booking.blockchainToken.tokenId}
                </code>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                <code className="text-xs bg-muted p-2 rounded block break-all">
                  {booking.blockchainToken.transactionHash}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-700 border-green-500/30">
                  ✓ Verified on Blockchain
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-3">
          <Button variant="outline" className="gap-2" onClick={handleDownloadTicket}>
            <Download className="w-4 h-4" />
            Download Ticket
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleShareBooking}>
            <Share2 className="w-4 h-4" />
            Share Booking
          </Button>
          <Button onClick={() => router.push("/rider")}>
            Back to Dashboard
          </Button>
        </div>

        {/* Important Notes */}
        <Card className="p-4 mt-6 bg-blue-500/5 border-blue-500/20">
          <h4 className="font-semibold text-sm mb-2">📱 Important Notes:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Arrive at pickup location 5 minutes before departure time</li>
            <li>• Have your QR code ready to show the driver</li>
            <li>• Driver contact is available above if you need assistance</li>
            <li>• Booking is secured on blockchain - tamper-proof!</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading booking details..." />
      </div>
    }>
      <BookingConfirmationContent />
    </Suspense>
  )
}
