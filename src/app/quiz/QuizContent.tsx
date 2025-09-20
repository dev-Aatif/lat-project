'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'
import QuestionCard from '@/components/Questioncard'

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

type QuizHistoryItem = {
  score: number;
  total: number;
  subject: string | null;
  date: string;
  percentage: number;
}

// Save quiz result to history
const saveQuizHistory = (score: number, total: number, subject: string | null) => {
  try {
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]')
    const newHistoryItem = {
      score,
      total,
      subject,
      date: new Date().toLocaleString(),
      percentage: Math.round((score / total) * 100)
    }
    
    // Add new item to beginning of array and keep only last 5
    const updatedHistory = [newHistoryItem, ...history].slice(0, 10)
    localStorage.setItem('quizHistory', JSON.stringify(updatedHistory))
  } catch (error) {
    console.error('Failed to save quiz history:', error)
  }
}

// Get quiz history from localStorage
const getQuizHistory = (): QuizHistoryItem[] => {
  try {
    return JSON.parse(localStorage.getItem('quizHistory') || '[]');
  } catch (error) {
    console.error('Failed to load quiz history:', error);
    return [];
  }
};


export default function QuizContent() {
  const searchParams = useSearchParams()
  const subject = searchParams.get('subject')
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [quizFinished, setQuizFinished] = useState(false)
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true)
        let query = supabase.from('questions').select('*')
        
        if (subject) {
          console.log('Filtering by subject:', subject)
          query = query.ilike('subject', subject)
        } else {
          console.log('No subject filter applied')
        }
        
        const { data, error } = await query
        
        if (error) {
          setError(error.message)
          console.error('Supabase error:', error)
        } else if (data && data.length > 0) {
          console.log(`Found ${data.length} questions for subject: ${subject || 'all'}`)
          setQuestions(data as Question[])
        } else {
          const errorMsg = subject ? `No questions found for ${subject}` : 'No questions available at the moment.'
          setError(errorMsg)
          console.log(errorMsg)
        }
      } catch (err) {
        const errorMsg = 'An unexpected error occurred'
        setError(errorMsg)
        console.error(errorMsg, err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [subject])

  const handleAnswer = (choice: number) => {
    const newUserAnswers = [...userAnswers, choice]
    setUserAnswers(newUserAnswers)
    
    if (currentIndex >= questions.length - 1) {
      // Quiz is finished - calculate final score
      const finalScore = questions.reduce((score, question, index) => {
        return score + (newUserAnswers[index] === question.correct_index ? 1 : 0)
      }, 0)
      setScore(finalScore)
      setQuizFinished(true)

         // Save to history
    saveQuizHistory(finalScore, questions.length, subject)

    } else {
      // Move to next question
      setCurrentIndex(currentIndex + 1)
    }
  }

  const restartQuiz = () => {
    setCurrentIndex(0)
    setScore(0)
    setUserAnswers([])
    setQuizFinished(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading questions...</p>
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

        <button 
          onClick={() => window.location.href = '/history'}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
        >
          View History
        </button>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md max-w-md mx-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">No Questions Available</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
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

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Results header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Quiz Finished!</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">Your score: {score} / {questions.length}</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {score === questions.length 
                ? 'Perfect score! Amazing job! 🎉' 
                : score >= questions.length * 0.7 
                  ? 'Great job! Keep practicing!' 
                  : 'Keep studying and try again!'
              }
            </p>
          </div>

          {/* Detailed results with explanations */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Review Your Answers</h2>
            
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index]
              const isCorrect = userAnswer === question.correct_index
              const options = [question.option1, question.option2, question.option3, question.option4]
              
              return (
                <div key={question.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                  <div className="flex items-start mb-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 font-semibold text-blue-700 dark:text-blue-400">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">{question.question_text}</h3>
                  </div>
                  
                  <div className="ml-11">
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Your answer:</h4>
                      <div className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-400'}`}>
                        <span className="font-medium">{String.fromCharCode(65 + userAnswer)}. </span>
                        {options[userAnswer]}
                        {!isCorrect && (
                          <div className="mt-2">
                            <span className="font-medium text-green-600 dark:text-green-400">Correct answer: </span>
                            <span>{String.fromCharCode(65 + question.correct_index)}. {options[question.correct_index]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {question.explanation && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Explanation:</h4>
                        <p className="text-blue-700 dark:text-blue-300">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button 
              onClick={restartQuiz}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
            >
              Choose Another Subject
            </button>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {subject ? `${subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz` : 'General Knowledge Quiz'}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-400">
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