import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import type { Transaction } from "@/types"
import {use, useEffect} from "react";

interface TransactionListProps {
  transactions: Transaction[]
  walletId: string
  isLoading: boolean
}

// TODO show more data, like receiver/sender
export function TransactionList({ transactions, walletId, isLoading }: TransactionListProps) {
    useEffect(() => {

    }, []);

  const isGreenTransaction = (transaction: Transaction) => {
      return transaction.type === "EXTERNAL_DEBIN" || transaction.type === "EXTERNAL_TOPUP" || transaction.receiverWalletId === walletId
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
        ) : transactions.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">No transactions yet</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
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
                    <p className="font-medium">{transaction.description}</p>
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
