// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ModeToggle } from '@/components/mode-toggle'

interface Competition {
  event_id: string
  date: string
  location: string
  country: string
  discipline: string[]
  category: string
  gender: string
  cancelled: boolean
  is_live: boolean
}

export default function CompetitionsTable() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [showPastEvents, setShowPastEvents] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('/api/competitions')
        const data = await response.json()
        setCompetitions(data)
      } catch {
        setError('Failed to fetch competitions')
      } finally {
        setLoading(false)
      }
    }

    fetchCompetitions()
  }, [])

  const sortAndFilterCompetitions = (comps: Competition[]) => {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    // Parse the competition date and get the end date if it's a range
    const getCompDate = (dateStr: string) => {
      const dates = dateStr.split('-')
      return new Date(
        dates[dates.length - 1]
          .trim()
          .replace('Oct', 'October')
          .replace('Nov', 'November')
          .replace('Dec', 'December')
          .replace('Jan', 'January')
          .replace('Feb', 'February')
          .replace('Mar', 'March'),
      )
    }

    // Filter and sort competitions
    return comps
      .filter((comp) => {
        const compDate = getCompDate(comp.date)
        const isPast = compDate < currentDate
        return showPastEvents ? true : !isPast
      })
      .sort((a, b) => {
        const dateA = getCompDate(a.date)
        const dateB = getCompDate(b.date)

        if (!showPastEvents) {
          // First sort by live status
          if (a.is_live && !b.is_live) return -1
          if (!a.is_live && b.is_live) return 1
        }

        // Then sort by date
        return dateA.getTime() - dateB.getTime()
      })
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  const sortedCompetitions = sortAndFilterCompetitions(competitions)

  return (
    <div className="mx-2 py-8 sm:container sm:mx-auto">
      {/* Desktop Layout */}
      <div className="mb-6 hidden items-center justify-between sm:flex">
        <h1 className="text-3xl font-bold">Ski Competitions</h1>
        <div className="flex items-center space-x-2">
          <div className="mr-4">
            <ModeToggle />
          </div>
          <Switch id="show-past" checked={showPastEvents} onCheckedChange={setShowPastEvents} />
          <Label htmlFor="show-past">Show Past Events</Label>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="mb-6 block items-center justify-between sm:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Ski Competitions</h1>
          <div className="flex items-center space-x-2">
            <div className="mr-4">
              <ModeToggle />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <Switch id="show-past" checked={showPastEvents} onCheckedChange={setShowPastEvents} />
          <Label htmlFor="show-past">Show Past Events</Label>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Discipline</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Gender</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCompetitions.map((competition) => (
              <TableRow key={competition.event_id}>
                <TableCell>
                  {competition.is_live ? (
                    <Badge className="bg-green-500">Live</Badge>
                  ) : competition.cancelled ? (
                    <Badge variant="destructive">Cancelled</Badge>
                  ) : (
                    <Badge variant="secondary">Scheduled</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/competition/${competition.event_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {competition.date}
                  </Link>
                </TableCell>
                <TableCell>{competition.location}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-[18px] w-[24px] flag-${competition.country.toUpperCase()}`}
                    ></span>
                    {competition.country}
                  </div>
                </TableCell>
                <TableCell>{competition.discipline.join(', ')}</TableCell>
                <TableCell>{competition.category}</TableCell>
                <TableCell>{competition.gender}</TableCell>
              </TableRow>
            ))}
            {sortedCompetitions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-4 text-center">
                  No {showPastEvents ? '' : 'upcoming'} events found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
