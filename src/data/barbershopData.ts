import { Barber, Service } from '../types';

export const BARBERSHOP_INFO = {
  name: 'Barbearia Bigode Grosso',
  headline: 'Estilo & Tradição',
  niche: 'Barbearia',
  description: 'Tradição, navalha afiada e excelência em cada detalhe. O melhor atendimento de Vitória da Conquista na Barbearia Bigode Grosso no Candeias.',
  address: 'R. Vilma Dias de Souza - Candeias, Vitória da Conquista - BA, 45028-570',
  phone: '(77) 99846-3074',
  phoneClean: '5577998463074',
  whatsappUrl: 'https://wa.me/5577998463074?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20Barbearia%20Bigode%20Grosso.',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=R.+Vilma+Dias+de+Souza+-+Candeias,+Vit%C3%B3ria+da+Conquista+-+BA,+45028-570',
  hours: 'Segunda: 14:00 às 19:00 • Terça a Sexta: 09:00 às 19:00 • Sábado: 09:00 às 15:00 • Domingo: Fechado',
  dailySchedule: [
    { day: 'Segunda-feira', hours: '14:00 – 19:00', open: true },
    { day: 'Terça-feira', hours: '09:00 – 19:00', open: true },
    { day: 'Quarta-feira', hours: '09:00 – 19:00', open: true },
    { day: 'Quinta-feira', hours: '09:00 – 19:00', open: true },
    { day: 'Sexta-feira', hours: '09:00 – 19:00', open: true },
    { day: 'Sábado', hours: '09:00 – 15:00', open: true },
    { day: 'Domingo', hours: 'Fechado', open: false },
  ],
  stats: [
    { label: 'Anos de Experiência', value: '15+' },
    { label: 'Clientes Atendidos', value: '10.000+' },
    { label: 'Barbeiros Especialistas', value: '5' },
    { label: 'Nota de Avaliação', value: '4.9 ★' },
  ],
};

export const SERVICES: Service[] = [
  {
    id: 'corte-masculino',
    name: 'Corte Masculino',
    description: 'Corte moderno ou clássico com tesoura e máquina, lavado refrescante e finalização com pomada matte.',
    durationMinutes: 35,
    price: 60,
    category: 'cabelo',
    popular: true,
    // Real barbershop hair cutting photo
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'barba',
    name: 'Barba Tradicional',
    description: 'Design e alinhamento de barba com toalha quente, navalhete descartável, massagem facial e óleo hidratante.',
    durationMinutes: 30,
    price: 45,
    category: 'barba',
    popular: true,
    // Real barbershop beard trimming with razor photo
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=700&q=80',
  },

  {
    id: 'combo-cabelo-barba',
    name: 'Combo Cabelo & Barba',
    description: 'A experiência completa: corte completo com styling + barba na toalha quente e tratamento aromático.',
    durationMinutes: 60,
    price: 95,
    category: 'combo',
    popular: true,
    // Complete styling barbershop
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'barboterapia',
    name: 'Barboterapia Relaxante',
    description: 'Protocolo de spa para a barba: esfoliação profunda, vapor de ozônio, navalha de precisão e bálsamo refrescante.',
    durationMinutes: 40,
    price: 65,
    category: 'barba',
    // Barber with hot towel / shave
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'selagem-alinhamento',
    name: 'Selagem & Alinhamento',
    description: 'Redução de volume e controle de frizz com produtos nobres sem formol, mantendo o movimento natural.',
    durationMinutes: 60,
    price: 110,
    category: 'cabelo',
    // Professional barbershop chair & styling
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80',
  },
];

export const BARBERS: Barber[] = [
  {
    id: 'carlos-silva',
    name: 'Carlos Silva',
    nickname: 'Mestre da Navalha',
    specialty: 'Cortes Clássicos & Barba Terapia',
    experienceYears: 12,
    rating: 5.0,
    reviewsCount: 384,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    availableDays: [1, 2, 3, 4, 5, 6], // Thu, Fri, Sat
  },
  {
    id: 'lucas-santos',
    name: 'Lucas Santos',
    nickname: 'Fade Master',
    specialty: 'Degradê High Fade & Riscos Artísticos',
    experienceYears: 8,
    rating: 4.9,
    reviewsCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    availableDays: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'rafael-souza',
    name: 'Rafael Souza',
    nickname: 'Visagista',
    specialty: 'Harmonização de Barba & Formato Facial',
    experienceYears: 9,
    rating: 4.9,
    reviewsCount: 245,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
    availableDays: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'diego-rocha',
    name: 'Diego Rocha',
    nickname: 'Tesoura de Ouro',
    specialty: 'Texturização & Cortes Médios/Longos',
    experienceYears: 7,
    rating: 4.8,
    reviewsCount: 198,
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
    availableDays: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'matheus-lima',
    name: 'Matheus Lima',
    nickname: 'Especialista Capilar',
    specialty: 'Tratamentos, Hidratação & Química',
    experienceYears: 6,
    rating: 4.9,
    reviewsCount: 162,
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80',
    availableDays: [1, 2, 3, 4, 5, 6],
  },
];

// Default time slots across valid business hours
export const TIME_SLOTS = [
  '09:00', '09:45', '10:30', '11:15', '12:00',
  '13:00', '13:45', '14:30', '15:15', '16:00',
  '16:45', '17:30', '18:15'
];

export const GALLERY_PHOTOS = [
  {
    id: 'gal-1',
    title: 'Corte Degradê com Navalha',
    description: 'Fade limpo e transição impecável com lâmina de precisão',
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-2',
    title: 'Barboterapia com Toalha Quente',
    description: 'Relaxamento profundo e hidratação com óleos essenciais',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-3',
    title: 'Cadeiras Clássicas & Ambiance',
    description: 'Estrutura premium em couro e ferro fundido vintage',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-4',
    title: 'Finalização & Styling',
    description: 'Pomada matte e textura natural com secador iônico',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-5',
    title: 'Ferramental Esterilizado',
    description: 'Tesouras forjadas japonesas e navalhetes descartáveis',
    imageUrl: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gal-6',
    title: 'Tradição & Visagismo',
    description: 'Atendimento consultivo focado no seu formato de rosto',
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
  },
];
