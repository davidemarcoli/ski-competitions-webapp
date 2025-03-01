import { NextResponse } from 'next/server'

const API_BASE_URL =
  process.env.API_BASE_URL || 'https://ski-data-api.homelab.davidemarcoli.dev/api/v1'

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/competitions`, {
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    })
    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=21600', // Cache for 1 hour, with a 6 hours stale-while-revalidate
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch competitions' }, { status: 500 })
  }
}
