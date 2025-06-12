"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { loginUser } from "@/lib/auth-service"
import Image from "next/image"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Call the login API
      const response = await loginUser({
        username,
        password
      })
      
      // Login the user with the returned token
      login(response.user, response.token)
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Invalid username or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-cream">
      {/* Background image with fade effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45"
        style={{
          backgroundImage: "url('/background.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-cream/20 via-white/25 to-lightgold/15" />
      <Card className="w-full max-w-md border-taupe relative z-10 bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image 
              src="/logo.png" 
              alt="Banco Platense Logo" 
              width={48} 
              height={48} 
              className="h-12 w-12 object-contain"
            />
            <h1 className="text-2xl font-bold text-deepbrown">Banco Platense</h1>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-deepbrown">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-taupe"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-darkgold hover:text-gold hover:underline transition-colors duration-200">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-taupe"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-mediumbrown to-darkgold hover:from-mediumbrown/90 hover:to-richgold border border-gold/20" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-darkgold hover:text-gold hover:underline transition-colors duration-200">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
