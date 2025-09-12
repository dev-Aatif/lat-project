'use client'

import { useState, useEffect } from 'react'

type Question = {
  id: string
  question_text: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_index: number
}

type Props = {
  question: Question
  onAnswer: (choice: number) => void
  currentQuestion: number
  totalQuestions: number
}

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function QuestionCard({ question, onAnswer, currentQuestion, totalQuestions }: Props) {
  const [shuffledOptions, setShuffledOptions] = useState<{ option: string; originalIndex: number }[]>([])
  const [isShuffled, setIsShuffled] = useState(false)

  useEffect(() => {
    // Create array of options with their original indices
    const options = [
      { option: question.option1, originalIndex: 0 },
      { option: question.option2, originalIndex: 1 },
      { option: question.option3, originalIndex: 2 },
      { option: question.option4, originalIndex: 3 }
    ]
    
    // Shuffle the options
    const shuffled = shuffleArray(options)
    setShuffledOptions(shuffled)
    setIsShuffled(true)
  }, [question])

  if (!isShuffled) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">Question {currentQuestion} of {totalQuestions}</h2>
          <div className="w-32 bg-blue-800 rounded-full h-2.5">
            <div 
              className="bg-white h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Question Content */}
      <div className="p-6">
        <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-6 text-center leading-relaxed">
          {question.question_text}
        </h3>
        
        {/* Horizontal Options Grid */}
        <div className="grid grid-cols-2 gap-4">
          {shuffledOptions.map((item, displayIndex) => (
            <button
              key={displayIndex}
              onClick={() => onAnswer(item.originalIndex)}
              className="flex items-center p-4 text-left border border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group h-24"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 flex items-center justify-center mr-4 font-semibold text-blue-700 dark:text-blue-400">
                {String.fromCharCode(65 + displayIndex)} {/* A, B, C, D */}
              </div>
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-800 dark:group-hover:text-blue-300 text-sm">{item.option}</span>
            </button>
          ))}
        </div>
        
        {/* Navigation Hint */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Select the correct answer to continue
        </div>
      </div>
    </div>
  )
}