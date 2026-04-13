# AI 聊天界面 (AI Chat UI)

一个现代化、功能丰富的 AI 对话前端应用，基于 Next.js 14 构建。

## ✨ 特性

### 核心功能
- **💬 多会话管理** - 创建、切换、删除聊天会话，支持会话重命名
- **🤖 智能消息系统** - 用户/助手消息气泡，支持代码高亮、复制、反馈
- **⚡ 流式响应模拟** - 打字机效果展示 AI 回复，提供自然对话体验
- **🎨 主题系统** - 浅色/深色/自动模式，支持实时切换
- **📱 完全响应式** - 完美适配桌面、平板和移动设备
- **🔌 Skills 插件** - 预置 5 个技能卡片（网络搜索、代码执行、图像生成、数据分析、文档处理）

### 技术亮点
- **状态持久化** - 使用 localStorage 自动保存聊天记录和设置
- **流畅动画** - 平滑的过渡效果和加载动画
- **类型安全** - 完整的 TypeScript 类型定义
- **模块化架构** - 清晰的组件拆分和状态管理

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **状态管理**: Zustand
- **图标**: Lucide React
- **工具**: clsx, tailwind-merge

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装步骤

```bash
# 进入项目目录
cd ai-chat-ui

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 生产构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📁 项目结构

```
ai-chat-ui/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # 根布局与主题提供者
│   │   └── page.tsx      # 主页面组件
│   ├── components/       # React 组件
│   │   ├── ChatInput.tsx     # 聊天输入框（支持多行、发送、技能选择）
│   │   ├── MessageBubble.tsx # 消息气泡（渲染用户/AI 消息、代码块）
│   │   └── Sidebar.tsx       # 侧边栏（会话列表、新建按钮、设置）
│   ├── lib/
│   │   ├── store.ts      # Zustand 状态管理（会话、消息、主题）
│   │   └── utils.ts      # 工具函数（类名合并、格式化等）
│   ├── styles/
│   │   └── globals.css   # 全局样式与 Tailwind 指令
│   └── types/
│       └── index.ts      # TypeScript 类型定义
├── package.json          # 项目依赖配置
├── tailwind.config.js    # TailwindCSS 配置
├── tsconfig.json         # TypeScript 配置
├── README.md             # 中文文档（本文件）
└── README_EN.md          # English Documentation
```

## 🎯 主要组件说明

### ChatInput (输入框)
- 多行文本输入，自动调整高度
- 支持 Shift+Enter 换行，Enter 发送
- 技能选择器下拉菜单
- 发送按钮动画反馈
- 禁用状态处理

### MessageBubble (消息气泡)
- 区分用户/AI 消息样式
- Markdown 内容渲染（基础支持）
- 代码块语法高亮
- 一键复制代码功能
- 消息反馈（点赞/点踩）
- 时间戳显示

### Sidebar (侧边栏)
- 会话列表展示
- 新建/删除/切换会话
- 响应式折叠（移动端）
- 主题切换按钮
- 设置入口

## ⚙️ 状态管理

使用 Zustand 进行全局状态管理：

```typescript
// 主要状态
{
  sessions: Session[];      // 会话列表
  currentSessionId: string; // 当前会话 ID
  messages: Message[];      // 当前会话消息
  theme: 'light' | 'dark' | 'system'; // 主题
  sidebarOpen: boolean;     // 侧边栏状态（移动端）
}

// 主要操作
{
  createSession();          // 新建会话
  deleteSession(id);        // 删除会话
  switchSession(id);        // 切换会话
  sendMessage(content);     // 发送消息
  toggleTheme();            // 切换主题
  toggleSidebar();          // 切换侧边栏
}
```

## 🎨 主题定制

项目支持三种主题模式：
- **浅色模式**: 清爽明亮，适合日间使用
- **深色模式**: 护眼舒适，适合夜间使用  
- **系统模式**: 跟随操作系统自动切换

主题偏好保存在 localStorage，刷新页面后自动恢复。

## 🔧 自定义扩展

### 添加新技能
在 `page.tsx` 中修改 `SKILLS` 数组：

```typescript
const SKILLS = [
  {
    id: 'custom-skill',
    name: '自定义技能',
    description: '技能描述',
    icon: <IconComponent />,
    color: 'bg-blue-500'
  }
];
```

### 修改主题颜色
编辑 `tailwind.config.js` 扩展颜色配置：

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* 你的颜色 */ }
    }
  }
}
```

### 接入真实后端
当前使用模拟数据，接入真实 API 需修改：
1. `lib/store.ts` 中的 `sendMessage` 方法
2. 替换 `simulateAIResponse` 为真实 API 调用
3. 实现流式响应处理（推荐 Vercel AI SDK）

## 📝 注意事项

- 当前版本使用模拟数据，未连接真实 AI 后端
- 代码高亮功能为基础实现，复杂场景建议集成 prismjs 或 highlight.js
- 移动端侧边栏默认关闭，点击菜单按钮打开
- 聊天记录保存在浏览器 localStorage，清除缓存会丢失数据

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**相关文档**: [English Version](./README_EN.md)
