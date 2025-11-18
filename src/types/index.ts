export interface UserData {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number // in cm
  weight: number // in kg
  fitnessGoal: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'endurance' | 'strength'
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  workoutLocation: 'home' | 'gym' | 'outdoor'
  dietaryPreference: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'keto' | 'paleo'
  medicalHistory?: string
  stressLevel?: 'low' | 'medium' | 'high'
  sleepHours?: number
  availableTime?: number // in minutes per day
  preferredWorkoutTime?: 'morning' | 'afternoon' | 'evening'
}

export interface Exercise {
  name: string
  sets: number
  reps: string
  restTime: string
  instructions: string
  muscleGroups: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  equipment: string[]
}

export interface WorkoutDay {
  day: string
  focus: string
  exercises: Exercise[]
  totalTime: string
  warmup: string[]
  cooldown: string[]
}

export interface Meal {
  name: string
  ingredients: string[]
  preparation: string
  calories: number
  protein: number
  carbs: number
  fats: number
  cookingTime: string
}

export interface DietDay {
  day: string
  breakfast: Meal
  lunch: Meal
  dinner: Meal
  snacks: Meal[]
  totalCalories: number
  waterIntake: string
}

export interface FitnessPlan {
  id: string
  userId: string
  createdAt: string
  workoutPlan: {
    title: string
    description: string
    duration: string
    frequency: string
    days: WorkoutDay[]
  }
  dietPlan: {
    title: string
    description: string
    days: DietDay[]
    guidelines: string[]
  }
  tips: {
    lifestyle: string[]
    motivation: string[]
    posture: string[]
    recovery: string[]
  }
  progress: {
    weeklyGoals: string[]
    measurements: string[]
    checkpoints: string[]
  }
}

export interface AIResponse {
  success: boolean
  data?: FitnessPlan
  error?: string
  message?: string
}

export interface VoiceSettings {
  voice: string
  speed: number
  pitch: number
  volume: number
}

export interface GeneratedImage {
  url: string
  prompt: string
  type: 'exercise' | 'meal'
  itemName: string
}