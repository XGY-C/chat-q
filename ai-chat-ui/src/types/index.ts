export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    latency?: number;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export type Theme = 'light' | 'dark' | 'system';

export interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  skills: Skill[];
  theme: Theme;
}
