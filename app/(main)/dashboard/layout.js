import { Suspense } from "react";

function Loader() {
  return (
    <div className="mt-6 w-full flex justify-center">
      <div className="h-2 w-full bg-gray-200 rounded">
        <div className="h-2 bg-gray-500 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Industry Insights
        </h1>
      </div>

      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </div>
  );
}