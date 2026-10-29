import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, testConnection, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Appointment,
  Barber,
  BookingState,
  MainTab,
  Service,
  User,
  AppointmentStatus,
  AdminAccount,
} from '../types';
import { BARBERS, SERVICES } from '../data/barbershopData';

export const MASTER_OWNER_EMAIL = 'planetaimaginariovdc@gmail.com';
const STORAGE_KEY_USER = 'donjuba_user_v4';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCurrentUserAdminAuthorized: boolean;
  adminAccounts: AdminAccount[];
  adminEmails: string[];
  masterOwnerEmail: string;
  activeTab: MainTab;
  tabHistory: MainTab[];
  bookingState: BookingState;
  appointments: Appointment[];
  services: Service[];
  isServicesLoading: boolean;
  setActiveTab: (tab: MainTab) => void;
  goBack: () => void;
  canGoBack: boolean;
  loginAsGuest: () => void;
  loginWithEmail: (email: string, name?: string, phone?: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;

  // Admin authentication & password management
  currentAdminAccount: AdminAccount | null;
  verifyAdminEmail: (email: string) => { isAuthorized: boolean; hasSetPassword: boolean; admin?: AdminAccount };
  loginAsAdmin: (password: string, emailOverride?: string) => Promise<boolean>;
  setAdminPassword: (password: string, emailToUpdate?: string) => Promise<boolean>;
  logoutAdmin: () => void;
  addAdminAccount: (email: string, name: string, initialPassword?: string) => Promise<boolean>;
  removeAdminAccount: (adminId: string, email: string) => Promise<boolean>;

  // Real-time Service management (Firestore CRUD)
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, updated: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Real-time Appointment management (Firestore CRUD)
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;

  // Booking actions
  setBookingStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  selectService: (service: Service) => void;
  selectBarber: (barber: Barber | null) => void;
  selectDate: (date: string) => void;
  selectTime: (time: string) => void;
  setBookingNotes: (notes: string) => void;
  resetBooking: () => void;
  startBookingWithService: (service: Service) => void;
  confirmAppointment: () => Promise<boolean>;
  cancelAppointment: (id: string) => Promise<void>;
}

const initialBookingState: BookingState = {
  step: 1,
  selectedService: null,
  selectedBarber: null,
  selectedDate: null,
  selectedTime: null,
  notes: '',
};

