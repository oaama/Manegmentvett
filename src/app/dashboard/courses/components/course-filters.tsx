"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { User } from "@/lib/types"

type CourseFiltersProps = {
  instructors: Pick<User, '_id' | 'name'>[]
}

export function CourseFilters({ instructors }: CourseFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentYear = searchParams.get("year")
  const currentInstructor = searchParams.get("instructor")
  const currentCategory = searchParams.get("category")

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }
  
  const academicYears = Array.from({ length: 5 }, (_, i) => i + 1);

  const clearFilters = () => {
    router.replace(pathname)
  }

  return (
    <div className="flex items-center gap-2">
       <Select onValueChange={(value) => handleFilterChange('year', value)} value={currentYear || 'all'}>
          <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by Year" />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {academicYears.map(year => (
                  <SelectItem key={year} value={String(year)}>Year {year}</SelectItem>
              ))}
          </SelectContent>
       </Select>
       <Select onValueChange={(value) => handleFilterChange('category', value)} value={currentCategory || 'all'}>
          <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
          </SelectContent>
       </Select>
       <Select onValueChange={(value) => handleFilterChange('instructor', value)} value={currentInstructor || 'all'}>
          <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Instructor" />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="all">All Instructors</SelectItem>
              {instructors.map(instructor => (
                  <SelectItem key={instructor._id} value={instructor._id}>{instructor.name}</SelectItem>
              ))}
          </SelectContent>
       </Select>
       {(currentYear || currentInstructor || currentCategory) && (
        <Button variant="ghost" onClick={clearFilters}>Clear</Button>
       )}
    </div>
  )
}
