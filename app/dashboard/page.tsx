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

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [balance, setBalance] = useState(1250.75)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // TODO: Replace with actual API call to fetch balance and transactions
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setTransactions(mockTransactions)
      } catch (error) {
        console.error("Failed to fetch wallet data", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f3efe8]">
      <DashboardHeader user={user} />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <BalanceCard balance={balance} isLoading={isLoading} />
        <ActionButtons />
        <TransactionList transactions={transactions} isLoading={isLoading} />
      </main>
    </div>
  )
}
