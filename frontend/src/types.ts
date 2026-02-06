
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: EventCategory;
  price: number;
  imageUrl: string;
  organizer: string;
}

export enum EventCategory {
  MUSIC = 'Music',
  TECH = 'Technology',
  ART = 'Art',
  SPORTS = 'Sports',
  FOOD = 'Food & Drink',
  BUSINESS = 'Business'
}

export interface SearchFilters {
  query: string;
  category: string;
  location: string;
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
