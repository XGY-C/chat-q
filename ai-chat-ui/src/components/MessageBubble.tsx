'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Bot, Copy, Check, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Message } from '@/types';
import { cn, formatDate } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming = false }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [displayContent, setDisplayContent] = useState('');
  const codeBlockRef = useRef<HTMLPreElement>(null);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // Typewriter effect for streaming assistant messages
  useEffect(() => {
    if (!isAssistant || !isStreaming) {
      setDisplayContent(message.content);
      return;
    }

    let currentIndex = 0;
    const targetContent = message.content;
    setDisplayContent('');

    const streamInterval = setInterval(() => {
      if (currentIndex < targetContent.length) {
        const remaining = targetContent.slice(currentIndex);
        const nextSpace = remaining.indexOf(' ');
        const chunkSize = nextSpace > 0 && nextSpace < 20 ? nextSpace + 1 : Math.min(20, remaining.length);
        
        setDisplayContent(targetContent.slice(0, currentIndex + chunkSize));
        currentIndex += chunkSize;
      } else {
        clearInterval(streamInterval);
      }
    }, 30);

    return () => clearInterval(streamInterval);
  }, [message.content, isAssistant, isStreaming]);

  // Auto-scroll code blocks when streaming
  useEffect(() => {
    if (isStreaming && codeBlockRef.current) {
      codeBlockRef.current.scrollTop = codeBlockRef.current.scrollHeight;
    }
  }, [displayContent, isStreaming]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(feedback === type ? null : type);
  };

  // Enhanced markdown rendering
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.slice(3, -3);
        const lines = codeContent.split('\n');
        const language = lines[0].trim() || 'code';
        const code = lines.slice(1).join('\n');
        
        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-gray-200 dark:border-dark-border">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 text-gray-300 text-xs">
              <span className="font-mono">{language}</span>
              <button onClick={handleCopy} className="flex items-center gap-1 hover:text-white transition-colors">
                {copied ? (<><Check className="w-3 h-3" /><span>Copied!</span></>) : (<><Copy className="w-3 h-3" /><span>Copy</span></>)}
              </button>
            </div>
            <pre ref={codeBlockRef} className="p-4 bg-gray-900 dark:bg-black overflow-x-auto text-sm text-gray-100 max-h-96" style={{ tabSize: 2 }}>
              <code className="font-mono">{code}</code>
            </pre>
          </div>
        );
      }
      
      return (
        <span key={index}>
          {part.split(/(\n\n|\n|^\s*[-*]\s+|^\s*\d+\.\s+|^\s*>\s+|\$\$[\s\S]*?\$\$|\$[^$]*\$)/g).map((segment, i) => {
            if (segment === '\n\n') return <br key={i} />;
            if (segment.startsWith('**') && segment.endsWith('**')) return <strong key={i} className="font-semibold">{segment.slice(2, -2)}</strong>;
            if (segment.startsWith('*') && segment.endsWith('*') && !segment.startsWith('**')) return <em key={i}>{segment.slice(1, -1)}</em>;
            if (segment.startsWith('`') && segment.endsWith('`')) return <code key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-red-600 dark:text-red-400">{segment.slice(1, -1)}</code>;
            if (segment.startsWith('$') && segment.endsWith('$') && !segment.startsWith('$$')) return <span key={i} className="px-1 py-0.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm font-serif italic text-purple-700 dark:text-purple-300">{segment.slice(1, -1)}</span>;
            if (segment.startsWith('$$') && segment.endsWith('$$')) return <div key={i} className="my-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center font-serif italic text-purple-700 dark:text-purple-300 overflow-x-auto">{segment.slice(2, -2)}</div>;
            if (segment.match(/^\s*[-*]\s+/)) return <div key={i} className="flex items-start gap-2 my-1 ml-4"><span className="text-gray-400 mt-1">•</span><span>{segment.replace(/^\s*[-*]\s+/, '')}</span></div>;
            const numberedMatch = segment.match(/^\s*(\d+)\.\s+(.+)/);
            if (numberedMatch) return <div key={i} className="flex items-start gap-2 my-1 ml-4"><span className="text-gray-400 mt-1 min-w-[1.5rem]">{numberedMatch[1]}.</span><span>{numberedMatch[2]}</span></div>;
            if (segment.match(/^\s*>\s+/)) return <blockquote key={i} className="border-l-4 border-primary-400 pl-4 my-3 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-dark-border py-2 pr-2 rounded-r">{segment.replace(/^\s*>\s+/, '')}</blockquote>;
            if (segment.match(/^#+\s+/)) {
              const level = segment.match(/^#+/)?.[0].length || 1;
              const text = segment.replace(/^#+\s+/, '');
              const HeaderTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
              const sizeClasses: Record<number, string> = { 1: 'text-2xl font-bold mt-6 mb-3', 2: 'text-xl font-bold mt-5 mb-2', 3: 'text-lg font-semibold mt-4 mb-2', 4: 'text-base font-semibold mt-3 mb-1' };
              return <HeaderTag key={i} className={sizeClasses[level] || sizeClasses[4]}>{text}</HeaderTag>;
            }
            return segment;
          })}
        </span>
      );
    });
  };

  return (
    <div className={cn('flex gap-3 max-w-4xl mx-auto animate-slide-up', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', isUser ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white' : isAssistant ? 'bg-gradient-to-br from-emerald-400 to-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300')}>
        {isUser ? <User className="w-5 h-5" /> : isAssistant ? (isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />) : null}
      </div>

      <div className={cn('group relative flex-1', isUser ? 'text-right' : 'text-left')}>
        <div className={cn('inline-block px-4 py-3 rounded-2xl max-w-[85%] md:max-w-[75%]', isUser ? 'bg-primary-500 text-white rounded-tr-sm' : 'bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-tl-sm shadow-sm')}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {isAssistant && isStreaming ? renderContent(displayContent) : renderContent(message.content)}
            {isStreaming && isAssistant && <span className="inline-block w-2 h-4 ml-1 bg-primary-500 animate-pulse align-middle" />}
          </div>
        </div>

        {!isStreaming && (
          <div className={cn('flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity', isUser ? 'justify-end' : 'justify-start')}>
            <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(message.timestamp)}</span>
            {isAssistant && (
              <>
                <button onClick={handleCopy} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors" title="Copy message">
                  {copied ? <Check className="w-3.5 h