'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Dumbbell } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-white/20 dark:border-gray-700/30 glass-card sticky top-0 z-50"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl gradient-primary shadow-lg">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gradient">
            FitMind AI
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <span className="hover:text-purple-600 cursor-pointer transition-colors">Features</span>
            <span className="hover:text-purple-600 cursor-pointer transition-colors">Plans</span>
            <span className="hover:text-purple-600 cursor-pointer transition-colors">About</span>
          </div>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-10 w-10 rounded-xl glass-card hover:bg-purple-100 dark:hover:bg-purple-900/30"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-orange-500" />
              ) : (
                <Moon className="h-5 w-5 text-purple-600" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  )
}