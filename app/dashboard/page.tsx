"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { ActionButtons } from "@/components/dashboard/action-buttons"
import { mockTransactions } from "@/lib/mock-data"
import type { Transaction } from "@/types"
import { apiRequest } from "@/lib/api"

export default function DashboardPage() {
  const { user, isAuthenticated, token } = useAuth()
  const router = useRouter()
  const [balance, setBalance] = useState(1250.75)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push("/login")
      return
    }

    // Fetch user data using JWT token
    const fetchData = async () => {
      try {
        // For now, use mock data but demonstrate how we would use the token
        // In a real app, we would replace this with actual API calls
        // Example:
        // const userData = await apiRequest('/user/profile', { token });
        // const transactionData = await apiRequest('/user/transactions', { token });
        
        // Simulate API call to demonstrate token usage
        console.log("Using JWT token for authentication:", token)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setTransactions(mockTransactions)
      } catch (error) {
        console.error("Failed to fetch wallet data", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, router, token])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-cream">
      <DashboardHeader user={user} />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <BalanceCard balance={balance} isLoading={isLoading} />
        <ActionButtons />
        <TransactionList transactions={transactions} isLoading={isLoading} />
      </main>
    </div>
  )
}
