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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-purple-950 dark:to-indigo-950">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <Header />

      <main className="container mx-auto px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-gradient mb-6 leading-tight"
          >
            FitMind AI
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-4 font-medium">
              Your AI-powered personal fitness coach
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get customized workout and diet plans tailored specifically for your goals, 
              fitness level, and lifestyle preferences.
            </p>
          </motion.div>
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