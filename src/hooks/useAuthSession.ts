// src/hooks/useAuthSession.ts

import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider'; // Import the hook from your provider

export const useAuthSession = () => {
  const { session } = useAuth(); // Get session state from the context
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // Navigate after signing out
  };

  return { session, handleLogout };
};