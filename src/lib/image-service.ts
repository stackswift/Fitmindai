export async function generateImage(itemName: string, type: 'exercise' | 'meal'): Promise<string> {
  // Try different image generation services in order of preference
  const providers = [
    { name: 'openai', func: generateWithOpenAI },
    { name: 'replicate', func: generateWithReplicate },
    { name: 'fallback', func: generateFallbackImage }
  ]

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name} for image generation...`)
      const imageUrl = await provider.func(itemName, type)
      if (imageUrl) {
        return imageUrl
      }
    } catch (error) {
      console.error(`${provider.name} image generation failed:`, error)
      continue
    }
  }

  // Return a fallback placeholder
  return generateFallbackImage(itemName, type)
}

async function generateWithOpenAI(itemName: string, type: 'exercise' | 'meal'): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.log('OpenAI API key not found')
    return null
  }

  try {
    const prompt = createImagePrompt(itemName, type)

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data[0]?.url || null
  } catch (error) {
    console.error('OpenAI image generation failed:', error)
    return null
  }
}

async function generateWithReplicate(itemName: string, type: 'exercise' | 'meal'): Promise<string | null> {
  const apiKey = process.env.REPLICATE_API_TOKEN
  if (!apiKey) {
    console.log('Replicate API key not found')
    return null
  }

  try {
    const Replicate = require('replicate')
    const replicate = new Replicate({
      auth: apiKey,
    })

    const prompt = createImagePrompt(itemName, type)

    const output = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          prompt: prompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: "DPMSolverMultistep",
          num_inference_steps: 20,
          guidance_scale: 7.5,
        }
      }
    )

    return Array.isArray(output) ? output[0] : output
  } catch (error) {
    console.error('Replicate image generation failed:', error)
    return null
  }
}

function generateFallbackImage(itemName: string, type: 'exercise' | 'meal'): string {
  // Return a placeholder image URL from a free service
  const encodedName = encodeURIComponent(itemName)

  if (type === 'exercise') {
    return `https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=${encodedName}+Exercise`
  } else {
    return `https://via.placeholder.com/400x300/10B981/FFFFFF?text=${encodedName}+Recipe`
  }
}

function createImagePrompt(itemName: string, type: 'exercise' | 'meal'): string {
  if (type === 'exercise') {
    return `A high-quality, realistic image of a person performing ${itemName} exercise in a gym or fitness setting. Professional fitness photography style, good lighting, proper form demonstration, clean background. Focus on the exercise technique and movement.`
  } else {
    return `A high-quality, appetizing food photography image of ${itemName}. Professional food styling, good lighting, restaurant quality presentation, clean background. The dish should look delicious and well-prepared.`
  }
}