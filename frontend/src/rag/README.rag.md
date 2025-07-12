# 🧠 RAG Assistant Drawer for Lumen

This module implements a bottom-positioned, toggleable assistant drawer powered by a Retrieval-Augmented Generation (RAG) backend. It integrates cleanly into the Lumen frontend using modular React + Tailwind CSS + TypeScript.

---

## 📁 Folder Structure

```
src/
└── rag/
    ├── components/       # UI components (Drawer, InputBox, MessageList, Toggle)
    ├── context/          # React Context + Provider
    ├── hooks/            # useRagAgent + useRagContext
    ├── types/            # Type definitions for context/messages
    └── api/              # RAG API call (askAgent)
```


        ┌───────────────────────────┐
        │       RagToggleButton     │ ◄─────────────┐
        └────────────┬──────────────┘               │
                     │                              │
                     ▼                              │
        ┌────────────────────────────┐              │
        │    useRagContext (open)    │              │
        └────────────┬─────────────-─┘              │
                     │                              │
                     ▼                              │
        ┌───────────────────────────┐               │
        │        RagDrawer          │               │
        └────────────┬──────────────┘               │
                     │                              │
     ┌───────────────┴──────────────┐               │
     ▼                              ▼               │
┌──────────────┐          ┌──────────────────┐      │
│ MessageList  │          │     InputBox     │      │
│ (shows msgs) │          │ (user input UI)  │      │
└──────────────┘          └────────┬─────────┘      │
                                   ▼                │
                        ┌─────────────────────┐     │
                        │   useRagAgent.ts    │     │
                        │  ─ sendQuery() ───▶  ───-┘
                        └───────┬────────────-┘
                                ▼
                         ┌──────────────┐
                         │ askAgent.ts  │
                         │ (API POST)   │
                         └─────┬────────┘
                               ▼
                 ┌────────────────────────┐
                 │  FastAPI RAG backend   │
                 │  (e.g. /ask endpoint)  │
                 └────────────────────────┘


---

## 🧩 Components Overview

### `RagDrawer.tsx`
- Fixed-position bottom drawer
- Contains MessageList + InputBox
- Closes via ✕ button
- Respects `isOpen` state from context

### `InputBox.tsx`
- Textarea + Send button
- Calls `sendQuery()` from `useRagAgent`

### `MessageList.tsx`
- Displays messages from context
- Labels "You:" (green) and "RAG:" (cyan)

### `RagToggleButton.tsx`
- Floating button to open drawer
- Bottom-right position

---

## 🧠 State & Logic

### `RagContext.tsx`
- Holds drawer state and message list

### `RagProvider.tsx`
- Context provider for Lumen app

### `useRagContext.ts`
- Safe hook to access context

---

## 📡 API Hook

### `useRagAgent.ts`
- Handles message flow:
  - Adds user message
  - Sends `POST /ask` via `askAgent`
  - Adds animated AI response
  - Manages loading + error state

### `askAgent.ts`
- Calls RAG FastAPI backend

```ts
POST http://localhost:8001/ask
{ "question": "..." }
```

---

## 🔁 Interaction Diagram

```
RagToggleButton → useRagContext().openDrawer()
         ↓
    ┌──────────────┐
    │  RagDrawer   │
    └────┬──┬──────┘
         │  └────────→ InputBox → useRagAgent → askAgent → FastAPI
         │
         └────────────→ MessageList ← (messages from context)
```

---

## ✅ Usage Example

```tsx
<RagProvider>
  <MainLayout />
  <RagDrawer />
  <RagToggleButton />
</RagProvider>
```

---

## 🎨 Styling & Theme

- Dark mode (black background, white/cyan/green text)
- Responsive Tailwind styling
- Minimal & modern, mobile-safe

---

## 🧪 Future Ideas

- Streaming support with `ReadableStream`
- Source doc citations (like ChatGPT-style)
- Named agents (e.g. Julia, Kadian)

---

Built with ❤️ to power AI-assisted vascular reporting in **Lumen**.