import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface BalanceCardProps {
  balance: number
  isLoading: boolean
}

export function BalanceCard({ balance, isLoading }: BalanceCardProps) {
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
      </CardContent>
    </Card>
  )
}
