import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import type { Transaction, UserData } from "@/types"
import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

interface TransactionListProps {
  transactions: Transaction[]
  walletId: string
  isLoading: boolean
}

interface EnhancedTransaction extends Transaction {
  senderUsername?: string
  receiverUsername?: string
}

export function TransactionList({ transactions, walletId, isLoading }: TransactionListProps) {
  const { token } = useAuth()
  const [enhancedTransactions, setEnhancedTransactions] = useState<EnhancedTransaction[]>([])
  const [userCache, setUserCache] = useState<Map<string, string>>(new Map())

  // Fetch username for a given wallet ID
  const fetchUsername = async (walletId: string): Promise<string> => {
    // Check cache first
    if (userCache.has(walletId)) {
      return userCache.get(walletId)!
    }

    try {
      const userData: UserData = await apiRequest(`/wallets/${walletId}/user`, { token })
      const username = userData.username
      
      // Cache the result
      setUserCache(prev => new Map(prev).set(walletId, username))
      
      return username
    } catch (error) {
      console.error(`Failed to fetch username for wallet ${walletId}:`, error)
      return "Unknown User"
    }
  }

  // Enhance transactions with usernames
  useEffect(() => {
    if (!transactions.length || !token) {
      setEnhancedTransactions(transactions)
      return
    }

    const enhanceTransactions = async () => {
      const enhanced = await Promise.all(
        transactions.map(async (transaction) => {
          const enhancedTransaction: EnhancedTransaction = { ...transaction }

          // Only fetch usernames for P2P transactions
          if (transaction.type === "P2P") {
            try {
              // Fetch sender username (if not current user's wallet)
              if (transaction.senderWalletId !== walletId) {
                enhancedTransaction.senderUsername = await fetchUsername(transaction.senderWalletId)
              }

              // Fetch receiver username (if not current user's wallet)
              if (transaction.receiverWalletId !== walletId) {
                enhancedTransaction.receiverUsername = await fetchUsername(transaction.receiverWalletId)
              }
            } catch (error) {
              console.error("Error fetching usernames for transaction:", error)
            }
          }

          return enhancedTransaction
        })
      )

      setEnhancedTransactions(enhanced)
    }

    enhanceTransactions()
  }, [transactions, walletId, token])

  const isGreenTransaction = (transaction: Transaction) => {
    return transaction.type === "EXTERNAL_DEBIN" || transaction.type === "EXTERNAL_TOPUP" || transaction.receiverWalletId === walletId
  }

  const getTransactionDisplayText = (transaction: EnhancedTransaction) => {
    if (transaction.type === "P2P") {
      const isReceiving = transaction.receiverWalletId === walletId
      
      if (isReceiving && transaction.senderUsername) {
        return `From ${transaction.senderUsername}`
      } else if (!isReceiving && transaction.receiverUsername) {
        return `To ${transaction.receiverUsername}`
      }
    }
    
    return transaction.description
  }

  return (
    <Card className="mt-6 border-taupe bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-deepbrown">Recent Transactions</CardTitle>
        <CardDescription>Your recent activity</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : enhancedTransactions.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">No transactions yet</p>
        ) : (
          <div className="space-y-4">
            {enhancedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b border-taupe/20 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center">
                  <div
                    className={`mr-3 p-2 rounded-full ${
                      isGreenTransaction(transaction) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isGreenTransaction(transaction) ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{getTransactionDisplayText(transaction)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(transaction.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className={`font-medium ${isGreenTransaction(transaction) ? "text-green-700" : "text-red-700"}`}>
                  {isGreenTransaction(transaction) ? "+" : "-"}${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
