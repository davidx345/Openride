"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DriverSidebar from "@/components/driver/driver-sidebar"
import RouteCreationForm from "@/components/driver/route-creation-form"
import ActiveRoutesList from "@/components/driver/active-routes-list"
import ModernDriverDashboard from "@/components/driver/modern-driver-dashboard"
import DriverProfileEdit from "@/components/driver/driver-profile-edit"
import BankDetailsManagement from "@/components/driver/bank-details-management"
import PriceCalculator from "@/components/driver/price-calculator"
import EarningsDashboard from "@/components/driver/earnings-dashboard"
import { Plus, LayoutDashboard, Route, Settings, Wallet } from "lucide-react"

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showNewRouteForm, setShowNewRouteForm] = useState(false)
  const [routes, setRoutes] = useState([
    {
      id: "1",
      from: "Ogba",
      to: "VI",
      passingStops: ["Berger", "Ketu"],
      departureTime: "6:30 AM",
      availableSeats: 3,
      pricePerSeat: 566,
      status: "active",
      bookings: 2,
    },
    {
      id: "2",
      from: "Ikeja",
      to: "Lekki",
      passingStops: ["Obalende"],
      departureTime: "7:00 AM",
      availableSeats: 2,
      pricePerSeat: 566,
      status: "active",
      bookings: 1,
    },
  ])

  const handleCreateRoute = (newRoute: any) => {
    setRoutes([...routes, { ...newRoute, id: Date.now().toString(), status: "active", bookings: 0 }])
    setShowNewRouteForm(false)
  }

  const handleUpdateRouteStatus = (routeId: string, newStatus: string) => {
    setRoutes(routes.map((r) => (r.id === routeId ? { ...r, status: newStatus } : r)))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <DriverSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Driver Dashboard</h1>
              <p className="text-muted-foreground">Manage your routes, earnings, and profile</p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full md:w-fit grid-cols-4">
                <TabsTrigger value="dashboard">
                  <LayoutDashboard className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="routes">
                  <Route className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Routes</span>
                </TabsTrigger>
                <TabsTrigger value="profile">
                  <Settings className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="bank">
                  <Wallet className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Bank</span>
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                <ModernDriverDashboard />
              </TabsContent>

              {/* Routes Tab */}
              <TabsContent value="routes" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">My Routes</h2>
                  <Button
                    className="bg-primary hover:bg-primary/90 gap-2"
                    onClick={() => setShowNewRouteForm(!showNewRouteForm)}
                  >
                    <Plus className="w-4 h-4" />
                    New Route
                  </Button>
                </div>

                {showNewRouteForm && (
                  <RouteCreationForm onSubmit={handleCreateRoute} onCancel={() => setShowNewRouteForm(false)} />
                )}

                <ActiveRoutesList routes={routes} onUpdateStatus={handleUpdateRouteStatus} />
              </TabsContent>

              {/* Earnings Tab */}
              <TabsContent value="earnings" className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Earnings Overview</h2>
                <EarningsDashboard routes={routes} />
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <DriverProfileEdit />
              </TabsContent>

              {/* Bank Details Tab */}
              <TabsContent value="bank" className="space-y-6">
                <BankDetailsManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
