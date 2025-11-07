"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Clock, Search, Star, History, Home, Briefcase, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SavedPlace {
  id: string
  name: string
  address: string
  type: "home" | "work" | "recent"
}

interface ModernSearchFormProps {
  onSearch: (from: string, to: string, time: string) => void
}

export default function ModernSearchForm({ onSearch }: ModernSearchFormProps) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [timeRange, setTimeRange] = useState("6:00 - 8:00 AM")
  const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null)
  const [recentSearches, setRecentSearches] = useState<Array<{ from: string; to: string }>>([])
  const [savedPlaces] = useState<SavedPlace[]>([
    { id: "1", name: "Home", address: "Lekki Phase 1, Lagos", type: "home" },
    { id: "2", name: "Work", address: "Victoria Island, Lagos", type: "work" },
  ])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent_searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const handleSearch = () => {
    if (from && to) {
      // Save to recent searches
      const newSearch = { from, to }
      const updated = [newSearch, ...recentSearches.filter(s => s.from !== from || s.to !== to)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recent_searches", JSON.stringify(updated))
      
      onSearch(from, to, timeRange)
      setActiveInput(null)
    }
  }

  const selectPlace = (address: string, inputType: "from" | "to") => {
    if (inputType === "from") {
      setFrom(address)
    } else {
      setTo(address)
    }
    setActiveInput(null)
  }

  const selectRecent = (search: { from: string; to: string }) => {
    setFrom(search.from)
    setTo(search.to)
    setActiveInput(null)
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
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-md" />
            </div>
            <Input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => setActiveInput("from")}
              placeholder="Pickup location"
              className="pl-10 h-14 text-base border-2 focus:border-primary transition-all"
            />
            {from && activeInput === "from" && (
              <button
                onClick={() => setFrom("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
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
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => setActiveInput("to")}
              placeholder="Dropoff location"
              className="pl-10 h-14 text-base border-2 focus:border-primary transition-all"
            />
            {to && activeInput === "to" && (
              <button
                onClick={() => setTo("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
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

      {/* Suggestions Panel - Shows when input is focused */}
      {activeInput && (
        <Card className="border-2 border-primary/20 shadow-lg animate-fade-in-up">
          <div className="p-4">
            {/* Saved Places */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Saved Places
              </h3>
              <div className="space-y-2">
                {savedPlaces.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => selectPlace(place.address, activeInput)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {place.type === "home" ? (
                        <Home className="w-5 h-5 text-primary" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{place.name}</p>
                      <p className="text-xs text-muted-foreground">{place.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
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
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
