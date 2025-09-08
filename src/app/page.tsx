import Link from "next/link";
import Head from "next/head";

const subjects = [
  { name: "English", href: "/quiz?subject=english", color: "bg-blue-500" },
  { name: "General Knowledge", href: "/quiz?subject=gk", color: "bg-purple-500" },
  { name: "Islamic Studies", href: "/quiz?subject=islamic", color: "bg-green-500" },
  { name: "Pakistan Studies", href: "/quiz?subject=pakistan", color: "bg-amber-500" },
  { name: "Urdu", href: "/quiz?subject=urdu", color: "bg-rose-500" },
  { name: "Math (Basic)", href: "/quiz?subject=math", color: "bg-indigo-500" },
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>LAT Practice - Prepare for LAT the Smart Way</title>
        <meta name="description" content="Practice MCQs, essays, and personal statements for LAT. Track your progress with mock papers and challenge yourself with hardcore mode." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <main className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center py-12 md:py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Prepare for <span className="text-blue-600">LAT</span> the Smart Way
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Practice MCQs, essays, and personal statements. Track your progress with
              mock papers and challenge yourself with hardcore mode.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz"
                className="px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Start practicing quizzes"
              >
                Start Practicing
              </Link>
              <Link
                href="/progress"
                className="px-8 py-3.5 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="View your progress"
              >
                Track Progress
              </Link>
            </div>
          </section>

          {/* Subjects Grid */}
          <section className="py-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-8">
              Choose a Subject
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {subjects.map((subject) => (
                <Link
                  key={subject.name}
                  href={subject.href}
                  className={`group relative overflow-hidden p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex items-center justify-center h-32 ${subject.color} bg-gradient-to-r from-blue-500 to-indigo-600 text-white`}
                  aria-label={`Practice ${subject.name}`}
                >
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <span className="text-lg font-semibold text-center relative z-10">
                    {subject.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-10">
              Why Choose Our Platform
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Practice</h3>
                <p className="text-gray-600">Access hundreds of questions across all subjects with detailed explanations.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-gray-600">Monitor your performance with detailed analytics and personalized insights.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Mock Tests</h3>
                <p className="text-gray-600">Simulate the actual LAT exam experience with full-length timed tests.</p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} LAT Practice. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}