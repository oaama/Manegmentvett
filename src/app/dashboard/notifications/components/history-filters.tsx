"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function NotificationHistoryFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTarget = searchParams.get("target") || "all"

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      params.set('target', value)
    } else {
      params.delete('target')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }
  
  const targets = ['all', 'students', 'instructors'];

  return (
    <div className="flex items-center gap-2">
       <Select onValueChange={handleFilterChange} value={currentTarget}>
          <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Target Audience" />
          </SelectTrigger>
          <SelectContent>
              {targets.map(target => (
                  <SelectItem key={target} value={String(target)} className="capitalize">{target}</SelectItem>
              ))}
          </SelectContent>
       </Select>
    </div>
  )
}
