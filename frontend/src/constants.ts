
import { Event, EventCategory } from './types';

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival 2024',
    description: 'The biggest outdoor music experience of the year featuring top international artists.',
    date: 'July 15, 2024',
    location: 'Central Park, New York',
    category: EventCategory.MUSIC,
    price: 120,
    imageUrl: 'https://picsum.photos/seed/music/800/600',
    organizer: 'Vibe Events'
  },
  {
    id: '2',
    title: 'AI & Future Tech Summit',
    description: 'Join industry leaders to discuss the next frontier of artificial intelligence and robotics.',
    date: 'August 22, 2024',
    location: 'Convention Center, San Francisco',
    category: EventCategory.TECH,
    price: 499,
    imageUrl: 'https://picsum.photos/seed/tech/800/600',
    organizer: 'TechConnect'
  },
  {
    id: '3',
    title: 'Gourmet Food Tour',
    description: 'A curated journey through the city\'s hidden culinary gems and Michelin-starred bites.',
    date: 'June 10, 2024',
    location: 'Downtown, Chicago',
    category: EventCategory.FOOD,
    price: 85,
    imageUrl: 'https://picsum.photos/seed/food/800/600',
    organizer: 'Taste Hunters'
  },
  {
    id: '4',
    title: 'Contemporary Art Expo',
    description: 'Explore breathtaking works from emerging artists across the globe.',
    date: 'September 5, 2024',
    location: 'Modern Art Gallery, London',
    category: EventCategory.ART,
    price: 45,
    imageUrl: 'https://picsum.photos/seed/art/800/600',
    organizer: 'ArtScape'
  },
  {
    id: '5',
    title: 'Startup Pitch Night',
    description: 'Watch the hottest new startups pitch to elite venture capitalists.',
    date: 'October 12, 2024',
    location: 'Innovation Hub, Austin',
    category: EventCategory.BUSINESS,
    price: 25,
    imageUrl: 'https://picsum.photos/seed/business/800/600',
    organizer: 'Ventures X'
  }
];

export const CATEGORIES = Object.values(EventCategory);
