/**
 * Filename: NotFound.tsx
 *
 * Desc: Handles when user visits an invalid url
 *
 * Author: Jerry Meng
 *
 * Last Modified: Dec 2025
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(
      "Error 404: User attempted to access non-existent route: ",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100"
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
    >
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-500 dark:text-gray-400">
          Oops! Page not found
        </p>
        <a href="/" className="text-teal-600 underline hover:text-teal-500/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
