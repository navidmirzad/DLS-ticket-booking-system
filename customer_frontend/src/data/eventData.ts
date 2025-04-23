import { EventType } from '../types/eventTypes';

export const events: EventType[] = [
  {
    id: '1',
    title: 'Taylor Swift | The Eras Tour',
    category: 'Concert',
    date: '2025-05-15T19:30:00',
    venue: 'Levi\'s Stadium',
    location: 'Santa Clara, CA',
    imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: {
      min: 99,
      max: 499
    },
    description: 'Experience the magic of Taylor Swift\'s record-breaking Eras Tour live! This three-hour musical journey spans her entire career with stunning visuals, multiple set and costume changes, and all her biggest hits.',
    featured: true,
    tags: ['Pop', 'Live Music', 'Stadium Tour'],
    availableTickets: 352
  },
  {
    id: '2',
    title: 'Tech Innovation Summit 2025',
    category: 'Conference',
    date: '2025-06-10T09:00:00',
    venue: 'Moscone Center',
    location: 'San Francisco, CA',
    imageUrl: 'https://images.pexels.com/photos/2182973/pexels-photo-2182973.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: {
      min: 199,
      max: 899
    },
    description: 'Join tech leaders and innovators for three days of inspiring keynotes, hands-on workshops, and networking opportunities. Discover the latest trends in AI, blockchain, quantum computing, and more.',
    featured: true,
    tags: ['Technology', 'Networking', 'Professional'],
    availableTickets: 785
  },
  {
    id: '3',
    title: 'NBA Finals 2025: Game 1',
    category: 'Sports',
    date: '2025-06-05T18:00:00',
    venue: 'Chase Center',
    location: 'San Francisco, CA',
    imageUrl: 'https://images.pexels.com/photos/945471/pexels-photo-945471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: {
      min: 250,
      max: 8000
    },
    description: 'Witness basketball history at the opening game of the NBA Finals. Experience the electric atmosphere as the league\'s best teams battle for championship glory.',
    featured: true,
    tags: ['Basketball', 'Sports', 'Championship'],
    availableTickets: 125
  },
  {
    id: '4',
    title: 'Hamilton: The Musical',
    category: 'Theater',
    date: '2025-04-22T19:00:00',
    venue: 'Orpheum Theatre',
    location: 'San Francisco, CA',
    imageUrl: 'https://images.pexels.com/photos/11068183/pexels-photo-11068183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: {
      min: 89,
      max: 399
    },
    description: 'Don\'t miss the return of the revolutionary musical that took the world by storm. Experience the innovative telling of founding father Alexander Hamilton\'s story through a blend of hip-hop, jazz, R&B, and Broadway.',
    featured: false,
    tags: ['Broadway', 'Musical', 'Historical'],
    availableTickets: 210
  },
  {
    id: '5',
    title: 'Wine & Food Festival',
    category: 'Food & Drink',
    date: '2025-07-18T12:00:00',
    venue: 'Golden Gate Park',
    location: 'San Francisco, CA',
    imageUrl: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: {
      min: 75,
      max: 150
    },
    description: 'Indulge in a weekend of culinary delights featuring premium wines, craft beers, and gourmet dishes from top local and celebrity chefs. Includes cooking demonstrations, tastings, and live entertainment.',
    featured: false,
    tags: ['Culinary', 'Wine', 'Festival'],
    availableTickets: 568
  },
  {
    id: '6',
    title: 'Coldplay World Tour',
    category: 'Concert',
    date: '2025-05-30T20:00:00',
    venue: 'Oracle Park',
    location: 'San Francisco, CA',
    imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: {
      min: 95,
      max: 450
    },
    description: 'Coldplay returns with their spectacular live show featuring stunning visual effects, interactive light-up wristbands, and all their greatest hits from across their career. A must-see concert experience!',
    featured: true,
    tags: ['Rock', 'Live Music', 'Stadium Tour'],
    availableTickets: 422
  }
];

export const featuredEvents = events.filter(event => event.featured);

export const categories = [
  { id: 'concert', name: 'Concerts', icon: 'music' },
  { id: 'sports', name: 'Sports', icon: 'trophy' },
  { id: 'theater', name: 'Theater', icon: 'theater' },
  { id: 'conference', name: 'Conferences', icon: 'users' },
  { id: 'food', name: 'Food & Drink', icon: 'utensils' }
];

export const getEventById = (id: string): EventType | undefined => {
  return events.find(event => event.id === id);
};

export const getRelatedEvents = (event: EventType): EventType[] => {
  return events
    .filter(e => e.id !== event.id && e.category === event.category)
    .slice(0, 3);
};