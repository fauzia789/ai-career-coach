"use client";

import { Suspense } from "react";

function Loader() {
  return (
    <div className="mt-6 flex justify-center">
      <div className="h-10 w-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <div className="px-5">
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </div>
  );
}