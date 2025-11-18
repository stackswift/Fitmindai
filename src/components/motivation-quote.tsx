'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const motivationQuotes = [
  "Your body can do it. It's your mind you have to convince.",
  "The groundwork for all happiness is good health.",
  "Take care of your body. It's the only place you have to live.",
  "A healthy outside starts from the inside.",
  "Health is not about the weight you lose, but about the life you gain.",
  "Every workout is progress, no matter how small.",
  "Consistency is the key to achieving your fitness goals.",
  "The best project you'll ever work on is you.",
  "Strong is what happens when you run out of weak.",
  "Your health is an investment, not an expense."
]

export function MotivationQuote() {
  const [currentQuote, setCurrentQuote] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Get or set daily quote
    const today = new Date().toDateString()
    const storedDate = localStorage.getItem('quoteDate')
    const storedQuote = localStorage.getItem('dailyQuote')

    if (storedDate === today && storedQuote) {
      setCurrentQuote(storedQuote)
    } else {
      const randomQuote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)]
      setCurrentQuote(randomQuote)
      localStorage.setItem('quoteDate', today)
      localStorage.setItem('dailyQuote', randomQuote)
    }
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-8"
    >
      <Card className="glass-effect border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Quote className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-lg font-medium text-foreground italic">
                &ldquo;{currentQuote}&rdquo;
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Daily Motivation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}