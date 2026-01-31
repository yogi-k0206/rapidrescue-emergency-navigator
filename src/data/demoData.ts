import { Hospital, Ambulance, TemporaryEmergencyVehicle, RoutePoint } from './types';

// Bangalore coordinates center
export const BANGALORE_CENTER = {
  lat: 12.9716,
  lng: 77.5946,
};

// 5 Sample Hospitals in Bangalore
export const hospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'Manipal Hospital',
    address: 'Old Airport Road, Bangalore',
    lat: 12.9592,
    lng: 77.6480,
    availability: 'available',
    beds: 24,
    emergencyContact: '+91 80 2502 4444',
  },
  {
    id: 'h2',
    name: "St. John's Medical College Hospital",
    address: 'Sarjapur Road, Bangalore',
    lat: 12.9279,
    lng: 77.6271,
    availability: 'available',
    beds: 18,
    emergencyContact: '+91 80 2206 5000',
  },
  {
    id: 'h3',
    name: 'Apollo Hospital',
    address: 'Bannerghatta Road, Bangalore',
    lat: 12.8958,
    lng: 77.5997,
    availability: 'busy',
    beds: 8,
    emergencyContact: '+91 80 2630 4050',
  },
  {
    id: 'h4',
    name: 'Fortis Hospital',
    address: 'Cunningham Road, Bangalore',
    lat: 12.9857,
    lng: 77.5895,
    availability: 'available',
    beds: 32,
    emergencyContact: '+91 80 6621 4444',
  },
  {
    id: 'h5',
    name: 'Narayana Health City',
    address: 'Bommasandra, Bangalore',
    lat: 12.8196,
    lng: 77.6810,
    availability: 'available',
    beds: 45,
    emergencyContact: '+91 80 7122 2222',
  },
];

// Generate a simple route between two points with traffic simulation
const generateRoute = (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): RoutePoint[] => {
  const points: RoutePoint[] = [];
  const steps = 10;
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const lat = startLat + (endLat - startLat) * progress;
    const lng = startLng + (endLng - startLng) * progress;
    
    // Simulate traffic levels
    let trafficLevel: 'clear' | 'moderate' | 'heavy';
    if (i >= 3 && i <= 5) {
      trafficLevel = 'moderate';
    } else if (i === 6) {
      trafficLevel = 'heavy';
    } else {
      trafficLevel = 'clear';
    }
    
    points.push({ lat, lng, trafficLevel });
  }
  
  return points;
};

// 3 Sample Ambulances
export const ambulances: Ambulance[] = [
  {
    id: 'a1',
    registrationNumber: 'KA-01-AB-1234',
    driverName: 'Rajesh Kumar',
    driverContact: '+91 98765 43210',
    vehicleType: 'advanced',
    status: 'active',
    currentLat: 12.9716,
    currentLng: 77.6412, // Indiranagar area
    destinationHospitalId: 'h1',
    patientStatus: 'registered',
    eta: 8,
    route: generateRoute(12.9716, 77.6412, 12.9592, 77.6480),
  },
  {
    id: 'a2',
    registrationNumber: 'KA-02-CD-5678',
    driverName: 'Suresh Reddy',
    driverContact: '+91 98765 43211',
    vehicleType: 'basic',
    status: 'standby',
    currentLat: 12.9352,
    currentLng: 77.6245, // Koramangala area
    destinationHospitalId: null,
    patientStatus: 'pending',
    eta: undefined,
    route: [],
  },
  {
    id: 'a3',
    registrationNumber: 'KA-03-EF-9012',
    driverName: 'Mohammed Ali',
    driverContact: '+91 98765 43212',
    vehicleType: 'icu',
    status: 'active',
    currentLat: 12.9121,
    currentLng: 77.6446, // HSR Layout area
    destinationHospitalId: 'h3',
    patientStatus: 'pending',
    eta: 12,
    route: generateRoute(12.9121, 77.6446, 12.8958, 77.5997),
  },
];

// 1 Sample Temporary Emergency Vehicle
export const temporaryEmergencyVehicles: TemporaryEmergencyVehicle[] = [
  {
    id: 't1',
    registrationNumber: 'KA-05-CD-5678',
    vehicleType: 'Auto-rickshaw',
    driverName: 'Venkatesh Gowda',
    driverContact: '+91 98765 43213',
    reason: 'Ambulance unavailable - Critical patient',
    status: 'active',
    currentLat: 12.9352,
    currentLng: 77.6245, // Koramangala
    destinationHospitalId: 'h2',
    approvedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
    expiresAt: new Date(Date.now() + 20 * 60 * 1000), // 20 mins from now
    eta: 12,
  },
];

// Emergency reasons for temporary vehicle mode
export const emergencyReasons = [
  'Ambulance unavailable in area',
  'Critical medical emergency',
  'Multiple casualty incident',
  'Remote location - no ambulance access',
  'Ambulance breakdown during transport',
];

// Helper to get hospital by ID
export const getHospitalById = (id: string): Hospital | undefined => {
  return hospitals.find(h => h.id === id);
};

// Helper to calculate distance (simplified Haversine)
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper to estimate ETA (simplified)
export const estimateETA = (distanceKm: number): number => {
  // Assume average speed of 30 km/h in city traffic
  return Math.round((distanceKm / 30) * 60);
};
