"use client"

import { LogOut, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { UserType } from "@/types"

interface DashboardHeaderProps {
  user: UserType | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="bg-[#336659] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-[#336659]/80">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#f3efe8]">
              <div className="flex flex-col gap-4 mt-8">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-md hover:bg-[#faecc3] text-[#0e1c4f]"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/send"
                  className="px-4 py-2 rounded-md hover:bg-[#faecc3] text-[#0e1c4f]"
                  onClick={() => setIsOpen(false)}
                >
                  Send Money
                </Link>
                <Link
                  href="/dashboard/add-money"
                  className="px-4 py-2 rounded-md hover:bg-[#faecc3] text-[#0e1c4f]"
                  onClick={() => setIsOpen(false)}
                >
                  Add Money
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start px-4 text-[#0e1c4f] hover:bg-[#faecc3]"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold">Wallet App</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/dashboard" className="hover:text-[#faecc3]">
            Dashboard
          </Link>
          <Link href="/dashboard/send" className="hover:text-[#faecc3]">
            Send Money
          </Link>
          <Link href="/dashboard/add-money" className="hover:text-[#faecc3]">
            Add Money
          </Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 bg-[#faecc3] text-[#0e1c4f]">
                <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#f3efe8] border-[#bba591]">
            <DropdownMenuItem className="cursor-default">
              <User className="mr-2 h-4 w-4" />
              <span>{user?.name || "User"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
