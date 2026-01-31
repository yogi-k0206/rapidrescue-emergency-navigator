import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Ambulance, ArrowLeft } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

const DashboardHeader = ({ title, subtitle, showBack = true }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { setRole } = useApp();

  const handleBack = () => {
    setRole(null);
    navigate('/');
  };

  return (
    <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-emergency flex items-center justify-center">
            <Ambulance className="w-5 h-5 text-emergency-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="text-sm font-medium text-primary">
        RapidRescue
      </div>
    </header>
  );
};

export default DashboardHeader;
