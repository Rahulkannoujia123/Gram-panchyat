export type Page = 
  | 'home' 
  | 'news' 
  | 'complaints' 
  | 'schemes' 
  | 'members' 
  | 'emergency' 
  | 'polls' 
  | 'notices'
  | 'notifications'
  | 'profile'
  | 'workers';

export type ServiceType =
  | 'Electrician'
  | 'Plumber'
  | 'Carpenter'
  | 'Mason'
  | 'Labor'
  | 'FarmLabor'
  | 'Painter'
  | 'Mechanic'
  | 'Welder'
  | 'Other';

export type ExperienceLevel = '1 year' | '2-5 years' | '5-10 years' | '10+ years';

export type AvailabilityStatus = 'Available Now' | 'Busy' | 'Available tomorrow' | 'On holiday';

export interface WorkerRate {
  standard: number;
  complex: number;
  emergency: number;
  materialsExtra: boolean;
}

export interface Worker {
  id: number;
  name: string;
  phone: string;
  whatsapp?: string;
  location: {
    village: Village;
    address: string;
  };
  photo?: string;
  serviceType: ServiceType;
  experience: ExperienceLevel;
  rateCard: WorkerRate;
  availability: AvailabilityStatus;
  trustScore: {
    verified: boolean;
    reviews: number;
    rating: number;
    yearsInService: number;
    complaints: number;
  };
}

export interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  liked?: boolean;
  icon?: string;
  village: Village;
}

export type Village = string;

export interface VillageStats {
  population2026: number;
  wardsCount: number;
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  userName: string;
  village: Village;
  status: 'pending' | 'in-progress' | 'resolved';
  category: string;
  votes: number;
  upvoted?: boolean;
  image?: string;
}

export interface Scheme {
  id: number;
  name: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  deadline?: string;
  category: string;
  link?: string;
}

export interface Member {
  id: number;
  name: string;
  role: string;
  ward: string;
  village: Village | 'Constituency';
  phone: string;
  image?: string;
  avatar?: string;
}

export interface Emergency {
  id: number;
  name: string;
  number: string;
  type: string;
  icon?: string;
}

export interface Poll {
  id: number;
  title: string;
  question: string;
  options: PollOption[];
  date: string;
  status: 'active' | 'closed';
  village: Village | 'All';
}

export interface PollOption {
  id: number;
  text: string;
  votes: number;
  voted?: boolean;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'medium' | 'low' | 'normal';
  author?: string;
  village: Village | 'All';
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  read: boolean;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  ward: string;
  language: 'hi' | 'en';
  theme: 'light' | 'dark';
  notifications: {
    enabled: boolean;
    byType: {
      news: boolean;
      complaints: boolean;
      schemes: boolean;
      polls: boolean;
      notices: boolean;
    };
  };
}
