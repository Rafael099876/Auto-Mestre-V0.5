
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Vehicle, MaintenanceTask } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  vehicles: Vehicle[];
  tasks: { [vehicleId: string]: MaintenanceTask[] };
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  removeVehicle: (vehicleId: string) => void;
  updateVehicleImage: (vehicleId: string, image: string) => void;
  addTask: (task: Omit<MaintenanceTask, 'id'>) => void;
  removeTask: (vehicleId: string, taskId: string) => void;
  updateTaskProgress: (vehicleId: string, taskId: string, completedSteps: number, totalSteps: number) => void;
  getVehicleById: (vehicleId: string) => Vehicle | undefined;
  getTaskById: (vehicleId: string, taskId: string) => MaintenanceTask | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};


export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userKey = user?.email || 'guest';
  
  const [allVehicles, setAllVehicles] = useLocalStorage<{ [email: string]: Vehicle[] }>('vehicles', {});
  const [allTasks, setAllTasks] = useLocalStorage<{ [vehicleId: string]: MaintenanceTask[] }>('tasks', {});

  const vehicles = allVehicles[userKey] || [];
  const tasks = Object.keys(allTasks)
    .filter(vehicleId => vehicles.some(v => v.id === vehicleId))
    .reduce((acc, vehicleId) => {
        acc[vehicleId] = allTasks[vehicleId];
        return acc;
    }, {} as { [vehicleId: string]: MaintenanceTask[] });


  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle = { ...vehicle, id: crypto.randomUUID() };
    const userVehicles = allVehicles[userKey] || [];
    setAllVehicles({ ...allVehicles, [userKey]: [...userVehicles, newVehicle] });
  };

  const removeVehicle = (vehicleId: string) => {
    const updatedVehicles = vehicles.filter((v) => v.id !== vehicleId);
    setAllVehicles({ ...allVehicles, [userKey]: updatedVehicles });
    const { [vehicleId]: _, ...remainingTasks } = allTasks;
    setAllTasks(remainingTasks);
  };
  
  const updateVehicleImage = (vehicleId: string, image: string) => {
    const updatedVehicles = vehicles.map(v => v.id === vehicleId ? {...v, image} : v);
    setAllVehicles({ ...allVehicles, [userKey]: updatedVehicles });
  };

  const addTask = (task: Omit<MaintenanceTask, 'id'>) => {
    const newTask = { ...task, id: crypto.randomUUID() };
    const vehicleTasks = allTasks[task.vehicleId] || [];
    setAllTasks({ ...allTasks, [task.vehicleId]: [...vehicleTasks, newTask] });
  };

  const removeTask = (vehicleId: string, taskId: string) => {
     const vehicleTasks = allTasks[vehicleId] || [];
     const updatedTasks = vehicleTasks.filter(t => t.id !== taskId);
     setAllTasks({ ...allTasks, [vehicleId]: updatedTasks });
  };

  const updateTaskProgress = (vehicleId: string, taskId: string, completedSteps: number, totalSteps: number) => {
    const vehicleTasks = allTasks[vehicleId] || [];
    const updatedTasks = vehicleTasks.map(t => t.id === taskId ? { ...t, completedSteps, totalSteps } : t);
    setAllTasks({ ...allTasks, [vehicleId]: updatedTasks });
  };
  
  const getVehicleById = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  }

  const getTaskById = (vehicleId: string, taskId: string) => {
    return (allTasks[vehicleId] || []).find(t => t.id === taskId);
  }

  return (
    <DataContext.Provider value={{ vehicles, tasks, addVehicle, removeVehicle, updateVehicleImage, addTask, removeTask, updateTaskProgress, getVehicleById, getTaskById }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
