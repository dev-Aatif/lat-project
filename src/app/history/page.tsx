'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type QuizHistoryItem = {
  type: 'quiz';
  score: number;
  total: number;
  subject: string | null;
  date: string;
  percentage: number;
}

type MockExamHistoryItem = {
  type: 'mock';
  score: number;
  total: number;
  date: string;
  timeSpent: string;
  breakdown?: Record<string, { correct: number; total: number }>;
}

type HistoryItem = QuizHistoryItem | MockExamHistoryItem;

export default function UnifiedHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'quiz' | 'mock'>('all')

  useEffect(() => {
    // Load both histories from localStorage
    const loadHistory = () => {
      try {
        const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]')
        const mockHistory = JSON.parse(localStorage.getItem('mockExamHistory') || '[]')
        
        // Add type identifiers to each item
        const typedQuizHistory = quizHistory.map((item: any) => ({ ...item, type: 'quiz' }))
        const typedMockHistory = mockHistory.map((item: any) => ({ ...item, type: 'mock' }))
        
        // Combine and sort by date (newest first)
        const combinedHistory = [...typedQuizHistory, ...typedMockHistory].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        
        setHistory(combinedHistory)
      } catch (error) {
        console.error('Failed to load history:', error)
      }
    }

    loadHistory()
  }, [])

  const clearHistory = (type?: 'quiz' | 'mock') => {
    if (type) {
      if (confirm(`Are you sure you want to clear your ${type} history?`)) {
        localStorage.removeItem(type === 'quiz' ? 'quizHistory' : 'mockExamHistory')
        setHistory(prev => prev.filter(item => item.type !== type))
      }
    } else {
      if (confirm('Are you sure you want to clear all your history?')) {
        localStorage.removeItem('quizHistory')
        localStorage.removeItem('mockExamHistory')
        setHistory([])
      }
    }
  }

  const filteredHistory = activeTab === 'all' 
    ? history 
    : history.filter(item => item.type === activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Study History</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            All History
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'quiz'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setActiveTab('mock')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'mock'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Mock Exams
          </button>
        </div>

        {/* Clear Buttons */}
        <div className="mb-4 flex justify-end space-x-2">
          <button
            onClick={() => clearHistory('quiz')}
            className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-800/40 transition"
          >
            Clear Quizzes
          </button>
          <button
            onClick={() => clearHistory('mock')}
            className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-800/40 transition"
          >
            Clear Mock Exams
          </button>
          <button
            onClick={() => clearHistory()}
            className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-800/40 transition"
          >
            Clear All
          </button>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {activeTab === 'all' 
                ? "No history yet." 
                : `No ${activeTab} history yet.`
              }
            </p>
            <Link 
              href={activeTab === 'mock' ? "/mock" : "/"}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {activeTab === 'mock' ? "Take a Mock Exam" : "Take a Quiz"}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => (
              <div key={index} className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 ${
                item.type === 'quiz' 
                  ? 'border-green-500' 
                  : 'border-purple-500'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {item.type === 'quiz' 
                        ? `${item.subject || 'General'} Quiz` 
                        : 'Mock Exam Attempt'
                      }
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{item.date}</p>
                    {item.type === 'mock' && 'timeSpent' in item && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Time spent: {item.timeSpent}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      item.type === 'quiz'
                        ? item.percentage >= 80 ? 'text-green-600 dark:text-green-400' :
                          item.percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        : (item.score / item.total) >= 0.7 ? 'text-green-600 dark:text-green-400' :
                          (item.score / item.total) >= 0.5 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                    }`}>
                      {item.type === 'quiz' 
                        ? `${item.percentage}%` 
                        : `${Math.round((item.score / item.total) * 100)}%`
                      }
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {item.score} / {item.total} correct
                    </p>
                  </div>
                </div>
                
                {item.type === 'mock' && 'breakdown' in item && item.breakdown && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject Breakdown:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(item.breakdown).map(([subject, stats]) => (
                        <div key={subject} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 capitalize">{subject}:</span>
                          <span className="font-medium">{stats.correct}/{stats.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
                  <div 
                    className={`h-2.5 rounded-full ${
                      item.type === 'quiz'
                        ? item.percentage >= 80 ? 'bg-green-500' :
                          item.percentage >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        : (item.score / item.total) >= 0.7 ? 'bg-green-500' :
                          (item.score / item.total) >= 0.5 ? 'bg-yellow-500' :
                          'bg-red-500'
                    }`}
                    style={{ 
                      width: `${item.type === 'quiz' 
                        ? item.percentage 
                        : (item.score / item.total) * 100
                      }%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}