const getInitialAppointments = (userPhone: string, userName: string): Appointment[] => [
  {
    id: 'apt-sample-1',
    serviceId: 'combo-cabelo-barba',
    serviceName: 'Combo Cabelo & Barba',
    servicePrice: 95,
    serviceDuration: 60,
    barberId: 'carlos-silva',
    barberName: 'Carlos Silva',
    barberImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '15:15',
    userId: 'default-user',
    userName: userName || 'Rodrigo Alcantara',
    userPhone: userPhone || '(77) 98845-9301',
    notes: 'Degradê na zero com alinhamento na toalha quente.',
    status: 'confirmado',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-sample-2',
    serviceId: 'corte-masculino',
    serviceName: 'Corte Masculino',
    servicePrice: 60,
    serviceDuration: 35,
    barberId: 'lucas-santos',
    barberName: 'Lucas Santos',
    barberImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
    time: '10:00',
    userId: 'default-user',
    userName: userName || 'Rodrigo Alcantara',
    userPhone: userPhone || '(77) 98845-9301',
    notes: '',
    status: 'concluido',
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTabState] = useState<MainTab>('inicio');
  const [tabHistory, setTabHistory] = useState<MainTab[]>(['inicio']);
  const [bookingState, setBookingState] = useState<BookingState>(initialBookingState);

  // Firestore real-time state
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [isServicesLoading, setIsServicesLoading] = useState<boolean>(true);
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    getInitialAppointments(user?.phone || '', user?.name || '')
  );

  // Authenticated Admin session state
  const [currentAdminAccount, setCurrentAdminAccount] = useState<AdminAccount | null>(null);

  // 1. Check connection and setup Firestore real-time listeners
  useEffect(() => {
    testConnection();

    // Setup Real-time listener for Services
    const unsubscribeServices = onSnapshot(
      collection(db, 'services'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Service[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<Service, 'id'>) });
          });
          // Sort by category or name
          setServices(loaded);
          setIsServicesLoading(false);
        } else {
          // If Firestore is empty, seed default services so the catalog is live in the DB
          seedInitialServices();
        }
      },
      (error) => {
        console.error('Error fetching services snapshot:', error);
        handleFirestoreError(error, OperationType.LIST, 'services');
      }
    );

    // Setup Real-time listener for Admins
    const unsubscribeAdmins = onSnapshot(
      collection(db, 'admins'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: AdminAccount[] = [];
          let hasMaster = false;
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Omit<AdminAccount, 'id'>;
            if (data.email?.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase()) {
              hasMaster = true;
            }
            loaded.push({ id: docSnap.id, ...data });
          });

          // Ensure master owner exists in Firestore
          if (!hasMaster) {
            seedMasterAdmin();
          }
          setAdminAccounts(loaded);
        } else {
          // Empty admins collection: seed Master Owner immediately
          seedMasterAdmin();
        }
      },
      (error) => {
        console.error('Error fetching admins snapshot:', error);
        handleFirestoreError(error, OperationType.LIST, 'admins');
      }
    );

    // Setup Real-time listener for Appointments
    const unsubscribeAppointments = onSnapshot(
      collection(db, 'appointments'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Appointment[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<Appointment, 'id'>) });
          });
          // Sort newest first
          loaded.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setAppointments(loaded);
        } else {
          // Seed sample appointments if collection is empty
          seedInitialAppointments();
        }
      },
      (error) => {
        console.error('Error fetching appointments snapshot:', error);
        handleFirestoreError(error, OperationType.LIST, 'appointments');
      }
    );

    return () => {
      unsubscribeServices();
      unsubscribeAdmins();
      unsubscribeAppointments();
    };
  }, []);

  // Seed functions for initial Firestore state
  const seedInitialServices = async () => {
    try {
      for (const s of SERVICES) {
        await setDoc(doc(db, 'services', s.id), s);
      }
      setIsServicesLoading(false);
    } catch (e) {
      console.warn('Could not seed initial services to Firestore', e);
      setIsServicesLoading(false);
    }
  };

  const seedMasterAdmin = async () => {
    try {
      const docId = 'admin_master_owner';
      const masterAccount: Omit<AdminAccount, 'id'> = {
        email: MASTER_OWNER_EMAIL,
        name: 'Proprietário Don Juba',
        role: 'owner',
        hasSetCustomPassword: false, // Owner sets their own password on first login!
        createdAt: new Date().toISOString(),
        createdBy: 'system_bootstrap',
      };
      await setDoc(doc(db, 'admins', docId), masterAccount);
    } catch (e) {
      console.warn('Could not seed master admin account', e);
    }
  };

  const seedInitialAppointments = async () => {
    try {
      const initial = getInitialAppointments(user?.phone || '', user?.name || '');
      for (const apt of initial) {
        await setDoc(doc(db, 'appointments', apt.id), apt);
      }
    } catch (e) {
      console.warn('Could not seed initial appointments', e);
    }
  };

  // Save current user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to save user', e);
    }
  }, [user]);

  // Derived Admin Emails
  const adminEmails = adminAccounts.map((a) => a.email.toLowerCase());
  if (!adminEmails.includes(MASTER_OWNER_EMAIL.toLowerCase())) {
    adminEmails.unshift(MASTER_OWNER_EMAIL.toLowerCase());
  }

  // Check if current user is an authorized admin
  const isCurrentUserAdminAuthorized =
    !!user &&
    !user.isGuest &&
    adminEmails.some((e) => e.toLowerCase() === user.email.toLowerCase());

  const setActiveTab = (newTab: MainTab) => {
    if (newTab === activeTab) return;
    setTabHistory((prev) => [...prev, newTab]);
    setActiveTabState(newTab);
  };

  const goBack = () => {
    if (activeTab === 'agendar' && bookingState.step > 1) {
      setBookingState((prev) => ({
        ...prev,
        step: (prev.step - 1) as 1 | 2 | 3 | 4 | 5,
      }));
      return;
    }

    if (activeTab === 'admin') {
      setActiveTab('perfil');
      return;
    }

    if (tabHistory.length > 1) {
      const nextHistory = [...tabHistory];
      nextHistory.pop();
      const previousTab = nextHistory[nextHistory.length - 1];
      setTabHistory(nextHistory);
      setActiveTabState(previousTab);
    } else {
      setActiveTabState('inicio');
    }
  };

  const canGoBack =
    (activeTab === 'agendar' && bookingState.step > 1) ||
    activeTab === 'admin' ||
    (tabHistory.length > 1 && activeTab !== 'inicio');

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest-' + Date.now().toString(36),
      name: 'Visitante',
      phone: '(77) 98845-9301',
      email: 'visitante@donjuba.com',
      isGuest: true,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    };
    setUser(guestUser);
    setCurrentAdminAccount(null);
    toast.success('Bem-vindo à Barbearia Don Juba!', {
      description: 'Você está navegando como visitante.',
    });
  };

  const loginWithEmail = (email: string, name?: string, phone?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isAuthorized = adminEmails.includes(cleanEmail);
    const newUser: User = {
      id: 'user-' + Date.now().toString(36),
      name: name?.trim() || cleanEmail.split('@')[0],
      phone: phone?.trim() || '(77) 98845-9301',
      email: cleanEmail,
      isGuest: false,
      isAdmin: false, // Must authenticate with password to unlock admin privileges
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    toast.success(`Olá, ${newUser.name}!`, {
      description: isAuthorized
        ? 'E-mail de administrador identificado. Acesse o painel com sua senha.'
        : 'Login realizado com sucesso.',
    });
  };

  const logout = () => {
    setUser(null);
    setCurrentAdminAccount(null);
    setBookingState(initialBookingState);
    setActiveTabState('inicio');
    setTabHistory(['inicio']);
    toast.info('Sessão encerrada.');
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
    toast.success('Perfil atualizado com sucesso!');
  };

  // ==========================================
  // ADMIN AUTHENTICATION & PASSWORD MANAGEMENT
  // ==========================================

  const verifyAdminEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    const admin = adminAccounts.find((a) => a.email.toLowerCase() === clean);
    const isAuthorized = clean === MASTER_OWNER_EMAIL.toLowerCase() || !!admin;
    const hasSetPassword = admin?.hasSetCustomPassword === true && !!admin?.password;
    return { isAuthorized, hasSetPassword, admin };
  };

  const loginAsAdmin = async (password: string, emailOverride?: string): Promise<boolean> => {
    const targetEmail = (emailOverride || user?.email || '').trim().toLowerCase();

    if (!targetEmail) {
      toast.error('Informe um e-mail de administrador cadastrado.');
      return false;
    }

    const { isAuthorized, hasSetPassword, admin } = verifyAdminEmail(targetEmail);

    if (!isAuthorized) {
      toast.error('Acesso Negado!', {
        description: `O e-mail "${targetEmail}" não possui permissão de administrador.`,
      });
      return false;
    }

    // If admin has not set their custom password yet, they must set it first
    if (!hasSetPassword) {
      toast.info('Primeiro acesso!', {
        description: 'Você precisa definir sua senha de acesso agora.',
      });
      return false;
    }

    // Verify password
    if (admin?.password !== password.trim()) {
      toast.error('Senha incorreta!', {
        description: 'Verifique sua senha e tente novamente.',
      });
      return false;
    }

    // Successful Admin Login
    setCurrentAdminAccount(admin);
    if (!user || user.email.toLowerCase() !== targetEmail) {
      setUser({
        id: admin.id || 'admin-' + Date.now().toString(36),
        name: admin.name || 'Administrador Don Juba',
        email: targetEmail,
        phone: '(77) 98845-9301',
        isGuest: false,
        isAdmin: true,
        createdAt: new Date().toISOString(),
      });
    } else {
      setUser({ ...user, isAdmin: true });
    }

    setActiveTab('admin');
    toast.success('Painel Administrativo Desbloqueado!', {
      description: `Autenticado com sucesso como ${targetEmail}.`,
    });
    return true;
  };

  const setAdminPassword = async (newPassword: string, emailToUpdate?: string): Promise<boolean> => {
    const targetEmail = (emailToUpdate || user?.email || MASTER_OWNER_EMAIL).trim().toLowerCase();

    if (newPassword.trim().length < 4) {
      toast.error('A senha deve ter pelo menos 4 caracteres.');
      return false;
    }

    try {
      const existing = adminAccounts.find((a) => a.email.toLowerCase() === targetEmail);
      const docId = existing?.id || (targetEmail === MASTER_OWNER_EMAIL.toLowerCase() ? 'admin_master_owner' : 'admin_' + Date.now().toString(36));

      const updatedData = {
        email: targetEmail,
        name: existing?.name || (targetEmail === MASTER_OWNER_EMAIL.toLowerCase() ? 'Proprietário Don Juba' : 'Administrador'),
        role: targetEmail === MASTER_OWNER_EMAIL.toLowerCase() ? ('owner' as const) : ('admin' as const),
        password: newPassword.trim(),
        hasSetCustomPassword: true,
        updatedAt: new Date().toISOString(),
        createdAt: existing?.createdAt || new Date().toISOString(),
        createdBy: existing?.createdBy || 'self_setup',
      };

      await setDoc(doc(db, 'admins', docId), updatedData, { merge: true });

      // Automatically authenticate if current user is this admin
      const loggedAdmin: AdminAccount = { id: docId, ...updatedData };
      setCurrentAdminAccount(loggedAdmin);
      if (user) {
        setUser({ ...user, isAdmin: true, email: targetEmail });
      } else {
        setUser({
          id: docId,
          name: updatedData.name,
          email: targetEmail,
          phone: '(77) 98845-9301',
          isGuest: false,
          isAdmin: true,
          createdAt: new Date().toISOString(),
        });
      }

      setActiveTab('admin');
      toast.success('Senha definida com sucesso!', {
        description: 'Sua senha pessoal foi salva no Firestore. Você já está logado!',
      });
      return true;
    } catch (error) {
      console.error('Error setting admin password in Firestore:', error);
      handleFirestoreError(error, OperationType.WRITE, `admins/${targetEmail}`);
      toast.error('Erro ao salvar nova senha no banco de dados.');
      return false;
    }
  };

  const logoutAdmin = () => {
    if (user) {
      setUser({ ...user, isAdmin: false });
    }
    setCurrentAdminAccount(null);
    setActiveTab('inicio');
    toast.info('Sessão administrativa finalizada.');
  };

  const addAdminAccount = async (newEmail: string, name: string, initialPassword?: string): Promise<boolean> => {
    const clean = newEmail.trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      toast.error('Informe um e-mail válido.');
      return false;
    }

    if (adminAccounts.some((a) => a.email.toLowerCase() === clean)) {
      toast.info('Este e-mail já está cadastrado como administrador.');
      return false;
    }

    try {
      const docId = 'admin_' + Date.now().toString(36);
      const newAdmin: Omit<AdminAccount, 'id'> = {
        email: clean,
        name: name.trim() || clean.split('@')[0],
        role: 'admin',
        password: initialPassword ? initialPassword.trim() : '',
        hasSetCustomPassword: !!initialPassword,
        createdAt: new Date().toISOString(),
        createdBy: user?.email || MASTER_OWNER_EMAIL,
      };

      await setDoc(doc(db, 'admins', docId), newAdmin);
      toast.success(`Administrador ${clean} cadastrado com sucesso!`, {
        description: initialPassword
          ? 'Senha provisória definida pelo gestor.'
          : 'O novo administrador escolherá sua senha no primeiro acesso.',
      });
      return true;
    } catch (error) {
      console.error('Error adding admin in Firestore:', error);
      handleFirestoreError(error, OperationType.CREATE, 'admins');
      toast.error('Erro ao adicionar administrador no Firestore.');
      return false;
    }
  };

  const removeAdminAccount = async (adminId: string, email: string): Promise<boolean> => {
    const clean = email.trim().toLowerCase();
    if (clean === MASTER_OWNER_EMAIL.toLowerCase()) {
      toast.error('O proprietário master da plataforma não pode ser removido.');
      return false;
    }

    try {
      await deleteDoc(doc(db, 'admins', adminId));
      toast.info(`Acesso de administrador removido para ${clean}.`);
      return true;
    } catch (error) {
      console.error('Error deleting admin from Firestore:', error);
      handleFirestoreError(error, OperationType.DELETE, `admins/${adminId}`);
      toast.error('Erro ao excluir administrador no Firestore.');
      return false;
    }
  };

  // ==========================================
  // REAL-TIME FIRESTORE SERVICES (CRUD)
  // ==========================================

  const addService = async (newServiceData: Omit<Service, 'id'>) => {
    try {
      const docRef = doc(collection(db, 'services'));
      const newService: Service = {
        ...newServiceData,
        id: docRef.id,
      };

      await setDoc(docRef, newService);
      toast.success(`Corte "${newService.name}" salvo no Firestore com sucesso!`, {
        description: 'Disponível em tempo real para todos os clientes.',
      });
    } catch (error) {
      console.error('Error creating service in Firestore:', error);
      handleFirestoreError(error, OperationType.CREATE, 'services');
      toast.error('Falha ao adicionar serviço no Firestore.');
    }
  };

  const updateService = async (id: string, updated: Partial<Service>) => {
    try {
      const serviceRef = doc(db, 'services', id);
      await updateDoc(serviceRef, {
        ...updated,
        updatedAt: new Date().toISOString(),
      });
      toast.success('Corte atualizado em tempo real no Firestore!');
    } catch (error) {
      console.error('Error updating service in Firestore:', error);
      handleFirestoreError(error, OperationType.UPDATE, `services/${id}`);
      toast.error('Falha ao atualizar serviço no Firestore.');
    }
  };

  const deleteService = async (id: string) => {
    try {
      const target = services.find((s) => s.id === id);
      await deleteDoc(doc(db, 'services', id));
      toast.info(`Corte "${target?.name || 'Serviço'}" excluído do Firestore.`);
    } catch (error) {
      console.error('Error deleting service in Firestore:', error);
      handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
      toast.error('Falha ao excluir serviço no Firestore.');
    }
  };

  // ==========================================
  // REAL-TIME FIRESTORE APPOINTMENTS (CRUD)
  // ==========================================

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status,
        updatedAt: new Date().toISOString(),
      });
      const statusLabels: Record<AppointmentStatus, string> = {
        confirmado: 'Confirmado',
        concluido: 'Concluído',
        cancelado: 'Cancelado',
      };
      toast.success(`Agendamento atualizado para "${statusLabels[status]}" no Firestore!`);
    } catch (error) {
      console.error('Error updating appointment in Firestore:', error);
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
      toast.error('Erro ao atualizar agendamento no Firestore.');
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
      toast.info('Agendamento excluído do sistema.');
    } catch (error) {
      console.error('Error deleting appointment in Firestore:', error);
      handleFirestoreError(error, OperationType.DELETE, `appointments/${id}`);
      toast.error('Erro ao excluir agendamento.');
    }
  };

  // ==========================================
  // BOOKING FLOW CONTROLS
  // ==========================================

  const setBookingStep = (step: 1 | 2 | 3 | 4 | 5) => {
    setBookingState((prev) => ({ ...prev, step }));
  };

  const selectService = (service: Service) => {
    setBookingState((prev) => ({
      ...prev,
      selectedService: service,
      step: 2,
    }));
  };

  const selectBarber = (barber: Barber | null) => {
    const resolvedBarber = barber || BARBERS[0];
    setBookingState((prev) => ({
      ...prev,
      selectedBarber: resolvedBarber,
      step: 3,
    }));
  };

  const selectDate = (date: string) => {
    setBookingState((prev) => ({
      ...prev,
      selectedDate: date,
      step: 4,
    }));
  };

  const selectTime = (time: string) => {
    setBookingState((prev) => ({
      ...prev,
      selectedTime: time,
      step: 5,
    }));
  };

  const setBookingNotes = (notes: string) => {
    setBookingState((prev) => ({ ...prev, notes }));
  };

  const resetBooking = () => {
    setBookingState(initialBookingState);
  };

  const startBookingWithService = (service: Service) => {
    setBookingState({
      ...initialBookingState,
      selectedService: service,
      step: 2,
    });
    setActiveTab('agendar');
  };

  const confirmAppointment = async (): Promise<boolean> => {
    const { selectedService, selectedBarber, selectedDate, selectedTime, notes } = bookingState;

    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      toast.error('Por favor, preencha todas as etapas do agendamento.');
      return false;
    }

    const docRef = doc(collection(db, 'appointments'));
    const newAppointment: Appointment = {
      id: docRef.id,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.durationMinutes,
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      barberImage: selectedBarber.imageUrl,
      date: selectedDate,
      time: selectedTime,
      userId: user?.id || 'guest',
      userName: user?.name || 'Cliente Don Juba',
      userPhone: user?.phone || '(77) 98845-9301',
      notes: notes.trim(),
      status: 'confirmado',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(docRef, newAppointment);
      resetBooking();
      setActiveTab('agendamentos');

      toast.success('Agendamento confirmado com sucesso!', {
        description: `${selectedService.name} com ${selectedBarber.name} às ${selectedTime}`,
      });
      return true;
    } catch (error) {
      console.error('Error saving appointment in Firestore:', error);
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
      toast.error('Falha ao registrar agendamento no Firestore.');
      return false;
    }
  };

  const cancelAppointment = async (id: string) => {
    await updateAppointmentStatus(id, 'cancelado');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        isCurrentUserAdminAuthorized,
        adminAccounts,
        adminEmails,
        masterOwnerEmail: MASTER_OWNER_EMAIL,
        activeTab,
        tabHistory,
        bookingState,
        appointments,
        services,
        isServicesLoading,
        setActiveTab,
        goBack,
        canGoBack,
        loginAsGuest,
        loginWithEmail,
        logout,
        updateUser,
        currentAdminAccount,
        verifyAdminEmail,
        loginAsAdmin,
        setAdminPassword,
        logoutAdmin,
        addAdminAccount,
        removeAdminAccount,
        addService,
        updateService,
        deleteService,
        updateAppointmentStatus,
        deleteAppointment,
        setBookingStep,
        selectService,
        selectBarber,
        selectDate,
        selectTime,
        setBookingNotes,
        resetBooking,
        startBookingWithService,
        confirmAppointment,
        cancelAppointment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
