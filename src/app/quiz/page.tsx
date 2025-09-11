import { Suspense } from 'react'
import QuizContent from './QuizContent'

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading quiz...</div>}>
      <QuizContent />
    </Suspense>
  )
}