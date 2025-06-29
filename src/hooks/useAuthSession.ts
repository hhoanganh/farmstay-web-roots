// src/hooks/useAuthSession.ts
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider'; // Import the new hook

export const useAuthSession = () => {
  const { session } = useAuth(); // Get session from the context
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return { session, handleLogout };
};