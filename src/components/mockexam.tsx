'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'

type Question = {
  id: string
  subject: string
  question_text: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_index: number
  explanation: string
}

type SubjectWeight = {
  subject: string
  weight: number
  questions: Question[]
}

export default function MockExam() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [examFinished, setExamFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 120 minutes in seconds
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Subject weights for LAT exam (approximate distribution)
  const subjectWeights: { subject: string; weight: number }[] = [
    { subject: 'english', weight: 20 },
    { subject: 'general knowledge', weight: 20 },
    { subject: 'islamic', weight: 10 },
    { subject: 'pakistan', weight: 10 },
    { subject: 'urdu', weight: 10 },
    { subject: 'math', weight: 5 }
  ]

  useEffect(() => {
    generateMockExam()
  }, [])

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 && !examFinished) {
      finishExam()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, examFinished])

  const generateMockExam = async () => {
    try {
      setIsLoading(true)
      const allQuestions: Question[] = []
      
      // Fetch questions for each subject based on weight
      for (const { subject, weight } of subjectWeights) {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .ilike('subject', subject)
          .limit(weight)

        if (error) {
          console.error(`Error fetching ${subject} questions:`, error)
          continue
        }

        if (data && data.length > 0) {
          // Shuffle and take the required number of questions
          const shuffled = [...data].sort(() => 0.5 - Math.random())
          allQuestions.push(...shuffled.slice(0, weight))
        }
      }

      // Shuffle all questions
      const shuffledQuestions = [...allQuestions].sort(() => 0.5 - Math.random())
      setQuestions(shuffledQuestions as Question[])
    } catch (err) {
      setError('Failed to generate mock exam')
      console.error('Error generating mock exam:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = (choice: number) => {
    const newUserAnswers = [...userAnswers, choice]
    setUserAnswers(newUserAnswers)

    if (currentIndex >= questions.length - 1) {
      finishExam()
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const finishExam = () => {
    setExamFinished(true)
    // Calculate score
    const score = questions.reduce((total, question, index) => {
      return total + (userAnswers[index] === question.correct_index ? 1 : 0)
    }, 0)
    
    // Save to history
    saveExamHistory(score, calculateSubjectBreakdown())
  }

  const saveExamHistory = (score: number, breakdown: Record<string, { correct: number; total: number }>) => {
  try {
      const history = JSON.parse(localStorage.getItem('mockExamHistory') || '[]')
      const newHistoryItem = {
        score,
        total: questions.length,
        date: new Date().toLocaleString(),
        timeSpent: formatTime(30 * 60 - timeLeft),
        breakdown
      }
      
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10)
      localStorage.setItem('mockExamHistory', JSON.stringify(updatedHistory))
    } catch (error) {
      console.error('Failed to save exam history:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const calculateSubjectBreakdown = () => {
    const breakdown: Record<string, { correct: number; total: number }> = {}
    
    questions.forEach((question, index) => {
      const subject = question.subject
      if (!breakdown[subject]) {
        breakdown[subject] = { correct: 0, total: 0 }
      }
      
      breakdown[subject].total += 1
      if (userAnswers[index] === question.correct_index) {
        breakdown[subject].correct += 1
      }
    })
    
    return breakdown
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Generating mock exam...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md max-w-md mx-4">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (examFinished) {
    const score = questions.reduce((total, question, index) => {
      return total + (userAnswers[index] === question.correct_index ? 1 : 0)
    }, 0)
    
    const subjectBreakdown = calculateSubjectBreakdown()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Mock Exam Completed!</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              Your score: {score} / {questions.length}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Time spent: {formatTime(30 * 60 - timeLeft)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Subject Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(subjectBreakdown).map(([subject, { correct, total }]) => (
                <div key={subject} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 dark:text-white capitalize">{subject}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {correct} / {total} correct ({Math.round((correct / total) * 100)}%)
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(correct / total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Take Another Exam
            </button>
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Exam Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">LAT Mock Exam</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${timeLeft < 600 ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Time remaining</p>
            </div>
          </div>
        </div>

        {/* Question */}
        {questions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              {questions[currentIndex].question_text}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                questions[currentIndex].option1,
                questions[currentIndex].option2,
                questions[currentIndex].option3,
                questions[currentIndex].option4
              ].map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="flex items-center p-4 text-left border border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 font-semibold text-blue-700 dark:text-blue-400">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{option}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stop Button */}
        <div className="text-center">
          <button
            onClick={finishExam}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Stop Exam
          </button>
        </div>
      </div>
    </div>
  )
}