'use client';

import React from 'react';
import { Send, SquareSquare, Mic, Paperclip } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = React.useState('');
  const [isComposing, setIsComposing] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { isLoading } = useChatStore();

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim() || disabled || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        // Handle image paste - could be extended for file upload
        console.log('Image pasted - feature to be implemented');
        break;
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className={cn(
          'relative flex items-end gap-2 p-3 rounded-2xl border',
          'bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm',
          'border-gray-200 dark:border-dark-border',
          'shadow-lg transition-all duration-200',
          'focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {/* Attachment button */}
        <button
          type="button"
          className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
          disabled={disabled || isLoading}
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onPaste={handlePaste}
          placeholder="Type your message..."
          rows={1}
          disabled={disabled || isLoading}
          className={cn(
            'flex-1 resize-none bg-transparent border-0 outline-none',
            'text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
            'py-2 px-1 max-h-[200px]',
            'disabled:cursor-not-allowed'
          )}
          style={{ minHeight: '24px' }}
        />

        {/* Voice input button (optional feature) */}
        <button
          type="button"
          className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
          disabled={disabled || isLoading}
          title="Voice input"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled || isLoading}
          className={cn(
            'p-2.5 rounded-xl transition-all duration-200',
            'bg-primary-500 hover:bg-primary-600',
            'text-white shadow-md hover:shadow-lg',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
            'active:scale-95'
          )}
        >
          {isLoading ? (
            <SquareSquare className="w-5 h-5 animate-pulse" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* Helper text */}
      <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  );
};
