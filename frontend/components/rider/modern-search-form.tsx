"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Clock, Search, Star, History, Home, Briefcase, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NIGERIAN_CITIES } from "@/src/types"

interface SavedPlace {
  id: string
  name: string
  address: string
  type: "home" | "work" | "recent"
}

interface ModernSearchFormProps {
  onSearch: (searchParams: { from: string; to: string; timeRange: string }) => void
}

export default function ModernSearchForm({ onSearch }: ModernSearchFormProps) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [timeRange, setTimeRange] = useState("6:00 - 8:00 AM")
  const [fromSearch, setFromSearch] = useState("")
  const [toSearch, setToSearch] = useState("")
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<Array<{ from: string; to: string }>>([])
  
  const fromRef = useRef<HTMLDivElement>(null)
  const toRef = useRef<HTMLDivElement>(null)

  const [savedPlaces] = useState<SavedPlace[]>([
    { id: "1", name: "Home", address: "Lekki Phase 1", type: "home" },
    { id: "2", name: "Work", address: "Victoria Island", type: "work" },
  ])

  // Filter cities based on search input
  const filteredFromCities = NIGERIAN_CITIES.filter((city) =>
    city.toLowerCase().includes(fromSearch.toLowerCase())
  )
  const filteredToCities = NIGERIAN_CITIES.filter((city) =>
    city.toLowerCase().includes(toSearch.toLowerCase())
  )

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent_searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

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

  const handleSearch = () => {
    if (from && to) {
      // Save to recent searches
      const newSearch = { from, to }
      const updated = [newSearch, ...recentSearches.filter(s => s.from !== from || s.to !== to)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recent_searches", JSON.stringify(updated))
      
      // Call the parent onSearch with proper parameters
      onSearch({ from, to, timeRange })
      setFromOpen(false)
      setToOpen(false)
    }
  }

  const selectPlace = (address: string, inputType: "from" | "to") => {
    if (inputType === "from") {
      setFrom(address)
      setFromSearch("")
      setFromOpen(false)
    } else {
      setTo(address)
      setToSearch("")
      setToOpen(false)
    }
  }

  const selectRecent = (search: { from: string; to: string }) => {
    setFrom(search.from)
    setTo(search.to)
    setFromSearch("")
    setToSearch("")
    setFromOpen(false)
    setToOpen(false)
  }

  const swapLocations = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  const timeRanges = [
    "6:00 - 8:00 AM",
    "8:00 - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 - 2:00 PM",
    "2:00 - 4:00 PM",
    "4:00 - 6:00 PM",
    "6:00 - 8:00 PM",
  ]

  return (
    <div className="space-y-4">
      {/* Main Search Card - Uber/Bolt Style */}
      <Card className="border-2 border-border shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-accent p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Where are you going?</h2>
          <p className="text-white/90 text-sm">Search for rides near you</p>
        </div>

        <div className="p-6 space-y-4">
          {/* From Input */}
          <div className="relative" ref={fromRef}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-md" />
            </div>
            <Input
              value={from || fromSearch}
              onChange={(e) => {
                setFromSearch(e.target.value)
                setFrom("")
                setFromOpen(true)
              }}
              onFocus={() => setFromOpen(true)}
              placeholder="Pickup location"
              className="pl-10 h-14 text-base border-2 focus:border-primary transition-all"
            />
            {from && (
              <button
                onClick={() => {
                  setFrom("")
                  setFromSearch("")
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {/* From Dropdown */}
            {fromOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border-2 border-primary rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {filteredFromCities.length > 0 ? (
                  filteredFromCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setFrom(city)
                        setFromSearch("")
                        setFromOpen(false)
                      }}
                      className="w-full px-4 py-3 hover:bg-primary/10 text-left transition-colors text-sm flex items-center gap-3"
                    >
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium">{city}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    No locations found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Connecting Line */}
          <div className="flex items-center gap-3">
            <div className="w-px h-6 bg-border ml-[18px]" />
            <Button
              variant="ghost"
              size="sm"
              onClick={swapLocations}
              className="text-primary hover:text-primary/80"
            >
              ⇅ Swap
            </Button>
          </div>

          {/* To Input */}
          <div className="relative" ref={toRef}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <Input
              value={to || toSearch}
              onChange={(e) => {
                setToSearch(e.target.value)
                setTo("")
                setToOpen(true)
              }}
              onFocus={() => setToOpen(true)}
              placeholder="Dropoff location"
              className="pl-10 h-14 text-base border-2 focus:border-primary transition-all"
            />
            {to && (
              <button
                onClick={() => {
                  setTo("")
                  setToSearch("")
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {/* To Dropdown */}
            {toOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border-2 border-primary rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {filteredToCities.length > 0 ? (
                  filteredToCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setTo(city)
                        setToSearch("")
                        setToOpen(false)
                      }}
                      className="w-full px-4 py-3 hover:bg-primary/10 text-left transition-colors text-sm flex items-center gap-3"
                    >
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium">{city}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    No locations found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Time Range Selector */}
          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Clock className="w-4 h-4 text-primary" />
              Departure Time
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeRanges.map((time) => (
                <button
                  key={time}
                  onClick={() => setTimeRange(time)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === time
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!from || !to}
            className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Rides
          </Button>
        </div>
      </Card>

      {/* Recent Searches Panel - Shows below main card */}
      {recentSearches.length > 0 && !fromOpen && !toOpen && (
        <Card className="border-2 border-border/50 shadow-sm">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <History className="w-4 h-4" />
              Recent Searches
            </h3>
            <div className="space-y-2">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => selectRecent(search)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{search.from} → {search.to}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
