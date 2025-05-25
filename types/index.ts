export interface UserType {
  id: string
  name: string
  email: string
}

export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  date: string
}
