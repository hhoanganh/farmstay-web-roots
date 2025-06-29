// ABOUTME: This hook provides real-time Supabase session data.
// ABOUTME: It also includes a function to handle user logout and a loading state.
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Add this loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Check for an active session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // Set loading to false after the check
    });

    // Listen for changes in authentication state (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false); // Also set loading to false on state change
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return { session, loading, handleLogout }; // Return the loading state
};