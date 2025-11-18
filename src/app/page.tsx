'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import UserForm from '@/components/user-form'
import PlanDisplay from '@/components/plan-display'
import { Header } from '@/components/header'
import { MotivationQuote } from '@/components/motivation-quote'
import { UserData, FitnessPlan } from '@/types'

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [plan, setPlan] = useState<FitnessPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleUserSubmit = async (data: UserData) => {
    setUserData(data)
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to generate plan')
      }

      const generatedPlan = await response.json()
      setPlan(generatedPlan)

      // Save to localStorage
      localStorage.setItem('fitnessPlan', JSON.stringify(generatedPlan))
      localStorage.setItem('userData', JSON.stringify(data))
    } catch (error) {
      console.error('Error generating plan:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegeneratePlan = () => {
    if (userData) {
      handleUserSubmit(userData)
    }
  }

  const handleBackToForm = () => {
    setPlan(null)
    setUserData(null)
    localStorage.removeItem('fitnessPlan')
    localStorage.removeItem('userData')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            FitMind AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your AI-powered personal fitness coach. Get customized workout and diet plans
            tailored specifically for your goals and preferences.
          </p>
        </motion.div>

        <MotivationQuote />

        {!plan ? (
          <UserForm onSubmit={handleUserSubmit} isLoading={isGenerating} />
        ) : (
          <PlanDisplay 
            plan={plan} 
            userData={userData!}
            onRegenerate={handleRegeneratePlan}
            onBackToForm={handleBackToForm}
            isRegenerating={isGenerating}
          />
        )}
      </main>
    </div>
  )
}