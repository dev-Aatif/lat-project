'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'
import QuestionCard from '@/components/Questioncard'

type Question = {
  id: string
  question_text: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_index: number
}

export default function QuizPage() {
  const searchParams = useSearchParams()
  const subject = searchParams.get('subject')
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true)
        let query = supabase.from('questions').select('*')
        
        // Filter by subject if provided
        if (subject) {
          query = query.eq('subject', subject)
        }
        
        const { data, error } = await query.limit(10)
        
        if (error) {
          setError(error.message)
          console.error('Supabase error:', error)
        } else if (data && data.length > 0) {
          setQuestions(data as Question[])
        } else {
          setError('No questions found for this subject')
        }
      } catch (err) {
        setError('Failed to load questions')
        console.error('Fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchQuestions()
  }, [subject])

  const handleAnswer = (choice: number) => {
    if (choice === questions[currentIndex].correct_index) {
      setScore(score + 1)
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const restartQuiz = () => {
    setCurrentIndex(0)
    setScore(0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md mx-4">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
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

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md mx-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Questions Available</h2>
          <p className="text-gray-700 mb-6">
            {subject 
              ? `No questions found for ${subject}.` 
              : 'No questions available at the moment.'
            }
          </p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (currentIndex >= questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Finished!</h1>
          <p className="text-lg text-gray-600 mb-2">Your score: {score} / {questions.length}</p>
          <p className="text-gray-500 mb-6">
            {score === questions.length 
              ? 'Perfect score! Amazing job! 🎉' 
              : score >= questions.length * 0.7 
                ? 'Great job! Keep practicing!' 
                : 'Keep studying and try again!'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={restartQuiz}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Choose Another Subject
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {subject ? `${subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz` : 'General Knowledge Quiz'}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-600">
            <span>Score: {score}</span>
            <span>•</span>
            <span>Question {currentIndex + 1} of {questions.length}</span>
          </div>
        </div>
        
        <QuestionCard 
          question={questions[currentIndex]}
          onAnswer={handleAnswer}
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
        />
      </div>
    </div>
  )
}