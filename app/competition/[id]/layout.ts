import type { Metadata } from 'next'

async function getCompetition(id: string) {
  try {
    const res = await fetch(`/api/competitions/${id}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const competition = await getCompetition((await params).id)

  if (!competition) {
    return {
      title: 'Competition Not Found',
    }
  }

  const { location, country, date, discipline, category, gender } = competition.competition

  return {
    title: `${location} ${discipline.join('/')} - ${gender}`,
    description: `Follow live results from the ${category} ${discipline.join('/')} competition in ${location}, ${country} on ${date}.`,
    openGraph: {
      title: `${location} ${discipline.join('/')} - ${gender}`,
      description: `Follow live results from the ${category} ${discipline.join('/')} competition in ${location}, ${country} on ${date}.`,
    },
    twitter: {
      title: `${location} ${discipline.join('/')} - ${gender}`,
      description: `Follow live results from the ${category} ${discipline.join('/')} competition in ${location}, ${country} on ${date}.`,
    },
  }
}

export default function CompetitionLayout({ children }: { children: React.ReactNode }) {
  return children
}
