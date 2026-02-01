import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import DashboardHeader from '@/components/layout/DashboardHeader';
import EmergencyMap from '@/components/map/EmergencyMap';
import SOSButton from '@/components/sos/SOSButton';
import RouteComparisonPanel from '@/components/route/RouteComparisonPanel';
import { getHospitalById } from '@/data/demoData';
import { 
  Phone, 
  MapPin, 
  Clock, 
  User, 
  Truck,
  Navigation,
  Radio,
  CheckCircle,
  AlertCircle,
  Building2
} from 'lucide-react';

const AmbulanceDashboard = () => {
  const { ambulances, hospitals, selectedAmbulanceId, selectAmbulance, updateAmbulance } = useApp();
  const [selectedRouteId, setSelectedRouteId] = useState('route1');
  
  const currentAmbulance = ambulances.find(a => a.id === selectedAmbulanceId) || ambulances[0];
  const destinationHospital = currentAmbulance?.destinationHospitalId 
    ? getHospitalById(currentAmbulance.destinationHospitalId) 
    : null;

  // Generate route options based on destination
  const routeOptions = destinationHospital ? [
    {
      id: 'route1',
      name: 'Via Old Airport Road',
      distance: destinationHospital.distance || 5.2,
      eta: 8,
      trafficLevel: 'clear' as const,
      isRecommended: true,
    },
    {
      id: 'route2',
      name: 'Via Indiranagar',
      distance: (destinationHospital.distance || 5.2) + 1.5,
      eta: 12,
      trafficLevel: 'moderate' as const,
    },
    {
      id: 'route3',
      name: 'Via Koramangala',
      distance: (destinationHospital.distance || 5.2) + 2.8,
      eta: 18,
      trafficLevel: 'heavy' as const,
    },
  ] : [];

  const handleStatusToggle = () => {
    if (!currentAmbulance) return;
    const newStatus = currentAmbulance.status === 'active' ? 'standby' : 'active';
    updateAmbulance(currentAmbulance.id, { status: newStatus });
  };

  const handlePatientStatusToggle = () => {
    if (!currentAmbulance) return;
    const newStatus = currentAmbulance.patientStatus === 'registered' ? 'pending' : 'registered';
    updateAmbulance(currentAmbulance.id, { patientStatus: newStatus });
  };

  const handleHospitalChange = (hospitalId: string) => {
    if (!currentAmbulance) return;
    updateAmbulance(currentAmbulance.id, { destinationHospitalId: hospitalId });
  };

  if (!currentAmbulance) {
    return <div>No ambulance selected</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader 
        title={currentAmbulance.registrationNumber}
        subtitle="Ambulance Dashboard"
      />

      {/* Status Bar */}
      <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge 
            variant={currentAmbulance.status === 'active' ? 'destructive' : 'secondary'}
            className="animate-pulse"
          >
            {currentAmbulance.status === 'active' ? '🚨 ACTIVE' : '⏸️ STANDBY'}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {currentAmbulance.vehicleType.toUpperCase()} Life Support
          </span>
        </div>
        <Button 
          size="sm" 
          variant={currentAmbulance.status === 'active' ? 'outline' : 'destructive'}
          onClick={handleStatusToggle}
        >
          {currentAmbulance.status === 'active' ? 'Go Standby' : 'Go Active'}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel - Details */}
        <div className="lg:w-96 p-4 space-y-4 overflow-y-auto">
          {/* Ambulance Selector */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Select Ambulance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={currentAmbulance.id} onValueChange={selectAmbulance}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ambulance" />
                </SelectTrigger>
                <SelectContent>
                  {ambulances.map(amb => (
                    <SelectItem key={amb.id} value={amb.id}>
                      {amb.registrationNumber} - {amb.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Ambulance Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Ambulance Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{currentAmbulance.driverName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{currentAmbulance.driverContact}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <span className="capitalize">{currentAmbulance.vehicleType} Life Support</span>
              </div>
            </CardContent>
          </Card>

          {/* Destination Hospital */}
          <Card className={destinationHospital ? 'border-primary/50' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Destination Hospital
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select 
                value={currentAmbulance.destinationHospitalId || ''} 
                onValueChange={handleHospitalChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map(hospital => (
                    <SelectItem key={hospital.id} value={hospital.id}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          hospital.availability === 'available' ? 'bg-success' :
                          hospital.availability === 'busy' ? 'bg-warning' : 'bg-destructive'
                        }`} />
                        {hospital.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {destinationHospital && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{destinationHospital.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{destinationHospital.emergencyContact}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-bold text-primary">{currentAmbulance.eta || '--'} min ETA</span>
                    </div>
                    <Badge variant={
                      destinationHospital.availability === 'available' ? 'default' :
                      destinationHospital.availability === 'busy' ? 'secondary' : 'destructive'
                    }>
                      {destinationHospital.beds} beds
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Patient Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                Patient Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant={currentAmbulance.patientStatus === 'registered' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={handlePatientStatusToggle}
              >
                {currentAmbulance.patientStatus === 'registered' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-success" />
                    Patient Registered at Hospital
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2 text-warning" />
                    Registration Pending
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Route Options */}
          {routeOptions.length > 0 && (
            <RouteComparisonPanel
              routes={routeOptions}
              selectedRouteId={selectedRouteId}
              onSelectRoute={setSelectedRouteId}
            />
          )}
        </div>

        {/* Right Panel - Map */}
        <div className="flex-1 p-4 min-h-[400px] lg:min-h-0">
          <div className="h-full rounded-lg overflow-hidden border border-border">
            <EmergencyMap
              hospitals={hospitals}
              ambulances={ambulances}
              selectedAmbulanceId={currentAmbulance.id}
              showRoute={currentAmbulance.status === 'active'}
              centerOn={{ lat: currentAmbulance.currentLat, lng: currentAmbulance.currentLng }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-card border-t border-border p-4 flex flex-wrap items-center gap-3">
        <Button 
          className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
          disabled={!destinationHospital || currentAmbulance.status !== 'active'}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Start Navigation
        </Button>
        
        {/* SOS Button for Traffic Clearance */}
        {currentAmbulance.status === 'active' && (
          <SOSButton
            vehicleId={currentAmbulance.id}
            vehicleRegistration={currentAmbulance.registrationNumber}
            vehicleType="ambulance"
            currentLocation={{ lat: currentAmbulance.currentLat, lng: currentAmbulance.currentLng }}
          />
        )}
        
        <Button 
          variant="outline" 
          className="flex-1 sm:flex-none border-primary text-primary hover:bg-primary/10"
        >
          <Radio className="w-4 h-4 mr-2" />
          Emergency Broadcast
        </Button>
      </div>
    </div>
  );
};

export default AmbulanceDashboard;
