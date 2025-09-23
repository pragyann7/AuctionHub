import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold text-gray-900">
          404
        </h1>

        <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700">
          The page cannot be found.
        </h2>

        <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed">
          Sorry! The page you were looking for could not be found. <br className="hidden sm:block" />
          Try searching for it or browse through our website.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full sm:w-auto rounded-xl bg-orange-600 px-6 py-3 text-white font-medium shadow-md hover:bg-orange-700 transition"
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}
