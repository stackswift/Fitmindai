import { UserData, FitnessPlan } from '@/types'

// AI Service using multiple providers (OpenAI, Gemini, etc.)
export async function generateFitnessPlan(userData: UserData): Promise<FitnessPlan> {
  const prompt = createPrompt(userData)

  // Try different AI providers in order of preference
  const providers = [
    { name: 'openai', func: generateWithOpenAI },
    { name: 'gemini', func: generateWithGemini },
    { name: 'fallback', func: generateFallbackPlan }
  ]

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name} for plan generation...`)
      const plan = await provider.func(prompt, userData)
      if (plan) {
        return plan
      }
    } catch (error) {
      console.error(`${provider.name} failed:`, error)
      continue
    }
  }

  // If all providers fail, return a fallback plan
  return generateFallbackPlan(prompt, userData)
}

function createPrompt(userData: UserData): string {
  return `
    Create a comprehensive fitness plan for the following person:

    Personal Info:
    - Name: ${userData.name}
    - Age: ${userData.age}
    - Gender: ${userData.gender}
    - Height: ${userData.height}cm
    - Weight: ${userData.weight}kg

    Goals & Preferences:
    - Fitness Goal: ${userData.fitnessGoal}
    - Current Level: ${userData.fitnessLevel}
    - Workout Location: ${userData.workoutLocation}
    - Dietary Preference: ${userData.dietaryPreference}
    - Available Time: ${userData.availableTime || 60} minutes per day
    - Preferred Workout Time: ${userData.preferredWorkoutTime || 'evening'}
    - Sleep Hours: ${userData.sleepHours || 7 - 8} hours
    - Stress Level: ${userData.stressLevel || 'medium'}
    ${userData.medicalHistory ? `- Medical History: ${userData.medicalHistory}` : ''}

    Please provide a detailed response in JSON format with:
    1. A 7-day workout plan with specific exercises, sets, reps, and instructions
    2. A 7-day diet plan with breakfast, lunch, dinner, and snacks
    3. Lifestyle tips, motivation, posture advice, and recovery guidance
    4. Progress tracking recommendations

    Make sure all content is personalized, practical, and safe for the user's level and goals.
  `
}

async function generateWithOpenAI(prompt: string, userData: UserData): Promise<FitnessPlan | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.log('OpenAI API key not found')
    return null
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness coach and nutritionist. Generate comprehensive, personalized fitness and diet plans in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    // Try to parse the JSON response
    const planData = JSON.parse(content)
    return formatPlanData(planData, userData)
  } catch (error) {
    console.error('OpenAI generation failed:', error)
    return null
  }
}

async function generateWithGemini(prompt: string, userData: UserData): Promise<FitnessPlan | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.log('Gemini API key not found')
    return null
  }

  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const result = await model.generateContent(prompt + '\n\nPlease respond with valid JSON only.')
    const response = await result.response
    const text = response.text()

    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response')
    }

    const planData = JSON.parse(jsonMatch[0])
    return formatPlanData(planData, userData)
  } catch (error) {
    console.error('Gemini generation failed:', error)
    return null
  }
}

function generateFallbackPlan(prompt: string, userData: UserData): FitnessPlan {
  // Generate a basic but comprehensive fallback plan
  const planId = `plan_${Date.now()}`

  return {
    id: planId,
    userId: userData.name.toLowerCase().replace(/\s+/g, '_'),
    createdAt: new Date().toISOString(),
    workoutPlan: {
      title: `${userData.name}'s ${userData.fitnessGoal} Plan`,
      description: `A personalized ${userData.fitnessLevel} level workout plan focused on ${userData.fitnessGoal} for ${userData.workoutLocation} workouts.`,
      duration: '4-6 weeks',
      frequency: '5-6 days per week',
      days: generateWorkoutDays(userData)
    },
    dietPlan: {
      title: `${userData.name}'s Nutrition Plan`,
      description: `A balanced ${userData.dietaryPreference} diet plan designed to support your ${userData.fitnessGoal} goals.`,
      days: generateDietDays(userData),
      guidelines: generateDietGuidelines(userData)
    },
    tips: {
      lifestyle: generateLifestyleTips(userData),
      motivation: generateMotivationTips(),
      posture: generatePostureTips(),
      recovery: generateRecoveryTips()
    },
    progress: {
      weeklyGoals: generateWeeklyGoals(userData),
      measurements: ['Weight', 'Body Fat %', 'Muscle Mass', 'Energy Level', 'Sleep Quality'],
      checkpoints: ['Week 2: Form Assessment', 'Week 4: Progress Review', 'Week 6: Plan Adjustment']
    }
  }
}

