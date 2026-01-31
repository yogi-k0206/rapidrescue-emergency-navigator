import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hospital, Ambulance, TemporaryEmergencyVehicle, RoutePoint } from '@/data/types';
import { BANGALORE_CENTER } from '@/data/demoData';

// Fix default marker icon issue in Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createIcon = (emoji: string, className: string = '') => {
  return L.divIcon({
    html: `<div class="flex items-center justify-center w-10 h-10 rounded-full bg-card shadow-lg border-2 border-card text-xl ${className}">${emoji}</div>`,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const ambulanceIcon = L.divIcon({
  html: `<div class="flex items-center justify-center w-10 h-10 rounded-full bg-emergency shadow-lg border-2 border-emergency-foreground emergency-pulse">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/><path d="M8 8v4"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
  </div>`,
  className: 'ambulance-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const tempVehicleIcon = L.divIcon({
  html: `<div class="flex items-center justify-center w-10 h-10 rounded-full bg-warning shadow-lg border-2 border-warning-foreground">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
  </div>`,
  className: 'temp-vehicle-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const getHospitalIcon = (availability: 'available' | 'busy' | 'full') => {
  const colors = {
    available: 'bg-success border-success',
    busy: 'bg-warning border-warning',
    full: 'bg-destructive border-destructive',
  };
  
  return L.divIcon({
    html: `<div class="flex items-center justify-center w-9 h-9 rounded-lg ${colors[availability]} shadow-lg border-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/></svg>
    </div>`,
    className: 'hospital-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

interface EmergencyMapProps {
  hospitals: Hospital[];
  ambulances?: Ambulance[];
  tempVehicles?: TemporaryEmergencyVehicle[];
  selectedAmbulanceId?: string | null;
  showRoute?: boolean;
  centerOn?: { lat: number; lng: number };
  onHospitalClick?: (hospital: Hospital) => void;
  onAmbulanceClick?: (ambulance: Ambulance) => void;
  className?: string;
}

const EmergencyMap = ({
  hospitals,
  ambulances = [],
  tempVehicles = [],
  selectedAmbulanceId,
  showRoute = true,
  centerOn,
  onHospitalClick,
  onAmbulanceClick,
  className = '',
}: EmergencyMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [centerOn?.lat || BANGALORE_CENTER.lat, centerOn?.lng || BANGALORE_CENTER.lng],
      zoom: 13,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create route layer group
    routeLayerRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers and routes
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    
    // Clear existing markers (except base tile layer and route layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add hospital markers
    hospitals.forEach((hospital) => {
      const marker = L.marker([hospital.lat, hospital.lng], {
        icon: getHospitalIcon(hospital.availability),
      }).addTo(map);
      
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${hospital.name}</h3>
          <p class="text-xs text-gray-600">${hospital.address}</p>
          <p class="text-xs mt-1">
            <span class="inline-block px-2 py-0.5 rounded text-white text-xs ${
              hospital.availability === 'available' ? 'bg-green-500' :
              hospital.availability === 'busy' ? 'bg-amber-500' : 'bg-red-500'
            }">
              ${hospital.beds} beds ${hospital.availability}
            </span>
          </p>
        </div>
      `);

      if (onHospitalClick) {
        marker.on('click', () => onHospitalClick(hospital));
      }
    });

    // Add ambulance markers
    ambulances.forEach((ambulance) => {
      const marker = L.marker([ambulance.currentLat, ambulance.currentLng], {
        icon: ambulanceIcon,
      }).addTo(map);
      
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${ambulance.registrationNumber}</h3>
          <p class="text-xs text-gray-600">Driver: ${ambulance.driverName}</p>
          <p class="text-xs">Status: <span class="font-medium ${
            ambulance.status === 'active' ? 'text-red-600' : 'text-gray-600'
          }">${ambulance.status.toUpperCase()}</span></p>
          ${ambulance.eta ? `<p class="text-xs">ETA: ${ambulance.eta} min</p>` : ''}
        </div>
      `);

      if (onAmbulanceClick) {
        marker.on('click', () => onAmbulanceClick(ambulance));
      }
    });

    // Add temporary emergency vehicle markers
    tempVehicles.forEach((vehicle) => {
      const marker = L.marker([vehicle.currentLat, vehicle.currentLng], {
        icon: tempVehicleIcon,
      }).addTo(map);
      
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${vehicle.registrationNumber}</h3>
          <p class="text-xs text-gray-600">${vehicle.vehicleType}</p>
          <p class="text-xs">Status: <span class="font-medium text-amber-600">TEMP EMERGENCY</span></p>
          ${vehicle.eta ? `<p class="text-xs">ETA: ${vehicle.eta} min</p>` : ''}
        </div>
      `);
    });

  }, [hospitals, ambulances, tempVehicles, onHospitalClick, onAmbulanceClick]);

  // Draw route for selected ambulance
  useEffect(() => {
    if (!mapRef.current || !routeLayerRef.current) return;

    // Clear existing routes
    routeLayerRef.current.clearLayers();

    if (!showRoute || !selectedAmbulanceId) return;

    const selectedAmbulance = ambulances.find(a => a.id === selectedAmbulanceId);
    if (!selectedAmbulance?.route?.length) return;

    // Draw route segments with traffic colors
    const route = selectedAmbulance.route;
    for (let i = 0; i < route.length - 1; i++) {
      const start = route[i];
      const end = route[i + 1];
      
      const color = 
        start.trafficLevel === 'heavy' ? '#DC2626' :
        start.trafficLevel === 'moderate' ? '#F59E0B' : '#16A34A';
      
      const polyline = L.polyline(
        [[start.lat, start.lng], [end.lat, end.lng]],
        { color, weight: 5, opacity: 0.8 }
      );
      
      routeLayerRef.current?.addLayer(polyline);
    }

    // Fit map to show route
    const bounds = L.latLngBounds(route.map(p => [p.lat, p.lng]));
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });

  }, [selectedAmbulanceId, ambulances, showRoute]);

  // Center map when centerOn changes
  useEffect(() => {
    if (!mapRef.current || !centerOn) return;
    mapRef.current.setView([centerOn.lat, centerOn.lng], 14);
  }, [centerOn]);

  return (
    <div ref={mapContainerRef} className={`w-full h-full min-h-[300px] rounded-lg ${className}`} />
  );
};

export default EmergencyMap;
