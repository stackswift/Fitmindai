'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Activity, Target, MapPin, Utensils, Clock, Heart, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { UserData } from '@/types'

interface UserFormProps {
  onSubmit: (data: UserData) => void
  isLoading: boolean
}

export default function UserForm({ onSubmit, isLoading }: UserFormProps) {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    age: 25,
    gender: 'male',
    height: 170,
    weight: 70,
    fitnessGoal: 'muscle-gain',
    fitnessLevel: 'intermediate',
    workoutLocation: 'gym',
    dietaryPreference: 'non-vegetarian',
    medicalHistory: '',
    stressLevel: 'medium',
    sleepHours: 7,
    availableTime: 60,
    preferredWorkoutTime: 'evening'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof UserData, value: any) => {
    setFormData((prev: UserData) => ({ ...prev, [field]: value }))
  }

  const formSections = [
    {
      title: "Personal Information",
      icon: User,
      fields: [
        { key: 'name', label: 'Full Name', type: 'text', required: true },
        { key: 'age', label: 'Age', type: 'number', min: 13, max: 100 },
        {
          key: 'gender', label: 'Gender', type: 'select', options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]
        },
        { key: 'height', label: 'Height (cm)', type: 'number', min: 100, max: 250 },
        { key: 'weight', label: 'Weight (kg)', type: 'number', min: 30, max: 300 }
      ]
    },
    {
      title: "Fitness Goals",
      icon: Target,
      fields: [
        {
          key: 'fitnessGoal', label: 'Primary Goal', type: 'select', options: [
            { value: 'weight-loss', label: 'Weight Loss' },
            { value: 'muscle-gain', label: 'Muscle Gain' },
            { value: 'maintenance', label: 'Maintenance' },
            { value: 'endurance', label: 'Endurance' },
            { value: 'strength', label: 'Strength' }
          ]
        },
        {
          key: 'fitnessLevel', label: 'Current Fitness Level', type: 'select', options: [
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' }
          ]
        },
        {
          key: 'workoutLocation', label: 'Preferred Workout Location', type: 'select', options: [
            { value: 'home', label: 'Home' },
            { value: 'gym', label: 'Gym' },
            { value: 'outdoor', label: 'Outdoor' }
          ]
        }
      ]
    },
    {
      title: "Diet & Lifestyle",
      icon: Utensils,
      fields: [
        {
          key: 'dietaryPreference', label: 'Dietary Preference', type: 'select', options: [
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'non-vegetarian', label: 'Non-Vegetarian' },
            { value: 'vegan', label: 'Vegan' },
            { value: 'keto', label: 'Keto' },
            { value: 'paleo', label: 'Paleo' }
          ]
        },
        {
          key: 'stressLevel', label: 'Stress Level', type: 'select', options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' }
          ]
        },
        { key: 'sleepHours', label: 'Average Sleep (hours)', type: 'number', min: 4, max: 12 }
      ]
    },
    {
      title: "Preferences",
      icon: Clock,
      fields: [
        { key: 'availableTime', label: 'Available Time (minutes/day)', type: 'number', min: 15, max: 240 },
        {
          key: 'preferredWorkoutTime', label: 'Preferred Workout Time', type: 'select', options: [
            { value: 'morning', label: 'Morning' },
            { value: 'afternoon', label: 'Afternoon' },
            { value: 'evening', label: 'Evening' }
          ]
        },
        { key: 'medicalHistory', label: 'Medical History (Optional)', type: 'textarea', placeholder: 'Any injuries, conditions, or medications...' }
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            Tell Us About Yourself
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {formSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <section.icon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field) => (
                    <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label htmlFor={field.key} className="block text-sm font-medium mb-2">
                        {field.label} {'required' in field && field.required && <span className="text-red-500">*</span>}
                      </label>

                      {field.type === 'select' ? (
                        <select
                          id={field.key}
                          value={formData[field.key as keyof UserData] as string}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange(field.key as keyof UserData, e.target.value)}
                          className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <Textarea
                          id={field.key}
                          value={formData[field.key as keyof UserData] as string || ''}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(field.key as keyof UserData, e.target.value)}
                          placeholder={'placeholder' in field ? field.placeholder : undefined}
                          rows={3}
                        />
                      ) : (
                        <Input
                          id={field.key}
                          type={field.type}
                          value={formData[field.key as keyof UserData] as string | number}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(
                            field.key as keyof UserData,
                            field.type === 'number' ? Number(e.target.value) : e.target.value
                          )}
                          min={'min' in field ? field.min : undefined}
                          max={'max' in field ? field.max : undefined}
                          required={'required' in field ? field.required : false}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center pt-6"
            >
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !formData.name.trim()}
                className="min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2 h-4 w-4" />
                    Generate My Fitness Plan
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}