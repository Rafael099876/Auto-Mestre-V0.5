
export interface User {
  username: string;
  email: string;
  password?: string; // Only present during registration
}

export interface Vehicle {
  id: string;
  year: number;
  brand: string;
  model: string;
  image?: string; // base64 string
}

export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  name: string;
  date: string; // YYYY-MM-DD
  completedSteps?: number;
  totalSteps?: number;
}

export interface MaintenanceGuide {
  tools: string[];
  steps: { title: string; description: string }[];
}
