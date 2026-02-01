import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/data/types';
import { Ambulance, Car, Shield, Building2, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const roleInfo: Record<UserRole, { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  color: string;
  demoCredentials: { username: string; password: string };
}> = {
  ambulance: {
    title: 'Ambulance Driver',
    description: 'Access emergency navigation and hospital routing',
    icon: Ambulance,
    color: 'text-emergency bg-emergency/10',
    demoCredentials: { username: 'ambulance_driver', password: 'demo123' },
  },
  temporary: {
    title: 'Temporary Emergency',
    description: 'Request emergency authorization for your vehicle',
    icon: Car,
    color: 'text-warning bg-warning/10',
    demoCredentials: { username: 'temp_emergency', password: 'demo123' },
  },
  police: {
    title: 'Police Control Room',
    description: 'Monitor all active emergency vehicles',
    icon: Shield,
    color: 'text-primary bg-primary/10',
    demoCredentials: { username: 'police_admin', password: 'demo123' },
  },
  hospital: {
    title: 'Hospital Staff',
    description: 'Track incoming emergencies and manage arrivals',
    icon: Building2,
    color: 'text-success bg-success/10',
    demoCredentials: { username: 'hospital_staff', password: 'demo123' },
  },
};

const LoginPage = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { setRole } = useApp();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const currentRole = role as UserRole;
  const info = roleInfo[currentRole];

  if (!info) {
    navigate('/');
    return null;
  }

  const Icon = info.icon;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      setRole(currentRole);
      toast({
        title: `Welcome, ${info.title}!`,
        description: "You have successfully logged in.",
      });
      navigate(`/${currentRole}`);
    }, 1500);
  };

  const handleDemoLogin = () => {
    setUsername(info.demoCredentials.username);
    setPassword(info.demoCredentials.password);
    toast({
      title: "Demo credentials filled",
      description: "Click Login to continue with demo account",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-medical/5 flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Role Selection
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${info.color}`}>
              <Icon className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl">{info.title}</CardTitle>
            <CardDescription>{info.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Demo Mode</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Use Demo Credentials
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <span className="font-medium">Demo Credentials:</span><br />
                Username: <code className="bg-background px-1 rounded">{info.demoCredentials.username}</code><br />
                Password: <code className="bg-background px-1 rounded">{info.demoCredentials.password}</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>RapidRescue • Demo Authentication</p>
      </footer>
    </div>
  );
};

export default LoginPage;
