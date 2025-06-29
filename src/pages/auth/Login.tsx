
// ABOUTME: This file defines the staff login page.
// ABOUTME: It provides a secure gateway for staff to access the admin portal.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin/dashboard');
      }
    };
    
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" 
         style={{ backgroundColor: 'hsl(var(--background-primary))' }}>
      <Card className="w-full max-w-md border border-[hsl(var(--stone))] border-opacity-20 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <a 
            href="/" 
            className="inline-block hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] rounded"
          >
            <h2 
              className="text-3xl text-[hsl(var(--text-accent))]"
              style={{ fontFamily: 'Caveat, cursive' }}
            >
              Lâm Hà Farmstay
            </h2>
          </a>
          <h1 
            className="text-2xl text-[hsl(var(--text-primary))]"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Staff Portal
          </h1>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
