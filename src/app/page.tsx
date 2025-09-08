import Link from "next/link";

const subjects = [
  { name: "English", href: "/quiz?subject=english" },
  { name: "General Knowledge", href: "/quiz?subject=gk" },
  { name: "Islamic Studies", href: "/quiz?subject=islamic" },
  { name: "Pakistan Studies", href: "/quiz?subject=pakistan" },
  { name: "Urdu", href: "/quiz?subject=urdu" },
  { name: "Math (Basic)", href: "/quiz?subject=math" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        Prepare for LAT the Smart Way
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Practice MCQs, essays, and personal statements. Track your progress with
        mock papers and challenge yourself with hardcore mode.
      </p>

      <Link
        href="/quiz"
        className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
      >
        Start Practicing
      </Link>

      <h2 className="text-2xl font-semibold mt-12 mb-6">Choose a Subject</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Link
            key={subject.name}
            href={subject.href}
            className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md hover:border-blue-500 transition"
          >
            {subject.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
