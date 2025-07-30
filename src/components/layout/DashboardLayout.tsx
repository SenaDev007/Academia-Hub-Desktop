import React, { useState, useEffect } from 'react';
import LoadingPage from '../loading/LoadingPage';

const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement pendant quelques secondes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {isLoading ? (
        <LoadingPage onLoadingComplete={() => setIsLoading(false)} />
      ) : (
        <main className="flex-grow">
          {children}
        </main>
      )}
    </div>
  );
};

export default DashboardLayout;
