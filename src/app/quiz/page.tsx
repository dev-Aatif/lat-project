'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import QuestionCard from '@/components/QuestionCard'

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
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('questions').select('*').limit(5)
      if (error) console.error(error)
      else setQuestions(data as Question[])
    }
    fetchQuestions()
  }, [])

  const handleAnswer = (choice: number) => {
    if (choice === questions[currentIndex].correct_index) {
      setScore(score + 1)
    }
    setCurrentIndex(currentIndex + 1)
  }

  if (questions.length === 0) return <p>Loading...</p>

  if (currentIndex >= questions.length) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Quiz Finished!</h1>
        <p className="mt-4">Your score: {score} / {questions.length}</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <QuestionCard
        question={questions[currentIndex]}
        onAnswer={handleAnswer}
      />
    </div>
  )
}
