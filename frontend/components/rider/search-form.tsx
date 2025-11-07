"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search, MapPin } from "lucide-react"
import { NIGERIAN_CITIES } from "@/src/types"

export default function SearchForm({ onSearch }: any) {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    timeRange: "06:00-08:00",
  })

  const [fromSearch, setFromSearch] = useState("")
  const [toSearch, setToSearch] = useState("")
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)
  
  const fromRef = useRef<HTMLDivElement>(null)
  const toRef = useRef<HTMLDivElement>(null)

  // Filter cities based on search input
  const filteredFromCities = NIGERIAN_CITIES.filter((city) =>
    city.toLowerCase().includes(fromSearch.toLowerCase())
  )
  const filteredToCities = NIGERIAN_CITIES.filter((city) =>
    city.toLowerCase().includes(toSearch.toLowerCase())
  )

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setFromOpen(false)
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setToOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.from && formData.to) {
      onSearch(formData)
    }
  }

  return (
    <Card className="p-6 bg-card border border-border">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          {/* From Location */}
          <div className="space-y-2" ref={fromRef}>
            <Label htmlFor="from">From</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search location..."
                value={formData.from || fromSearch}
                onChange={(e) => {
                  setFromSearch(e.target.value)
                  setFormData((prev) => ({ ...prev, from: "" }))
                  setFromOpen(true)
                }}
                onFocus={() => setFromOpen(true)}
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              
              {fromOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {filteredFromCities.length > 0 ? (
                    filteredFromCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, from: city }))
                          setFromSearch("")
                          setFromOpen(false)
                        }}
                        className="w-full px-4 py-2 hover:bg-muted text-left transition-colors text-sm flex items-center gap-2"
                      >
                        <MapPin className="w-3 h-3 text-primary" />
                        {city}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      No locations found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* To Location */}
          <div className="space-y-2" ref={toRef}>
            <Label htmlFor="to">To</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search location..."
                value={formData.to || toSearch}
                onChange={(e) => {
                  setToSearch(e.target.value)
                  setFormData((prev) => ({ ...prev, to: "" }))
                  setToOpen(true)
                }}
                onFocus={() => setToOpen(true)}
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              
              {toOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {filteredToCities.length > 0 ? (
                    filteredToCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, to: city }))
                          setToSearch("")
                          setToOpen(false)
                        }}
                        className="w-full px-4 py-2 hover:bg-muted text-left transition-colors text-sm flex items-center gap-2"
                      >
                        <MapPin className="w-3 h-3 text-primary" />
                        {city}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      No locations found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Time Range */}
          <div className="space-y-2">
            <Label htmlFor="time">Time Range</Label>
            <select
              value={formData.timeRange}
              onChange={(e) => setFormData((prev) => ({ ...prev, timeRange: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="06:00-08:00">6:00 - 8:00 AM</option>
              <option value="07:00-09:00">7:00 - 9:00 AM</option>
              <option value="06:00-09:00">6:00 - 9:00 AM</option>
              <option value="05:30-09:00">5:30 - 9:00 AM</option>
            </select>
          </div>
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 gap-2" size="lg">
          <Search className="w-5 h-5" />
          Search Rides
        </Button>
      </form>
    </Card>
  )
}
