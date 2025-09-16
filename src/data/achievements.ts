import { Category, Achievement, Running } from '@/types';

export const categories: Category[] = [
  {
    id: 'korona-europy',
    name: 'Korona Europy',
    description: '48 najwyższych szczytów każdego kraju europejskiego. Od Mount Elbrus po Ben Nevis.',
    icon: '🏔️',
    color: '#1e40af',
    gradient: 'from-blue-600 to-blue-800',
    totalCount: 48,
    completedCount: 15,
    achievements: [
      {
        id: 'elbrus',
        name: 'Mount Elbrus',
        description: 'Najwyższy szczyt Europy, położony w Rosji na Kaukazie.',
        category: 'korona-europy',
        difficulty: 'hard',
        completed: true,
        completedDate: '2023-08-15',
        location: 'Rosja, Kaukaz',
        elevation: 5642,
        notes: 'Wspaniałe widoki na Kaukaz. Trudne podejście od południa.'
      },
      {
        id: 'mont-blanc',
        name: 'Mont Blanc',
        description: 'Najwyższy szczyt Alp Zachodnich, granica Francji i Włoch.',
        category: 'korona-europy',
        difficulty: 'hard',
        completed: true,
        completedDate: '2023-07-22',
        location: 'Francja/Włochy, Alpy',
        elevation: 4808,
        notes: 'Klasyczna droga przez Gouter Hut. Śnieg i lód na szczycie.'
      },
      {
        id: 'matterhorn',
        name: 'Matterhorn',
        description: 'Ikoniczny szczyt w kształcie piramidy w Alpach Pennińskich.',
        category: 'korona-europy',
        difficulty: 'extreme',
        completed: false,
        location: 'Szwajcaria/Włochy, Alpy',
        elevation: 4478,
        notes: 'Wymaga zaawansowanych umiejętności wspinaczkowych.'
      }
    ]
  },
  {
    id: 'korona-polski',
    name: 'Korona Polski',
    description: '28 najwyższych szczytów każdego województwa w Polsce. Od Rysów po Śnieżkę.',
    icon: '🏔️',
    color: '#059669',
    gradient: 'from-green-600 to-green-800',
    totalCount: 28,
    completedCount: 12,
    achievements: [
      {
        id: 'rysy',
        name: 'Rysy',
        description: 'Najwyższy szczyt Polski, położony w Tatrach Wysokich.',
        category: 'korona-polski',
        difficulty: 'hard',
        completed: true,
        completedDate: '2023-06-10',
        location: 'Tatry Wysokie, Małopolska',
        elevation: 2503,
        notes: 'Piękna trasa przez Morskie Oko. Widoki na całe Tatry.'
      },
      {
        id: 'sniezka',
        name: 'Śnieżka',
        description: 'Najwyższy szczyt Karkonoszy i Sudetów.',
        category: 'korona-polski',
        difficulty: 'medium',
        completed: true,
        completedDate: '2023-05-20',
        location: 'Karkonosze, Dolnośląskie',
        elevation: 1603,
        notes: 'Łatwa trasa z Karpacza. Często mgła na szczycie.'
      },
      {
        id: 'lysica',
        name: 'Łysica',
        description: 'Najwyższy szczyt Gór Świętokrzyskich.',
        category: 'korona-polski',
        difficulty: 'easy',
        completed: false,
        location: 'Góry Świętokrzyskie, Świętokrzyskie',
        elevation: 612,
        notes: 'Łatwa trasa dla początkujących. Piękne widoki na okolicę.'
      }
    ]
  },
  {
    id: 'maratony-swiata',
    name: 'Maratony Świata',
    description: 'Najsłynniejsze maratony na świecie. Od Bostonu po Tokio, od Londynu po Nowy Jork.',
    icon: '🏃',
    color: '#dc2626',
    gradient: 'from-red-600 to-red-800',
    totalCount: 25,
    completedCount: 8,
    achievements: [
      {
        id: 'boston-marathon',
        name: 'Boston Marathon',
        description: 'Najstarszy maraton świata, wymaga kwalifikacji czasowej.',
        category: 'maratony-swiata',
        difficulty: 'hard',
        completed: true,
        completedDate: '2023-04-17',
        location: 'Boston, USA',
        distance: 42.2,
        time: '3:15:30',
        notes: 'Trudna trasa z Heartbreak Hill. Atmosfera jak na festiwalu.'
      },
      {
        id: 'london-marathon',
        name: 'London Marathon',
        description: 'Jeden z World Marathon Majors, trasa przez centrum Londynu.',
        category: 'maratony-swiata',
        difficulty: 'medium',
        completed: true,
        completedDate: '2023-04-23',
        location: 'Londyn, Wielka Brytania',
        distance: 42.2,
        time: '3:08:45',
        notes: 'Płaska trasa, dużo widzów. Przejście przez Tower Bridge.'
      },
      {
        id: 'tokyo-marathon',
        name: 'Tokyo Marathon',
        description: 'Maraton przez nowoczesne i tradycyjne dzielnice Tokio.',
        category: 'maratony-swiata',
        difficulty: 'medium',
        completed: false,
        location: 'Tokio, Japonia',
        distance: 42.2,
        notes: 'Wymaga loterii. Płaska trasa, organizacja na najwyższym poziomie.'
      }
    ]
  },
  {
    id: 'bieganie',
    name: 'Bieganie',
    description: 'Śledź swoje biegi po świecie i Polsce. Kraje, województwa, miasta - każdy bieg to nowa historia.',
    icon: '🏃‍♂️',
    color: '#7c3aed',
    gradient: 'from-purple-600 to-purple-800',
    totalCount: 0,
    completedCount: 0,
    achievements: [],
    runnings: [
      {
        id: 'berlin-2024',
        country: 'Niemcy',
        city: 'Berlin',
        date: '2024-03-15',
        notes: 'Bieg przez Tiergarten i Unter den Linden. Piękna wiosenna pogoda.',
        completed: true
      },
      {
        id: 'prague-2024',
        country: 'Czechy',
        city: 'Praga',
        date: '2024-02-20',
        notes: 'Bieg wzdłuż Wełtawy. Zimowa atmosfera, mniej turystów.',
        completed: true
      },
      {
        id: 'barcelona-2024',
        country: 'Hiszpania',
        city: 'Barcelona',
        date: '2024-01-10',
        notes: 'Bieg wzdłuż plaży Barceloneta. Łagodna zima, dużo słońca.',
        completed: true
      },
      {
        id: 'warszawa-2023',
        country: 'Polska',
        voivodeship: 'Mazowieckie',
        city: 'Warszawa',
        date: '2023-12-01',
        notes: 'Bieg przez Łazienki Królewskie. Śnieg i świąteczna atmosfera.',
        completed: true
      },
      {
        id: 'krakow-2023',
        country: 'Polska',
        voivodeship: 'Małopolskie',
        city: 'Kraków',
        date: '2023-11-15',
        notes: 'Bieg wokół Plant. Jesienne kolory, studencka atmosfera.',
        completed: true
      },
      {
        id: 'wroclaw-2023',
        country: 'Polska',
        voivodeship: 'Dolnośląskie',
        city: 'Wrocław',
        date: '2023-10-20',
        notes: 'Bieg przez Ostrów Tumski. Mosty i katedry w tle.',
        completed: true
      },
      {
        id: 'gdansk-2023',
        country: 'Polska',
        voivodeship: 'Pomorskie',
        city: 'Gdańsk',
        date: '2023-09-30',
        notes: 'Bieg wzdłuż Motławy. Morskie powietrze i zabytki.',
        completed: true
      },
      {
        id: 'poznan-2023',
        country: 'Polska',
        voivodeship: 'Wielkopolskie',
        city: 'Poznań',
        date: '2023-09-15',
        notes: 'Bieg przez Stary Rynek. Koziołki i kolorowe kamienice.',
        completed: true
      }
    ]
  }
];

// Oblicz statystyki dla kategorii biegów
categories.forEach(category => {
  if (category.id === 'bieganie' && category.runnings) {
    const uniqueCountries = new Set(category.runnings.map(r => r.country)).size;
    const uniqueVoivodeships = new Set(category.runnings.filter(r => r.voivodeship).map(r => r.voivodeship)).size;
    
    category.totalCount = uniqueCountries + uniqueVoivodeships;
    category.completedCount = category.runnings.filter(r => r.completed).length;
  }
});

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getAchievementById = (id: string): Achievement | undefined => {
  for (const category of categories) {
    const achievement = category.achievements.find(achievement => achievement.id === id);
    if (achievement) return achievement;
  }
  return undefined;
};

export const getRunningById = (id: string): Running | undefined => {
  for (const category of categories) {
    if (category.runnings) {
      const running = category.runnings.find(running => running.id === id);
      if (running) return running;
    }
  }
  return undefined;
};
