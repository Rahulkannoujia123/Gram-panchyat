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
  | 'profile';

export interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  content: string;
  image?: string;
  likes: number;
  liked?: boolean;
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  date: string;
  status: string;
  category: string;
  upvotes: number;
  upvoted?: boolean;
}

export interface Scheme {
  id: number;
  name: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  deadline?: string;
  category: string;
}

export interface Member {
  id: number;
  name: string;
  role: string;
  ward: string;
  phone: string;
  image?: string;
}

export interface Emergency {
  id: number;
  name: string;
  number: string;
  type: string;
}

export interface Poll {
  id: number;
  title: string;
  question: string;
  options: PollOption[];
  date: string;
  status: 'active' | 'closed';
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
  priority: 'high' | 'normal' | 'low';
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
