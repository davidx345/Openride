"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Camera, Save, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"

interface DriverProfileEditProps {
  onBack?: () => void
}

export default function DriverProfileEdit({ onBack }: DriverProfileEditProps) {
  const [profile, setProfile] = useState({
    name: "Amara Kelechi",
    email: "amara.driver@openride.com",
    phone: "+234 801 234 5678",
    licenseNumber: "ABC123456789",
    vehicle: {
      model: "Toyota Camry 2020",
      color: "Black",
      plateNumber: "ABC 123 XY",
      seats: 4,
    },
  })

  const handleSave = () => {
    // Save to localStorage (demo mode)
    localStorage.setItem("driver_profile", JSON.stringify(profile))
    toast.success("Profile updated successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">Update your personal and vehicle information</p>
        </div>
      </div>

      {/* Profile Photo */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Profile Photo</h3>
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Button variant="outline" className="gap-2">
              <Camera className="w-4 h-4" />
              Change Photo
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              JPG, PNG or GIF. Max size 2MB
            </p>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Enter email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="license">Driver's License</Label>
            <Input
              id="license"
              value={profile.licenseNumber}
              onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
              placeholder="License number"
            />
          </div>
        </div>
      </Card>

      {/* Vehicle Information */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model">Vehicle Model</Label>
            <Input
              id="model"
              value={profile.vehicle.model}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  vehicle: { ...profile.vehicle, model: e.target.value },
                })
              }
              placeholder="e.g., Toyota Camry 2020"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Vehicle Color</Label>
            <Input
              id="color"
              value={profile.vehicle.color}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  vehicle: { ...profile.vehicle, color: e.target.value },
                })
              }
              placeholder="e.g., Black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plate">Plate Number</Label>
            <Input
              id="plate"
              value={profile.vehicle.plateNumber}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  vehicle: { ...profile.vehicle, plateNumber: e.target.value },
                })
              }
              placeholder="e.g., ABC 123 XY"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seats">Available Seats</Label>
            <Input
              id="seats"
              type="number"
              value={profile.vehicle.seats}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  vehicle: { ...profile.vehicle, seats: parseInt(e.target.value) },
                })
              }
              placeholder="Number of seats"
              min="1"
              max="7"
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} className="bg-primary gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
