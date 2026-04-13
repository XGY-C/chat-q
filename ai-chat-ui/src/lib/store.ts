import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatState, Message, ChatSession, Skill, Theme } from '@/types';

const generateId = () => Math.random().toString(36).substring(2, 15);

const defaultSkills: Skill[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the web for current information',
    icon: 'search',
    enabled: false,
  },
  {
    id: 'code-executor',
    name: 'Code Executor',
    description: 'Execute code snippets safely',
    icon: 'code',
    enabled: false,
  },
  {
    id: 'image-generator',
    name: 'Image Generator',
    description: 'Generate images from text descriptions',
    icon: 'image',
    enabled: false,
  },
  {
    id: 'file-processor',
    name: 'File Processor',
    description: 'Process and analyze uploaded files',
    icon: 'file',
    enabled: false,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Perform mathematical calculations',
    icon: 'calculator',
    enabled: true,
  },
];

const createInitialState = (): ChatState => ({
  sessions: [],
  currentSessionId: null,
  isLoading: false,
  skills: defaultSkills,
  theme: 'system',
});

interface ChatActions {
  createSession: (title?: string) => string;
  deleteSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string | null) => void;
  addMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (sessionId: string, messageId: string, content: string) => void;
  setLoading: (loading: boolean) => void;
  toggleSkill: (skillId: string) => void;
  setTheme: (theme: Theme) => void;
  clearSessions: () => void;
}

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      createSession: (title = 'New Chat') => {
        const newSession: ChatSession = {
          id: generateId(),
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          model: 'gpt-4',
        };
        
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id,
        }));
        
        return newSession.id;
      },

      deleteSession: (sessionId) => {
        set((state) => {
          const newSessions = state.sessions.filter(s => s.id !== sessionId);
          return {
            sessions: newSessions,
            currentSessionId: state.currentSessionId === sessionId 
              ? (newSessions[0]?.id || null) 
              : state.currentSessionId,
          };
        });
      },

      setCurrentSession: (sessionId) => {
        set({ currentSessionId: sessionId });
      },

      addMessage: (sessionId, messageData) => {
        const message: Message = {
          ...messageData,
          id: generateId(),
          timestamp: new Date(),
        };

        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, message],
                  updatedAt: new Date(),
                  title: session.messages.length === 0 && message.role === 'user'
                    ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                    : session.title,
                }
              : session
          ),
        }));

        return message.id;
      },

      updateMessage: (sessionId, messageId, content) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: session.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, content } : msg
                  ),
                  updatedAt: new Date(),
                }
              : session
          ),
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      toggleSkill: (skillId) => {
        set((state) => ({
          skills: state.skills.map((skill) =>
            skill.id === skillId ? { ...skill, enabled: !skill.enabled } : skill
          ),
        }));
      },

      setTheme: (theme) => {
        set({ theme });
      },

      clearSessions: () => {
        set({ sessions: [], currentSessionId: null });
      },
    }),
    {
      name: 'ai-chat-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        skills: state.skills,
        theme: state.theme,
      }),
    }
  )
);
