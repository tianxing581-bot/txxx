
export enum AppSection {
  HOME = 'home',
  TUTORING = 'tutoring',
  REVIEW = 'review',
  COMPETENCY = 'competency',
  MARKETING = 'marketing',
  BP_EVAL = 'bp_eval',
  LOGIN = 'login',
  PROFILE = 'profile'
}

export interface ChatRecord {
  id: string;
  title: string;
  date: string;
  toolType: string;
}

export interface User {
  nickname: string;
  username: string;
  phone: string;
  isVip: boolean;
  avatar: string;
  chatCount: number;
  records: ChatRecord[];
}

export interface NavItem {
  id: AppSection;
  label: string;
}

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  systemPrompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}
