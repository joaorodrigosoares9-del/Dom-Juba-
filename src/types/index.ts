export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  isGuest: boolean;
  isAdmin?: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl: string;
  category: 'cabelo' | 'barba' | 'combo' | 'tratamento';
  popular?: boolean;
}

export interface Barber {
  id: string;
  name: string;
  nickname: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  availableDays: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
}

export type AppointmentStatus = 'confirmado' | 'concluido' | 'cancelado';

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  barberId: string;
  barberName: string;
  barberImage: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  userId: string;
  userName: string;
  userPhone: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin';
  password?: string;
  hasSetCustomPassword?: boolean;
  createdAt: string;
  createdBy?: string;
}

export interface BookingState {
  step: 1 | 2 | 3 | 4 | 5;
  selectedService: Service | null;
  selectedBarber: Barber | null;
  selectedDate: string | null; // YYYY-MM-DD
  selectedTime: string | null;
  notes: string;
}

export type MainTab = 'inicio' | 'agendar' | 'agendamentos' | 'perfil' | 'admin';

