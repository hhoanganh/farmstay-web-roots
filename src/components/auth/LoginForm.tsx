
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label 
          htmlFor="email"
          className="text-[hsl(var(--text-primary))] ui-text"
        >
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="h-11 focus:ring-2 focus:ring-[hsl(var(--focus))] border-[hsl(var(--stone))] border-opacity-30"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label 
          htmlFor="password"
          className="text-[hsl(var(--text-primary))] ui-text"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="h-11 pr-10 focus:ring-2 focus:ring-[hsl(var(--focus))] border-[hsl(var(--stone))] border-opacity-30"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[hsl(var(--stone))] hover:text-[hsl(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] rounded"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-[hsl(var(--brown))] text-[hsl(var(--paper))] hover:bg-[hsl(var(--brown))]/90 focus:ring-2 focus:ring-[hsl(var(--focus))] ui-text font-medium"
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </Button>

      <div className="text-center mt-6">
        <a
          href="#"
          className="text-sm text-[hsl(var(--stone))] hover:text-[hsl(var(--text-accent))] transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focus))] rounded-sm px-3 py-2 min-h-[44px] inline-flex items-center justify-center ui-text"
          onClick={(e) => {
            e.preventDefault();
            toast({
              title: "Password Reset",
              description: "Please contact the farmstay owner for password assistance.",
            });
          }}
        >
          Forgot Password?
        </a>
      </div>
    </form>
  );
};
