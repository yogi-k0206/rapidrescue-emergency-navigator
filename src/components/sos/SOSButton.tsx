import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Phone, Radio, CheckCircle, Siren, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SOSButtonProps {
  vehicleId: string;
  vehicleRegistration: string;
  vehicleType: 'ambulance' | 'temporary';
  currentLocation: { lat: number; lng: number };
  className?: string;
}

const SOSButton = ({ 
  vehicleId, 
  vehicleRegistration, 
  vehicleType, 
  currentLocation,
  className = '' 
}: SOSButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertSending, setIsAlertSending] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const handleSOSClick = () => {
    setIsOpen(true);
    setAlertSent(false);
  };

  const handleSendAlert = () => {
    setIsAlertSending(true);
    
    // Simulate sending alert to police and nearby signals
    setTimeout(() => {
      setIsAlertSending(false);
      setAlertSent(true);
      
      toast({
        title: "🚨 Traffic Clearance Alert Sent",
        description: "Police control room and nearby traffic signals have been notified. Help is on the way!",
      });
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setAlertSent(false);
  };

  return (
    <>
      <Button
        onClick={handleSOSClick}
        className={`bg-emergency hover:bg-emergency/90 text-emergency-foreground font-bold shadow-lg emergency-pulse ${className}`}
        size="lg"
      >
        <Siren className="w-5 h-5 mr-2" />
        SOS - Traffic Alert
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emergency">
              <AlertTriangle className="w-5 h-5" />
              Emergency Traffic Clearance
            </DialogTitle>
            <DialogDescription>
              Alert traffic control to clear the path for your emergency vehicle.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!alertSent ? (
              <>
                {/* Vehicle Info */}
                <div className="p-3 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vehicle</span>
                    <Badge variant={vehicleType === 'ambulance' ? 'destructive' : 'secondary'}>
                      {vehicleRegistration}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-mono text-xs">
                      {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* What happens */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">This will:</p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success shrink-0" />
                      Alert Police Control Room
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success shrink-0" />
                      Notify nearby traffic signals
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success shrink-0" />
                      Request traffic clearance on your route
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success shrink-0" />
                      Broadcast emergency to nearby vehicles
                    </li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button 
                    className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground"
                    onClick={handleSendAlert}
                    disabled={isAlertSending}
                  >
                    {isAlertSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending Alert...
                      </>
                    ) : (
                      <>
                        <Radio className="w-4 h-4 mr-2" />
                        Send Traffic Clearance Alert
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleClose}
                    disabled={isAlertSending}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Alert Sent Successfully!</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Traffic control has been notified. Signals ahead will be adjusted for your route.
                  </p>
                  
                  <div className="p-3 bg-primary/10 rounded-lg text-sm mb-4">
                    <p className="font-medium text-primary">Emergency Response ETA: ~2-3 minutes</p>
                    <p className="text-muted-foreground">Traffic signals ahead are being coordinated</p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>Police Control: 100</span>
                  </div>
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

export default SOSButton;
