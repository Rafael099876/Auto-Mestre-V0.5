
import React, { useState, useRef, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { Vehicle, MaintenanceTask } from '../types';
import { PlusIcon, TrashIcon, CalendarIcon, CarIcon } from '../components/common/Icons';
import { useLanguage } from '../context/LanguageContext';

const DashboardPage: React.FC = () => {
  const { vehicles, tasks, addVehicle, removeVehicle, addTask, updateVehicleImage } = useData();
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState<string | null>(null);
  const { t } = useLanguage();

  const allTasks = (Object.values(tasks).flat() as MaintenanceTask[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="animate-fadeIn">
      <Header title={t('headerTitleGarage')} />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <VehicleGallery 
          vehicles={vehicles}
          onAddClick={() => setShowVehicleForm(true)}
          onRemove={removeVehicle}
          onShowTaskForm={setShowTaskForm}
          onUpdateImage={updateVehicleImage}
        />
        {showVehicleForm && <VehicleForm onAdd={addVehicle} onCancel={() => setShowVehicleForm(false)} />}
        
        {showTaskForm && <TaskForm vehicleId={showTaskForm} onAdd={addTask} onCancel={() => setShowTaskForm(null)} />}
        
        <Timeline tasks={allTasks} vehicles={vehicles} today={today} />
      </main>
    </div>
  );
};


const VehicleGallery: React.FC<{
    vehicles: Vehicle[], 
    onAddClick: () => void,
    onRemove: (id: string) => void,
    onShowTaskForm: (id: string) => void,
    onUpdateImage: (id: string, image: string) => void
}> = ({ vehicles, onAddClick, onRemove, onShowTaskForm, onUpdateImage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const { t } = useLanguage();

    const handleImageUploadClick = (vehicleId: string) => {
        setSelectedVehicleId(vehicleId);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && selectedVehicleId) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateImage(selectedVehicleId, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <section>
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">{t('vehiclesTitle')}</h2>
            <div className="flex overflow-x-auto space-x-6 pb-4">
                {vehicles.map(vehicle => (
                    <div key={vehicle.id} className="flex-shrink-0 w-80 bg-light-card dark:bg-dark-card rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="relative h-40 bg-gray-200 dark:bg-gray-700 cursor-pointer" onClick={() => handleImageUploadClick(vehicle.id)}>
                            {vehicle.image ? (
                                <img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 flex-col">
                                    <CarIcon className="w-12 h-12" />
                                    <p className="text-sm mt-2">{t('uploadImageHint')}</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                                <p className="text-white font-semibold">{t('changeImageHover')}</p>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-xl font-bold text-light-text dark:text-dark-text">{vehicle.year} {vehicle.brand}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{vehicle.model}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <button onClick={() => onShowTaskForm(vehicle.id)} className="text-sm bg-secondary text-white py-1 px-3 rounded-full hover:bg-emerald-600 transition-colors flex items-center gap-1">
                                    <PlusIcon className="w-4 h-4" /> {t('addTaskButton')}
                                </button>
                                <button onClick={() => onRemove(vehicle.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors" aria-label={`Remove ${vehicle.brand} ${vehicle.model}`}>
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex-shrink-0 w-80">
                     <button onClick={onAddClick} className="w-full h-full border-2 border-dashed border-light-border dark:border-dark-border rounded-lg flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-light-bg dark:hover:bg-dark-card hover:border-primary dark:hover:border-primary transition-all duration-300">
                        <PlusIcon className="w-12 h-12" />
                        <span className="mt-2 font-semibold">{t('addNewVehicle')}</span>
                    </button>
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
        </section>
    );
};


const VehicleForm: React.FC<{onAdd: (v: Omit<Vehicle, 'id'>) => void, onCancel: () => void}> = ({onAdd, onCancel}) => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const { t } = useLanguage();
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ year, brand, model });
        onCancel();
    };

    return (
        <div className="p-6 bg-light-card dark:bg-dark-card rounded-lg shadow-md mt-4 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">{t('addVehicleTitle')}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} placeholder={t('yearLabel')} required className="w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" aria-label={t('yearLabel')} />
                <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder={t('brandLabel')} required className="w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" aria-label={t('brandLabel')} />
                <input type="text" value={model} onChange={e => setModel(e.target.value)} placeholder={t('modelLabel')} required className="w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" aria-label={t('modelLabel')} />
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors">{t('addVehicleButton')}</button>
                    <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text font-semibold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">{t('cancelButton')}</button>
                </div>
            </form>
        </div>
    );
};

const TaskForm: React.FC<{vehicleId: string, onAdd: (t: Omit<MaintenanceTask, 'id'>) => void, onCancel: () => void}> = ({vehicleId, onAdd, onCancel}) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const { t } = useLanguage();
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ vehicleId, name, date });
        onCancel();
    };

    return (
        <div className="p-6 bg-light-card dark:bg-dark-card rounded-lg shadow-md mt-4 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">{t('addTaskTitle')}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('taskNameLabel')} required className="w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" aria-label={t('taskNameLabel')} />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Task Date" />
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors">{t('addTaskButtonForm')}</button>
                    <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text font-semibold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">{t('cancelButton')}</button>
                </div>
            </form>
        </div>
    );
};

const Timeline: React.FC<{tasks: MaintenanceTask[], vehicles: Vehicle[], today: string}> = ({tasks, vehicles, today}) => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    const scroll = (scrollOffset: number) => {
        if(timelineRef.current) {
            timelineRef.current.scrollLeft += scrollOffset;
        }
    };

    const getVehicleName = (id: string) => {
        const v = vehicles.find(v => v.id === id);
        return v ? `${v.brand} ${v.model}` : t('unknownVehicle');
    }

    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">{t('timelineTitle')}</h2>
                <div className="flex gap-2">
                    <button onClick={() => scroll(-300)} className="bg-light-card dark:bg-dark-card p-2 rounded-full shadow-md hover:bg-light-bg dark:hover:bg-dark-bg" aria-label="Scroll left">&lt;</button>
                    <button onClick={() => scroll(300)} className="bg-light-card dark:bg-dark-card p-2 rounded-full shadow-md hover:bg-light-bg dark:hover:bg-dark-bg" aria-label="Scroll right">&gt;</button>
                </div>
            </div>
            <div ref={timelineRef} className="flex overflow-x-auto space-x-4 pb-4 scroll-smooth">
                {tasks.length > 0 ? tasks.map(task => {
                    const isPast = task.date < today;
                    return (
                        <Link to={`/maintenance/${task.vehicleId}/${task.id}`} key={task.id} className={`flex-shrink-0 w-64 p-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${isPast ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900/50'}`}>
                           <p className={`text-sm font-semibold ${isPast ? 'text-gray-500 dark:text-gray-400' : 'text-primary'}`}>{new Date(task.date).toDateString()}</p>
                           <h4 className="font-bold text-light-text dark:text-dark-text mt-1">{task.name}</h4>
                           <p className="text-xs text-gray-500 dark:text-gray-400">{getVehicleName(task.vehicleId)}</p>
                        </Link>
                    )
                }) : (
                     <div className="w-full text-center py-10 bg-light-card dark:bg-dark-card rounded-lg">
                        <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                        <p className="mt-4 text-gray-500 dark:text-gray-400">{t('noTasks')}</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">{t('noTasksHint')}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DashboardPage;