function formatPlanData(planData: any, userData: UserData): FitnessPlan {
  // Ensure the plan data has all required fields and proper structure
  return {
    id: `plan_${Date.now()}`,
    userId: userData.name.toLowerCase().replace(/\s+/g, '_'),
    createdAt: new Date().toISOString(),
    workoutPlan: planData.workoutPlan || generateWorkoutDays(userData),
    dietPlan: planData.dietPlan || generateDietDays(userData),
    tips: planData.tips || {
      lifestyle: generateLifestyleTips(userData),
      motivation: generateMotivationTips(),
      posture: generatePostureTips(),
      recovery: generateRecoveryTips()
    },
    progress: planData.progress || {
      weeklyGoals: generateWeeklyGoals(userData),
      measurements: ['Weight', 'Body Fat %', 'Muscle Mass', 'Energy Level'],
      checkpoints: ['Week 2: Assessment', 'Week 4: Review', 'Week 6: Adjustment']
    }
  }
}

function generateWorkoutDays(userData: UserData) {
  const baseExercises = {
    home: [
      { name: 'Push-ups', sets: 3, reps: '10-15', restTime: '60s', instructions: 'Keep your body straight and lower until chest nearly touches ground.', muscleGroups: ['Chest', 'Triceps', 'Shoulders'], difficulty: 'beginner' as const, equipment: ['None'] },
      { name: 'Squats', sets: 3, reps: '15-20', restTime: '60s', instructions: 'Keep your back straight and lower until thighs are parallel to ground.', muscleGroups: ['Quads', 'Glutes'], difficulty: 'beginner' as const, equipment: ['None'] },
      { name: 'Plank', sets: 3, reps: '30-60s', restTime: '60s', instructions: 'Hold a straight line from head to heels.', muscleGroups: ['Core'], difficulty: 'beginner' as const, equipment: ['None'] }
    ],
    gym: [
      { name: 'Barbell Squat', sets: 4, reps: '8-12', restTime: '90s', instructions: 'Keep chest up and descend until thighs are parallel.', muscleGroups: ['Quads', 'Glutes'], difficulty: 'intermediate' as const, equipment: ['Barbell', 'Squat Rack'] },
      { name: 'Bench Press', sets: 4, reps: '8-12', restTime: '90s', instructions: 'Lower bar to chest and press up explosively.', muscleGroups: ['Chest', 'Triceps', 'Shoulders'], difficulty: 'intermediate' as const, equipment: ['Barbell', 'Bench'] },
      { name: 'Deadlift', sets: 3, reps: '6-10', restTime: '120s', instructions: 'Keep back straight and lift with legs and hips.', muscleGroups: ['Back', 'Glutes', 'Hamstrings'], difficulty: 'intermediate' as const, equipment: ['Barbell'] }
    ],
    outdoor: [
      { name: 'Running', sets: 1, reps: '20-30min', restTime: 'N/A', instructions: 'Maintain steady pace and good form.', muscleGroups: ['Cardio', 'Legs'], difficulty: 'beginner' as const, equipment: ['None'] },
      { name: 'Burpees', sets: 3, reps: '8-15', restTime: '90s', instructions: 'Full body movement from standing to plank to jump.', muscleGroups: ['Full Body'], difficulty: 'intermediate' as const, equipment: ['None'] },
      { name: 'Mountain Climbers', sets: 3, reps: '20-30', restTime: '60s', instructions: 'Alternate bringing knees to chest in plank position.', muscleGroups: ['Core', 'Cardio'], difficulty: 'beginner' as const, equipment: ['None'] }
    ]
  }

  const exercises = baseExercises[userData.workoutLocation as keyof typeof baseExercises] || baseExercises.home

  return [
    {
      day: 'Monday',
      focus: 'Upper Body',
      exercises: exercises.slice(0, 3),
      totalTime: '45-60 minutes',
      warmup: ['5 min light cardio', 'Arm circles', 'Shoulder rolls'],
      cooldown: ['10 min stretching', 'Deep breathing']
    },
    {
      day: 'Tuesday',
      focus: 'Lower Body',
      exercises: exercises.slice(1, 4),
      totalTime: '45-60 minutes',
      warmup: ['5 min light cardio', 'Leg swings', 'Hip circles'],
      cooldown: ['10 min stretching', 'Foam rolling']
    },
    {
      day: 'Wednesday',
      focus: 'Cardio & Core',
      exercises: exercises.slice(0, 2),
      totalTime: '30-45 minutes',
      warmup: ['5 min dynamic stretching'],
      cooldown: ['10 min cool down walk', 'Core stretches']
    },
    {
      day: 'Thursday',
      focus: 'Upper Body',
      exercises: exercises.slice(0, 3),
      totalTime: '45-60 minutes',
      warmup: ['5 min light cardio', 'Arm circles'],
      cooldown: ['10 min stretching']
    },
    {
      day: 'Friday',
      focus: 'Full Body',
      exercises: exercises,
      totalTime: '50-70 minutes',
      warmup: ['10 min dynamic warm-up'],
      cooldown: ['15 min full body stretch']
    },
    {
      day: 'Saturday',
      focus: 'Active Recovery',
      exercises: [
        { name: 'Light Walking', sets: 1, reps: '20-30min', restTime: 'N/A', instructions: 'Gentle pace for recovery.', muscleGroups: ['Cardio'], difficulty: 'beginner' as const, equipment: ['None'] }
      ],
      totalTime: '20-30 minutes',
      warmup: ['Light stretching'],
      cooldown: ['Relaxation exercises']
    },
    {
      day: 'Sunday',
      focus: 'Rest Day',
      exercises: [],
      totalTime: 'Rest',
      warmup: [],
      cooldown: []
    }
  ]
}

