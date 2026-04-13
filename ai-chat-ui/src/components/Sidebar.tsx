'use client';

import React from 'react';
import { MessageSquare, Plus, Trash2, Settings, Moon, Sun, Monitor, Menu, X } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Theme } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { sessions, currentSessionId, createSession, deleteSession, setCurrentSession, theme, setTheme } = useChatStore();
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);

  const handleNewChat = () => {
    createSession();
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSession(sessionId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteSession(sessionId);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setShowThemeMenu(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-50',
          'w-72 flex flex-col',
          'bg-gray-50 dark:bg-dark-bg border-r border-gray-200 dark:border-dark-border',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          'md:transform-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-border">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-500" />
            AI Chat
          </h1>
          
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
              >
                {getThemeIcon()}
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-surface rounded-lg shadow-lg border border-gray-200 dark:border-dark-border overflow-hidden animate-slide-up z-50">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm flex items-center gap-2',
                      'hover:bg-gray-100 dark:hover:bg-dark-border',
                      theme === 'light' && 'text-primary-600 dark:text-primary-400'
                    )}
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm flex items-center gap-2',
                      'hover:bg-gray-100 dark:hover:bg-dark-border',
                      theme === 'dark' && 'text-primary-600 dark:text-primary-400'
                    )}
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </button>
                  <button
                    onClick={() => handleThemeChange('system')}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm flex items-center gap-2',
                      'hover:bg-gray-100 dark:hover:bg-dark-border',
                      theme === 'system' && 'text-primary-600 dark:text-primary-400'
                    )}
                  >
                    <Monitor className="w-4 h-4" />
                    System
                  </button>
                </div>
              )}
            </div>

            {/* Close button (mobile) */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-border transition-colors md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* New chat button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3',
              'bg-primary-500 hover:bg-primary-600',
              'text-white rounded-xl font-medium',
              'shadow-md hover:shadow-lg transition-all duration-200',
              'active:scale-98'
            )}
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="space-y-1">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-xs mt-1">Start a new chat to begin</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer',
                    'transition-all duration-200',
                    currentSessionId === session.id
                      ? 'bg-white dark:bg-dark-surface shadow-sm border border-gray-200 dark:border-dark-border'
                      : 'hover:bg-gray-200/50 dark:hover:bg-dark-border/50'
                  )}
                >
                  <MessageSquare
                    className={cn(
                      'w-5 h-5 flex-shrink-0',
                      currentSessionId === session.id
                        ? 'text-primary-500'
                        : 'text-gray-400 dark:text-gray-500'
                    )}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        'text-sm font-medium truncate',
                        currentSessionId === session.id
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-gray-700 dark:text-gray-300'
                      )}
                    >
                      {session.title}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {session.messages.length} messages · {formatRelativeTime(session.updatedAt)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className={cn(
                      'opacity-0 group-hover:opacity-100 p-1.5 rounded-lg',
                      'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
                      'transition-all duration-200'
                    )}
                    title="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-border">
          <button
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-2.5',
              'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
              'hover:bg-gray-200/50 dark:hover:bg-dark-border/50 rounded-xl',
              'transition-colors duration-200'
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};
