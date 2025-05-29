"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { ActionButtons } from "@/components/dashboard/action-buttons"
import type {Transaction, Wallet} from "@/types"
import { apiRequest } from "@/lib/api"

export default function DashboardPage() {
  const { user , isAuthenticated, token } = useAuth()
  const router = useRouter()
  const [wallet, setWallet] = useState<Wallet>({id: "", balance: 0, userId: ""})
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
        const wallet: Wallet = await apiRequest("/wallets/user", {token})
        setWallet(wallet)

        const transactions: Transaction[] = await apiRequest(`/wallets/transactions`, {token})

        setTransactions(transactions)
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
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <BalanceCard balance={wallet.balance} walletId={wallet.id} isLoading={isLoading} />
        <ActionButtons />
        <TransactionList transactions={transactions} walletId={wallet.id} isLoading={isLoading} />
      </main>
    </div>
  )
}
