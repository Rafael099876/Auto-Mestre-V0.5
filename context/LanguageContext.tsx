
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// English Translations
const en = {
  // Header
  welcomeMessage: 'Welcome, {username}',
  
  // Login Page
  loginTitle: 'Welcome Back!',
  loginSubtitle: 'Sign in to manage your vehicles.',
  emailLabel: 'Email Address',
  passwordLabel: 'Password',
  loginButton: 'Sign In',
  loginError: 'Invalid email or password.',
  signupPrompt: "Don't have an account?",
  signUpLink: 'Sign Up',

  // Register Page
  registerTitle: 'Create Your Account',
  registerSubtitle: 'Join AutoCare Pro today.',
  usernameLabel: 'Username',
  registerButton: 'Sign Up',
  registerError: 'An account with this email already exists.',
  loginPrompt: 'Already have an account?',
  signInLink: 'Sign In',

  // Dashboard Page
  headerTitleGarage: 'My Garage',
  vehiclesTitle: 'Vehicles',
  uploadImageHint: 'Click to upload image',
  changeImageHover: 'Change Image',
  addTaskButton: 'Task',
  addNewVehicle: 'Add New Vehicle',
  // Vehicle Form
  addVehicleTitle: 'Add a New Vehicle',
  yearLabel: 'Year',
  brandLabel: 'Brand',
  modelLabel: 'Model',
  addVehicleButton: 'Add Vehicle',
  cancelButton: 'Cancel',
  // Task Form
  addTaskTitle: 'Add Maintenance Task',
  taskNameLabel: 'Task Name (e.g., Oil Change)',
  addTaskButtonForm: 'Add Task',
  // Timeline
  timelineTitle: 'Maintenance Timeline',
  noTasks: 'No maintenance tasks scheduled.',
  noTasksHint: 'Add a task to your vehicles to see them here.',
  unknownVehicle: 'Unknown Vehicle',

  // Agenda Page
  headerTitleAgenda: 'Maintenance Agenda',
  allTasksTitle: 'All Tasks',
  filterAll: 'All',
  filterUpcoming: 'Upcoming',
  filterPast: 'Past',
  noTasksInCategory: 'No tasks in this category.',
  noTasksInCategoryHint: 'Your maintenance schedule is clear!',

  // Maintenance Detail Page
  backToGarage: 'Back to Garage',
  progressComplete: '% Complete',
  notFound: 'Vehicle or Task not found.',
  goBack: 'Go back',
  guideTitle: 'Step-by-Step Guide',
  guideError: 'Failed to generate maintenance guide.',
  guideFetchError: 'An error occurred while fetching the guide.',
  toolsTitle: 'Required Tools',
};

// Portuguese (Brazil) Translations
const ptBR = {
  // Header
  welcomeMessage: 'Bem-vindo(a), {username}',

  // Login Page
  loginTitle: 'Bem-vindo(a) de volta!',
  loginSubtitle: 'Faça login para gerenciar seus veículos.',
  emailLabel: 'Endereço de E-mail',
  passwordLabel: 'Senha',
  loginButton: 'Entrar',
  loginError: 'E-mail ou senha inválidos.',
  signupPrompt: 'Não tem uma conta?',
  signUpLink: 'Cadastre-se',

  // Register Page
  registerTitle: 'Crie sua conta',
  registerSubtitle: 'Junte-se ao AutoCare Pro hoje.',
  usernameLabel: 'Nome de usuário',
  registerButton: 'Cadastrar',
  registerError: 'Já existe uma conta com este e-mail.',
  loginPrompt: 'Já tem uma conta?',
  signInLink: 'Entrar',

  // Dashboard Page
  headerTitleGarage: 'Minha Garagem',
  vehiclesTitle: 'Veículos',
  uploadImageHint: 'Clique para enviar uma imagem',
  changeImageHover: 'Mudar Imagem',
  addTaskButton: 'Tarefa',
  addNewVehicle: 'Adicionar Novo Veículo',
  // Vehicle Form
  addVehicleTitle: 'Adicionar um Novo Veículo',
  yearLabel: 'Ano',
  brandLabel: 'Marca',
  modelLabel: 'Modelo',
  addVehicleButton: 'Adicionar Veículo',
  cancelButton: 'Cancelar',
  // Task Form
  addTaskTitle: 'Adicionar Tarefa de Manutenção',
  taskNameLabel: 'Nome da Tarefa (ex: Troca de Óleo)',
  addTaskButtonForm: 'Adicionar Tarefa',
  // Timeline
  timelineTitle: 'Linha do Tempo de Manutenção',
  noTasks: 'Nenhuma tarefa de manutenção agendada.',
  noTasksHint: 'Adicione uma tarefa aos seus veículos para vê-las aqui.',
  unknownVehicle: 'Veículo Desconhecido',
  
  // Agenda Page
  headerTitleAgenda: 'Agenda de Manutenção',
  allTasksTitle: 'Todas as Tarefas',
  filterAll: 'Todas',
  filterUpcoming: 'Próximas',
  filterPast: 'Passadas',
  noTasksInCategory: 'Nenhuma tarefa nesta categoria.',
  noTasksInCategoryHint: 'Sua agenda de manutenção está livre!',
  
  // Maintenance Detail Page
  backToGarage: 'Voltar para a Garagem',
  progressComplete: '% Completo',
  notFound: 'Veículo ou Tarefa não encontrado.',
  goBack: 'Voltar',
  guideTitle: 'Guia Passo a Passo',
  guideError: 'Falha ao gerar o guia de manutenção.',
  guideFetchError: 'Ocorreu um erro ao buscar o guia.',
  toolsTitle: 'Ferramentas Necessárias',
};


type Language = 'en' | 'pt-BR';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations, replacements?: { [key: string]: string | number }) => string;
}

const translations: { [key in Language]: Translations } = {
  en,
  'pt-BR': ptBR,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    // Check if navigator language is pt and no language is saved
    if (!savedLanguage && navigator.language.startsWith('pt')) {
        return 'pt-BR';
    }
    return savedLanguage || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: keyof Translations, replacements?: { [key: string]: string | number }): string => {
    let translation = translations[language]?.[key] || translations['en'][key];
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            translation = translation.replace(`{${rKey}}`, String(replacements[rKey]));
        });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
