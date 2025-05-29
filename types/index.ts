export interface UserType {
  id: string
  username: string
  email: string
}

export interface Transaction {
  id: string
  type: "P2P" | "EXTERNAL_DEBIN" | "EXTERNAL_TOPUP"
  amount: number
  description: string
  timestamp: string
  receiverWalletId: string
  senderWalletId: string
}

export interface Wallet {
  id: string
  userId: string,
  balance: number,
}