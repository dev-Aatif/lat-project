'use client'

type Question = {
  question_text: string
  option1: string
  option2: string
  option3: string
  option4: string
}

type Props = {
  question: Question
  onAnswer: (choice: number) => void
}

export default function QuestionCard({ question, onAnswer }: Props) {
  return (
    <div className="p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">{question.question_text}</h2>
      <ul className="space-y-2">
        {[question.option1, question.option2, question.option3, question.option4].map(
          (opt, index) => (
            <li key={index}>
              <button
                onClick={() => onAnswer(index)}
                className="w-full p-2 text-left border rounded hover:bg-gray-100"
              >
                {opt}
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  )
}
