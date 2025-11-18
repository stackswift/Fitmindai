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

        {/* About Section - First */}
        <section id="about" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6">
              About FitMind AI
            </h2>
            <div className="glass-card p-8 rounded-2xl mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                FitMind AI is your personal fitness companion powered by advanced artificial intelligence. 
                We combine cutting-edge technology with fitness expertise to create personalized workout 
                and nutrition plans that adapt to your unique goals, preferences, and lifestyle.
              </p>
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="text-xl font-bold text-gradient mb-3">Our Mission</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    To make professional fitness coaching accessible to everyone through AI technology, 
                    helping you achieve your health and fitness goals with personalized guidance.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gradient mb-3">Technology</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Built with Next.js, powered by OpenAI and Google Gemini, featuring voice synthesis, 
                    AI image generation, and modern responsive design.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Navigation to other sections */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="glass-card px-6 py-3 rounded-xl font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 transform hover:scale-105"
              >
                🧠 Explore Features
              </button>
              <button 
                onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                className="glass-card px-6 py-3 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 transform hover:scale-105"
              >
                🏋️ Get Your Plan
              </button>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Powerful AI Features
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience cutting-edge AI technology designed to transform your fitness journey
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
            {[
              {
                title: "AI-Powered Plans",
                description: "Personalized workout and diet plans generated by advanced AI",
                icon: "🧠"
              },
              {
                title: "Voice Guidance",
                description: "Listen to your plans with high-quality text-to-speech",
                icon: "🔊"
              },
              {
                title: "Visual Exercise Guide",
                description: "AI-generated images for exercise demonstrations",
                icon: "🖼️"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gradient">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
              className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Your Fitness Journey →
            </button>
          </div>
        </section>

        {/* Plans Section */}
        <section id="plans">
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
        </section>
      </main>
    </div>
  )
}