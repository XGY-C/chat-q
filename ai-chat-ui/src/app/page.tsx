'use client';

import React from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { ChatInput } from '@/components/ChatInput';
import { MessageBubble } from '@/components/MessageBubble';
import { Sidebar } from '@/components/Sidebar';
import { cn } from '@/lib/utils';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  const {
    sessions,
    currentSessionId,
    isLoading,
    addMessage,
    setLoading,
    createSession,
  } = useChatStore();

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with a session if none exists
  React.useEffect(() => {
    if (!currentSessionId && sessions.length === 0) {
      createSession('Welcome Chat');
    }
  }, [currentSessionId, sessions.length, createSession]);

  const handleSendMessage = async (content: string) => {
    if (!currentSessionId) return;

    // Add user message immediately (optimistic update)
    addMessage(currentSessionId, {
      role: 'user',
      content,
    });

    // Set loading state
    setLoading(true);

    try {
      // Simulate AI response with streaming
      await simulateAIResponseStreaming(content, currentSessionId);
    } catch (error) {
      console.error('Error getting response:', error);
      addMessage(currentSessionId, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Simulated AI response with streaming effect
  const simulateAIResponseStreaming = async (userMessage: string, sessionId: string) => {
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
    
    const responses = [
      "That's an interesting question! Let me think about it...\n\nBased on my understanding, I would suggest considering multiple perspectives on this topic. Here are some key points:\n\n1. **Context matters**: The answer often depends on the specific situation.\n2. **Best practices**: Following established guidelines can help.\n3. **Trade-offs**: Every approach has its pros and cons.\n\nWould you like me to elaborate on any of these points?",
      "Great question! Here's what I think:\n\nThe topic you've raised is quite nuanced. Let me break it down:\n\n```javascript\n// Example code snippet\nconst solution = (problem) => {\n  return problem.split('').reverse().join('');\n};\n```\n\nThis approach works well for many cases. Would you like to see more examples?",
      "I'd be happy to help with that!\n\nHere's a comprehensive answer:\n\n**Key Considerations**:\n- First, we need to understand the requirements\n- Then, we can evaluate different approaches\n- Finally, implement and test the solution\n\nLet me know if you need more details on any specific aspect!",
      "Thanks for asking! This is something I can definitely help with.\n\n**Summary**:\nThe short answer is yes, but there are some important caveats to consider.\n\n**Details**:\nWhen approaching this problem, it's essential to consider scalability, maintainability, and performance. Here's my recommendation based on best practices in the industry.",
    ];
    
    const lowerMessage = userMessage.toLowerCase();
    let responseText = '';
    if (lowerMessage.includes('code') || lowerMessage.includes('function')) {
      responseText = responses[1];
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      responseText = responses[2];
    } else {
      responseText = responses[Math.floor(Math.random() * responses.length)];
    }

    // Create placeholder assistant message
    const assistantMessageId = `msg-${Date.now()}`;
    const fullContent = responseText;
    let streamedContent = '';
    
    // Stream the response word by word
    const words = fullContent.split(/(\s+)/);
    for (let i = 0; i < words.length; i++) {
      streamedContent += words[i];
      
      // Add or update the assistant message with streamed content
      if (i === 0) {
        addMessage(sessionId, {
          id: assistantMessageId,
          role: 'assistant',
          content: streamedContent,
          metadata: {
            model: 'gpt-4',
            tokens: Math.floor(Math.random() * 200) + 50,
            latency: Math.floor(Math.random() * 500) + 100,
          },
        });
      } else {
        // Update existing message
        addMessage(sessionId, {
          id: assistantMessageId,
          role: 'assistant',
          content: streamedContent,
        });
      }
      
      // Simulate network delay between chunks
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 20));
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-surface">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-dark-border bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-600">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {currentSession?.title || 'AI Assistant'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentSession?.messages.length || 0} messages
                </p>
              </div>
            </div>
          </div>

          {/* Model selector placeholder */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-dark-border">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              GPT-4
            </span>
          </div>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to AI Chat
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                Start a conversation with your AI assistant. Ask questions, get help with code, or just chat!
              </p>
              
              {/* Suggestion cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                {[
                  { icon: '💡', title: 'Explain a concept', desc: 'Break down complex topics' },
                  { icon: '📝', title: 'Help me write', desc: 'Draft emails, essays, or code' },
                  { icon: '🔍', title: 'Analyze data', desc: 'Get insights from information' },
                  { icon: '🎨', title: 'Creative ideas', desc: 'Brainstorm and explore' },
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(suggestion.title + ': ' + suggestion.desc)}
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-xl',
                      'bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border',
                      'hover:border-primary-500 hover:shadow-md transition-all duration-200',
                      'text-left group'
                    )}
                  >
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {suggestion.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {suggestion.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages list */}
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              {messages.map((message, index) => {
                const isLastMessage = index === messages.length - 1;
                const isStreaming = isLastMessage && message.role === 'assistant' && isLoading;
                return (
                  <MessageBubble 
                    key={message.id || index} 
                    message={message} 
                    isStreaming={isStreaming}
                  />
                );
              })}
              
              {/* Loading indicator when no message yet */}
              {isLoading && messages.length === 0 && (
                <div className="flex gap-3 max-w-4xl mx-auto animate-slide-up">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-tl-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 dark:border-dark-border bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm p-4 pb-6">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
}
