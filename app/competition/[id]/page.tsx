// app/competition/[id]/page.tsx
'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'

interface Result {
  athlete_id: string
  rank: number
  name: string
  nation: string
  run1: string
  run2: string
  total: string
  diff: string
  fis_points: number
  cup_points: number
}

interface Race {
  race_id: string
  codex: string
  date: string
  discipline: string
  gender: string
  has_live_timing: boolean
  live_timing_url: string
  results?: Result[]
  runs: {
    number: number
    time: string
    status: string
    info: string
  }[]
}

interface Broadcaster {
  name: string
  countries: string[]
  url: string
  logo_url: string
}

interface CompetitionDetail {
  competition: {
    event_id: string
    date: string
    location: string
    country: string
    discipline: string[]
    category: string
    gender: string
    cancelled: boolean
  }
  races: Race[]
  broadcasters: Broadcaster[]
  documents: Record<string, string>
}

export default function CompetitionDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const response = await fetch(`/api/competitions/${resolvedParams.id}`)
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
      <Link href="/" className="flex items-center gap-2 text-blue-600 hover:underline mb-6">
        <ArrowLeft size={20} />
        Back to Competitions
      </Link>

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
                <Badge variant="success">Active</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {competition.races.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Races</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {competition.races.map((race) => (
                <div key={race.race_id} className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">
                      {race.discipline} - {race.gender}
                    </h3>
                    <p className="text-sm text-gray-500">Date: {new Date(race.date).toLocaleDateString()}</p>
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
                          className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                        >
                          View Live Timing
                        </a>
                      )}
                    </div>
                  </div>

                  {race.results && race.results.length > 0 && (
                    <>
                      {/* Podium View */}
                      <div className="relative h-64 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 rounded-lg p-4">
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center w-full max-w-3xl mb-2" style={{alignItems: "last baseline"}}>
                          {/* Silver - 2nd Place */}
                          <div className="flex flex-col items-center mx-4 text-center">
                            <div className="h-32 w-24 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-end justify-center">
                              <Image 
                                src={`https://data.fis-ski.com/general/load-competitor-picture/${race.results[1].athlete_id}.html`}
                                alt={race.results[1].name}
                                className="w-20 h-20 object-cover rounded-full mb-2"
                              />
                            </div>
                            <div className="mt-2">
                              <div className="font-semibold text-sm dark:text-gray-100">{race.results[1].name}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">{race.results[1].nation}</div>
                              <div className="text-xs font-medium dark:text-gray-300">{race.results[1].total}</div>
                            </div>
                          </div>

                          {/* Gold - 1st Place */}
                          <div className="flex flex-col items-center mx-4 text-center -mb-4">
                            <div className="h-40 w-24 bg-yellow-200 dark:bg-yellow-700 rounded-t-lg flex items-end justify-center">
                              <Image 
                                src={`https://data.fis-ski.com/general/load-competitor-picture/${race.results[0].athlete_id}.html`}
                                alt={race.results[0].name}
                                className="w-20 h-20 object-cover rounded-full mb-2"
                              />
                            </div>
                            <div className="mt-2">
                              <div className="font-semibold text-sm dark:text-gray-100">{race.results[0].name}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">{race.results[0].nation}</div>
                              <div className="text-xs font-medium dark:text-gray-300">{race.results[0].total}</div>
                            </div>
                          </div>

                          {/* Bronze - 3rd Place */}
                          <div className="flex flex-col items-center mx-4 text-center -mb-8">
                            <div className="h-24 w-24 bg-orange-200 dark:bg-orange-800 rounded-t-lg flex items-end justify-center">
                              <Image 
                                src={`https://data.fis-ski.com/general/load-competitor-picture/${race.results[2].athlete_id}.html`}
                                alt={race.results[2].name}
                                className="w-20 h-20 object-cover rounded-full mb-2"
                              />
                            </div>
                            <div className="mt-2">
                              <div className="font-semibold text-sm dark:text-gray-100">{race.results[2].name}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">{race.results[2].nation}</div>
                              <div className="text-xs font-medium dark:text-gray-300">{race.results[2].total}</div>
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
                                  <TableHead>Run 1</TableHead>
                                  <TableHead>Run 2</TableHead>
                                  <TableHead>Total</TableHead>
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
                                          className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <span className="dark:text-gray-100">{result.name}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="dark:text-gray-300">{result.nation}</TableCell>
                                    <TableCell className="dark:text-gray-300">{result.run1}</TableCell>
                                    <TableCell className="dark:text-gray-300">{result.run2}</TableCell>
                                    <TableCell className="font-medium dark:text-gray-100">{result.total}</TableCell>
                                    <TableCell className="text-gray-600 dark:text-gray-400">{result.diff}</TableCell>
                                    <TableCell className="dark:text-gray-300">{result.cup_points}</TableCell>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {competition.broadcasters.map((broadcaster) => (
                      <div key={broadcaster.name} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{broadcaster.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {broadcaster.countries.join(', ')}
                        </p>
                        <a
                          href={broadcaster.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm dark:text-blue-400"
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