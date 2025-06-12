"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BalanceCardProps {
  balance: number
  walletId: string
  isLoading: boolean
}

export function BalanceCard({ balance, walletId, isLoading }: BalanceCardProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletId)
      setIsCopied(true)
      toast({
        title: "Wallet ID copied!",
        description: "Your wallet ID has been copied to the clipboard.",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
      toast({
        title: "Copy failed",
        description: "Failed to copy wallet ID to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="mb-6 border-taupe bg-white">
      <CardHeader className="pb-2">
        <CardDescription>Current Balance</CardDescription>
        <CardTitle className="text-3xl font-bold text-deepbrown">
          {isLoading ? <Skeleton className="h-9 w-32" /> : `$${balance.toFixed(2)}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Last updated: {isLoading ? <Skeleton className="h-4 w-36 inline-block" /> : new Date().toLocaleDateString()}
        </p>
        <div className="flex items-center justify-between mt-2 p-2 bg-gray-50 rounded-md border">
          <div className="flex-1">
            <p className="text-sm font-mono text-gray-700 break-all">{`WalletId: ${walletId}`}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="ml-2 h-8 w-8 p-0 hover:bg-gray-200"
            title="Copy wallet ID"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
