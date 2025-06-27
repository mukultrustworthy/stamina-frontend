import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Stamina
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Your fitness journey starts here. Track your progress and build lasting
        habits.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/users"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          View Users Demo
        </Link>
        <Link
          to="/about"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-block"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
