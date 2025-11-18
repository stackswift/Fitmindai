import { NextRequest, NextResponse } from 'next/server'
import { FitnessPlan, UserData } from '@/types'
import { generatePDF } from '@/lib/pdf-service'

export async function POST(request: NextRequest) {
  try {
    const { plan, userData }: { plan: FitnessPlan; userData: UserData } = await request.json()

    if (!plan || !userData) {
      return NextResponse.json(
        { error: 'Missing plan or user data' },
        { status: 400 }
      )
    }

    const pdfBuffer = await generatePDF(plan, userData)

    return new NextResponse(pdfBuffer as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${userData.name}_fitness_plan.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}