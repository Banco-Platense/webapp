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

export default function SendMoneyPage() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
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

    const transactionData = {amount, description: note, receiverWalletId: recipient}
    try {
      await apiRequest(`/wallets/transactions/p2p`, {token, method: "POST", body: JSON.stringify(transactionData)})

      // Mock successful transfer
      router.push("/dashboard")
    } catch (err) {
      setError("Transfer failed. Please try again.")
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
            <CardTitle className="text-2xl font-bold text-center text-deepbrown">Send Money</CardTitle>
            <CardDescription className="text-center">Transfer funds to another account holder</CardDescription>
          </CardHeader>
          <CardContent>
            <form noValidate onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Email or ID</Label>
                <Input
                  id="recipient"
                  type="text"
                  placeholder="recipient walletId"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                  className="border-taupe"
                />
              </div>
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
                <Label htmlFor="note">Note (Optional)</Label>
                <Input
                  id="note"
                  type="text"
                  placeholder="What's this for?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="border-taupe"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-mediumbrown to-darkgold hover:from-mediumbrown/90 hover:to-richgold border border-gold/20" disabled={isLoading}>
                {isLoading ? "Processing..." : "Send Money"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
