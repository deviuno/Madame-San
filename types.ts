export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  price?: number;
  isPremium?: boolean;
  isFree?: boolean;
  rating?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

export interface FeedItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  type: 'Artigo' | 'Vídeo' | 'Premium';
  readTime?: string;
  isLocked?: boolean;
  videoDuration?: string;
}
