
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MaintenanceGuide } from '../types';
import { generateMaintenanceGuide } from '../services/geminiService';
import { CheckCircleIcon, ChevronLeftIcon, ToolIcon, CarIcon } from '../components/common/Icons';
import { useLanguage } from '../context/LanguageContext';

const MaintenanceDetailPage: React.FC = () => {
  const { vehicleId, taskId } = useParams<{ vehicleId: string; taskId: string }>();
  const { getVehicleById, getTaskById, updateTaskProgress } = useData();
  const { t } = useLanguage();

  const [guide, setGuide] = useState<MaintenanceGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>([]);

  const vehicle = useMemo(() => vehicleId ? getVehicleById(vehicleId) : undefined, [getVehicleById, vehicleId]);
  const task = useMemo(() => vehicleId && taskId ? getTaskById(vehicleId, taskId) : undefined, [getTaskById, vehicleId, taskId]);

  useEffect(() => {
    const fetchGuide = async () => {
      if (vehicle && task) {
        try {
          setLoading(true);
          setError(null);
          const generatedGuide = await generateMaintenanceGuide(vehicle, task.name);
          if (generatedGuide) {
            setGuide(generatedGuide);
            const initialCheckedState = Array(generatedGuide.steps.length).fill(false);
            if(task.completedSteps) {
                for(let i=0; i<task.completedSteps; i++) {
                    initialCheckedState[i] = true;
                }
            }
            setCheckedSteps(initialCheckedState);
          } else {
            setError('guideError');
          }
        } catch (e) {
          setError('guideFetchError');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchGuide();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle?.id, task?.id]);

  useEffect(() => {
    if(vehicleId && taskId && guide) {
        const completedCount = checkedSteps.filter(Boolean).length;
        updateTaskProgress(vehicleId, taskId, completedCount, guide.steps.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedSteps, vehicleId, taskId, guide]);


  const handleStepToggle = (index: number) => {
    const newCheckedSteps = [...checkedSteps];
    newCheckedSteps[index] = !newCheckedSteps[index];
    setCheckedSteps(newCheckedSteps);
  };
  
  const progress = guide ? (checkedSteps.filter(Boolean).length / guide.steps.length) * 100 : 0;

  if (!vehicle || !task) {
    return (
      <div className="flex items-center justify-center min-h-screen text-light-text dark:text-dark-text">
        <p>{t('notFound')}</p>
        <Link to="/dashboard" className="ml-4 text-primary">{t('goBack')}</Link>
      </div>
    );
  }

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen animate-fadeIn">
        <header className="bg-light-card dark:bg-dark-card shadow-sm p-4 sticky top-0 z-20">
            <div className="container mx-auto">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-primary hover:underline mb-4">
                    <ChevronLeftIcon className="w-4 h-4" />
                    {t('backToGarage')}
                </Link>
                <div className="flex items-center gap-4">
                    {vehicle.image ? <img src={vehicle.image} alt="vehicle" className="w-16 h-16 rounded-lg object-cover" /> : <CarIcon className="w-16 h-16 text-primary p-2 bg-light-bg dark:bg-dark-bg rounded-lg"/>}
                    <div>
                        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">{task.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}</p>
                    </div>
                </div>
                 <div className="mt-4">
                    <div className="w-full bg-light-bg dark:bg-dark-bg rounded-full h-2.5">
                        <div className="bg-secondary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">{Math.round(progress)}{t('progressComplete')}</p>
                </div>
            </div>
        </header>

        <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4 flex items-center gap-2"><CheckCircleIcon className="w-6 h-6 text-secondary"/>{t('guideTitle')}</h2>
                {loading && <div className="space-y-4">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-light-card dark:bg-dark-card rounded-lg animate-pulse"></div>)}
                </div>}
                {error && <p className="text-red-500">{t(error as any)}</p>}
                
                {guide && (
                    <ol className="space-y-4">
                        {guide.steps.map((step, index) => (
                        <li key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold transition-colors ${checkedSteps[index] ? 'bg-secondary text-white' : 'bg-light-card dark:bg-dark-card border-2 border-secondary text-secondary'}`}>{index + 1}</span>
                                {index < guide.steps.length - 1 && <div className="w-0.5 flex-grow bg-light-border dark:border-dark-border my-2"></div>}
                            </div>
                            <div className="flex-1 pb-4">
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" checked={checkedSteps[index]} onChange={() => handleStepToggle(index)} className="hidden" />
                                    <h3 className={`text-lg font-semibold text-light-text dark:text-dark-text transition-colors ${checkedSteps[index] ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>{step.title}</h3>
                                </label>
                                <p className={`mt-1 text-gray-600 dark:text-gray-300 transition-colors ${checkedSteps[index] ? 'line-through text-gray-500 dark:text-gray-500' : ''}`}>{step.description}</p>
                            </div>
                        </li>
                        ))}
                    </ol>
                )}
            </div>
            <aside className="lg:col-span-1">
                <div className="sticky top-40">
                    <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4 flex items-center gap-2"><ToolIcon className="w-6 h-6 text-primary"/>{t('toolsTitle')}</h2>
                        {loading && <div className="space-y-2">
                            {[...Array(4)].map((_, i) => <div key={i} className="h-6 bg-light-bg dark:bg-dark-bg rounded animate-pulse"></div>)}
                        </div>}
                        {guide && (
                            <ul className="space-y-2">
                                {guide.tools.map((tool, index) => (
                                    <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>{tool}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </aside>
        </main>
    </div>
  );
};

export default MaintenanceDetailPage;