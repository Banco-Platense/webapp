import { redirect } from "next/navigation"

export default function Home() {
  // In a real implementation, this would check for JWT token server-side
  // For now, we'll redirect to login page
  redirect("/login")
}
