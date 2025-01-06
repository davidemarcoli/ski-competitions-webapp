import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL || 'https://ski-data-api.homelab.davidemarcoli.dev/api/v1'

export const revalidate = 60 // Revalidate every minute for individual competitions

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const response = await fetch(`${API_BASE_URL}/competitions/${(await params).id}`, {
      next: {
        revalidate: 60, // Cache for 1 minute
      },
    })

    if (response.status === 404) {
      return NextResponse.json('Competition not found', { status: 404 })
    }

    if (!response.ok) {
      console.error(await response.text())
      return NextResponse.json('Failed to fetch competition details', { status: 500 })
    }

    const data = await response.json()

    // Check if the competition is currently live
    const isLive = data.competition?.status?.is_live || false

    // Set different cache durations based on whether the competition is live
    const cacheDuration = isLive ? 60 : 300 // 1 minute for live events, 5 minutes for others

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${cacheDuration}, stale-while-revalidate=${cacheDuration * 2}`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch competition details' }, { status: 500 })
  }
}
