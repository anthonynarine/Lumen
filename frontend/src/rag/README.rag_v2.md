# 🧠 Lumen RAG Assistant — Developer Guide

This AI assistant drawer is a modular, React-based UI component that enables users to ask questions and receive live responses from a RAG (Retrieval-Augmented Generation) backend. It provides a seamless experience that includes a typing animation, message memory, context-aware input, and consistent design matching the app's dark theme.

---

## 🧩 Component Architecture Overview

```
<App>
 └── <RagProvider>
      └── <RagDrawer />  ← Main assistant container
           ├── Header (label + close button)
           ├── <MessageList /> ← Displays all messages
           │    └── <TypingMessage /> ← Animated response from assistant
           └── <InputBox />     ← User message input and send button
```

---

## 🧬 Component Breakdown

### 1. **RagProvider**
- 📁 `context/RagProvider.tsx`
- React Context provider that stores assistant drawer state.
- Makes the following available to all children:
  - `isOpen`: Whether the drawer is visible
  - `messages`: Full list of messages
  - `openDrawer()`, `closeDrawer()`
  - `addMessage()`, `setMessages()`

### 2. **RagDrawer**
- 📁 `components/RagDrawer.tsx`
- The floating drawer UI.
- Displays messages (`MessageList`), a text input (`InputBox`), and a close button.
- Animates open/close based on `isOpen`.
- Uses a scroll ref to auto-scroll to the latest message.

### 3. **MessageList**
- 📁 `components/Messages.tsx`
- Maps over the `messages` array from context.
- Renders each message based on its type (`user`, `ai`, `system`).
- For the most recent AI message, renders `<TypingMessage />` to animate text.

### 4. **TypingMessage**
- 📁 `components/TypingMessage.tsx`
- Animated typing effect for assistant responses.
- Displays one character at a time using `setInterval`.
- Includes a blinking cursor.
- Uses `scrollIntoView` to keep output visible.

### 5. **InputBox**
- 📁 `components/InputBox.tsx`
- User input field + send button.
- Auto-expands textarea height as you type.
- Calls `useRagAgent().sendQuery()` on submit.
- Disables input during loading.

---

## ⚙️ Hooks and Logic

### 6. **useRagContext**
- 📁 `hooks/useRagContext.ts`
- Safely consumes the context.
- Throws an error if used outside `<RagProvider>`.

### 7. **useRagAgent**
- 📁 `hooks/useRagAgent.tsx`
- Core logic for sending a user message to the backend and handling response.
- Adds the user message immediately to context.
- Calls the async `askAgent({ question })` function.
- Adds AI response after it's returned.
- Tracks `loading` and `error` states.

---

## 📡 API Call Flow

```js
InputBox → useRagAgent → askAgent() → backend responds → message added via context → MessageList renders
```

1. User types a message and hits send.
2. Message is added to the context immediately.
3. API call is made via `askAgent()`.
4. AI's answer is parsed and also added to the message list.
5. UI scrolls to bottom and shows response (with animation if last AI message).

---

## 🎨 Theming & UX

- Uses TailwindCSS for layout, spacing, and dark theme.
- Lucide icons for UI polish (`ArrowUpCircle`, `X`).
- Smooth transitions (`ease-in-out`, `translate`, `opacity`).
- Input field, message list, and drawer panel all match your app’s dark branding.

---

## ✅ Integration Checklist

To integrate the RAG assistant into any React app:

1. Wrap your app in `<RagProvider>`.
2. Place `<RagDrawer />` somewhere globally (usually near root layout).
3. Trigger `openDrawer()` from anywhere using `useRagContext()`.
4. Make sure `askAgent()` is correctly connected to your backend.

---

## 📁 File Structure Summary

```
/components
  ├── RagDrawer.tsx
  ├── InputBox.tsx
  ├── Messages.tsx
  └── TypingMessage.tsx

/context
  ├── RagContext.ts
  └── RagProvider.tsx

/hooks
  ├── useRagContext.ts
  └── useRagAgent.tsx

/api
  └── ragApi.ts  // Sends queries to backend
```

---

## 🧠 Assistant Philosophy

This assistant isn’t just a UI feature — it’s designed to feel intelligent, elegant, and invisible until summoned. The code is modular, typed, and accessible to junior and senior devs alike.