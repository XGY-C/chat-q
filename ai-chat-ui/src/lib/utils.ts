import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export const simulateAIResponse = async (userMessage: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const responses = [
    "That's an interesting question! Let me think about it...\n\nBased on my understanding, I would suggest considering multiple perspectives on this topic. Here are some key points:\n\n1. **Context matters**: The answer often depends on the specific situation.\n2. **Best practices**: Following established guidelines can help.\n3. **Trade-offs**: Every approach has its pros and cons.\n\nWould you like me to elaborate on any of these points?",
    "Great question! Here's what I think:\n\nThe topic you've raised is quite nuanced. Let me break it down:\n\n```javascript\n// Example code snippet\nconst solution = (problem) => {\n  return problem.split('').reverse().join('');\n};\n```\n\nThis approach works well for many cases. Would you like to see more examples?",
    "I'd be happy to help with that!\n\nHere's a comprehensive answer:\n\n**Key Considerations:**\n- First, we need to understand the requirements\n- Then, we can evaluate different approaches\n- Finally, implement and test the solution\n\nLet me know if you need more details on any specific aspect!",
    "Thanks for asking! This is something I can definitely help with.\n\n**Summary:**\nThe short answer is yes, but there are some important caveats to consider.\n\n**Details:**\nWhen approaching this problem, it's essential to consider scalability, maintainability, and performance. Here's my recommendation based on best practices in the industry.",
  ];
  
  // Simple keyword-based response selection
  const lowerMessage = userMessage.toLowerCase();
  if (lowerMessage.includes('code') || lowerMessage.includes('function') || lowerMessage.includes('program')) {
    return responses[1];
  }
  if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
    return responses[2];
  }
  if (lowerMessage.includes('yes') || lowerMessage.includes('no') || lowerMessage.includes('?')) {
    return responses[3];
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};
