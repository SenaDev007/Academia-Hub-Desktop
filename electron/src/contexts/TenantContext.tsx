import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface School {
  id: string;
  name: string;
  subdomain: string;
  plan: string;
  status?: 'pending_payment' | 'pending_kyc' | 'active' | 'suspended' | 'expired';
  settings: {
    logo?: string;
    theme?: string;
    language?: string;
  };
}

interface TenantContextType {
  school: School | null;
  setSchool: (school: School) => void;
  isLoading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [school, setSchoolState] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to set school and save to localStorage
  const setSchool = (schoolData: School) => {
    setSchoolState(schoolData);
    localStorage.setItem('tenant', JSON.stringify(schoolData));
  };

  // On mount, try to load tenant from localStorage or determine from URL
  useEffect(() => {
    const loadTenant = async () => {
      try {
        // First check localStorage
        const savedTenant = localStorage.getItem('tenant');
        if (savedTenant) {
          setSchoolState(JSON.parse(savedTenant));
          setIsLoading(false);
          return;
        }

        // If no saved tenant, try to determine from URL
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        
        if (subdomain && subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'localhost') {
          // In a real implementation, you would fetch school data from your API
          // Simulating API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Simulated response
          setSchoolState({
            id: 'school-1',
            name: subdomain.charAt(0).toUpperCase() + subdomain.slice(1).replace(/-/g, ' '),
            subdomain,
            plan: 'professional',
            status: 'active',
            settings: {
              theme: 'default',
              language: 'fr'
            }
          });
        } else {
          // Default tenant for main site
          setSchoolState({
            id: 'main',
            name: 'Academia Hub',
            subdomain: 'app',
            plan: 'main',
            settings: {
              theme: 'default',
              language: 'fr'
            }
          });
        }
      } catch (err) {
        console.error('Failed to load tenant:', err);
        setError('Failed to load school information');
      } finally {
        setIsLoading(false);
      }
    };

    loadTenant();
  }, []);

  const value = {
    school,
    setSchool,
    isLoading,
    error
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};