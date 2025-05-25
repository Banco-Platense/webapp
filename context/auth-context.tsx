"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserType } from "@/types"

interface AuthContextType {
  user: UserType | null
  isAuthenticated: boolean
  login: (user: UserType) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("wallet_user")
    const token = localStorage.getItem("wallet_token")

    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [])

  const login = (userData: UserType) => {
    // TODO: In a real app, this would validate the JWT token
    // For now, we'll just store the user data and a dummy token
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("wallet_user", JSON.stringify(userData))
    localStorage.setItem("wallet_token", "dummy-jwt-token")
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("wallet_user")
    localStorage.removeItem("wallet_token")
  }

  if (isLoading) {
    return null // or a loading spinner
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}
