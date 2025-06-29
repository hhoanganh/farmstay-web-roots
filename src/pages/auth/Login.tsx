
// ABOUTME: This file defines the staff login page.
// ABOUTME: It provides a secure gateway for staff to access the admin portal.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/providers/AuthProvider';

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    // If a user is already logged in, redirect them to the dashboard.
    // This prevents logged-in users from seeing the login page again.
    if (session) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [session, navigate]);

  // If a session exists, we are in the process of redirecting.
  // Render nothing to avoid flashing the login form.
  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" 
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
            <p className="text-xs text-[hsl(var(--stone))] ui-text -mt-1">
              ← Back to Home
            </p>
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

      <div className="mt-6 w-full max-w-md text-center text-sm text-[hsl(var(--stone))] p-4 bg-[hsl(var(--background-secondary))] rounded-lg border border-[hsl(var(--border-primary))]">
        <h3 
          className="font-medium text-[hsl(var(--text-primary))] mb-2"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          For Testing Purposes
        </h3>
        <div className="space-y-1" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          <p><strong>Email:</strong> staff@lamhafarmstay.com</p>
          <p><strong>Password:</strong> staff@lamhafarmstay.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