function generateDietDays(userData: UserData) {
  const sampleMeals = {
    vegetarian: {
      breakfast: { name: 'Oatmeal with Fruits', ingredients: ['Oats', 'Banana', 'Berries', 'Nuts'], preparation: 'Cook oats with milk, top with fruits and nuts', calories: 350, protein: 12, carbs: 55, fats: 8, cookingTime: '10 minutes' },
      lunch: { name: 'Quinoa Buddha Bowl', ingredients: ['Quinoa', 'Chickpeas', 'Vegetables', 'Tahini'], preparation: 'Mix cooked quinoa with roasted vegetables and chickpeas', calories: 450, protein: 18, carbs: 65, fats: 12, cookingTime: '25 minutes' },
      dinner: { name: 'Lentil Curry with Rice', ingredients: ['Lentils', 'Rice', 'Spices', 'Vegetables'], preparation: 'Cook lentils with spices, serve with brown rice', calories: 400, protein: 16, carbs: 70, fats: 6, cookingTime: '30 minutes' }
    },
    'non-vegetarian': {
      breakfast: { name: 'Scrambled Eggs with Toast', ingredients: ['Eggs', 'Whole grain bread', 'Butter', 'Herbs'], preparation: 'Scramble eggs with herbs, serve with toast', calories: 380, protein: 20, carbs: 30, fats: 18, cookingTime: '8 minutes' },
      lunch: { name: 'Grilled Chicken Salad', ingredients: ['Chicken breast', 'Mixed greens', 'Olive oil', 'Vegetables'], preparation: 'Grill chicken, serve over mixed green salad', calories: 420, protein: 35, carbs: 15, fats: 22, cookingTime: '20 minutes' },
      dinner: { name: 'Baked Salmon with Vegetables', ingredients: ['Salmon fillet', 'Broccoli', 'Sweet potato', 'Olive oil'], preparation: 'Bake salmon with seasoned vegetables', calories: 480, protein: 32, carbs: 35, fats: 24, cookingTime: '25 minutes' }
    }
  }

  const meals = sampleMeals[userData.dietaryPreference as keyof typeof sampleMeals] || sampleMeals['non-vegetarian']
  const snacks = [
    { name: 'Greek Yogurt', ingredients: ['Greek yogurt', 'Honey'], preparation: 'Mix yogurt with honey', calories: 120, protein: 15, carbs: 12, fats: 2, cookingTime: '2 minutes' },
    { name: 'Mixed Nuts', ingredients: ['Almonds', 'Walnuts'], preparation: 'Ready to eat', calories: 160, protein: 6, carbs: 6, fats: 14, cookingTime: '0 minutes' }
  ]

  return Array.from({ length: 7 }, (_, i) => ({
    day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
    breakfast: meals.breakfast,
    lunch: meals.lunch,
    dinner: meals.dinner,
    snacks: snacks,
    totalCalories: meals.breakfast.calories + meals.lunch.calories + meals.dinner.calories + snacks.reduce((sum, snack) => sum + snack.calories, 0),
    waterIntake: '2-3 liters'
  }))
}

