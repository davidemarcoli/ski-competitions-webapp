import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'http://localhost:8000/api/v1'

export const revalidate = 300 // Revalidate every 5 minutes for individual competitions

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const response = await fetch(`${API_BASE_URL}/competitions/${(await params).id}`, {
      next: {
        revalidate: 300 // Cache for 5 minutes
      }
    })
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
    return NextResponse.json(
      { error: 'Failed to fetch competition details' },
      { status: 500 }
    )
  }
}