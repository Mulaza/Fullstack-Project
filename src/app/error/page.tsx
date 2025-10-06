export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-black mb-4">404</h1>
          <div className="inline-block mb-4 px-4 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
            Page not found
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-black mb-4">
          This page doesn't exist
        </h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for could not be found. It might have been removed, renamed, or doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="/"
            className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Go Home
          </a>
          <a 
            href="/dashboard"
            className="border border-gray-300 text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}