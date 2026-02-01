// Demo user database for temporary emergency vehicle registration
// In production, this would be fetched from a backend database

export interface DemoUser {
  email: string;
  fullName: string;
  phone: string;
  vehicleRegistration: string;
  vehicleType: string;
  aadhaarLast4?: string;
  licenseNumber?: string;
}

export const demoUsers: DemoUser[] = [
  {
    email: 'ravi.kumar@gmail.com',
    fullName: 'Ravi Kumar',
    phone: '+91 98765 43210',
    vehicleRegistration: 'KA-05-AB-1234',
    vehicleType: 'Auto-rickshaw',
    aadhaarLast4: '4521',
    licenseNumber: 'KA0320190012345',
  },
  {
    email: 'priya.sharma@gmail.com',
    fullName: 'Priya Sharma',
    phone: '+91 87654 32109',
    vehicleRegistration: 'KA-01-CD-5678',
    vehicleType: 'Car',
    aadhaarLast4: '7892',
    licenseNumber: 'KA0120180054321',
  },
  {
    email: 'arun.naidu@yahoo.com',
    fullName: 'Arun Naidu',
    phone: '+91 76543 21098',
    vehicleRegistration: 'KA-03-EF-9012',
    vehicleType: 'Two-wheeler',
    aadhaarLast4: '3456',
    licenseNumber: 'KA0320170098765',
  },
  {
    email: 'meena.reddy@outlook.com',
    fullName: 'Meena Reddy',
    phone: '+91 65432 10987',
    vehicleRegistration: 'KA-02-GH-3456',
    vehicleType: 'Van',
    aadhaarLast4: '6789',
    licenseNumber: 'KA0220160076543',
  },
];

export const findUserByEmail = (email: string): DemoUser | undefined => {
  return demoUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
};
