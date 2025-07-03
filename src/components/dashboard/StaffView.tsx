
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Edit, Trash2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Profile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

export function StaffView() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProfiles(data);
    }
  };

  const handleRemoveStaff = async (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (!error) {
        setProfiles(profiles.filter(profile => profile.id !== id));
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'staff':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 
            className="text-4xl text-[hsl(var(--text-accent))] mb-2"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Staff
          </h1>
          <p 
            className="text-[hsl(var(--text-secondary))]"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            Manage team members and their roles
          </p>
        </div>
        <Button 
          className="bg-[hsl(var(--interactive-primary))] hover:bg-[hsl(var(--interactive-primary))]/90 h-12"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Staff
        </Button>
      </div>

      {/* Staff List */}
      <div className="space-y-4">
        {profiles.length === 0 ? (
          <Card className="border-[hsl(var(--border-primary))]">
            <CardContent className="p-8">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--text-secondary))]" />
                <h3 
                  className="text-lg font-medium text-[hsl(var(--text-primary))] mb-2"
                  style={{ fontFamily: 'Caveat, cursive' }}
                >
                  No Staff Members Yet
                </h3>
                <p 
                  className="text-[hsl(var(--text-secondary))] mb-4"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  Add team members to help manage the farm
                </p>
                <Button 
                  className="bg-[hsl(var(--interactive-primary))] hover:bg-[hsl(var(--interactive-primary))]/90"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Add First Staff Member
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          profiles.map((profile) => (
            <Card key={profile.id} className="border-[hsl(var(--border-primary))]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[hsl(var(--text-accent))] rounded-full flex items-center justify-center">
                      <span 
                        className="text-white font-medium"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    
                    <div>
                      <h3 
                        className="text-lg font-medium text-[hsl(var(--text-primary))]"
                        style={{ fontFamily: 'Caveat, cursive' }}
                      >
                        {profile.full_name || 'Unknown User'}
                      </h3>
                      <div className="flex items-center gap-3">
                        <Badge className={getRoleColor(profile.role)} variant="outline">
                          {profile.role}
                        </Badge>
                        <span 
                          className="text-sm text-[hsl(var(--text-secondary))]"
                          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                        >
                          Joined: {format(new Date(profile.created_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-[hsl(var(--border-primary))] hover:bg-[hsl(var(--background-primary))]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-[hsl(var(--border-primary))] hover:bg-[hsl(var(--background-primary))]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {profile.role !== 'admin' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-200 hover:bg-red-50 text-red-600"
                        onClick={() => handleRemoveStaff(profile.id)}
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
