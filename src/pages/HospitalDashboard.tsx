import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { getHospitalById } from '@/data/demoData';
import { 
  Ambulance as AmbulanceIcon, 
  Car, 
  CheckCircle,
  Clock,
  User,
  Phone,
  Building2,
  UserCheck
} from 'lucide-react';

const HospitalDashboard = () => {
  const { ambulances, tempVehicles, hospitals, selectedHospitalId, selectHospital, updateAmbulance, updateTempVehicle } = useApp();

  const currentHospital = selectedHospitalId ? getHospitalById(selectedHospitalId) : hospitals[0];

  // Filter vehicles heading to this hospital
  const incomingAmbulances = ambulances.filter(
    a => a.status === 'active' && a.destinationHospitalId === currentHospital?.id
  );
  const incomingTempVehicles = tempVehicles.filter(
    v => v.status === 'active' && v.destinationHospitalId === currentHospital?.id
  );
  const allIncoming = [...incomingAmbulances, ...incomingTempVehicles];

  const handleMarkReceived = (vehicleId: string, type: 'ambulance' | 'temporary') => {
    if (type === 'ambulance') {
      updateAmbulance(vehicleId, { status: 'completed', patientStatus: 'received' });
    } else {
      updateTempVehicle(vehicleId, { status: 'completed' });
    }
  };

  if (!currentHospital) {
    return <div>No hospital selected</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader 
        title="Hospital Dashboard"
        subtitle={currentHospital.name}
      />

      {/* Hospital Selector */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-4 max-w-md">
          <Building2 className="w-5 h-5 text-muted-foreground shrink-0" />
          <Select value={currentHospital.id} onValueChange={selectHospital}>
            <SelectTrigger>
              <SelectValue placeholder="Select hospital" />
            </SelectTrigger>
            <SelectContent>
              {hospitals.map(hospital => (
                <SelectItem key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hospital Info */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="outline" className="text-sm">
            <Building2 className="w-3 h-3 mr-1" />
            {currentHospital.address}
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Phone className="w-3 h-3 mr-1" />
            {currentHospital.emergencyContact}
          </Badge>
          <Badge 
            variant={
              currentHospital.availability === 'available' ? 'default' :
              currentHospital.availability === 'busy' ? 'secondary' : 'destructive'
            }
          >
            {currentHospital.beds} Emergency Beds Available
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emergency/10 flex items-center justify-center">
                  <AmbulanceIcon className="w-5 h-5 text-emergency" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{incomingAmbulances.length}</p>
                  <p className="text-xs text-muted-foreground">Incoming Ambulances</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Car className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{incomingTempVehicles.length}</p>
                  <p className="text-xs text-muted-foreground">Temp Emergencies</p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2 sm:col-span-1">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{currentHospital.beds}</p>
                  <p className="text-xs text-muted-foreground">Beds Available</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Incoming Emergencies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Incoming Emergencies
                {allIncoming.length > 0 && (
                  <Badge variant="destructive" className="ml-2 animate-pulse">
                    {allIncoming.length} incoming
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allIncoming.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AmbulanceIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No incoming emergencies at this time</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingAmbulances.map(ambulance => (
                    <div 
                      key={ambulance.id}
                      className="p-4 rounded-lg border border-emergency/30 bg-emergency/5 animate-fade-in"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">
                              <AmbulanceIcon className="w-3 h-3 mr-1" />
                              AMBULANCE
                            </Badge>
                            <span className="font-bold">{ambulance.registrationNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{ambulance.driverName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{ambulance.driverContact}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={ambulance.patientStatus === 'registered' ? 'default' : 'secondary'}>
                              {ambulance.patientStatus === 'registered' ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Patient Registered
                                </>
                              ) : (
                                'Registration Pending'
                              )}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="flex items-center gap-2 text-lg font-bold text-primary">
                            <Clock className="w-5 h-5" />
                            <span>{ambulance.eta || '--'} min ETA</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-success hover:bg-success/90"
                            onClick={() => handleMarkReceived(ambulance.id, 'ambulance')}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Mark Received
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {incomingTempVehicles.map(vehicle => (
                    <div 
                      key={vehicle.id}
                      className="p-4 rounded-lg border border-warning/30 bg-warning/5 animate-fade-in"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-warning text-warning-foreground">
                              <Car className="w-3 h-3 mr-1" />
                              TEMP EMERGENCY
                            </Badge>
                            <span className="font-bold">{vehicle.registrationNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{vehicle.driverName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{vehicle.driverContact}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Reason: {vehicle.reason}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="flex items-center gap-2 text-lg font-bold text-warning">
                            <Clock className="w-5 h-5" />
                            <span>{vehicle.eta || '--'} min ETA</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-success hover:bg-success/90"
                            onClick={() => handleMarkReceived(vehicle.id, 'temporary')}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Mark Received
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
