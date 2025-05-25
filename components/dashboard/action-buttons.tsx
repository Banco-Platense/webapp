import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, PlusCircle } from "lucide-react"

export function ActionButtons() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <Link href="/dashboard/send" className="w-full">
        <Button
          className="w-full h-16 bg-[#336659] hover:bg-[#336659]/90 flex flex-col items-center justify-center"
          size="lg"
        >
          <ArrowUpRight className="h-6 w-6 mb-1" />
          <span>Send Money</span>
        </Button>
      </Link>
      <Link href="/dashboard/add-money" className="w-full">
        <Button
          className="w-full h-16 bg-[#0e1c4f] hover:bg-[#0e1c4f]/90 flex flex-col items-center justify-center"
          size="lg"
        >
          <PlusCircle className="h-6 w-6 mb-1" />
          <span>Add Money</span>
        </Button>
      </Link>
    </div>
  )
}
