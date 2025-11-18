import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, section } = await request.json()

    // If ElevenLabs API key is available, use it
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY

    if (elevenLabsApiKey) {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey,
        },
        body: JSON.stringify({
          text: text.substring(0, 2500), // Limit text length
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      })

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer()
        return new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
          },
        })
      }
    }

    // Fallback: Return a simple response indicating browser speech synthesis should be used
    return NextResponse.json({
      message: 'Use browser speech synthesis',
      useBrowserSpeech: true
    })

  } catch (error) {
    console.error('Error with text-to-speech:', error)
    return NextResponse.json(
      { error: 'Text-to-speech service failed', useBrowserSpeech: true },
      { status: 500 }
    )
  }
}