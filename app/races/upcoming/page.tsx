'use client'

import { Competition, CompetitionDetail, ExtendedRun } from '@/app/models'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UpcomingRacesList() {
  const [sortedRuns, setSortedRuns] = useState<ExtendedRun[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      if (sortedRuns.length > 0) return

      try {
        setLoading(true)
        // First fetch competitions
        const response = await fetch('/api/competitions')
        const comps = (await response.json()) as Competition[]

        const currentDate = new Date()
        // currentDate.setDate(currentDate.getDate() + 2)
        // currentDate.setHours(0, 0, 0, 0)
        const currentDateMidnight = new Date()
        currentDateMidnight.setHours(0, 0, 0, 0)
        const currentDatePlusOneWeek = new Date()
        currentDatePlusOneWeek.setDate(currentDateMidnight.getDate() + 7)

        // Filter competitions first to minimize API calls
        const relevantComps = comps.filter((comp) => {
          const compDate = getCompDate(comp.date)
          const isPast = compDate < currentDateMidnight
          const isWithinOneWeek = compDate < currentDatePlusOneWeek
          return isWithinOneWeek && !isPast
        })

        // Fetch details for filtered competitions only
        const details = (await Promise.all(
          relevantComps.map((comp) =>
            fetch(`/api/competitions/${comp.event_id}`).then((r) => r.json()),
          ),
        )) as CompetitionDetail[]

        // Process the runs
        const runs = details
          .map((comp) => comp.races.map(race => ({ ...race, comp_id: comp.competition.event_id })))
          .flat(1)
          .map((race) =>
            race.runs.map((run) => ({
              ...run,
              race: race,
              date: race.date.split('T')[0] + 'T' + run.time,
              id: race.codex + run.number,
              is_today: isDateInSameDay(new Date(race.date), currentDate),
            })),
          )
          .flat(1)
          .filter((run) => new Date(run.date) > currentDate)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setSortedRuns(runs)
      } catch {
        setError('Failed to fetch competition data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sortedRuns.length]) // Empty dependency array means this only runs once on mount

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

  const isDateInSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <>
      <div className="left-0 top-0 m-4 hidden sm:block">
        <Button variant={'outline'} onClick={() => router.push('/')}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="mx-2 py-8 sm:container sm:mx-auto sm:py-4">
        <div className="flex gap-4 sm:hidden">
          <Button variant={'outline'} onClick={() => router.push('/')}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="mb-4 text-3xl font-bold">Upcoming Races</h1>
        </div>
        <div className="hidden sm:block">
          <h1 className="mb-4 text-3xl font-bold">Upcoming Races</h1>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Discipline</TableHead>
                <TableHead>Gender</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRuns.map((run) => (
                <TableRow
                  key={run.id}
                  className={run.is_today ? 'border-l-4 border-l-blue-500' : ''}
                  onClick={() => router.push(`/competition/${run.race.comp_id}`)}
                >
                  <TableCell>{new Date(run.date).toLocaleString()}</TableCell>
                  <TableCell>{run.race.discipline}</TableCell>
                  <TableCell>{run.race.gender}</TableCell>
                </TableRow>
              ))}
              {sortedRuns.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-4 text-center">
                    No upcoming runs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
