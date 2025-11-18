'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  RefreshCw,
  Volume2,
  VolumeX,
  Dumbbell,
  Utensils,
  Target,
  Calendar,
  Clock,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FitnessPlan, UserData } from '@/types'

interface PlanDisplayProps {
  plan: FitnessPlan
  userData: UserData
  onRegenerate: () => void
  onBackToForm: () => void
  isRegenerating: boolean
}

export default function PlanDisplay({ plan, userData, onRegenerate, onBackToForm, isRegenerating }: PlanDisplayProps) {
  const [activeTab, setActiveTab] = useState<'workout' | 'diet' | 'tips'>('workout')
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedDay, setSelectedDay] = useState(0)
  const [progress, setProgress] = useState({
    completedWorkouts: 0,
    totalWorkouts: plan.workoutPlan.days.filter(day => day.exercises.length > 0).length,
    weeklyGoalsCompleted: 0,
    startDate: new Date().toISOString().split('T')[0]
  })

  const handleExportPDF = async () => {
    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan, userData }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${userData.name}_fitness_plan.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting PDF:', error)
    }
  }

  const handleTextToSpeech = async (text: string) => {
    if (isPlaying) {
      // Stop any current speech
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    try {
      setIsPlaying(true)
      // Try to use ElevenLabs API if available
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.substring(0, 2000), section: activeTab }),
      })

      if (response.ok && response.headers.get('content-type')?.includes('audio')) {
        const blob = await response.blob()
        const audio = new Audio(URL.createObjectURL(blob))
        audio.play()
        audio.onended = () => {
          setIsPlaying(false)
          URL.revokeObjectURL(audio.src)
        }
        audio.onerror = () => {
          setIsPlaying(false)
          // Fallback to browser speech synthesis
          useBrowserSpeech(text)
        }
      } else {
        // Fallback to browser's speech synthesis
        useBrowserSpeech(text)
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error)
      // Fallback to browser's speech synthesis
      useBrowserSpeech(text)
    }
  }

  const useBrowserSpeech = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text.substring(0, 2000))
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 0.8
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleGenerateImage = async (itemName: string, type: 'exercise' | 'meal') => {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemName, type }),
      })

      if (response.ok) {
        const { imageUrl } = await response.json()
        // Open image in a new window or modal
        window.open(imageUrl, '_blank')
      }
    } catch (error) {
      console.error('Error generating image:', error)
    }
  }

  const handleMarkWorkoutComplete = () => {
    setProgress(prev => ({
      ...prev,
      completedWorkouts: Math.min(prev.completedWorkouts + 1, prev.totalWorkouts)
    }))
    // Save progress to localStorage
    const updatedProgress = {
      ...progress,
      completedWorkouts: Math.min(progress.completedWorkouts + 1, progress.totalWorkouts)
    }
    localStorage.setItem(`progress_${plan.id}`, JSON.stringify(updatedProgress))
  }

  const handleMarkGoalComplete = () => {
    setProgress(prev => ({
      ...prev,
      weeklyGoalsCompleted: Math.min(prev.weeklyGoalsCompleted + 1, plan.progress.weeklyGoals.length)
    }))
    const updatedProgress = {
      ...progress,
      weeklyGoalsCompleted: Math.min(progress.weeklyGoalsCompleted + 1, plan.progress.weeklyGoals.length)
    }
    localStorage.setItem(`progress_${plan.id}`, JSON.stringify(updatedProgress))
  }

  // Load progress from localStorage on component mount
  React.useEffect(() => {
    const savedProgress = localStorage.getItem(`progress_${plan.id}`)
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [plan.id])

  const tabs = [
    { key: 'workout', label: 'Workout Plan', icon: Dumbbell },
    { key: 'diet', label: 'Diet Plan', icon: Utensils },
    { key: 'tips', label: 'Tips & Motivation', icon: Target }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <Card className="glass-card shadow-strong border-0">
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-xl gradient-primary">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <span className="text-gradient">Your Personalized Fitness Plan</span>
              </CardTitle>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                  {userData.name}
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                  {userData.fitnessGoal.replace('-', ' ')}
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                  {userData.fitnessLevel}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Workouts Progress</span>
                  <span>{progress.completedWorkouts}/{progress.totalWorkouts} completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.completedWorkouts / progress.totalWorkouts) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                onClick={onBackToForm}
                className="glass-card hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                New Plan
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportPDF}
                className="glass-card hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="glass-card hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                {isRegenerating ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Regenerate
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-3 justify-center p-2 glass-card rounded-2xl max-w-fit mx-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab.key as 'workout' | 'diet' | 'tips')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === tab.key 
                ? 'gradient-primary text-white shadow-lg' 
                : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'workout' && (
          <div className="space-y-8">
            <Card className="glass-card shadow-strong border-0">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 rounded-xl gradient-primary">
                      <Dumbbell className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gradient">{plan.workoutPlan.title}</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTextToSpeech(
                      `Workout Plan: ${plan.workoutPlan.description}. ${plan.workoutPlan.days.map(day =>
                        `${day.day}: ${day.focus}. Exercises: ${day.exercises.map(ex =>
                          `${ex.name}, ${ex.sets} sets, ${ex.reps} reps`
                        ).join(', ')}`
                      ).join('. ')}`
                    )}
                    className="glass-card hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">{plan.workoutPlan.description}</p>
                <div className="flex gap-6 text-sm">
                  <span className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                    <Calendar className="h-4 w-4" />
                    {plan.workoutPlan.duration}
                  </span>
                  <span className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                    <Clock className="h-4 w-4" />
                    {plan.workoutPlan.frequency}
                  </span>
                </div>
              </CardHeader>
            </Card>

            {/* Day Selection */}
            <div className="flex flex-wrap gap-2 justify-center">
              {plan.workoutPlan.days.map((day, index) => (
                <Button
                  key={index}
                  variant={selectedDay === index ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDay(index)}
                >
                  {day.day}
                </Button>
              ))}
            </div>

            {/* Selected Day Details */}
            {plan.workoutPlan.days[selectedDay] && (
              <Card>
                <CardHeader>
                  <CardTitle>{plan.workoutPlan.days[selectedDay].day} - {plan.workoutPlan.days[selectedDay].focus}</CardTitle>
                  <p className="text-muted-foreground">
                    Total Time: {plan.workoutPlan.days[selectedDay].totalTime}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Warmup */}
                    <div>
                      <h4 className="font-medium text-sm text-primary mb-2">WARMUP</h4>
                      <ul className="text-sm text-muted-foreground">
                        {plan.workoutPlan.days[selectedDay].warmup.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Exercises */}
                    <div>
                      <h4 className="font-medium text-sm text-primary mb-2">EXERCISES</h4>
                      <div className="grid gap-4">
                        {plan.workoutPlan.days[selectedDay].exercises.map((exercise, i) => (
                          <div key={i} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{exercise.name}</h5>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGenerateImage(exercise.name, 'exercise')}
                              >
                                <ImageIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mb-2">
                              <span>Sets: {exercise.sets}</span>
                              <span>Reps: {exercise.reps}</span>
                              <span>Rest: {exercise.restTime}</span>
                              <span>Level: {exercise.difficulty}</span>
                            </div>
                            <p className="text-sm">{exercise.instructions}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {exercise.muscleGroups.map((muscle, j) => (
                                <span key={j} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {muscle}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cooldown */}
                    <div>
                      <h4 className="font-medium text-sm text-primary mb-2">COOLDOWN</h4>
                      <ul className="text-sm text-muted-foreground">
                        {plan.workoutPlan.days[selectedDay].cooldown.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Workout Completion */}
                    {plan.workoutPlan.days[selectedDay].exercises.length > 0 && (
                      <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-green-800 dark:text-green-200">Complete this workout</h5>
                            <p className="text-sm text-green-600 dark:text-green-300">Mark as completed to track your progress</p>
                          </div>
                          <Button
                            onClick={handleMarkWorkoutComplete}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            ✓ Mark Complete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'diet' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    {plan.dietPlan.title}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTextToSpeech(
                      `Diet Plan: ${plan.dietPlan.description}. Guidelines: ${plan.dietPlan.guidelines.join(', ')}`
                    )}
                  >
                    {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-muted-foreground">{plan.dietPlan.description}</p>
              </CardHeader>
            </Card>

            {/* Diet Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.dietPlan.guidelines.map((guideline, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span className="text-sm">{guideline}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Daily Meals */}
            <div className="grid gap-6">
              {plan.dietPlan.days.map((day, dayIndex) => (
                <Card key={dayIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{day.day}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {day.totalCalories} calories • {day.waterIntake}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Breakfast */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-primary">Breakfast</h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateImage(day.breakfast.name, 'meal')}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <h6 className="font-medium text-sm mb-2">{day.breakfast.name}</h6>
                        <p className="text-xs text-muted-foreground mb-2">
                          {day.breakfast.calories} cal • {day.breakfast.cookingTime}
                        </p>
                        <p className="text-xs">{day.breakfast.preparation}</p>
                      </div>

                      {/* Lunch */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-primary">Lunch</h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateImage(day.lunch.name, 'meal')}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <h6 className="font-medium text-sm mb-2">{day.lunch.name}</h6>
                        <p className="text-xs text-muted-foreground mb-2">
                          {day.lunch.calories} cal • {day.lunch.cookingTime}
                        </p>
                        <p className="text-xs">{day.lunch.preparation}</p>
                      </div>

                      {/* Dinner */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-primary">Dinner</h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateImage(day.dinner.name, 'meal')}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <h6 className="font-medium text-sm mb-2">{day.dinner.name}</h6>
                        <p className="text-xs text-muted-foreground mb-2">
                          {day.dinner.calories} cal • {day.dinner.cookingTime}
                        </p>
                        <p className="text-xs">{day.dinner.preparation}</p>
                      </div>

                      {/* Snacks */}
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium text-primary mb-2">Snacks</h5>
                        {day.snacks.map((snack, i) => (
                          <div key={i} className="mb-2 last:mb-0">
                            <div className="flex items-center justify-between">
                              <h6 className="font-medium text-sm">{snack.name}</h6>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGenerateImage(snack.name, 'meal')}
                              >
                                <ImageIcon className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {snack.calories} cal
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Lifestyle Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Lifestyle Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.tips.lifestyle.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Motivation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Motivation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.tips.motivation.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Posture Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-purple-500" />
                    Posture & Form
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.tips.posture.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-purple-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recovery */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Recovery & Rest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.tips.recovery.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Progress Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Progress Tracking
                  <div className="text-sm text-muted-foreground">
                    Goals: {progress.weeklyGoalsCompleted}/{plan.progress.weeklyGoals.length}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h5 className="font-medium text-primary mb-2 flex items-center justify-between">
                      Weekly Goals
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {progress.weeklyGoalsCompleted}/{plan.progress.weeklyGoals.length}
                      </span>
                    </h5>
                    <ul className="space-y-2 text-sm">
                      {plan.progress.weeklyGoals.map((goal, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={i < progress.weeklyGoalsCompleted}
                            onChange={i < progress.weeklyGoalsCompleted ? undefined : handleMarkGoalComplete}
                            className="rounded"
                          />
                          <span className={i < progress.weeklyGoalsCompleted ? 'line-through text-muted-foreground' : ''}>
                            {goal}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-2">Measurements</h5>
                    <ul className="space-y-1 text-sm">
                      {plan.progress.measurements.map((measurement, i) => (
                        <li key={i}>• {measurement}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-2">Checkpoints</h5>
                    <ul className="space-y-1 text-sm">
                      {plan.progress.checkpoints.map((checkpoint, i) => (
                        <li key={i}>• {checkpoint}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Overall Progress Summary */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h6 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Your Journey</h6>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{progress.completedWorkouts}</div>
                      <div className="text-blue-600">Workouts Done</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{progress.weeklyGoalsCompleted}</div>
                      <div className="text-green-600">Goals Achieved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(((progress.completedWorkouts / progress.totalWorkouts) + (progress.weeklyGoalsCompleted / plan.progress.weeklyGoals.length)) / 2 * 100)}%
                      </div>
                      <div className="text-purple-600">Overall Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.ceil((new Date().getTime() - new Date(progress.startDate).getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-orange-600">Days Active</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}