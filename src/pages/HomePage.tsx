import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
        <div className="flex flex-col items-center justify-center">
          <Button variant="outline">
            <Link to="/users">View Users Demo</Link>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Button variant="outline">
            <Link to="/about">About</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
