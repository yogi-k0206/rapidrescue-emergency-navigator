import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Phone, 
  Radio, 
  CheckCircle, 
  Siren, 
  Loader2,
  TrafficCone,
  MapPin,
  Signal,
  Shield,
  Users,
  Wifi
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EnhancedSOSButtonProps {
  vehicleId: string;
  vehicleRegistration: string;
  vehicleType: 'ambulance' | 'temporary';
  currentLocation: { lat: number; lng: number };
  className?: string;
  variant?: 'default' | 'compact' | 'large';
}

interface AlertStep {
  id: string;
  label: string;
  icon: React.ElementType;
  status: 'pending' | 'active' | 'completed';
}

const EnhancedSOSButton = ({ 
  vehicleId, 
  vehicleRegistration, 
  vehicleType, 
  currentLocation,
  className = '',
  variant = 'default'
}: EnhancedSOSButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertPhase, setAlertPhase] = useState<'idle' | 'sending' | 'active' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [alertSteps, setAlertSteps] = useState<AlertStep[]>([
    { id: 'police', label: 'Alerting Police Control Room', icon: Shield, status: 'pending' },
    { id: 'signals', label: 'Notifying Traffic Signals (500m radius)', icon: TrafficCone, status: 'pending' },
    { id: 'broadcast', label: 'Broadcasting to Nearby Vehicles', icon: Wifi, status: 'pending' },
    { id: 'corridor', label: 'Creating Emergency Corridor', icon: Signal, status: 'pending' },
  ]);
  const [nearbySignals, setNearbySignals] = useState(0);
  const [clearedSignals, setClearedSignals] = useState(0);

  const handleSOSClick = () => {
    setIsOpen(true);
    setAlertPhase('idle');
    setProgress(0);
    setAlertSteps(steps => steps.map(s => ({ ...s, status: 'pending' })));
    setNearbySignals(0);
    setClearedSignals(0);
  };

  const handleSendAlert = () => {
    setAlertPhase('sending');
    
    // Simulate progressive alert steps
    const simulateStep = (index: number) => {
      if (index >= alertSteps.length) {
        setAlertPhase('active');
        setProgress(100);
        toast({
          title: "🚨 Emergency Corridor Active",
          description: "Traffic clearance in progress. Signals ahead are being coordinated.",
        });
        return;
      }

      setAlertSteps(steps => 
        steps.map((s, i) => ({
          ...s,
          status: i < index ? 'completed' : i === index ? 'active' : 'pending'
        }))
      );
      setProgress((index + 1) * 25);

      // Simulate signal detection and clearing
      if (index === 1) {
        setNearbySignals(Math.floor(Math.random() * 3) + 4); // 4-6 signals
      }
      if (index === 3) {
        setClearedSignals(nearbySignals || 5);
      }

      setTimeout(() => {
        setAlertSteps(steps => 
          steps.map((s, i) => ({
            ...s,
            status: i <= index ? 'completed' : s.status
          }))
        );
        simulateStep(index + 1);
      }, 800);
    };

    simulateStep(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setAlertPhase('idle');
  };

  const buttonSizeClass = {
    compact: 'h-10 px-4 text-sm',
    default: 'h-12 px-6',
    large: 'h-14 px-8 text-lg',
  }[variant];

  return (
    <>
      <Button
        onClick={handleSOSClick}
        className={`bg-emergency hover:bg-emergency/90 text-emergency-foreground font-bold shadow-lg relative overflow-hidden group ${buttonSizeClass} ${className}`}
        size="lg"
      >
        {/* Animated pulse rings */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="absolute w-full h-full rounded-md bg-emergency-foreground/10 animate-ping" />
        </span>
        <span className="relative flex items-center gap-2">
          <Siren className={`${variant === 'large' ? 'w-6 h-6' : 'w-5 h-5'} animate-pulse`} />
          <span>SOS - Traffic Alert</span>
        </span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emergency">
              <AlertTriangle className="w-5 h-5" />
              Emergency Traffic Clearance
            </DialogTitle>
            <DialogDescription>
              {alertPhase === 'idle' && 'Alert traffic control to clear the path for your emergency vehicle.'}
              {alertPhase === 'sending' && 'Activating emergency protocols...'}
              {alertPhase === 'active' && 'Emergency corridor is now active!'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {alertPhase === 'idle' && (
              <>
                {/* Vehicle Info */}
                <div className="p-4 bg-emergency/5 border border-emergency/20 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Vehicle</span>
                    <Badge variant={vehicleType === 'ambulance' ? 'destructive' : 'secondary'}>
                      {vehicleRegistration}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="font-mono text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Alert Radius</span>
                    <span className="text-sm font-medium">500 meters</span>
                  </div>
                </div>

                {/* What happens */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">This emergency alert will:</p>
                  <div className="grid gap-2">
                    {[
                      { icon: Shield, text: 'Alert Police Control Room', color: 'text-primary' },
                      { icon: TrafficCone, text: 'Turn traffic signals green on your route', color: 'text-success' },
                      { icon: Wifi, text: 'Broadcast to nearby vehicles', color: 'text-warning' },
                      { icon: Users, text: 'Request traffic personnel assistance', color: 'text-medical' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                        <item.icon className={`w-4 h-4 ${item.color} shrink-0`} />
                        <span className="text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button 
                    className="w-full h-12 bg-emergency hover:bg-emergency/90 text-emergency-foreground text-lg font-bold"
                    onClick={handleSendAlert}
                  >
                    <Radio className="w-5 h-5 mr-2 animate-pulse" />
                    SEND EMERGENCY ALERT
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}

            {alertPhase === 'sending' && (
              <div className="space-y-4">
                <Progress value={progress} className="h-2" />
                
                <div className="space-y-3">
                  {alertSteps.map((step) => (
                    <div 
                      key={step.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        step.status === 'completed' ? 'bg-success/10' :
                        step.status === 'active' ? 'bg-primary/10 border border-primary/30' :
                        'bg-muted/50 opacity-50'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-success shrink-0" />
                      ) : step.status === 'active' ? (
                        <Loader2 className="w-5 h-5 text-primary shrink-0 animate-spin" />
                      ) : (
                        <step.icon className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                      <span className={`text-sm ${step.status === 'active' ? 'font-medium' : ''}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {alertPhase === 'active' && (
              <>
                {/* Success State */}
                <div className="text-center py-2">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center relative">
                    <CheckCircle className="w-10 h-10 text-success" />
                    <span className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Emergency Corridor Active!</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Traffic control is coordinating your route. Drive carefully.
                  </p>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-success/10 rounded-lg text-center">
                    <p className="text-2xl font-bold text-success">{clearedSignals}</p>
                    <p className="text-xs text-muted-foreground">Signals Coordinated</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">~2-3</p>
                    <p className="text-xs text-muted-foreground">Minutes Response</p>
                  </div>
                </div>

                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm text-center">
                    <strong className="text-warning">⚠️ Keep emergency lights ON</strong>
                    <br />
                    <span className="text-muted-foreground text-xs">Other vehicles are being notified</span>
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground pt-2">
                  <Phone className="w-4 h-4" />
                  <span>Police Control: <strong className="text-foreground">100</strong></span>
                  <span className="text-border">|</span>
                  <span>Ambulance: <strong className="text-foreground">108</strong></span>
                </div>

                <Button 
                  className="w-full"
                  onClick={handleClose}
                >
                  Done
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedSOSButton;
