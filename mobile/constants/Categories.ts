export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const Categories: Category[] = [
  { id: 'rupa', name: 'Rupe na cestama', icon: '🕳️', color: '#E67E22' },
  { id: 'pozar', name: 'Požar', icon: '🔥', color: '#E74C3C' },
  { id: 'poplava', name: 'Poplava', icon: '🌊', color: '#3498DB' },
  { id: 'zemljotres', name: 'Zemljotres', icon: '🏔️', color: '#8B4513' },
  { id: 'kliziste', name: 'Klizište', icon: '⛰️', color: '#795548' },
  { id: 'infrastruktura', name: 'Oštećenje infrastrukture', icon: '🏗️', color: '#7F8C8D' }
];

export const Priorities = [
  { id: 'nizak', label: 'Nizak' },
  { id: 'srednji', label: 'Srednji' },
  { id: 'visok', label: 'Visok' },
  { id: 'kritican', label: 'Kritičan' }
];

export const Statuses = {
  novo: 'Novo',
  u_obradi: 'U obradi',
  rijeseno: 'Riješeno'
};
