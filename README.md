# AI Studio Frontend

A Next.js application for AI image generation with shadcn/ui and Tailwind CSS.

## Features

### 🎨 Core Functionality
- **AI Image Generation** - Generate images using text prompts and style preferences
- **Prompt Input System** - Rich text input for detailed image descriptions
- **Style Selection** - Choose from 5 predefined styles (Editorial, Streetwear, Vintage, Minimalist, Artistic)
- **Mock API Integration** - Simulated image generation with realistic delays and error handling

### 📁 File Management
- **Image Upload** - Drag & drop or click to upload PNG/JPG images
- **File Validation** - Automatic format and size checking (max 10MB)
- **Client-side Processing** - Automatic image downscaling to ≤1920px dimensions
- **Image Preview** - Real-time preview of uploaded images

### 🔄 Generation & History
- **Response Queue** - FIFO-based history management (max 5 items)
- **Persistent Storage** - Automatic localStorage persistence of generation history
- **History Display** - Review previous generations with details and timestamps
- **Configuration Restoration** - Restore previous prompt/style combinations
- **Error Handling** - Comprehensive error states with retry mechanisms

### 🎯 User Experience
- **Modern UI Design** - Clean, professional interface with glassmorphism effects
- **Responsive Layout** - Side panel + main content area with proper spacing
- **Loading States** - Visual feedback during image processing and generation
- **Real-time Updates** - Live summary of current prompt, style, and generation status
- **Accessibility** - Keyboard navigation and ARIA attributes

### 🛠️ Technical Features
- **Server-side Rendering** - Full SSR compatibility with Next.js
- **Hydration Safety** - Prevents client/server rendering mismatches
- **Type Safety** - Full TypeScript support throughout the application
- **Error Recovery** - Exponential backoff retry logic for failed API calls
- **Performance Optimized** - Efficient queue operations and minimal re-renders

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library
- **ESLint** - Code linting


