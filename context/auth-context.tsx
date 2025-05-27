"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserType } from "@/types"

interface AuthContextType {
  user: UserType | null
  isAuthenticated: boolean
  login: (userData: UserType, token: string) => void
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  token: null
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // Check if user is logged in from localStorage
      const storedUser = localStorage.getItem("wallet_user")
      const storedToken = localStorage.getItem("wallet_token")

      if (storedUser && storedToken && storedUser !== "undefined") {
        // Validate JSON before parsing
        const parsedUser = JSON.parse(storedUser)
        
        // Validate that the parsed user has required properties
        if (parsedUser && parsedUser.id && parsedUser.email) {
          setUser(parsedUser)
          setToken(storedToken)
          setIsAuthenticated(true)
        } else {
          // Invalid user data, clear localStorage
          localStorage.removeItem("wallet_user")
          localStorage.removeItem("wallet_token")
        }
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error)
      // Clear invalid data from localStorage
      localStorage.removeItem("wallet_user")
      localStorage.removeItem("wallet_token")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (userData: UserType, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    setIsAuthenticated(true)
    localStorage.setItem("wallet_user", JSON.stringify(userData))
    localStorage.setItem("wallet_token", authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem("wallet_user")
    localStorage.removeItem("wallet_token")
  }

  if (isLoading) {
    return null // or a loading spinner
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout, token }}>{children}</AuthContext.Provider>
}
