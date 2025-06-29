// ABOUTME: This file defines the authentication context provider for the application.
// ABOUTME: It manages and provides the user's session state to all components.
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

// Define the shape of your context data
interface AuthContextType {
  session: Session | null;
  userProfile: any | null;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for changes in authentication state (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // When the session changes, fetch the user's profile
  useEffect(() => {
    if (session?.user) {
      // Don't set loading to true here to avoid a full page reload flicker on simple profile updates
      supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          setUserProfile(data ?? null);
          setIsLoading(false); // Set loading to false after the first profile fetch
        });
    } else {
      // If there is no session, clear the profile and stop loading
      setUserProfile(null);
      setIsLoading(false);
    }
  }, [session]);

  // While loading the session, render the children only when loading is complete.
  return (
    <AuthContext.Provider value={{ session, userProfile }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to consume the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};