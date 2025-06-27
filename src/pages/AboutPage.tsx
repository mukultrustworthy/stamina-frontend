import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          About Stamina
        </h1>
        <div className="prose prose-lg mx-auto">
          <p className="text-lg text-gray-600 mb-6">
            Stamina is designed to help you build lasting fitness habits and
            track your progress along the way. Our platform makes it easy to
            stay motivated and achieve your health goals.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 mb-6">
            To empower individuals to take control of their fitness journey
            through intelligent tracking, personalized insights, and community
            support.
          </p>
          <div className="text-center mt-8">
            <Link
              to="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
