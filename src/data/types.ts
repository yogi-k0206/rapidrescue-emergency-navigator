export type UserRole = 'ambulance' | 'temporary' | 'police' | 'hospital';

export type EmergencyStatus = 'active' | 'standby' | 'completed';

export type PatientStatus = 'registered' | 'pending' | 'received';

export type TrafficLevel = 'clear' | 'moderate' | 'heavy';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
  eta?: number;
  availability: 'available' | 'busy' | 'full';
  beds: number;
  emergencyContact: string;
}

export interface Ambulance {
  id: string;
  registrationNumber: string;
  driverName: string;
  driverContact: string;
  vehicleType: 'basic' | 'advanced' | 'icu';
  status: EmergencyStatus;
  currentLat: number;
  currentLng: number;
  destinationHospitalId: string | null;
  patientStatus: PatientStatus;
  eta?: number;
  route?: RoutePoint[];
}

export interface TemporaryEmergencyVehicle {
  id: string;
  registrationNumber: string;
  vehicleType: string;
  driverName: string;
  driverContact: string;
  reason: string;
  status: 'pending' | 'approved' | 'active' | 'completed';
  currentLat: number;
  currentLng: number;
  destinationHospitalId: string;
  approvedAt?: Date;
  expiresAt?: Date;
  eta?: number;
}

export interface RoutePoint {
  lat: number;
  lng: number;
  trafficLevel: TrafficLevel;
}

export interface EmergencyRequest {
  vehicleRegistration: string;
  vehicleType: string;
  driverName: string;
  driverContact: string;
  reason: string;
  nearestHospitalId: string;
}