function generateDietGuidelines(userData: UserData): string[] {
  return [
    'Eat every 3-4 hours to maintain steady energy levels',
    'Include protein with every meal for muscle recovery',
    'Stay hydrated with 8-10 glasses of water daily',
    'Choose whole grains over refined carbohydrates',
    'Include a variety of colorful fruits and vegetables',
    'Limit processed foods and added sugars',
    'Practice portion control using the plate method',
    'Time your largest meals around your workouts'
  ]
}

function generateLifestyleTips(userData: UserData): string[] {
  return [
    'Prioritize 7-9 hours of quality sleep each night',
    'Take the stairs instead of elevators when possible',
    'Park farther away to get extra steps',
    'Set reminders to move every hour during work',
    'Practice stress management techniques like meditation',
    'Stay consistent with your routine even on weekends',
    'Track your progress with photos and measurements',
    'Find a workout buddy for accountability'
  ]
}

function generateMotivationTips(): string[] {
  return [
    'Focus on how exercise makes you feel, not just how you look',
    'Celebrate small victories and progress milestones',
    'Remember that consistency beats perfection',
    'Your only competition is who you were yesterday',
    'Every workout is an investment in your future self',
    'Progress takes time - trust the process',
    'You are stronger than your excuses',
    'Make your health a priority, not an option'
  ]
}

function generatePostureTips(): string[] {
  return [
    'Maintain neutral spine alignment during all exercises',
    'Engage your core before lifting any weight',
    'Keep shoulders back and down, avoid hunching',
    'Breathe properly - exhale on exertion, inhale on release',
    'Start with lighter weights to perfect your form',
    'Use mirrors to check your posture during workouts',
    'Take breaks between sets to reset your position',
    'Consider working with a trainer initially'
  ]
}

function generateRecoveryTips(): string[] {
  return [
    'Schedule at least one full rest day per week',
    'Include active recovery activities like walking or yoga',
    'Get adequate protein within 30 minutes post-workout',
    'Use foam rolling or massage for muscle recovery',
    'Listen to your body and adjust intensity as needed',
    'Manage stress levels as they impact recovery',
    'Stay hydrated throughout the day',
    'Consider taking rest days when feeling overly fatigued'
  ]
}

function generateWeeklyGoals(userData: UserData): string[] {
  const goalMap = {
    'weight-loss': [
      'Complete all scheduled workouts',
      'Maintain caloric deficit through diet',
      'Increase daily step count by 500 steps'
    ],
    'muscle-gain': [
      'Progressive overload in strength training',
      'Meet daily protein intake targets',
      'Ensure adequate rest between workouts'
    ],
    'maintenance': [
      'Maintain current workout frequency',
      'Keep consistent eating schedule',
      'Focus on form and technique improvement'
    ],
    'endurance': [
      'Increase workout duration by 5 minutes',
      'Improve cardiovascular efficiency',
      'Maintain steady pace during cardio sessions'
    ],
    'strength': [
      'Increase weights by 2.5-5% when possible',
      'Perfect lifting technique and form',
      'Complete all prescribed sets and reps'
    ]
  }

  return goalMap[userData.fitnessGoal] || goalMap['maintenance']
}