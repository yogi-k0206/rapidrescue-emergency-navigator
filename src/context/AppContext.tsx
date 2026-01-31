import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, Ambulance, TemporaryEmergencyVehicle, Hospital } from '@/data/types';
import { ambulances as initialAmbulances, temporaryEmergencyVehicles as initialTempVehicles, hospitals } from '@/data/demoData';

interface AppState {
  currentRole: UserRole | null;
  selectedAmbulanceId: string | null;
  ambulances: Ambulance[];
  tempVehicles: TemporaryEmergencyVehicle[];
  hospitals: Hospital[];
  selectedHospitalId: string | null;
}

interface AppContextType extends AppState {
  setRole: (role: UserRole | null) => void;
  selectAmbulance: (id: string) => void;
  updateAmbulance: (id: string, updates: Partial<Ambulance>) => void;
  addTempVehicle: (vehicle: TemporaryEmergencyVehicle) => void;
  updateTempVehicle: (id: string, updates: Partial<TemporaryEmergencyVehicle>) => void;
  selectHospital: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    currentRole: null,
    selectedAmbulanceId: 'a1', // Default to first ambulance
    ambulances: initialAmbulances,
    tempVehicles: initialTempVehicles,
    hospitals: hospitals,
    selectedHospitalId: 'h1', // Default to Manipal Hospital for hospital view
  });

  const setRole = (role: UserRole | null) => {
    setState(prev => ({ ...prev, currentRole: role }));
  };

  const selectAmbulance = (id: string) => {
    setState(prev => ({ ...prev, selectedAmbulanceId: id }));
  };

  const updateAmbulance = (id: string, updates: Partial<Ambulance>) => {
    setState(prev => ({
      ...prev,
      ambulances: prev.ambulances.map(a => 
        a.id === id ? { ...a, ...updates } : a
      ),
    }));
  };

  const addTempVehicle = (vehicle: TemporaryEmergencyVehicle) => {
    setState(prev => ({
      ...prev,
      tempVehicles: [...prev.tempVehicles, vehicle],
    }));
  };

  const updateTempVehicle = (id: string, updates: Partial<TemporaryEmergencyVehicle>) => {
    setState(prev => ({
      ...prev,
      tempVehicles: prev.tempVehicles.map(v => 
        v.id === id ? { ...v, ...updates } : v
      ),
    }));
  };

  const selectHospital = (id: string | null) => {
    setState(prev => ({ ...prev, selectedHospitalId: id }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setRole,
        selectAmbulance,
        updateAmbulance,
        addTempVehicle,
        updateTempVehicle,
        selectHospital,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
