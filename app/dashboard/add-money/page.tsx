"use client"

import React, {useEffect} from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import {apiRequest} from "@/lib/api";

export default function AddMoneyPage() {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()

  // Redirect if not authenticated
  if (typeof window !== "undefined" && !isAuthenticated) {
    router.push("/login")
  }

  useEffect(() => {
    setIsLoading(false)
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      setIsLoading(false)
      return
    }

    try {
      // Create debin transaction
      await apiRequest(`/wallets/transactions/debin`, {
        token,
        method: "POST",
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
        }),
      })
      router.push("/dashboard")
    } catch (err: any) {
      setError("Failed to add money. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream p-4">
      <div className="container mx-auto max-w-md">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <Card className="border-taupe">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-deepbrown">Add Money</CardTitle>
            <CardDescription className="text-center">Request funds from another wallet via DEBIN</CardDescription>
          </CardHeader>
          <CardContent>
            <form noValidate onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">$</div>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="pl-7 border-taupe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                {/* optional source selector */}
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-mediumbrown to-darkgold hover:from-mediumbrown/90 hover:to-richgold border border-gold/20" disabled={isLoading}>
                {isLoading ? "Processing..." : "Send DEBIN Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
