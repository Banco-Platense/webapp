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
import Image from "next/image"

export function DashboardHeader() {
  const { user, logout } = useAuth()
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
    <header className="bg-gradient-to-r from-darkbrown via-darkbrown to-darkgold text-white shadow-md border-b-2 border-gold/30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-darkbrown/80">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-cream">
              <div className="flex flex-col gap-4 mt-8">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-lightgold hover:to-gold/20 text-deepbrown transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/send"
                  className="px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-lightgold hover:to-gold/20 text-deepbrown transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Send Money
                </Link>
                <Link
                  href="/dashboard/add-money"
                  className="px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-lightgold hover:to-gold/20 text-deepbrown transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Add Money
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start px-4 text-deepbrown hover:bg-gradient-to-r hover:from-lightgold hover:to-gold/20 transition-all duration-200"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Banco Platense Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-xl font-bold">Banco Platense</h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/dashboard" className="hover:text-gold transition-colors duration-200">
            Dashboard
          </Link>
          <Link href="/dashboard/send" className="hover:text-gold transition-colors duration-200">
            Send Money
          </Link>
          <Link href="/dashboard/add-money" className="hover:text-gold transition-colors duration-200">
            Add Money
          </Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 bg-lightbrown text-deepbrown">
                <AvatarFallback>{user?.username ? getInitials(user.username) : "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-cream border-taupe">
            <DropdownMenuItem className="cursor-default">
              <User className="mr-2 h-4 w-4" />
              <span>{user?.username || "User"}</span>
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
