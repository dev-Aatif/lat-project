'use client'

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

export default function QuestionCard({ question, onAnswer, currentQuestion, totalQuestions }: Props) {
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
          {[
            { option: question.option1, index: 0, letter: 'A' },
            { option: question.option2, index: 1, letter: 'B' },
            { option: question.option3, index: 2, letter: 'C' },
            { option: question.option4, index: 3, letter: 'D' }
          ].map((item) => (
            <button
              key={item.index}
              onClick={() => onAnswer(item.index)}
              className="flex items-center p-4 text-left border border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group h-24"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 flex items-center justify-center mr-4 font-semibold text-blue-700 dark:text-blue-400">
                {item.letter}
              </div>
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-800 dark:group-hover:text-blue-300 text-sm">{item.option}</span>
            </button>
          ))}
        </div>
        
        {/* Navigation Hint */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Select the correct answer to continue
            <br />
          Antonym is opposite and synonym is same
        </div>
      </div>
    </div>
  )
}