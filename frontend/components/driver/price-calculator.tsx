"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, AlertCircle } from "lucide-react"

// Price suggestions based on Lagos routes and distance
const PRICE_SUGGESTIONS = {
  short: { min: 800, max: 1500, label: "< 10km" },
  medium: { min: 1500, max: 2500, label: "10-20km" },
  long: { min: 2500, max: 4000, label: "20-30km" },
  veryLong: { min: 4000, max: 6000, label: "> 30km" },
}

export default function PriceCalculator() {
  const [distance, setDistance] = useState("")
  const [fuelCost, setFuelCost] = useState("")
  const [seats, setSeats] = useState("4")
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)
  const [suggestion, setSuggestion] = useState<any>(null)

  const calculatePrice = () => {
    const dist = parseFloat(distance)
    const fuel = parseFloat(fuelCost)
    const seatCount = parseInt(seats)

    if (isNaN(dist) || isNaN(fuel) || isNaN(seatCount) || seatCount === 0) {
      return
    }

    // Calculate based on fuel cost + 30% profit margin
    const baseCost = (fuel / seatCount) * 1.3
    const recommendedPrice = Math.round(baseCost / 50) * 50 // Round to nearest 50

    setCalculatedPrice(recommendedPrice)

    // Determine suggestion category
    if (dist < 10) {
      setSuggestion(PRICE_SUGGESTIONS.short)
    } else if (dist < 20) {
      setSuggestion(PRICE_SUGGESTIONS.medium)
    } else if (dist < 30) {
      setSuggestion(PRICE_SUGGESTIONS.long)
    } else {
      setSuggestion(PRICE_SUGGESTIONS.veryLong)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Price Calculator</h3>
          <p className="text-sm text-muted-foreground">Get optimal pricing for your route</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Distance Input */}
        <div>
          <Label htmlFor="distance">Route Distance (km)</Label>
          <Input
            id="distance"
            type="number"
            placeholder="e.g., 15"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Fuel Cost Input */}
        <div>
          <Label htmlFor="fuelCost">Estimated Fuel Cost (₦)</Label>
          <Input
            id="fuelCost"
            type="number"
            placeholder="e.g., 3000"
            value={fuelCost}
            onChange={(e) => setFuelCost(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Total fuel cost for the complete route
          </p>
        </div>

        {/* Available Seats */}
        <div>
          <Label htmlFor="seats">Available Seats</Label>
          <Input
            id="seats"
            type="number"
            placeholder="e.g., 4"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className="mt-1"
            min="1"
            max="7"
          />
        </div>

        <Button onClick={calculatePrice} className="w-full gap-2">
          <Calculator className="w-4 h-4" />
          Calculate Optimal Price
        </Button>

        {/* Results */}
        {calculatedPrice !== null && suggestion && (
          <div className="space-y-4 pt-4 border-t border-border">
            {/* Calculated Price */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Recommended Price per Seat</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">
                ₦{calculatedPrice.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Includes fuel cost + 30% profit margin
              </p>
            </div>

            {/* Market Rate */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-secondary" />
                <span className="text-sm font-semibold">Market Rate for {suggestion.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="mr-2">
                    Min: ₦{suggestion.min.toLocaleString()}
                  </Badge>
                  <Badge variant="outline">
                    Max: ₦{suggestion.max.toLocaleString()}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {calculatedPrice < suggestion.min && (
                  <span className="text-orange-500">
                    ⚠️ Your price is below market rate. Consider increasing for better value.
                  </span>
                )}
                {calculatedPrice >= suggestion.min && calculatedPrice <= suggestion.max && (
                  <span className="text-green-600">
                    ✓ Your price is competitive and within market range!
                  </span>
                )}
                {calculatedPrice > suggestion.max && (
                  <span className="text-orange-500">
                    ⚠️ Your price is above market rate. You may get fewer bookings.
                  </span>
                )}
              </p>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">💡 Pricing Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Peak hours (6-9 AM, 5-8 PM) can support 10-20% higher prices</li>
                <li>• Regular riders often accept slightly higher prices for reliability</li>
                <li>• Consider toll fees and parking costs in your calculation</li>
                <li>• Lower prices on less popular routes to attract initial bookings</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
