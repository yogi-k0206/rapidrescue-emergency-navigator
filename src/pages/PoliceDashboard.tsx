import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/context/AppContext';
import DashboardHeader from '@/components/layout/DashboardHeader';
import EmergencyMap from '@/components/map/EmergencyMap';
import { getHospitalById } from '@/data/demoData';
import { 
  Ambulance as AmbulanceIcon, 
  Car, 
  CheckCircle,
  Clock,
  MapPin,
  Eye
} from 'lucide-react';

const PoliceDashboard = () => {
  const { ambulances, tempVehicles, hospitals } = useApp();
  const [selectedTab, setSelectedTab] = useState<'all' | 'ambulance' | 'temporary'>('all');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const activeAmbulances = ambulances.filter(a => a.status === 'active');
  const activeTempVehicles = tempVehicles.filter(v => v.status === 'active');
  const totalActive = activeAmbulances.length + activeTempVehicles.length;
  const completedToday = ambulances.filter(a => a.status === 'completed').length + 
    tempVehicles.filter(v => v.status === 'completed').length;

  // Combined vehicles for table
  const allVehicles = [
    ...activeAmbulances.map(a => ({
      id: a.id,
      type: 'ambulance' as const,
      registration: a.registrationNumber,
      driver: a.driverName,
      status: a.status,
      destination: a.destinationHospitalId ? getHospitalById(a.destinationHospitalId)?.name : 'Not assigned',
      eta: a.eta,
      lat: a.currentLat,
      lng: a.currentLng,
    })),
    ...activeTempVehicles.map(v => ({
      id: v.id,
      type: 'temporary' as const,
      registration: v.registrationNumber,
      driver: v.driverName,
      status: v.status,
      destination: getHospitalById(v.destinationHospitalId)?.name || 'Unknown',
      eta: v.eta,
      lat: v.currentLat,
      lng: v.currentLng,
    })),
  ];

  const filteredVehicles = selectedTab === 'all' 
    ? allVehicles 
    : allVehicles.filter(v => v.type === selectedTab);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader 
        title="Police Control Room"
        subtitle="Emergency Vehicle Monitoring"
      />

      {/* Stats Bar */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          <Card className="flex-1 min-w-[140px] max-w-[200px]">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emergency/10 flex items-center justify-center">
                <AmbulanceIcon className="w-5 h-5 text-emergency" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeAmbulances.length}</p>
                <p className="text-xs text-muted-foreground">Active Ambulances</p>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[140px] max-w-[200px]">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Car className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeTempVehicles.length}</p>
                <p className="text-xs text-muted-foreground">Temp Emergencies</p>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[140px] max-w-[200px]">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedToday}</p>
                <p className="text-xs text-muted-foreground">Resolved Today</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Table */}
        <div className="lg:w-1/2 xl:w-2/5 p-4 overflow-y-auto">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Live Tracking ({totalActive} active)</span>
                <Badge variant="outline" className="animate-pulse">
                  <span className="w-2 h-2 bg-success rounded-full mr-1" />
                  LIVE
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={v => setSelectedTab(v as typeof selectedTab)}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="ambulance" className="flex-1">Ambulances</TabsTrigger>
                  <TabsTrigger value="temporary" className="flex-1">Temp</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="mt-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Destination</TableHead>
                          <TableHead>ETA</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVehicles.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                              No active vehicles
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredVehicles.map(vehicle => (
                            <TableRow 
                              key={vehicle.id}
                              className={selectedVehicleId === vehicle.id ? 'bg-primary/5' : ''}
                            >
                              <TableCell>
                                <div className="font-medium text-sm">{vehicle.registration}</div>
                                <div className="text-xs text-muted-foreground">{vehicle.driver}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={vehicle.type === 'ambulance' ? 'destructive' : 'secondary'}>
                                  {vehicle.type === 'ambulance' ? (
                                    <AmbulanceIcon className="w-3 h-3 mr-1" />
                                  ) : (
                                    <Car className="w-3 h-3 mr-1" />
                                  )}
                                  {vehicle.type === 'ambulance' ? 'AMB' : 'TEMP'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  <span className="truncate max-w-[100px]">{vehicle.destination}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span>{vehicle.eta || '--'} min</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => setSelectedVehicleId(
                                    selectedVehicleId === vehicle.id ? null : vehicle.id
                                  )}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Map */}
        <div className="flex-1 p-4 min-h-[400px] lg:min-h-0">
          <div className="h-full rounded-lg overflow-hidden border border-border">
            <EmergencyMap
              hospitals={hospitals}
              ambulances={activeAmbulances}
              tempVehicles={activeTempVehicles}
              selectedAmbulanceId={selectedVehicleId}
              showRoute={!!selectedVehicleId}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-card border-t border-border px-4 py-2 text-center text-sm text-muted-foreground">
        <span className="flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" />
          Read-only monitoring view • Data updates every 5 seconds
        </span>
      </div>
    </div>
  );
};

export default PoliceDashboard;
