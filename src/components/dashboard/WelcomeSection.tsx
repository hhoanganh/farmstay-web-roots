// ABOUTME: This component displays a personalized greeting on the admin dashboard.
// ABOUTME: It shows the user's name and their role within the farmstay.
interface WelcomeSectionProps {
  userProfile: {
    full_name?: string;
    role: string;
  };
}

export function WelcomeSection({ userProfile }: WelcomeSectionProps) {
  const displayName = userProfile.full_name || 'there';
  
  return (
    <div className="bg-[hsl(var(--background-secondary))] rounded-lg p-6 border border-[hsl(var(--border-primary))]">
      <p 
        className="text-lg text-[hsl(var(--text-primary))] mb-2"
        style={{ fontFamily: 'IBM Plex Mono, monospace' }}
      >
        Welcome back, {displayName}.
      </p>
      <p className="text-sm text-[hsl(var(--text-secondary))]">
        Role: {userProfile.role === 'admin' ? 'Farmstay Owner' : 'Farmstay Staff'}
      </p>
      <p 
        className="text-sm text-[hsl(var(--text-secondary))] mt-2"
        style={{ fontFamily: 'IBM Plex Mono, monospace' }}
      >
        Here's what's happening at the farm today.
      </p>
    </div>
  );
}
