
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { MaintenanceTask, Vehicle } from '../types';
import { CalendarIcon, TrashIcon } from '../components/common/Icons';
import { useLanguage } from '../context/LanguageContext';

const AgendaPage: React.FC = () => {
  const { vehicles, tasks, removeTask } = useData();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const { t } = useLanguage();

  const allTasks = useMemo(() => {
    return (Object.values(tasks).flat() as MaintenanceTask[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    if (filter === 'upcoming') {
      return allTasks.filter(task => task.date >= today);
    }
    if (filter === 'past') {
      return allTasks.filter(task => task.date < today);
    }
    return allTasks;
  }, [allTasks, filter]);

  const getVehicleInfo = (vehicleId: string): Vehicle | undefined => {
    return vehicles.find(v => v.id === vehicleId);
  };

  return (
    <div className="animate-fadeIn">
      <Header title={t('headerTitleAgenda')} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6 border-b border-light-border dark:border-dark-border pb-4">
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">{t('allTasksTitle')}</h2>
            <div className="flex space-x-2 p-1 bg-light-bg dark:bg-dark-bg rounded-lg">
              <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{t('filterAll')}</button>
              <button onClick={() => setFilter('upcoming')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filter === 'upcoming' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{t('filterUpcoming')}</button>
              <button onClick={() => setFilter('past')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filter === 'past' ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{t('filterPast')}</button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => {
                const vehicle = getVehicleInfo(task.vehicleId);
                const isPast = task.date < new Date().toISOString().split('T')[0];
                return (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-light-bg dark:bg-dark-bg rounded-lg hover:shadow-md transition-shadow">
                    <Link to={`/maintenance/${task.vehicleId}/${task.id}`} className="flex-grow">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${isPast ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900/50'}`}>
                                <CalendarIcon className={`w-6 h-6 ${isPast ? 'text-gray-500' : 'text-primary'}`} />
                            </div>
                            <div>
                                <p className="font-bold text-light-text dark:text-dark-text">{task.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {vehicle ? `${vehicle.year} ${vehicle.brand} ${vehicle.model}` : t('unknownVehicle')}
                                </p>
                            </div>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{new Date(task.date).toLocaleDateString()}</p>
                        <button onClick={() => removeTask(task.vehicleId, task.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors" aria-label={`Remove task ${task.name}`}>
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <CalendarIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">{t('noTasksInCategory')}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">{t('noTasksInCategoryHint')}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgendaPage;
