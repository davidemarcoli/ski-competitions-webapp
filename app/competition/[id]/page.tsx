'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { CompetitionDetail } from '@/app/models'
import { useRouter } from 'next/navigation'

export default function CompetitionDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const response = await fetch(`/api/competitions/${resolvedParams.id}`)
        if (response.status === 404) {
          setCompetition(null)
          return
        }
        if (response.status !== 200) {
          throw new Error()
        }
        const data = await response.json()
        setCompetition(data)
      } catch {
        setError('Failed to fetch competition details')
      } finally {
        setLoading(false)
      }
    }

    fetchCompetition()
  }, [resolvedParams.id])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!competition) return <div className="p-4">Competition not found</div>

  return (
    <div className="container mx-auto py-8">
      <Button
        variant={'link'}
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft size={20} />
        Back
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {competition.competition.location}, {competition.competition.country}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p>{competition.competition.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p>{competition.competition.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Disciplines</p>
              <p>{competition.competition.discipline.join(', ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              {competition.competition.cancelled ? (
                <Badge variant="destructive">Cancelled</Badge>
              ) : (
                <Badge variant="secondary">Active</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {competition.races.filter((race) => !race.is_training).length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Races</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {competition.races
                .filter((race) => !race.is_training)
                .map((race) => (
                  <div key={race.race_id} className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 font-semibold">
                        {race.discipline} - {race.gender}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(race.date).toLocaleDateString()}
                      </p>
                      <div className="mt-2 space-y-2">
                        {race.runs.map((run) => (
                          <div key={run.number} className="text-sm">
                            Run {run.number}: {run.time} - {run.status}
                          </div>
                        ))}
                        {race.has_live_timing && (
                          <a
                            href={race.live_timing_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                          >
                            View Live Timing
                          </a>
                        )}
                      </div>
                    </div>

                    {race.results && race.results.length > 0 && (
                      <>
                        {/* Podium View */}
                        <div className="relative h-64 rounded-lg bg-gradient-to-b from-blue-50 to-white p-4 dark:from-blue-950 dark:to-gray-900">
                          <div
                            className="absolute bottom-0 left-1/2 mb-2 flex w-full max-w-3xl -translate-x-1/2 transform justify-center"
                            style={{ alignItems: 'last baseline' }}
                          >
                            {/* Silver - 2nd Place */}
                            <div className="mx-4 flex flex-col items-center text-center">
                              <div className="relative flex h-32 w-24 items-end justify-center rounded-t-lg bg-gray-200 dark:bg-gray-700">
                                <Image
                                  src={`https://data.fis-ski.com/general/load-competitor-picture/${race.results[1].athlete_id}.html`}
                                  alt={race.results[1].name}
                                  className="mb-2 h-20 w-20 rounded-full object-cover"
                                  width={80}
                                  height={80}
                                />
                                <span
                                  className={`flag-${race.results[1].nation.toUpperCase()} absolute bottom-3 right-1 h-[21px] w-[28px] rounded shadow`}
                                />
                              </div>
                              <div className="mt-2">
                                <div className="text-sm font-semibold dark:text-gray-100">
                                  {race.results[1].name}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {race.results[1].nation}
                                </div>
                                <div className="text-xs font-medium dark:text-gray-300">
                                  {race.results[1].diff}
                                </div>
                              </div>
                            </div>

                            {/* Gold - 1st Place */}
                            <div className="mx-4 -mb-4 flex flex-col items-center text-center">
                              <div className="relative flex h-40 w-24 items-end justify-center rounded-t-lg bg-yellow-200 dark:bg-yellow-700">
                                <Image
                                  src={`https://data.fis-ski.com/general/load-competitor-picture/${race.results[0].athlete_id}.html`}
                                  alt={race.results[0].name}
                                  className="mb-2 h-20 w-20 rounded-full object-cover"
                                  width={80}
                                  height={80}
                                />
                                <span
                                  className={`flag-${race.results[0].nation.toUpperCase()} absolute bottom-3 right-1 h-[21px] w-[28px] rounded shadow`}
                                />
                              </div>
                              <div className="mt-2">
                                <div className="text-sm font-semibold dark:text-gray-100">
                                  {race.results[0].name}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {race.results[0].nation}
                                </div>
                                <div className="text-xs font-medium dark:text-gray-300">
                                  {race.results[0].diff}
                                </div>
                              </div>
                            </div>

                            {/* Bronze - 3rd Place */}
                            <div className="mx-4 -mb-8 flex flex-col items-center text-center">
                              <div className="relative flex h-24 w-24 items-end justify-center rounded-t-lg bg-orange-200 dark:bg-orange-800">
                                <Image
                                  src={`https://data.fis-ski.com/general/load-competitor-picture/${race.results[2].athlete_id}.html`}
                                  alt={race.results[2].name}
                                  className="mb-2 h-20 w-20 rounded-full object-cover"
                                  width={80}
                                  height={80}
                                />
                                <span
                                  className={`flag-${race.results[2].nation.toUpperCase()} absolute bottom-3 right-1 h-[21px] w-[28px] rounded shadow`}
                                />
                              </div>
                              <div className="mt-2">
                                <div className="text-sm font-semibold dark:text-gray-100">
                                  {race.results[2].name}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {race.results[2].nation}
                                </div>
                                <div className="text-xs font-medium dark:text-gray-300">
                                  {race.results[2].diff}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Full Results Table */}
                        <Collapsible>
                          <div className="flex items-center justify-between py-2">
                            <h4 className="text-sm font-semibold">Full Results</h4>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Athlete</TableHead>
                                    <TableHead>Nation</TableHead>
                                    {race.discipline === 'SL' || race.discipline === 'GS' ? (
                                      <>
                                        <TableHead>Run 1</TableHead>
                                        <TableHead>Run 2</TableHead>
                                        <TableHead>Total</TableHead>
                                      </>
                                    ) : (
                                      <TableHead>Time</TableHead>
                                    )}
                                    <TableHead>Diff</TableHead>
                                    <TableHead>Points</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {race.results.map((result) => (
                                    <TableRow key={result.athlete_id}>
                                      <TableCell>{result.rank}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          <Image
                                            src={`https://data.fis-ski.com/general/load-competitor-picture/${result.athlete_id}.html`}
                                            alt={result.name}
                                            className="h-8 w-8 rounded-full object-cover"
                                            width={32}
                                            height={32}
                                          />
                                          <span className="dark:text-gray-100">{result.name}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`h-[18px] w-[24px] flag-${result.nation.toUpperCase()}`}
                                          ></span>
                                          {result.nation}
                                        </div>
                                      </TableCell>
                                      {race.discipline === 'SL' ||
                                        (race.discipline === 'GS' && (
                                          <>
                                            <TableCell className="dark:text-gray-300">
                                              {result.run1}
                                            </TableCell>
                                            <TableCell className="dark:text-gray-300">
                                              {result.run2}
                                            </TableCell>
                                          </>
                                        ))}
                                      <TableCell className="font-medium dark:text-gray-100">
                                        {result.total}
                                      </TableCell>
                                      <TableCell className="text-gray-600 dark:text-gray-400">
                                        {result.diff}
                                      </TableCell>
                                      <TableCell className="dark:text-gray-300">
                                        {result.cup_points}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </>
                    )}
                  </div>
                ))}
            </div>
            {competition.races.filter((race) => race.is_training).length > 0 && (
              <Collapsible className="mb-4">
                <div className="flex items-center justify-between py-2">
                  <h4 className="text-sm font-semibold">Trainings</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="space-y-4">
                    {competition.races
                      .filter((race) => race.is_training)
                      .map((race) => (
                        <div key={race.race_id} className="space-y-6">
                          <div className="rounded-lg border p-4">
                            <h3 className="mb-2 font-semibold">
                              {race.discipline} - {race.gender}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Date: {new Date(race.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
        </Card>
      )}

      {competition.broadcasters.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <Collapsible>
              <div className="flex items-center justify-between">
                <CardTitle>Broadcasters</CardTitle>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {competition.broadcasters.map((broadcaster) => (
                      <div key={broadcaster.name} className="rounded-lg border p-4">
                        <h3 className="font-semibold">{broadcaster.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {broadcaster.countries.join(', ')}
                        </p>
                        <a
                          href={broadcaster.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Visit website
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </CardHeader>
        </Card>
      )}

      {Object.keys(competition.documents).length > 0 && (
        <Card>
          <CardHeader>
            <Collapsible>
              <div className="flex items-center justify-between">
                <CardTitle>Documents</CardTitle>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {Object.entries(competition.documents).map(([name, url]) => (
                      <div key={name}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {name}
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
