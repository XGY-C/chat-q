# AI Chat UI

A modern, professional AI chat interface built with Next.js 14, TypeScript, TailwindCSS, and Zustand.

## Features

- 🎨 **Beautiful Design**: Modern UI with smooth animations and dark mode support
- 💬 **Real-time Chat**: Interactive messaging with typing indicators
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile
- 🧩 **Skills System**: Extensible plugin architecture for AI capabilities
- 🎯 **Session Management**: Multiple chat conversations with history
- ⚡ **Performance**: Optimized with client-side state management
- ♿ **Accessible**: Keyboard navigation and screen reader support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd ai-chat-ui
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
ai-chat-ui/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Main chat page
│   ├── components/       # React components
│   │   ├── ChatInput.tsx     # Message input
│   │   ├── MessageBubble.tsx # Chat message display
│   │   └── Sidebar.tsx       # Navigation sidebar
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and store
│   │   ├── store.ts      # Zustand state management
│   │   └── utils.ts      # Helper functions
│   ├── styles/           # Global styles
│   │   └── globals.css   # Tailwind and custom CSS
│   └── types/            # TypeScript types
│       └── index.ts      # Type definitions
├── public/               # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Key Components

### ChatInput
- Auto-resizing textarea
- File attachment support
- Voice input placeholder
- Send button with loading state

### MessageBubble
- User and assistant message styling
- Code block rendering with syntax highlighting
- Copy to clipboard functionality
- Feedback thumbs up/down
- Message metadata display

### Sidebar
- Session list with search
- New chat creation
- Theme switching (light/dark/system)
- Responsive mobile drawer

## State Management

Uses Zustand for global state:
- Chat sessions and messages
- Loading states
- Active skills/plugins
- Theme preferences
- Persistent storage

## Customization

### Adding New Skills

Edit `src/lib/store.ts` to add new skills:

```typescript
{
  id: 'your-skill',
  name: 'Your Skill',
  description: 'What it does',
  icon: 'icon-name',
  enabled: true,
}
```

### Theme Colors

Modify `tailwind.config.js` to customize colors:

```javascript
colors: {
  primary: { /* your colors */ },
  dark: { /* your colors */ },
}
```

## API Integration

To connect to a real AI backend:

1. Replace `simulateAIResponse` in `page.tsx`
2. Add your API endpoint
3. Handle streaming responses if needed

Example:
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message: content }),
});
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Acknowledgments

Inspired by:
- Vercel AI SDK
- Chatbot UI
- shadcn/ui
- Lucide Icons
