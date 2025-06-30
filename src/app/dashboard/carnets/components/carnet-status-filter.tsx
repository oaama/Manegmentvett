"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export function CarnetStatusFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get("status") || "pending"

  const setStatus = (status: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("status", status)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const statuses: ('pending' | 'approved' | 'rejected' | 'all')[] = ['pending', 'approved', 'rejected', 'all'];

  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
      {statuses.map(status => (
        <Button
          key={status}
          variant={currentStatus === status ? "default" : "ghost"}
          size="sm"
          onClick={() => setStatus(status)}
          className="capitalize"
        >
          {status}
        </Button>
      ))}
    </div>
  )
}
