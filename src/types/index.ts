export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  completed: boolean;
  completedDate?: string;
  location: string;
  elevation?: number;
  distance?: number;
  time?: string;
  image?: string;
  notes?: string;
}

export interface Running {
  id: string;
  country: string;
  voivodeship?: string; // tylko dla Polski
  city: string;
  date: string;
  notes?: string;
  completed: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  totalCount: number;
  completedCount: number;
  achievements: Achievement[];
  runnings?: Running[]; // dla kategorii biegów
}

export interface CategoryStats {
  total: number;
  completed: number;
  percentage: number;
}
