"use client"

import React, {useEffect} from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/context/auth-context"
import {apiRequest} from "@/lib/api";

export default function AddMoneyPage() {
  const [amount, setAmount] = useState("")
  const [source, setSource] = useState("card")
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
      const transactionData = {amount, description: source, externalWalletInfo: source}
      await apiRequest(`/wallets/transactions/topup`, {token, method: "POST", body: JSON.stringify(transactionData)})

      // Mock successful addition
      router.push("/dashboard")
    } catch (err) {
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
            <CardDescription className="text-center">Add funds to your account from external sources</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label>Source</Label>
                <RadioGroup value={source} onValueChange={setSource} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2 rounded-md border p-3 border-taupe">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3 border-taupe">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex-1 cursor-pointer">
                      Bank Account
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3 border-taupe">
                    <RadioGroupItem value="debin" id="debin" />
                    <Label htmlFor="debin" className="flex-1 cursor-pointer">
                      DEBIN Request
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="submit" className="w-full bg-mediumbrown hover:bg-mediumbrown/90" disabled={isLoading}>
                {isLoading ? "Processing..." : "Add Money"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
