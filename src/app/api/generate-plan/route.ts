import { NextRequest, NextResponse } from 'next/server'
import { UserData, FitnessPlan } from '@/types'
import { generateFitnessPlan } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const userData: UserData = await request.json()

    // Validate required fields
    if (!userData.name || !userData.age || !userData.height || !userData.weight) {
      return NextResponse.json(
        { error: 'Missing required user data' },
        { status: 400 }
      )
    }

    // Generate the fitness plan using AI
    const plan: FitnessPlan = await generateFitnessPlan(userData)

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error generating fitness plan:', error)
    return NextResponse.json(
      { error: 'Failed to generate fitness plan. Please try again.' },
      { status: 500 }
    )
  }
}