export interface Competition {
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

export interface Result {
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

export interface Run {
  number: number
  time: string
  status: string
  info: string
}

export interface ExtendedRun extends Run {
  date: string
  id: string
  race: ExtendedRace
  is_today: boolean
}

export interface Race {
  race_id: string
  codex: string
  date: string
  discipline: string
  is_training: boolean
  gender: string
  has_live_timing: boolean
  live_timing_url: string
  results?: Result[]
  runs: Run[]
}

export interface ExtendedRace extends Race {
  comp_id: string
}

export interface Broadcaster {
  name: string
  countries: string[]
  url: string
  logo_url: string
}

export interface CompetitionDetail {
  competition: Competition
  races: Race[]
  broadcasters: Broadcaster[]
  documents: Record<string, string>
}
