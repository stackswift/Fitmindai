import { NextRequest, NextResponse } from 'next/server'
import { generateImage } from '@/lib/image-service'

export async function POST(request: NextRequest) {
  try {
    const { itemName, type } = await request.json()

    if (!itemName || !type) {
      return NextResponse.json(
        { error: 'Missing itemName or type' },
        { status: 400 }
      )
    }

    const imageUrl = await generateImage(itemName, type)

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}