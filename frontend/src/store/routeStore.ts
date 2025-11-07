/**
 * Route Zustand store
 */
import { create } from "zustand"
import type { Route, SearchParams } from "@/src/types"
import { routeService } from "@/src/services/route.service"

interface RouteState {
  routes: Route[]
  searchResults: Route[]
  myRoutes: Route[]
  isLoading: boolean
  error: string | null
  lastSearch: SearchParams | null

  // Actions
  searchRoutes: (params: SearchParams) => Promise<void>
  fetchMyRoutes: () => Promise<void>
  createRoute: (data: Partial<Route>) => Promise<Route>
  updateRoute: (id: string, data: Partial<Route>) => Promise<void>
  deleteRoute: (id: string) => Promise<void>
  toggleRouteStatus: (id: string, status: "ACTIVE" | "INACTIVE") => Promise<void>
  clearSearchResults: () => void
  clearError: () => void
}

export const useRouteStore = create<RouteState>((set, get) => ({
  routes: [],
  searchResults: [],
  myRoutes: [],
  isLoading: false,
  error: null,
  lastSearch: null,

  searchRoutes: async (params) => {
    set({ isLoading: true, error: null, lastSearch: params })
    try {
      const routes = await routeService.searchRoutes(params)
      set({ searchResults: routes, isLoading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to search routes",
        isLoading: false,
      })
    }
  },

  fetchMyRoutes: async () => {
    set({ isLoading: true, error: null })
    try {
      const routes = await routeService.getMyRoutes()
      set({ myRoutes: routes, isLoading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch routes",
        isLoading: false,
      })
    }
  },

  createRoute: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const route = await routeService.createRoute(data)
      set({
        myRoutes: [route, ...get().myRoutes],
        isLoading: false,
      })
      return route
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create route",
        isLoading: false,
      })
      throw error
    }
  },

  updateRoute: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const updatedRoute = await routeService.updateRoute(id, data)
      set({
        myRoutes: get().myRoutes.map((r) => (r.id === id ? updatedRoute : r)),
        isLoading: false,
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update route",
        isLoading: false,
      })
      throw error
    }
  },

  deleteRoute: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await routeService.deleteRoute(id)
      set({
        myRoutes: get().myRoutes.filter((r) => r.id !== id),
        isLoading: false,
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete route",
        isLoading: false,
      })
      throw error
    }
  },

  toggleRouteStatus: async (id, status) => {
    set({ isLoading: true, error: null })
    try {
      const updatedRoute = await routeService.toggleRouteStatus(id, status)
      set({
        myRoutes: get().myRoutes.map((r) => (r.id === id ? updatedRoute : r)),
        isLoading: false,
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to toggle route status",
        isLoading: false,
      })
      throw error
    }
  },

  clearSearchResults: () => {
    set({ searchResults: [], lastSearch: null })
  },

  clearError: () => {
    set({ error: null })
  },
}))
