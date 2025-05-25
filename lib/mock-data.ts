import type { Transaction } from "@/types"

export const mockTransactions: Transaction[] = [
  {
    id: "tx-001",
    type: "income",
    amount: 500.0,
    description: "Received from John Doe",
    date: "2025-05-20T14:30:00Z",
  },
  {
    id: "tx-002",
    type: "expense",
    amount: 125.5,
    description: "Sent to Jane Smith",
    date: "2025-05-18T09:15:00Z",
  },
  {
    id: "tx-003",
    type: "income",
    amount: 1000.0,
    description: "Added from Bank Account",
    date: "2025-05-15T11:45:00Z",
  },
  {
    id: "tx-004",
    type: "expense",
    amount: 75.25,
    description: "Sent to Coffee Shop",
    date: "2025-05-12T16:20:00Z",
  },
  {
    id: "tx-005",
    type: "expense",
    amount: 250.0,
    description: "Sent to Alex Johnson",
    date: "2025-05-10T13:10:00Z",
  },
]
